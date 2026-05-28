from __future__ import annotations

import json
import os
import queue
import threading
import time
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
STATE_FILE = DATA_DIR / "state.json"
PUBLIC_FILES = {"/", "/index.html"}
PUBLIC_PREFIXES = ("/assets/",)

DEFAULT_FORUM = [
    {
        "name": "Equipe SmartLog",
        "message": "Bem-vindo ao mural. Compartilhe ideias de temas, duvidas ou sugestoes para novos artigos.",
        "date": "Fixado",
    }
]

state_lock = threading.Lock()
clients_lock = threading.Lock()
clients: set[queue.Queue[dict]] = set()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def default_state() -> dict:
    return {
        "posts": [],
        "forum": DEFAULT_FORUM.copy(),
        "subscribers": [],
        "updatedAt": now_iso(),
    }


def load_state() -> dict:
    if not STATE_FILE.exists():
        return default_state()

    try:
        data = json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return default_state()

    data.setdefault("posts", [])
    data.setdefault("forum", DEFAULT_FORUM.copy())
    data.setdefault("subscribers", [])
    data.setdefault("updatedAt", now_iso())
    return data


state = load_state()


def persist_state_locked() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    temp_file = STATE_FILE.with_suffix(".tmp")
    temp_file.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")
    temp_file.replace(STATE_FILE)


def clean_text(value: object, limit: int) -> str:
    return str(value or "").strip()[:limit]


def clean_tags(value: object) -> list[str]:
    if not isinstance(value, list):
        return ["Aluno", "SmartLog"]
    tags = [clean_text(tag, 32) for tag in value if clean_text(tag, 32)]
    return tags[:8] or ["Aluno", "SmartLog"]


def clean_body(value: object) -> list[str]:
    if isinstance(value, list):
        parts = [clean_text(part, 1200) for part in value]
    else:
        parts = [clean_text(part, 1200) for part in str(value or "").splitlines()]
    return [part for part in parts if part][:12]


def clean_post(data: dict) -> dict | None:
    title = clean_text(data.get("title"), 120)
    author = clean_text(data.get("author"), 80)
    category = clean_text(data.get("category"), 40)
    summary = clean_text(data.get("summary"), 320)
    body = clean_body(data.get("body"))
    if not title or not author or not category or not summary or not body:
        return None

    return {
        "id": clean_text(data.get("id"), 80) or f"post-{int(time.time() * 1000)}",
        "title": title,
        "author": author,
        "category": category,
        "date": clean_text(data.get("date"), 20) or datetime.now().date().isoformat(),
        "summary": summary,
        "tags": clean_tags(data.get("tags")),
        "image": clean_text(data.get("image"), 180) or "assets/warehouse-forklift.jpg",
        "body": body,
    }


def clean_forum_post(data: dict) -> dict | None:
    name = clean_text(data.get("name"), 70)
    message = clean_text(data.get("message"), 700)
    if not name or not message:
        return None
    return {
        "name": name,
        "message": message,
        "date": clean_text(data.get("date"), 40) or datetime.now().strftime("%d/%m %H:%M"),
    }


def clean_subscriber(data: dict) -> dict | None:
    name = clean_text(data.get("name"), 80)
    email = clean_text(data.get("email"), 140).lower()
    if not name or "@" not in email or "." not in email:
        return None
    return {"name": name, "email": email, "date": now_iso()}


def public_state() -> dict:
    with state_lock:
        payload = {
            "posts": list(state["posts"]),
            "forum": list(state["forum"]),
            "stats": {
                "subscribers": len(state["subscribers"]),
                "updatedAt": state["updatedAt"],
            },
        }

    with clients_lock:
        payload["stats"]["online"] = len(clients)
    return payload


def broadcast_state() -> None:
    payload = public_state()
    with clients_lock:
        targets = list(clients)

    for target in targets:
        try:
            target.put_nowait(payload)
        except queue.Full:
            pass


class SmartLogHandler(SimpleHTTPRequestHandler):
    server_version = "SmartLogHTTP/1.0"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/health":
            self.send_json(200, {"ok": True, "service": "smartlog"})
            return
        if path == "/api/state":
            self.send_json(200, public_state())
            return
        if path == "/api/events":
            self.stream_events()
            return
        if path not in PUBLIC_FILES and not path.startswith(PUBLIC_PREFIXES):
            self.send_error(404)
            return
        super().do_GET()

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        data = self.read_json()
        if data is None:
            self.send_json(400, {"error": "JSON invalido"})
            return

        if path == "/api/posts":
            post = clean_post(data)
            if post is None:
                self.send_json(400, {"error": "Artigo incompleto"})
                return
            with state_lock:
                state["posts"] = [post] + [item for item in state["posts"] if item.get("id") != post["id"]]
                state["posts"] = state["posts"][:80]
                state["updatedAt"] = now_iso()
                persist_state_locked()
            broadcast_state()
            self.send_json(200, public_state())
            return

        if path == "/api/forum":
            forum_post = clean_forum_post(data)
            if forum_post is None:
                self.send_json(400, {"error": "Mensagem incompleta"})
                return
            with state_lock:
                pinned = [item for item in state["forum"] if item.get("date") == "Fixado"]
                regular = [item for item in state["forum"] if item.get("date") != "Fixado"]
                state["forum"] = [forum_post] + regular[:28] + pinned[:1]
                state["updatedAt"] = now_iso()
                persist_state_locked()
            broadcast_state()
            self.send_json(200, public_state())
            return

        if path == "/api/newsletter":
            subscriber = clean_subscriber(data)
            if subscriber is None:
                self.send_json(400, {"error": "Inscricao invalida"})
                return
            with state_lock:
                state["subscribers"] = [
                    subscriber,
                    *[item for item in state["subscribers"] if item.get("email") != subscriber["email"]],
                ][:200]
                state["updatedAt"] = now_iso()
                persist_state_locked()
            broadcast_state()
            self.send_json(200, public_state())
            return

        self.send_json(404, {"error": "Rota nao encontrada"})

    def read_json(self) -> dict | None:
        try:
            length = min(int(self.headers.get("Content-Length", "0")), 128_000)
            raw = self.rfile.read(length)
            data = json.loads(raw.decode("utf-8"))
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
            return None
        return data if isinstance(data, dict) else None

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def stream_events(self) -> None:
        updates: queue.Queue[dict] = queue.Queue(maxsize=10)
        with clients_lock:
            clients.add(updates)
        broadcast_state()

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.end_headers()

        try:
            self.write_event(public_state())
            while True:
                try:
                    payload = updates.get(timeout=15)
                    self.write_event(payload)
                except queue.Empty:
                    self.wfile.write(b": keepalive\n\n")
                    self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, TimeoutError):
            pass
        finally:
            with clients_lock:
                clients.discard(updates)
            broadcast_state()

    def write_event(self, payload: dict) -> None:
        message = f"data: {json.dumps(payload, ensure_ascii=False)}\n\n".encode("utf-8")
        self.wfile.write(message)
        self.wfile.flush()


def main() -> None:
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), SmartLogHandler)
    print(f"SmartLog online em http://127.0.0.1:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
