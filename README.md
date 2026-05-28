# SmartLog Site

Portal SmartLog com visual premium, artigos, glossario, quiz, publicacao colaborativa, newsletter, mural da comunidade e Canvas do projeto.

## Abrir no PC

Use um destes arquivos:

- `ABRIR_SMARTLOG_SITE.bat`
- `ABRIR_SMARTLOG_FACIL.bat`
- `C:\Users\gozem\Documents\New project\ABRIR_SITE_SMARTLOG.bat`

Eles iniciam o servidor em `http://127.0.0.1:8000`. Com o servidor ligado, artigos publicados, mensagens do mural e inscricoes da newsletter ficam centralizados em `data/state.json` e sao sincronizados entre navegadores conectados.

Se abrir `index.html` direto, o site ainda funciona, mas em modo local.

## Supabase

Para dados permanentes, crie as tabelas no Supabase usando `supabase_schema.sql` e configure estas variaveis no Render:

- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_SECRET_KEY`: chave secreta nova do Supabase, usada somente no servidor.
- `SUPABASE_SERVICE_ROLE_KEY`: alternativa caso seu painel mostre a chave legacy `service_role`.

Nao coloque nenhuma dessas chaves dentro do `index.html`, no GitHub, em print, nem no navegador. Ela deve ficar apenas nas Environment Variables do Render.

## Painel do dono

Para liberar o controle privado do site, configure esta variavel no Render:

- `SMARTLOG_ADMIN_PASSWORD`: senha que so o dono do site deve saber.

Depois do deploy, abra o site, clique em `Dono`, digite a senha e os botoes `Apagar` aparecem em artigos e mensagens publicados pela comunidade. Essa senha nao deve ir para o GitHub.

## Publicar temporariamente

Use `PUBLICAR_SMARTLOG_TEMPORARIO.bat` para abrir um tunel publico temporario com Cloudflare. A URL aparece na janela do terminal e funciona enquanto o PC, o servidor e o tunel estiverem ligados.

## Hospedar online

O projeto esta pronto para deploy como app Python sem dependencias externas.

### Render

1. Suba a pasta `smartlog-site` para um repositorio GitHub.
2. No Render, crie um `Blueprint` usando `render.yaml`, ou crie um Web Service manual.
3. Use:
   - Build command: `pip install -r requirements.txt`
   - Start command: `python server.py`
4. Depois do deploy, acesse a URL publica do Render. O status no topo deve mudar para `Tempo real ativo`.

### Outro host Python

Qualquer host que rode Python 3 e mantenha um processo HTTP ativo consegue usar:

```bash
python server.py
```

Defina a variavel `PORT` se o provedor exigir uma porta especifica.
