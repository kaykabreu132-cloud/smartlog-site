const articles = [
  {
    id: "logistica-40",
    title: "Logística 4.0 e futuro",
    category: "Tecnologia",
    readTime: "6 min",
    date: "Hoje",
    author: "Redação SmartLog",
    icon: "cpu",
    image: "assets/warehouse-forklift.jpg",
    summary:
      "Automação, dados e rastreamento deixam a operação mais rápida, previsível e conectada ao cliente.",
    body:
      "Logística 4.0 é a aplicação de tecnologia nos processos logísticos. Na prática, isso inclui sistemas integrados, rastreamento, sensores, automação, análise de dados e comunicação em tempo real. Para estudantes, o mais importante é entender como essas ferramentas reduzem atrasos, evitam desperdícios e ajudam empresas a tomar decisões melhores."
  },
  {
    id: "rotas-sustentaveis",
    title: "Rotas sustentáveis reduzem custo operacional",
    category: "Sustentabilidade",
    readTime: "4 min",
    date: "Hoje",
    author: "Equipe SmartLog",
    icon: "leaf",
    image: "assets/container-yard.jpg",
    summary:
      "Planejamento de rotas, carga consolidada e manutenção preventiva reduzem gasto de combustível.",
    body:
      "Sustentabilidade em logística não é apenas uma pauta ambiental. Quando a empresa reduz quilômetros vazios, melhora a ocupação dos veículos e agrupa entregas por região, ela também diminui custos. Esse tema conecta eficiência operacional, impacto ambiental e qualidade do serviço."
  },
  {
    id: "primeiro-emprego",
    title: "Como começar na área de logística",
    category: "Carreira",
    readTime: "5 min",
    date: "Guia",
    author: "Redação SmartLog",
    icon: "graduation-cap",
    image: "assets/urban-delivery.jpg",
    summary:
      "Funções de entrada, habilidades valorizadas e caminhos para transformar estudo em oportunidade.",
    body:
      "Quem está começando pode buscar funções como auxiliar de logística, conferente, assistente de transporte, auxiliar de almoxarifado e suporte de compras. Organização, planilhas, comunicação clara e noções de estoque, transporte e atendimento ao cliente são competências importantes."
  },
  {
    id: "indicadores",
    title: "Indicadores logísticos que aparecem em entrevistas",
    category: "Mercado",
    readTime: "4 min",
    date: "Novo",
    author: "Equipe SmartLog",
    icon: "bar-chart-3",
    image: "assets/warehouse-conveyor.jpg",
    summary:
      "OTIF, lead time, acuracidade de estoque e nível de serviço explicados de forma objetiva.",
    body:
      "Indicadores transformam operação em informação. OTIF mede entregas no prazo e completas. Lead time mostra o tempo entre pedido e entrega. Acuracidade compara estoque real com sistema. Nível de serviço indica se a operação atende o cliente com qualidade."
  },
  {
    id: "armazens",
    title: "Armazéns inteligentes: do código de barras aos sensores",
    category: "Tecnologia",
    readTime: "6 min",
    date: "Análise",
    author: "Redação SmartLog",
    icon: "warehouse",
    image: "assets/warehouse-conveyor.jpg",
    summary:
      "WMS, leitores, coletores e automação melhoram separação, estoque e rastreabilidade.",
    body:
      "Um armazém inteligente começa com processos bem definidos. Depois entram ferramentas como WMS, código de barras, RFID, coletores e painéis de controle. O objetivo é saber onde cada item está, reduzir erros e acelerar a movimentação sem perder controle."
  },
  {
    id: "entrevista-supply",
    title: "Entrevista: rotina de quem trabalha com supply chain",
    category: "Carreira",
    readTime: "7 min",
    date: "Entrevista",
    author: "Convidado do setor",
    icon: "mic",
    image: "assets/urban-delivery.jpg",
    summary:
      "Perguntas para aproximar estudantes da realidade de transporte, estoque e compras.",
    body:
      "Uma boa entrevista mostra rotina, desafios e decisões reais. Perguntas úteis incluem: quais indicadores você acompanha, o que mais causa atraso, quais ferramentas usa e que conselho daria para um aluno. Esse formato cria conteúdo original para o portal."
  }
];

const events = [
  {
    id: "webinar-log40",
    day: "12",
    month: "Jun",
    title: "Webinar: Logística 4.0 sem complicar",
    host: "Equipe SmartLog",
    description: "Conceitos de automação, dados, rastreamento e exemplos de aplicação em empresas."
  },
  {
    id: "entrevista-analista",
    day: "19",
    month: "Jun",
    title: "Entrevista com analista de logística",
    host: "Convidado do setor",
    description: "Rotina, carreira, indicadores e aprendizados para quem está começando."
  },
  {
    id: "workshop-curriculo",
    day: "26",
    month: "Jun",
    title: "Workshop: currículo para logística",
    host: "Professores e alunos",
    description: "Como apresentar cursos, projetos, planilhas, experiências e competências técnicas."
  }
];

const defaultDiscussions = [
  {
    title: "Quais fontes vocês usam para estudar logística?",
    category: "Estudo",
    message: "Estou montando uma lista de portais, canais e revistas para acompanhar notícias e tendências.",
    date: "Fixado"
  },
  {
    title: "Sugestão de entrevista: transporte e estoque",
    category: "Mercado",
    message: "Seria interessante conversar com profissionais de áreas diferentes para comparar a rotina de cada função.",
    date: "Comunidade"
  }
];

const state = {
  filter: "todos",
  query: "",
  saved: JSON.parse(localStorage.getItem("smartlog:saved") || "[]"),
  discussions: JSON.parse(localStorage.getItem("smartlog:discussions") || "null") || defaultDiscussions,
  rsvps: JSON.parse(localStorage.getItem("smartlog:rsvps") || "[]")
};

const articleGrid = document.querySelector("#articleGrid");
const headlineList = document.querySelector("#headlineList");
const globalSearch = document.querySelector("#globalSearch");
const clearSearch = document.querySelector("#clearSearch");
const newsletterForm = document.querySelector("#newsletterForm");
const newsletterStatus = document.querySelector("#newsletterStatus");
const discussionForm = document.querySelector("#discussionForm");
const discussionList = document.querySelector("#discussionList");
const eventGrid = document.querySelector("#eventGrid");
const articleDialog = document.querySelector("#articleDialog");
const dialogContent = document.querySelector("#dialogContent");
const closeDialog = document.querySelector("#closeDialog");
const themeToggle = document.querySelector("#themeToggle");

function persist() {
  localStorage.setItem("smartlog:saved", JSON.stringify(state.saved));
  localStorage.setItem("smartlog:discussions", JSON.stringify(state.discussions));
  localStorage.setItem("smartlog:rsvps", JSON.stringify(state.rsvps));
}

function getVisibleArticles() {
  const normalizedQuery = state.query.trim().toLowerCase();
  return articles.filter((article) => {
    const matchesFilter = state.filter === "todos" || article.category === state.filter;
    const haystack = `${article.title} ${article.category} ${article.summary} ${article.body}`.toLowerCase();
    return matchesFilter && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
}

function renderArticles() {
  const visible = getVisibleArticles();

  articleGrid.innerHTML = visible
    .map((article) => {
      const isSaved = state.saved.includes(article.id);
      return `
        <article class="article-card">
          <img class="article-image" src="${article.image}" alt="" loading="lazy" />
          <div class="article-body">
            <header>
              <span class="tag">${article.category}</span>
              <small>${article.date}</small>
            </header>
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
            <div class="article-meta">
              <span>${article.readTime}</span>
              <span>${article.author}</span>
              <span>${isSaved ? "Salvo" : "Disponível"}</span>
            </div>
            <div class="article-actions">
              <button class="primary-button" type="button" data-open="${article.id}">
                <i data-lucide="book-open"></i>
                Ler
              </button>
              <button class="secondary-button" type="button" data-save="${article.id}">
                <i data-lucide="${isSaved ? "bookmark-check" : "bookmark"}"></i>
                ${isSaved ? "Salvo" : "Salvar"}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  if (!visible.length) {
    articleGrid.innerHTML = `
      <article class="article-card empty-state">
        <div class="article-body">
          <span class="tag">Busca</span>
          <h3>Nenhum conteúdo encontrado</h3>
          <p>Limpe a busca ou escolha outra categoria para voltar ao feed completo.</p>
        </div>
      </article>
    `;
  }

  renderHeadlines(visible);
  refreshIcons();
}

function renderHeadlines(list = articles) {
  const items = list.slice(0, 4);
  headlineList.innerHTML = items
    .map(
      (article) => `
        <article class="headline-item">
          <img src="${article.image}" alt="" loading="lazy" />
          <div>
            <span class="tag">${article.category}</span>
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
          </div>
          <button class="icon-button" type="button" data-open="${article.id}" aria-label="Abrir ${article.title}">
            <i data-lucide="arrow-up-right"></i>
          </button>
        </article>
      `
    )
    .join("");

  if (!items.length) {
    headlineList.innerHTML = `
      <article class="headline-item">
        <div>
          <span class="tag">Busca</span>
          <h3>Sem resultados</h3>
          <p>O feed volta a aparecer quando a busca for limpa.</p>
        </div>
      </article>
    `;
  }
}

function renderDiscussions() {
  discussionList.innerHTML = state.discussions
    .map(
      (item) => `
        <article class="discussion-card">
          <header>
            <span class="tag">${item.category}</span>
            <small>${item.date}</small>
          </header>
          <h3>${item.title}</h3>
          <p>${item.message}</p>
        </article>
      `
    )
    .join("");
}

function renderEvents() {
  eventGrid.innerHTML = events
    .map((event) => {
      const confirmed = state.rsvps.includes(event.id);
      return `
        <article class="event-card">
          <header>
            <div>
              <span class="tag">${event.host}</span>
              <h3>${event.title}</h3>
            </div>
            <div class="event-date">
              <span>${event.day}</span>
              ${event.month}
            </div>
          </header>
          <p>${event.description}</p>
          <button class="${confirmed ? "primary-button" : "secondary-button"}" type="button" data-rsvp="${event.id}">
            <i data-lucide="${confirmed ? "check-circle-2" : "calendar-plus"}"></i>
            ${confirmed ? "Inscrição confirmada" : "Confirmar interesse"}
          </button>
        </article>
      `;
    })
    .join("");
  refreshIcons();
}

function openArticle(id) {
  const article = articles.find((item) => item.id === id);
  if (!article) return;

  dialogContent.innerHTML = `
    <img class="dialog-image" src="${article.image}" alt="" />
    <span class="tag">${article.category}</span>
    <h2>${article.title}</h2>
    <div class="dialog-meta">
      <span>${article.date}</span>
      <span>${article.readTime}</span>
      <span>${article.author}</span>
    </div>
    <p>${article.body}</p>
    <p>${article.summary}</p>
  `;

  if (typeof articleDialog.showModal === "function") {
    articleDialog.showModal();
  }
}

function toggleSave(id) {
  state.saved = state.saved.includes(id)
    ? state.saved.filter((savedId) => savedId !== id)
    : [...state.saved, id];
  persist();
  renderArticles();
}

function toggleRsvp(id) {
  state.rsvps = state.rsvps.includes(id)
    ? state.rsvps.filter((eventId) => eventId !== id)
    : [...state.rsvps, id];
  persist();
  renderEvents();
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open]");
  const saveButton = event.target.closest("[data-save]");
  const rsvpButton = event.target.closest("[data-rsvp]");

  if (openButton) openArticle(openButton.dataset.open);
  if (saveButton) toggleSave(saveButton.dataset.save);
  if (rsvpButton) toggleRsvp(rsvpButton.dataset.rsvp);
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderArticles();
  });
});

globalSearch.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderArticles();
});

clearSearch.addEventListener("click", () => {
  globalSearch.value = "";
  state.query = "";
  renderArticles();
  globalSearch.focus();
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(newsletterForm));
  localStorage.setItem("smartlog:newsletter", JSON.stringify(data));
  newsletterStatus.textContent = `${data.name}, assinatura registrada para ${data.interest}.`;
  newsletterForm.reset();
});

discussionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(discussionForm));
  state.discussions = [
    {
      title: data.title,
      category: data.category,
      message: data.message,
      date: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date())
    },
    ...state.discussions
  ];
  persist();
  discussionForm.reset();
  renderDiscussions();
  refreshIcons();
});

closeDialog.addEventListener("click", () => articleDialog.close());

articleDialog.addEventListener("click", (event) => {
  const dialogBox = articleDialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < dialogBox.left ||
    event.clientX > dialogBox.right ||
    event.clientY < dialogBox.top ||
    event.clientY > dialogBox.bottom;

  if (clickedOutside) articleDialog.close();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("smartlog:theme", document.body.classList.contains("dark") ? "dark" : "light");
  themeToggle.innerHTML = `<i data-lucide="${document.body.classList.contains("dark") ? "sun" : "moon"}"></i>`;
  refreshIcons();
});

if (localStorage.getItem("smartlog:theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.innerHTML = '<i data-lucide="sun"></i>';
}

renderArticles();
renderDiscussions();
renderEvents();
refreshIcons();
