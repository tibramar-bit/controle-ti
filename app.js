/* ==========================================================================
   Controle T.I — lógica do aplicativo
   Réplica funcional do modelo: patrimônio, estoque, relatórios e backup.
   Persistência na nuvem via Supabase.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------- ícones -------------------------------- */

  const ICONES = {
    package:
      '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    boxes:
      '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>',
    warehouse:
      '<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect width="12" height="12" x="6" y="10"/>',
    wrench:
      '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    pencil:
      '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    trash:
      '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    eyeOff:
      '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    fileSpreadsheet:
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/>',
    download:
      '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
    upload:
      '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
    database:
      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    alert:
      '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    circleCheck:
      '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    circleCheckBig:
      '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
    circleX:
      '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    shieldCheck:
      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  };

  function icone(nome, tamanho) {
    const medida = tamanho || 18;
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      medida +
      '" height="' +
      medida +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONES[nome] || "") +
      "</svg>"
    );
  }

  /* ------------------------- constantes e utilidades ---------------------- */

  const TIPOS = [
    "Celular",
    "Notebook",
    "Tablet",
    "Desktop",
    "Coletor",
    "Chip",
    "Impressora",
    "Rede",
    "Outro",
  ];
  const STATUS = ["Em uso", "Em estoque", "Em manutenção", "Baixado"];
  const CONDICOES = ["Novo", "Usado"];

  const PADRAO = {
    nome: "",
    tipo: "Celular",
    status: "Em uso",
    condicao: "Novo",
    email: "",
    senha: "",
    numero: "",
    imei_ns: "",
    responsavel: "",
    observacoes: "",
  };

  const ROTULO_STATUS = {
    "Em uso": "badge-success",
    "Em estoque": "badge-info",
    "Em manutenção": "badge-warning",
    Baixado: "badge-danger",
  };
  const ROTULO_CONDICAO = { Novo: "badge-info", Usado: "" };

  const CHAVE_ACESSO = "controle_ti_acesso";
  const POR_PAGINA = 30;
  const VAZIO = "—";

  /* ------------------------------ supabase -------------------------------- */

  const CONFIG = window.CONTROLE_TI_SUPABASE || {};
  const TABELA = CONFIG.tabela || "equipamentos";
  const clienteSupabase =
    window.supabase && CONFIG.url && CONFIG.chave
      ? window.supabase.createClient(CONFIG.url, CONFIG.chave)
      : null;

  function esc(valor) {
    return String(valor === undefined || valor === null ? "" : valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function hoje() {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    return agora.getFullYear() + "-" + mes + "-" + dia;
  }

  function normalizar(bruto) {
    const item = Object.assign({}, PADRAO);
    Object.keys(PADRAO).forEach(function (campo) {
      const valor = bruto ? bruto[campo] : undefined;
      if (valor !== undefined && valor !== null) item[campo] = String(valor);
    });
    if (!item.tipo) item.tipo = PADRAO.tipo;
    if (STATUS.indexOf(item.status) === -1) item.status = PADRAO.status;
    if (CONDICOES.indexOf(item.condicao) === -1) item.condicao = PADRAO.condicao;
    return item;
  }

  /* -------------------------------- estado -------------------------------- */

  function semBanco() {
    avisar(
      "Supabase não configurado. Confira o arquivo supabase-config.js.",
      "danger"
    );
  }

  async function carregarRemoto() {
    if (!clienteSupabase) {
      semBanco();
      return [];
    }
    const resposta = await clienteSupabase
      .from(TABELA)
      .select("*")
      .order("criado_em", { ascending: false });
    if (resposta.error) throw resposta.error;
    return (resposta.data || []).map(function (linha) {
      return Object.assign(normalizar(linha), { id: linha.id });
    });
  }

  async function carregarTipos() {
    if (!clienteSupabase) return;
    const resposta = await clienteSupabase
      .from("tipos_equipamento")
      .select("*")
      .order("nome");
    if (resposta.error) throw resposta.error;
    estado.catalogoTipos = resposta.data || [];
    estado.tipos = estado.catalogoTipos
      .filter(function (tipo) {
        return tipo.ativo;
      })
      .map(function (tipo) {
        return tipo.nome;
      });
    if (!estado.tipos.length) estado.tipos = TIPOS.slice();
  }

  async function carregarOperacoes() {
    if (!clienteSupabase) return;
    estado.carregandoOperacoes = true;
    estado.erroOperacoes = false;
    if (rotaAtual() === "/operacoes") render();
    const resposta = await clienteSupabase
      .from("movimentacoes_estoque")
      .select("*")
      .order("criado_em", { ascending: false });
    estado.carregandoOperacoes = false;
    if (resposta.error) {
      estado.erroOperacoes = true;
      throw resposta.error;
    }
    estado.operacoes = resposta.data || [];
    estado.operacoesCarregadas = true;
  }

  function paraLinha(item) {
    return {
      nome: item.nome,
      tipo: item.tipo,
      status: item.status,
      condicao: item.condicao,
      email: item.email,
      senha: item.senha,
      numero: item.numero,
      imei_ns: item.imei_ns,
      responsavel: item.responsavel,
      observacoes: item.observacoes,
    };
  }

  const estado = {
    equipamentos: [],
    tipos: TIPOS.slice(),
    catalogoTipos: TIPOS.map(function (nome) {
      return { id: null, nome: nome, ativo: true };
    }),
    operacoes: [],
    operacoesCarregadas: false,
    carregandoOperacoes: false,
    erroOperacoes: false,
    salvandoOperacao: false,
    formularioOperacao: null,
    carregando: true,
    busca: "",
    tipo: "",
    status: "",
    condicao: "",
    limite: POR_PAGINA,
    senhasVisiveis: [],
    relTipo: "",
    relStatus: "",
    relCondicao: "",
    formulario: null,
    senhaFormVisivel: false,
    modal: null,
    arquivoBackup: null,
  };

  /* -------------------------------- toasts -------------------------------- */

  function avisar(mensagem, tipo) {
    const classe = tipo === "danger" ? "danger" : "success";
    const raiz = document.getElementById("toast-root");
    const caixa = document.createElement("div");
    caixa.className = "toast toast-" + classe;
    caixa.innerHTML =
      icone(classe === "success" ? "circleCheck" : "circleX", 18) +
      "<span>" +
      esc(mensagem) +
      "</span>";
    raiz.appendChild(caixa);
    setTimeout(function () {
      caixa.remove();
    }, 4000);
  }

  /* ------------------------------ rota e telas ---------------------------- */

  function rotaAtual() {
    const hash = location.hash.replace(/^#/, "");
    if (hash === "/relatorio") return "/relatorio";
    if (hash === "/operacoes") return "/operacoes";
    if (hash === "/entrar") return "/entrar";
    return "/";
  }

  function telaEntrada() {
    return (
      '<div class="entrada-capa">' +
      '<div class="entrada-hero">' +
      '<div class="entrada-hero-topo">' +
      '<span class="marca-icone">' +
      icone("package", 20) +
      "</span>" +
      '<div><div class="marca-titulo">Controle T.I</div>' +
      '<div class="marca-sub">BRAMARLOG / TI</div></div>' +
      "</div>" +
      '<h1 class="entrada-hero-titulo">Todo o patrimônio de TI da BRAMARLOG em uma tela só.</h1>' +
      '<ul class="entrada-lista">' +
      "<li>" +
      icone("circleCheckBig", 18) +
      " Busca rápida por nome, número ou IMEI/NS</li>" +
      "<li>" +
      icone("circleCheckBig", 18) +
      " Senhas ocultas, reveladas só com um clique</li>" +
      "<li>" +
      icone("circleCheckBig", 18) +
      " Patrimônio de TI sempre organizado</li>" +
      "</ul>" +
      "</div>" +
      '<div class="entrada-form-lado">' +
      '<div class="entrada-card">' +
      '<div class="entrada-card-titulo">Controle de Patrimônio</div>' +
      '<p class="entrada-card-sub">Entre para gerenciar os equipamentos da BRAMARLOG / TI</p>' +
      '<button class="btn btn-primary btn-lg btn-bloco" data-acao="entrar">' +
      icone("shieldCheck", 18) +
      " Entrar</button>" +
      '<p class="rodape-nota">Sem senha nesta versão: os dados ficam salvos na nuvem (Supabase).</p>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function cabecalho() {
    return (
      '<header class="cabecalho">' +
      '<div class="marca">' +
      '<span class="marca-icone">' +
      icone("package", 20) +
      "</span>" +
      '<div><div class="marca-titulo">Controle T.I</div>' +
      '<div class="marca-sub">BRAMARLOG / TI</div></div>' +
      "</div>" +
      '<div class="cabecalho-acoes">' +
      '<button class="btn btn-secondary btn-sm" data-acao="abrir-backup">' +
      icone("database", 16) +
      " Exportar / Importar</button>" +
      "</div>" +
      "</header>"
    );
  }

  function abas(rota) {
    const itens = [
      { caminho: "/", rotulo: "Equipamentos", simbolo: "boxes" },
      { caminho: "/operacoes", rotulo: "Operações", simbolo: "warehouse" },
      { caminho: "/relatorio", rotulo: "Relatório Excel", simbolo: "fileSpreadsheet" },
    ];
    return (
      '<nav class="abas">' +
      itens
        .map(function (item) {
          const ativa = rota === item.caminho ? " ativa" : "";
          return (
            '<a class="aba' +
            ativa +
            '" href="#' +
            item.caminho +
            '">' +
            icone(item.simbolo, 16) +
            item.rotulo +
            "</a>"
          );
        })
        .join("") +
      "</nav>"
    );
  }

  /* -------------------------------- filtros ------------------------------- */

  function filtrados() {
    const termo = estado.busca.trim().toLowerCase();
    return estado.equipamentos.filter(function (item) {
      if (estado.tipo && item.tipo !== estado.tipo) return false;
      if (estado.status && item.status !== estado.status) return false;
      if (estado.condicao && item.condicao !== estado.condicao) return false;
      if (!termo) return true;
      return [item.nome, item.email, item.numero, item.imei_ns].some(
        function (valor) {
          return String(valor || "").toLowerCase().indexOf(termo) !== -1;
        }
      );
    });
  }

  function relatorioFiltrados() {
    return estado.equipamentos.filter(function (item) {
      if (estado.relTipo && item.tipo !== estado.relTipo) return false;
      if (estado.relStatus && item.status !== estado.relStatus) return false;
      if (estado.relCondicao && item.condicao !== estado.relCondicao) return false;
      return true;
    });
  }

  function temFiltro() {
    return Boolean(
      estado.busca.trim() || estado.tipo || estado.status || estado.condicao
    );
  }

  function textoContador(total) {
    return total + (total === 1 ? " item" : " itens");
  }

  function opcoes(lista, valor, rotuloTodos) {
    let html =
      '<option value="">' +
      esc(rotuloTodos) +
      "</option>";
    lista.forEach(function (item) {
      html +=
        '<option value="' +
        esc(item) +
        '"' +
        (item === valor ? " selected" : "") +
        ">" +
        esc(item) +
        "</option>";
    });
    return html;
  }

  /* ------------------------------- bagdes --------------------------------- */

  function badge(texto, classe) {
    return '<span class="badge ' + (classe || "") + '">' + esc(texto) + "</span>";
  }

  /* --------------------------- página: equipamentos ----------------------- */

  function kpis() {
    const total = estado.equipamentos.length;
    const contagem = function (valor) {
      return estado.equipamentos.filter(function (item) {
        return item.status === valor;
      }).length;
    };
    const cartoes = [
      { rotulo: "Total de itens", valor: total, cor: "kpi-azul", simbolo: "boxes" },
      {
        rotulo: "Em uso",
        valor: contagem("Em uso"),
        cor: "kpi-verde",
        simbolo: "package",
      },
      {
        rotulo: "Em estoque",
        valor: contagem("Em estoque"),
        cor: "kpi-ciano",
        simbolo: "warehouse",
      },
      {
        rotulo: "Em manutenção",
        valor: contagem("Em manutenção"),
        cor: "kpi-ambar",
        simbolo: "wrench",
      },
    ];
    return (
      '<div class="kpis">' +
      cartoes
        .map(function (cartao) {
          return (
            '<div class="kpi ' +
            cartao.cor +
            '">' +
            '<div class="kpi-icone">' +
            icone(cartao.simbolo, 20) +
            "</div>" +
            "<div>" +
            '<div class="kpi-valor">' +
            cartao.valor +
            "</div>" +
            '<div class="kpi-rotulo">' +
            esc(cartao.rotulo) +
            "</div>" +
            "</div>" +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function linhaEquipamento(item) {
    const revelado = estado.senhasVisiveis.indexOf(item.id) !== -1;
    const senhaCelula = item.senha
      ? '<span class="celula-senha">' +
        esc(revelado ? item.senha : "••••••••") +
        '<button class="btn-icone btn-icone-mini" data-acao="alternar-senha" data-id="' +
        esc(item.id) +
        '" title="' +
        (revelado ? "Ocultar senha" : "Mostrar senha") +
        '">' +
        icone(revelado ? "eyeOff" : "eye", 15) +
        "</button></span>"
      : '<span class="vazio">' + VAZIO + "</span>";

    const meta = [item.tipo, item.responsavel].filter(Boolean).join(" · ");

    return (
      '<tr class="clicavel" data-acao="abrir-detalhe" data-id="' +
      esc(item.id) +
      '">' +
      "<td>" +
      '<div class="celula-nome">' +
      esc(item.nome || VAZIO) +
      "</div>" +
      (meta ? '<div class="celula-meta">' + esc(meta) + "</div>" : "") +
      "</td>" +
      "<td>" +
      (item.email ? esc(item.email) : '<span class="vazio">' + VAZIO + "</span>") +
      "</td>" +
      "<td>" +
      senhaCelula +
      "</td>" +
      '<td class="celula-num">' +
      (item.numero ? esc(item.numero) : '<span class="vazio">' + VAZIO + "</span>") +
      "</td>" +
      '<td class="celula-num">' +
      (item.imei_ns
        ? esc(item.imei_ns)
        : '<span class="vazio">' + VAZIO + "</span>") +
      "</td>" +
      "<td>" +
      badge(item.condicao, ROTULO_CONDICAO[item.condicao]) +
      "</td>" +
      "<td>" +
      badge(item.status, ROTULO_STATUS[item.status]) +
      "</td>" +
      "<td>" +
      '<div class="acoes-linha">' +
      '<button class="btn-icone" data-acao="abrir-editar" data-id="' +
      esc(item.id) +
      '" title="Editar">' +
      icone("pencil", 16) +
      "</button>" +
      '<button class="btn-icone perigo" data-acao="abrir-excluir" data-id="' +
      esc(item.id) +
      '" title="Excluir">' +
      icone("trash", 16) +
      "</button>" +
      "</div>" +
      "</td>" +
      "</tr>"
    );
  }

  function linhaVazia() {
    const comFiltro = temFiltro();
    return (
      '<tr class="linha-vazia"><td colspan="8">' +
      '<div class="linha-vazia-icone">' +
      icone("package", 22) +
      "</div>" +
      '<div class="linha-vazia-titulo">' +
      (comFiltro
        ? "Nenhum equipamento encontrado com esses filtros."
        : "Nenhum equipamento encontrado.") +
      "</div>" +
      (comFiltro
        ? ""
        : '<button class="btn btn-primary btn-sm" data-acao="abrir-novo">' +
          icone("plus", 16) +
          " Cadastrar equipamento</button>") +
      "</td></tr>"
    );
  }

  function paginaEquipamentos() {
    return (
      '<div class="pagina">' +
      '<div class="pagina-topo">' +
      '<h1 class="pagina-titulo">Controle de Patrimônio</h1>' +
      '<p class="pagina-sub">Equipamentos e aparelhos da BRAMARLOG / TI</p>' +
      "</div>" +
      kpis() +
      '<div class="card">' +
      '<div class="card-corpo">' +
      '<div class="filtros">' +
      '<div class="campo campo-busca">' +
      '<label class="campo-rotulo" for="busca">Buscar</label>' +
      '<div class="entrada-icone">' +
      icone("search", 16) +
      '<input class="entrada" id="busca" data-campo="busca" type="search" ' +
      'autocomplete="off" placeholder="Buscar por nome, e-mail, número, IMEI/NS..." value="' +
      esc(estado.busca) +
      '" />' +
      "</div>" +
      "</div>" +
      '<div class="campo">' +
      '<label class="campo-rotulo" for="filtro-tipo">Tipo</label>' +
      '<select class="selecao" id="filtro-tipo" data-campo="filtro-tipo">' +
      opcoes(estado.tipos, estado.tipo, "Todos os tipos") +
      "</select>" +
      "</div>" +
      '<button class="btn btn-secondary" data-acao="abrir-tipos">' +
      icone("plus", 16) +
      " Gerenciar tipos</button>" +
      '<div class="campo">' +
      '<label class="campo-rotulo" for="filtro-status">Status</label>' +
      '<select class="selecao" id="filtro-status" data-campo="filtro-status">' +
      opcoes(STATUS, estado.status, "Todos os status") +
      "</select>" +
      "</div>" +
      '<div class="campo">' +
      '<label class="campo-rotulo" for="filtro-condicao">Condição</label>' +
      '<select class="selecao" id="filtro-condicao" data-campo="filtro-condicao">' +
      opcoes(CONDICOES, estado.condicao, "Novo e usado") +
      "</select>" +
      "</div>" +
      '<div class="contador-itens" id="contador"></div>' +
      '<button class="btn btn-primary" data-acao="abrir-novo">' +
      icone("plus", 16) +
      " Novo equipamento</button>" +
      "</div>" +
      '<div class="tabela-wrap">' +
      '<table class="tabela">' +
      "<thead><tr>" +
      "<th>Equipamento</th><th>E-mail</th><th>Senha</th><th>Número</th>" +
      '<th>IMEI/NS</th><th>Condição</th><th>Status</th><th class="th-acoes">Ações</th>' +
      "</tr></thead>" +
      '<tbody id="corpo"></tbody>' +
      "</table>" +
      "</div>" +
      '<div class="sentinela oculta" id="sentinela">' +
      '<span class="sentinela-pulso"></span>Carregando mais...</div>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderCorpo() {
    const corpo = document.getElementById("corpo");
    if (!corpo) return;
    const sentinela = document.getElementById("sentinela");
    const contador = document.getElementById("contador");

    if (estado.carregando) {
      corpo.innerHTML =
        '<tr class="linha-vazia"><td colspan="8">Carregando equipamentos...</td></tr>';
      if (sentinela) sentinela.classList.add("oculta");
      if (contador) contador.textContent = "";
      return;
    }

    const lista = filtrados();
    const visiveis = lista.slice(0, estado.limite);
    corpo.innerHTML = visiveis.length
      ? visiveis.map(linhaEquipamento).join("")
      : linhaVazia();

    if (sentinela) {
      sentinela.classList.toggle(
        "oculta",
        !visiveis.length || lista.length <= estado.limite
      );
    }
    if (contador) contador.textContent = textoContador(lista.length);
  }

  let observador = null;

  function observarSentinela() {
    if (observador) {
      observador.disconnect();
      observador = null;
    }
    const alvo = document.getElementById("sentinela");
    if (!alvo || !("IntersectionObserver" in window)) return;
    observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          if (estado.limite >= filtrados().length) return;
          estado.limite += POR_PAGINA;
          renderCorpo();
        });
      },
      { root: document.getElementById("conteudo"), rootMargin: "200px" }
    );
    observador.observe(alvo);
  }

  function aplicarFiltro() {
    estado.limite = POR_PAGINA;
    renderCorpo();
  }

  /* --------------------------- página: relatório -------------------------- */

  function paginaRelatorio() {
    return (
      '<div class="pagina">' +
      '<div class="card relatorio-card">' +
      '<div class="card-corpo">' +
      '<div class="relatorio-icone">' +
      icone("fileSpreadsheet", 24) +
      "</div>" +
      '<h1 class="pagina-titulo">Relatório para Excel</h1>' +
      '<p class="pagina-sub">Equipamentos e aparelhos da BRAMARLOG / TI</p>' +
      '<p class="backup-texto">Escolha o que entra no relatório. Sem filtro, vai tudo.</p>' +
      '<div class="filtros">' +
      '<div class="campo">' +
      '<label class="campo-rotulo" for="r-tipo">Tipo</label>' +
      '<select class="selecao" id="r-tipo" data-campo="rel-tipo">' +
      opcoes(estado.tipos, estado.relTipo, "Todos os tipos") +
      "</select>" +
      "</div>" +
      '<div class="campo">' +
      '<label class="campo-rotulo" for="r-status">Status</label>' +
      '<select class="selecao" id="r-status" data-campo="rel-status">' +
      opcoes(STATUS, estado.relStatus, "Todos os status") +
      "</select>" +
      "</div>" +
      '<div class="campo">' +
      '<label class="campo-rotulo" for="r-condicao">Condição</label>' +
      '<select class="selecao" id="r-condicao" data-campo="rel-condicao">' +
      opcoes(CONDICOES, estado.relCondicao, "Novo e usado") +
      "</select>" +
      "</div>" +
      "</div>" +
      '<button class="btn btn-primary btn-lg btn-bloco" data-acao="baixar-planilha">' +
      icone("download", 18) +
      " Baixar planilha do Excel</button>" +
      '<p class="relatorio-aviso">' +
      icone("info", 14) +
      " As senhas nunca saem neste relatório.</p>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function chaveMaterial(tipo, material) {
    return (String(tipo) + "|" + String(material)).toLowerCase();
  }

  function resumoEstoque() {
    const mapa = {};
    estado.operacoes.forEach(function (item) {
      const chave = chaveMaterial(item.tipo, item.material);
      if (!mapa[chave]) {
        mapa[chave] = {
          tipo: item.tipo,
          material: item.material,
          saldo: 0,
        };
      }
      mapa[chave].saldo +=
        item.operacao === "entrada" ? Number(item.quantidade) : -Number(item.quantidade);
    });
    return Object.keys(mapa)
      .map(function (chave) {
        return mapa[chave];
      })
      .filter(function (item) {
        return item.saldo > 0;
      })
      .sort(function (a, b) {
        return (a.tipo + a.material).localeCompare(b.tipo + b.material, "pt-BR");
      });
  }

  function paginaOperacoes() {
    const saldo = resumoEstoque();
    const entradas = estado.operacoes
      .filter(function (item) {
        return item.operacao === "entrada";
      })
      .reduce(function (total, item) {
        return total + Number(item.quantidade);
      }, 0);
    const saidas = estado.operacoes
      .filter(function (item) {
        return item.operacao === "saida";
      })
      .reduce(function (total, item) {
        return total + Number(item.quantidade);
      }, 0);
    const linhas = estado.carregandoOperacoes
      ? '<tr><td colspan="6" class="tabela-vazia">Carregando operações...</td></tr>'
      : estado.erroOperacoes
        ? '<tr><td colspan="6" class="tabela-vazia">Não foi possível carregar o histórico. Confira a migração do Supabase.</td></tr>'
        : estado.operacoes.length
      ? estado.operacoes
          .map(function (item) {
            const data = item.criado_em
              ? new Date(item.criado_em).toLocaleString("pt-BR")
              : VAZIO;
            return (
              "<tr><td>" +
              esc(data) +
              "</td><td>" +
              esc(item.tipo) +
              "</td><td>" +
              esc(item.material) +
              "</td><td>" +
              badge(
                item.operacao === "entrada" ? "Entrada" : "Saída",
                item.operacao === "entrada" ? "badge-success" : "badge-warning"
              ) +
              "</td><td>" +
              esc(item.quantidade) +
              "</td><td>" +
              esc(item.responsavel || VAZIO) +
              "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="6" class="tabela-vazia">Nenhuma operação registrada ainda.</td></tr>';
    const saldos = estado.carregandoOperacoes
      ? '<tr><td colspan="3" class="tabela-vazia">Carregando saldo...</td></tr>'
      : estado.erroOperacoes
        ? '<tr><td colspan="3" class="tabela-vazia">Saldo indisponível até conectar a tabela do Supabase.</td></tr>'
        : saldo.length
      ? saldo
          .map(function (item) {
            return (
              "<tr><td>" +
              esc(item.tipo) +
              "</td><td>" +
              esc(item.material) +
              "</td><td>" +
              esc(item.saldo) +
              "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="3" class="tabela-vazia">O estoque está vazio.</td></tr>';

    return (
      '<div class="pagina">' +
      '<div class="pagina-topo pagina-topo-acoes"><div><h1 class="pagina-titulo">Operações de estoque</h1>' +
      '<p class="pagina-sub">Registre entradas e retiradas de materiais, como toners.</p></div>' +
      '<button class="btn btn-primary" data-acao="abrir-operacao">' +
      icone("plus", 16) +
      " Registrar operação</button></div>" +
      '<div class="kpis">' +
      '<div class="kpi kpi-verde"><div><div class="kpi-valor">' +
      esc(entradas) +
      '</div><div class="kpi-rotulo">Unidades recebidas</div></div></div>' +
      '<div class="kpi kpi-ambar"><div><div class="kpi-valor">' +
      esc(saidas) +
      '</div><div class="kpi-rotulo">Unidades retiradas</div></div></div>' +
      '<div class="kpi kpi-azul"><div><div class="kpi-valor">' +
      esc(saldo.reduce(function (total, item) { return total + item.saldo; }, 0)) +
      '</div><div class="kpi-rotulo">Unidades em estoque</div></div></div>' +
      "</div>" +
      '<div class="card operacoes-card"><div class="card-corpo"><h2 class="secao-titulo">Saldo atual por material</h2>' +
      '<div class="tabela-wrap"><table class="tabela"><thead><tr><th>Tipo</th><th>Material / modelo</th><th>Saldo</th></tr></thead><tbody>' +
      saldos +
      "</tbody></table></div></div></div>" +
      '<div class="card operacoes-card"><div class="card-corpo"><h2 class="secao-titulo">Histórico de operações</h2>' +
      '<div class="tabela-wrap"><table class="tabela"><thead><tr><th>Data</th><th>Tipo</th><th>Material / modelo</th><th>Operação</th><th>Quantidade</th><th>Responsável</th></tr></thead><tbody>' +
      linhas +
      "</tbody></table></div></div></div>" +
      "</div>"
    );
  }

  /* -------------------------------- modais -------------------------------- */

  function campoTexto(opcoes) {
    const erro = opcoes.erro
      ? '<span class="entrada-erro">' + esc(opcoes.erro) + "</span>"
      : "";
    return (
      '<div class="campo' +
      (opcoes.largo ? " campo-largo" : "") +
      '">' +
      '<label class="campo-rotulo" for="f-' +
      opcoes.nome +
      '">' +
      esc(opcoes.rotulo) +
      "</label>" +
      '<input class="entrada' +
      (opcoes.erro ? " erro" : "") +
      '" id="f-' +
      opcoes.nome +
      '" data-campo-form="' +
      opcoes.nome +
      '" type="' +
      (opcoes.tipo || "text") +
      '" value="' +
      esc(opcoes.valor) +
      '" placeholder="' +
      esc(opcoes.placeholder || "") +
      '" ' +
      (opcoes.autocomplete ? 'autocomplete="' + opcoes.autocomplete + '"' : "") +
      " />" +
      erro +
      "</div>"
    );
  }

  function campoSelecao(opcoes) {
    return (
      '<div class="campo' +
      (opcoes.largo ? " campo-largo" : "") +
      '">' +
      '<label class="campo-rotulo" for="f-' +
      opcoes.nome +
      '">' +
      esc(opcoes.rotulo) +
      "</label>" +
      '<select class="selecao" id="f-' +
      opcoes.nome +
      '" data-campo-form="' +
      opcoes.nome +
      '">' +
      opcoes.lista
        .map(function (valor) {
          return (
            '<option value="' +
            esc(valor) +
            '"' +
            (valor === opcoes.valor ? " selected" : "") +
            ">" +
            esc(valor) +
            "</option>"
          );
        })
        .join("") +
      "</select>" +
      "</div>"
    );
  }

  function modalFormulario() {
    const f = estado.formulario;
    const edicao = Boolean(f.id);
    const dados = f.dados;
    const erros = f.erros || {};

    const campoSenha =
      '<div class="campo">' +
      '<label class="campo-rotulo" for="f-senha">Senha</label>' +
      '<div class="senha-caixa">' +
      '<input class="entrada" id="f-senha" data-campo-form="senha" type="' +
      (estado.senhaFormVisivel ? "text" : "password") +
      '" value="' +
      esc(dados.senha) +
      '" placeholder="' +
      (edicao ? "Em branco mantém a atual" : "") +
      '" autocomplete="new-password" />' +
      '<button type="button" class="senha-olho" data-acao="alternar-senha-form" title="' +
      (estado.senhaFormVisivel ? "Ocultar senha" : "Mostrar senha") +
      '">' +
      icone(estado.senhaFormVisivel ? "eyeOff" : "eye", 15) +
      "</button>" +
      "</div>" +
      "</div>";

    return (
      '<div class="sobreposicao">' +
      '<div class="modal modal-lg" role="dialog" aria-modal="true">' +
      '<div class="modal-cabecalho">' +
      '<div class="modal-icone-marca">' +
      icone(edicao ? "pencil" : "package", 20) +
      "</div>" +
      "<div>" +
      '<div class="modal-titulo">' +
      (edicao ? "Editar equipamento" : "Novo equipamento") +
      "</div>" +
      '<div class="modal-sub">' +
      (edicao
        ? "Atualize os dados do item do patrimônio."
        : "Preencha os dados do novo item do patrimônio.") +
      "</div>" +
      "</div>" +
      '<button class="btn-icone modal-fechar" data-acao="fechar-modal" title="Fechar">' +
      icone("close", 18) +
      "</button>" +
      "</div>" +
      '<div class="modal-corpo">' +
      '<div class="form-grade">' +
      campoTexto({
        nome: "nome",
        rotulo: "Nome do equipamento",
        valor: dados.nome,
        largo: true,
        erro: erros.nome,
      }) +
      campoSelecao({
        nome: "tipo",
        rotulo: "Tipo",
        valor: dados.tipo,
        lista: estado.tipos.includes(dados.tipo)
          ? estado.tipos
          : estado.tipos.concat([dados.tipo]),
      }) +
      '<div class="campo campo-tipo-ajuda"><span class="campo-rotulo">&nbsp;</span>' +
      '<button class="btn btn-secondary btn-sm" data-acao="abrir-tipos">+ Novo tipo</button></div>' +
      campoSelecao({
        nome: "status",
        rotulo: "Status",
        valor: dados.status,
        lista: STATUS,
      }) +
      campoSelecao({
        nome: "condicao",
        rotulo: "Condição",
        valor: dados.condicao,
        lista: CONDICOES,
      }) +
      campoTexto({
        nome: "email",
        rotulo: "E-mail",
        valor: dados.email,
        tipo: "email",
        autocomplete: "off",
      }) +
      campoSenha +
      campoTexto({ nome: "numero", rotulo: "Número", valor: dados.numero }) +
      campoTexto({ nome: "imei_ns", rotulo: "IMEI/NS", valor: dados.imei_ns }) +
      campoTexto({
        nome: "responsavel",
        rotulo: "Responsável",
        valor: dados.responsavel,
      }) +
      '<div class="campo campo-largo">' +
      '<label class="campo-rotulo" for="f-observacoes">Observações</label>' +
      '<textarea class="area-texto" id="f-observacoes" data-campo-form="observacoes" rows="3">' +
      esc(dados.observacoes) +
      "</textarea>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="modal-rodape">' +
      '<button class="btn btn-secondary" data-acao="fechar-modal">Cancelar</button>' +
      '<button class="btn btn-primary" data-acao="salvar-formulario">' +
      (edicao ? "Salvar" : "Cadastrar equipamento") +
      "</button>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function modalDetalhe(id) {
    const item = estado.equipamentos.filter(function (cada) {
      return cada.id === id;
    })[0];
    if (!item) return "";
    const revelado = estado.senhasVisiveis.indexOf(id) !== -1;

    const senhaBloco = item.senha
      ? '<div class="celula-senha">' +
        esc(revelado ? item.senha : "••••••••") +
        '<button class="btn-icone btn-icone-mini" data-acao="alternar-senha" data-id="' +
        esc(id) +
        '" title="' +
        (revelado ? "Ocultar senha" : "Mostrar senha") +
        '">' +
        icone(revelado ? "eyeOff" : "eye", 15) +
        "</button></div>"
      : '<span class="vazio">' + VAZIO + "</span>";

    const linha = function (rotulo, valor, bruto) {
      const conteudo = bruto
        ? valor
        : valor
        ? esc(valor)
        : '<span class="vazio">' + VAZIO + "</span>";
      return (
        '<div class="detalhe-item">' +
        '<div class="detalhe-rotulo">' +
        esc(rotulo) +
        "</div>" +
        '<div class="detalhe-valor">' +
        conteudo +
        "</div>" +
        "</div>"
      );
    };

    return (
      '<div class="sobreposicao">' +
      '<div class="modal" role="dialog" aria-modal="true">' +
      '<div class="modal-cabecalho">' +
      '<div class="modal-icone-marca">' +
      icone("package", 20) +
      "</div>" +
      "<div>" +
      '<div class="modal-titulo">' +
      esc(item.nome || VAZIO) +
      "</div>" +
      '<div class="modal-sub">Detalhes do item do patrimônio.</div>' +
      "</div>" +
      '<button class="btn-icone modal-fechar" data-acao="fechar-modal" title="Fechar">' +
      icone("close", 18) +
      "</button>" +
      "</div>" +
      '<div class="modal-corpo">' +
      '<div class="detalhe-badges">' +
      badge(item.tipo, "badge-info") +
      badge(item.condicao, ROTULO_CONDICAO[item.condicao]) +
      badge(item.status, ROTULO_STATUS[item.status]) +
      "</div>" +
      '<div class="detalhe-grade">' +
      linha("Responsável", item.responsavel) +
      linha("E-mail", item.email) +
      linha("Senha", senhaBloco, true) +
      linha("Número", item.numero) +
      linha("IMEI/NS", item.imei_ns) +
      "</div>" +
      (item.observacoes
        ? '<div class="detalhe-obs">' + esc(item.observacoes) + "</div>"
        : "") +
      "</div>" +
      '<div class="modal-rodape">' +
      '<button class="btn btn-secondary" data-acao="fechar-modal">Fechar</button>' +
      '<button class="btn btn-primary" data-acao="abrir-editar" data-id="' +
      esc(id) +
      '">' +
      icone("pencil", 16) +
      " Editar</button>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function modalExcluir(id) {
    const item = estado.equipamentos.filter(function (cada) {
      return cada.id === id;
    })[0];
    if (!item) return "";
    return (
      '<div class="sobreposicao">' +
      '<div class="modal" role="dialog" aria-modal="true">' +
      '<div class="modal-cabecalho">' +
      '<div class="modal-icone-alerta">' +
      icone("alert", 20) +
      "</div>" +
      "<div>" +
      '<div class="modal-titulo">Excluir equipamento</div>' +
      '<div class="modal-sub">Essa ação não pode ser desfeita.</div>' +
      "</div>" +
      '<button class="btn-icone modal-fechar" data-acao="fechar-modal" title="Fechar">' +
      icone("close", 18) +
      "</button>" +
      "</div>" +
      '<div class="modal-corpo">' +
      "<p>Deseja excluir &quot;" +
      esc(item.nome || VAZIO) +
      "&quot;?</p>" +
      "</div>" +
      '<div class="modal-rodape">' +
      '<button class="btn btn-secondary" data-acao="fechar-modal">Cancelar</button>' +
      '<button class="btn btn-danger" data-acao="confirmar-exclusao" data-id="' +
      esc(id) +
      '">Excluir</button>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function modalBackup() {
    const arquivo = estado.arquivoBackup;
    return (
      '<div class="sobreposicao">' +
      '<div class="modal modal-lg" role="dialog" aria-modal="true">' +
      '<div class="modal-cabecalho">' +
      '<div class="modal-icone-marca">' +
      icone("database", 20) +
      "</div>" +
      "<div>" +
      '<div class="modal-titulo">Backup e compartilhamento</div>' +
      '<div class="modal-sub">' +
      estado.equipamentos.length +
      (estado.equipamentos.length === 1
        ? " equipamento cadastrado."
        : " equipamentos cadastrados.") +
      "</div>" +
      "</div>" +
      '<button class="btn-icone modal-fechar" data-acao="fechar-modal" title="Fechar">' +
      icone("close", 18) +
      "</button>" +
      "</div>" +
      '<div class="modal-corpo">' +
      '<div class="backup-secao">' +
      '<div class="backup-titulo">' +
      icone("download", 16) +
      " Exportar</div>" +
      '<p class="backup-texto">Baixa um arquivo com todos os equipamentos, incluindo as senhas. ' +
      "Guarde em local seguro e compartilhe só com quem deve ter acesso.</p>" +
      '<button class="btn btn-primary" data-acao="exportar-backup">' +
      icone("download", 16) +
      " Exportar tudo</button>" +
      "</div>" +
      '<div class="backup-secao">' +
      '<div class="backup-titulo">' +
      icone("upload", 16) +
      " Importar</div>" +
      '<p class="backup-texto">Escolha um arquivo de backup. Equipamentos que já existem não são duplicados.</p>' +
      '<input type="file" id="arquivo-entrada" accept=".json,application/json" data-campo="arquivo" />' +
      '<div class="backup-linha">' +
      '<button class="btn btn-secondary" data-acao="escolher-arquivo">' +
      icone("fileSpreadsheet", 16) +
      " Escolher arquivo</button>" +
      (arquivo ? '<span class="arquivo-nome">' + esc(arquivo.name) + "</span>" : "") +
      '<button class="btn btn-primary" data-acao="importar-backup"' +
      (arquivo ? "" : " disabled") +
      ">Importar</button>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderModal() {
    const raiz = document.getElementById("modal-root");
    const m = estado.modal;
    if (!m) {
      raiz.innerHTML = "";
      return;
    }
    let html = "";
    if (m.tipo === "form") html = modalFormulario();
    else if (m.tipo === "tipos") html = modalTipos();
    else if (m.tipo === "operacao") html = modalOperacao();
    else if (m.tipo === "detalhe") html = modalDetalhe(m.id);
    else if (m.tipo === "excluir") html = modalExcluir(m.id);
    else if (m.tipo === "backup") html = modalBackup();
    raiz.innerHTML = html;

    if (m.tipo === "form" && m.foco) {
      const alvo = document.querySelector(
        '[data-campo-form="' + m.foco + '"]'
      );
      if (alvo) alvo.focus();
      m.foco = null;
    }
  }

  function fecharModal() {
    const modalAtual = estado.modal;
    if (modalAtual && modalAtual.tipo === "tipos" && modalAtual.voltarParaFormulario) {
      estado.modal = { tipo: "form" };
      estado.senhaFormVisivel = false;
      renderModal();
      return;
    }
    if (modalAtual && modalAtual.tipo === "form") estado.formulario = null;
    if (modalAtual && modalAtual.tipo === "operacao") estado.formularioOperacao = null;
    estado.modal = null;
    estado.senhaFormVisivel = false;
    estado.arquivoBackup = null;
    renderModal();
  }

  function abrirModalFormulario(id) {
    const existente = id
      ? estado.equipamentos.filter(function (item) {
          return item.id === id;
        })[0]
      : null;
    const dados = existente ? Object.assign({}, existente) : Object.assign({}, PADRAO);
    if (existente) dados.senha = "";
    delete dados.id;
    estado.senhaFormVisivel = false;
    estado.formulario = { id: existente ? existente.id : null, dados: dados, erros: {} };
    estado.modal = { tipo: "form" };
    renderModal();
  }

  /* ------------------------------- operações ------------------------------ */

  function sincronizarFormulario() {
    if (!estado.formulario) return;
    document.querySelectorAll("[data-campo-form]").forEach(function (campo) {
      estado.formulario.dados[campo.dataset.campoForm] = campo.value;
    });
  }

  async function salvarFormulario() {
    const f = estado.formulario;
    if (!f) return;
    sincronizarFormulario();
    f.erros = {};
    if (!String(f.dados.nome).trim()) {
      f.erros.nome = "Informe o nome do equipamento.";
      f.foco = "nome";
      renderModal();
      return;
    }

    const limpo = normalizar(f.dados);
    limpo.nome = String(limpo.nome).trim();

    if (!clienteSupabase) {
      semBanco();
      return;
    }

    try {
      if (f.id) {
        const atual = estado.equipamentos.filter(function (item) {
          return item.id === f.id;
        })[0];
        if (String(limpo.senha) === "" && atual) limpo.senha = atual.senha;
        const resposta = await clienteSupabase
          .from(TABELA)
          .update(paraLinha(limpo))
          .eq("id", f.id)
          .select()
          .single();
        if (resposta.error) throw resposta.error;
        const indice = estado.equipamentos.findIndex(function (item) {
          return item.id === f.id;
        });
        if (indice !== -1) {
          estado.equipamentos[indice] = Object.assign(
            normalizar(resposta.data),
            { id: f.id }
          );
        }
        avisar("Equipamento atualizado.");
      } else {
        const resposta = await clienteSupabase
          .from(TABELA)
          .insert(paraLinha(limpo))
          .select()
          .single();
        if (resposta.error) throw resposta.error;
        estado.equipamentos.unshift(
          Object.assign(normalizar(resposta.data), { id: resposta.data.id })
        );
        avisar("Equipamento cadastrado.");
      }
    } catch (erro) {
      avisar("Não foi possível salvar.", "danger");
      return;
    }

    estado.modal = null;
    estado.formulario = null;
    estado.senhaFormVisivel = false;
    renderModal();
    render();
  }

  async function confirmarExclusao(id) {
    if (!clienteSupabase) {
      semBanco();
      return;
    }
    try {
      const resposta = await clienteSupabase.from(TABELA).delete().eq("id", id);
      if (resposta.error) throw resposta.error;
    } catch (erro) {
      avisar("Não foi possível excluir.", "danger");
      return;
    }
    const indice = estado.equipamentos.findIndex(function (item) {
      return item.id === id;
    });
    if (indice !== -1) estado.equipamentos.splice(indice, 1);
    const posicao = estado.senhasVisiveis.indexOf(id);
    if (posicao !== -1) estado.senhasVisiveis.splice(posicao, 1);
    estado.modal = null;
    renderModal();
    render();
    avisar("Equipamento excluído.");
  }

  async function salvarTipo() {
    const entrada = document.getElementById("novo-tipo");
    const nome = entrada ? entrada.value.trim() : "";
    if (!nome) {
      avisar("Informe o nome do tipo.", "danger");
      return;
    }
    if (!clienteSupabase) {
      semBanco();
      return;
    }

    const existente = estado.catalogoTipos.find(function (tipo) {
      return tipo.nome.toLocaleLowerCase("pt-BR") === nome.toLocaleLowerCase("pt-BR");
    });
    try {
      if (existente && existente.ativo) {
        avisar("Esse tipo já está cadastrado.", "danger");
        return;
      }
      if (existente && existente.id) {
        const resposta = await clienteSupabase
          .from("tipos_equipamento")
          .update({ ativo: true, nome: nome })
          .eq("id", existente.id);
        if (resposta.error) throw resposta.error;
      } else {
        const resposta = await clienteSupabase
          .from("tipos_equipamento")
          .insert({ nome: nome, ativo: true });
        if (resposta.error) throw resposta.error;
      }
      await carregarTipos();
      const voltar = estado.modal && estado.modal.voltarParaFormulario;
      if (voltar && estado.formulario) {
        estado.formulario.dados.tipo = nome;
        estado.modal = { tipo: "form" };
      }
      renderModal();
      avisar("Tipo incluído.");
    } catch (erro) {
      avisar("Não foi possível incluir o tipo. Confira se a migração do Supabase foi aplicada.", "danger");
    }
  }

  async function alternarTipo(id) {
    const tipo = estado.catalogoTipos.find(function (item) {
      return String(item.id) === String(id);
    });
    if (!tipo || !tipo.id || !clienteSupabase) return;
    try {
      const resposta = await clienteSupabase
        .from("tipos_equipamento")
        .update({ ativo: !tipo.ativo })
        .eq("id", tipo.id);
      if (resposta.error) throw resposta.error;
      await carregarTipos();
      if (!estado.tipos.includes(estado.tipo)) estado.tipo = "";
      renderModal();
      aplicarFiltro();
      avisar(tipo.ativo ? "Tipo retirado das opções; cadastros antigos foram preservados." : "Tipo restaurado.");
    } catch (erro) {
      avisar("Não foi possível atualizar o tipo.", "danger");
    }
  }

  function abrirModalOperacao() {
    estado.formularioOperacao = {
      operacao: "entrada",
      tipo: estado.tipos[0] || TIPOS[0],
      material: "",
      quantidade: 1,
      responsavel: "",
      observacoes: "",
    };
    estado.modal = { tipo: "operacao" };
    renderModal();
  }

  async function salvarOperacao() {
    const f = estado.formularioOperacao || {};
    if (estado.salvandoOperacao) return;
    const quantidade = Number(f.quantidade);
    if (!String(f.material || "").trim()) {
      avisar("Informe o material ou modelo.", "danger");
      return;
    }
    if (!Number.isInteger(quantidade) || quantidade < 1) {
      avisar("Informe uma quantidade inteira maior que zero.", "danger");
      return;
    }
    if (!clienteSupabase) {
      semBanco();
      return;
    }
    estado.salvandoOperacao = true;
    renderModal();
    try {
      const resposta = await clienteSupabase.rpc("registrar_movimentacao_estoque", {
        p_tipo: f.tipo,
        p_material: String(f.material).trim(),
        p_operacao: f.operacao,
        p_quantidade: quantidade,
        p_responsavel: String(f.responsavel || "").trim(),
        p_observacoes: String(f.observacoes || "").trim(),
      });
      if (resposta.error) throw resposta.error;
      estado.modal = null;
      estado.formularioOperacao = null;
      estado.salvandoOperacao = false;
      render();
      try {
        await carregarOperacoes();
        render();
        avisar(f.operacao === "entrada" ? "Entrada registrada." : "Retirada registrada.");
      } catch (erroAtualizacao) {
        avisar("Operação registrada, mas o histórico não atualizou. Recarregue a tela.", "danger");
      }
    } catch (erro) {
      estado.salvandoOperacao = false;
      renderModal();
      avisar(
        erro && erro.message ? erro.message : "Não foi possível registrar a operação.",
        "danger"
      );
    }
  }

  function alternarSenha(id) {
    const posicao = estado.senhasVisiveis.indexOf(id);
    if (posicao === -1) estado.senhasVisiveis.push(id);
    else estado.senhasVisiveis.splice(posicao, 1);
    if (estado.modal && estado.modal.tipo === "detalhe") renderModal();
    else renderCorpo();
  }

  /* ---------------------------- backup e planilha -------------------------- */

  function baixarArquivo(conteudo, nome, mime) {
    const blob = new Blob([conteudo], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nome;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function exportarBackup() {
    const pacote = {
      app: "Controle T.I",
      versao: 1,
      exportadoEm: new Date().toISOString(),
      equipamentos: estado.equipamentos,
    };
    baixarArquivo(
      JSON.stringify(pacote, null, 2),
      "controle-ti-backup-" + hoje() + ".json",
      "application/json"
    );
    avisar(
      "Backup gerado com " +
        estado.equipamentos.length +
        (estado.equipamentos.length === 1 ? " equipamento." : " equipamentos.")
    );
  }

  function mesmaChave(a, b) {
    const igual = function (x, y) {
      return (
        String(x || "").trim().toLowerCase() ===
        String(y || "").trim().toLowerCase()
      );
    };
    return (
      igual(a.nome, b.nome) &&
      igual(a.imei_ns, b.imei_ns) &&
      igual(a.numero, b.numero)
    );
  }

  function importarBackup() {
    const arquivo = estado.arquivoBackup;
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = async function () {
      let conteudo = null;
      try {
        conteudo = JSON.parse(String(leitor.result));
      } catch (erro) {
        conteudo = null;
      }
      if (
        !conteudo ||
        typeof conteudo !== "object" ||
        conteudo.app !== "Controle T.I" ||
        !Array.isArray(conteudo.equipamentos)
      ) {
        avisar("Este arquivo não é um backup válido do Controle T.I.", "danger");
        return;
      }
      if (!clienteSupabase) {
        semBanco();
        return;
      }

      let existentes = 0;
      let invalidos = 0;
      const novos = [];
      conteudo.equipamentos.forEach(function (bruto) {
        const item = normalizar(bruto);
        if (!String(item.nome).trim()) {
          invalidos += 1;
          return;
        }
        const repetido = estado.equipamentos.some(function (cada) {
          return mesmaChave(cada, item);
        });
        if (repetido) {
          existentes += 1;
          return;
        }
        novos.push(paraLinha(item));
      });

      let importados = 0;
      if (novos.length) {
        try {
          const resposta = await clienteSupabase
            .from(TABELA)
            .insert(novos)
            .select();
          if (resposta.error) throw resposta.error;
          (resposta.data || []).forEach(function (linha) {
            estado.equipamentos.unshift(
              Object.assign(normalizar(linha), { id: linha.id })
            );
          });
          importados = (resposta.data || []).length;
        } catch (erro) {
          avisar("Não foi possível salvar.", "danger");
          return;
        }
      }

      estado.modal = null;
      estado.arquivoBackup = null;
      renderModal();
      render();
      avisar(importados + " importados, " + existentes + " já existiam.");
      if (invalidos) {
        avisar(
          "A importação ignorou " +
            invalidos +
            (invalidos === 1 ? " item sem nome." : " itens sem nome."),
          "danger"
        );
      }
    };
    leitor.readAsText(arquivo);
  }

  function celulaCsv(valor) {
    const texto = valor === undefined || valor === null ? "" : String(valor);
    return /[";\r\n]/.test(texto) ? '"' + texto.replace(/"/g, '""') + '"' : texto;
  }

  function baixarPlanilha() {
    const lista = relatorioFiltrados();
    if (!lista.length) {
      avisar("Nenhum equipamento encontrado com esses filtros.", "danger");
      return;
    }
    const colunas = [
      "Nome",
      "Tipo",
      "Condição",
      "Status",
      "Responsável",
      "E-mail",
      "Número",
      "IMEI/NS",
      "Observações",
    ];
    const linhas = lista.map(function (item) {
      return [
        item.nome,
        item.tipo,
        item.condicao,
        item.status,
        item.responsavel,
        item.email,
        item.numero,
        item.imei_ns,
        item.observacoes,
      ];
    });
    const csv = [colunas]
      .concat(linhas)
      .map(function (linha) {
        return linha.map(celulaCsv).join(";");
      })
      .join("\r\n");
    baixarArquivo(
      "\ufeff" + csv,
      "controle-ti-relatorio-" + hoje() + ".csv",
      "text/csv;charset=utf-8"
    );
    avisar(
      "Planilha gerada com " +
        lista.length +
        (lista.length === 1 ? " equipamento." : " equipamentos.")
    );
  }

  function modalTipos() {
    const linhas = estado.catalogoTipos
      .map(function (tipo) {
        return (
          '<div class="linha-tipo"><span>' +
          esc(tipo.nome) +
          (tipo.ativo ? "" : ' <small class="texto-inativo">(retirado)</small>') +
          '</span><button class="btn btn-secondary btn-sm" data-acao="alternar-tipo" data-id="' +
          esc(tipo.id || "") +
          '"' +
          (!tipo.id ? " disabled" : "") +
          ">" +
          (tipo.ativo ? "Retirar" : "Restaurar") +
          "</button></div>"
        );
      })
      .join("");
    return (
      '<div class="sobreposicao"><section class="modal modal-lg">' +
      '<div class="modal-cabecalho"><div><div class="modal-titulo">Gerenciar tipos</div>' +
      '<div class="modal-sub">Tipos retirados deixam de aparecer nas opções; os registros existentes são preservados.</div></div>' +
      '<button class="btn-icone modal-fechar" data-acao="fechar-modal" title="Fechar">' +
      icone("close", 18) +
      "</button></div>" +
      '<div class="modal-corpo"><div class="gerenciar-tipos-form">' +
      '<input class="entrada" id="novo-tipo" type="text" maxlength="80" placeholder="Ex.: Toner" />' +
      '<button class="btn btn-primary" data-acao="salvar-tipo">' +
      icone("plus", 16) +
      " Incluir tipo</button></div>" +
      '<div class="lista-tipos">' +
      (linhas || '<p class="backup-texto">Nenhum tipo cadastrado.</p>') +
      "</div></div></section></div>"
    );
  }

  function modalOperacao() {
    const f = estado.formularioOperacao || {};
    const tipos = estado.tipos.length ? estado.tipos : TIPOS;
    return (
      '<div class="sobreposicao"><section class="modal modal-lg">' +
      '<div class="modal-cabecalho"><div><div class="modal-titulo">Registrar operação</div>' +
      '<div class="modal-sub">Registre entrada ou retirada. O sistema impede retirar mais do que há em estoque.</div></div>' +
      '<button class="btn-icone modal-fechar" data-acao="fechar-modal" title="Fechar">' +
      icone("close", 18) +
      "</button></div>" +
      '<div class="modal-corpo"><div class="form-grade">' +
      '<div class="campo"><label class="campo-rotulo" for="op-operacao">Operação</label>' +
      '<select class="selecao" id="op-operacao" data-operacao-campo="operacao">' +
      '<option value="entrada"' +
      (f.operacao === "entrada" ? " selected" : "") +
      ">Entrada</option><option value=\"saida\"" +
      (f.operacao === "saida" ? " selected" : "") +
      ">Retirada</option></select></div>" +
      '<div class="campo"><label class="campo-rotulo" for="op-tipo">Tipo</label>' +
      '<select class="selecao" id="op-tipo" data-operacao-campo="tipo">' +
      tipos
        .map(function (tipo) {
          return (
            '<option value="' +
            esc(tipo) +
            '"' +
            (f.tipo === tipo ? " selected" : "") +
            ">" +
            esc(tipo) +
            "</option>"
          );
        })
        .join("") +
      "</select></div>" +
      '<div class="campo campo-largo"><label class="campo-rotulo" for="op-material">Material / modelo</label>' +
      '<input class="entrada" id="op-material" data-operacao-campo="material" type="text" maxlength="120" placeholder="Ex.: Toner HP 105A" value="' +
      esc(f.material || "") +
      '" /></div>' +
      '<div class="campo"><label class="campo-rotulo" for="op-quantidade">Quantidade</label>' +
      '<input class="entrada" id="op-quantidade" data-operacao-campo="quantidade" type="number" min="1" step="1" value="' +
      esc(f.quantidade || 1) +
      '" /></div>' +
      '<div class="campo"><label class="campo-rotulo" for="op-responsavel">Responsável</label>' +
      '<input class="entrada" id="op-responsavel" data-operacao-campo="responsavel" type="text" maxlength="120" value="' +
      esc(f.responsavel || "") +
      '" /></div>' +
      '<div class="campo campo-largo"><label class="campo-rotulo" for="op-observacoes">Observações</label>' +
      '<textarea class="area-texto" id="op-observacoes" data-operacao-campo="observacoes" rows="3">' +
      esc(f.observacoes || "") +
      "</textarea></div>" +
      "</div></div>" +
      '<div class="modal-rodape"><button class="btn btn-secondary" data-acao="fechar-modal">Cancelar</button>' +
      '<button class="btn btn-primary" data-acao="salvar-operacao"' +
      (estado.salvandoOperacao ? " disabled" : "") +
      ">" +
      (estado.salvandoOperacao ? "Salvando..." : "Registrar operação") +
      "</button></div>" +
      "</section></div>"
    );
  }

  /* -------------------------------- render -------------------------------- */

  function render() {
    const rota = rotaAtual();
    const app = document.getElementById("app");

    if (rota === "/entrar") {
      app.innerHTML = telaEntrada();
      return;
    }

    app.innerHTML =
      '<div class="app-shell">' +
      cabecalho() +
      abas(rota) +
      '<main class="conteudo" id="conteudo">' +
      (rota === "/relatorio"
        ? paginaRelatorio()
        : rota === "/operacoes"
          ? paginaOperacoes()
          : paginaEquipamentos()) +
      "</main>" +
      "</div>";

    if (rota === "/") {
      renderCorpo();
      observarSentinela();
    }
  }

  /* -------------------------------- eventos -------------------------------- */

  let temporizadorBusca = null;

  document.addEventListener("click", function (evento) {
    if (evento.target.classList.contains("sobreposicao")) {
      fecharModal();
      return;
    }

    const alvo = evento.target.closest("[data-acao]");
    if (!alvo) return;
    const acao = alvo.dataset.acao;
    const id = alvo.dataset.id;

    if (acao === "entrar") {
      try {
        sessionStorage.setItem(CHAVE_ACESSO, "1");
      } catch (erro) {
        /* navegador sem armazenamento de sessão: entra mesmo assim */
      }
      location.hash = "#/";
      carregarDados();
    } else if (acao === "abrir-novo") {
      abrirModalFormulario(null);
    } else if (acao === "abrir-tipos") {
      const voltarParaFormulario = Boolean(
        estado.modal && estado.modal.tipo === "form"
      );
      estado.modal = {
        tipo: "tipos",
        voltarParaFormulario: voltarParaFormulario,
      };
      renderModal();
      const entradaTipo = document.getElementById("novo-tipo");
      if (entradaTipo) entradaTipo.focus();
    } else if (acao === "salvar-tipo") {
      salvarTipo();
    } else if (acao === "alternar-tipo") {
      alternarTipo(id);
    } else if (acao === "abrir-operacao") {
      abrirModalOperacao();
    } else if (acao === "salvar-operacao") {
      salvarOperacao();
    } else if (acao === "abrir-editar") {
      abrirModalFormulario(id);
    } else if (acao === "abrir-detalhe") {
      estado.modal = { tipo: "detalhe", id: id };
      renderModal();
    } else if (acao === "abrir-excluir") {
      estado.modal = { tipo: "excluir", id: id };
      renderModal();
    } else if (acao === "abrir-backup") {
      estado.arquivoBackup = null;
      estado.modal = { tipo: "backup" };
      renderModal();
    } else if (acao === "fechar-modal") {
      fecharModal();
    } else if (acao === "salvar-formulario") {
      salvarFormulario();
    } else if (acao === "confirmar-exclusao") {
      confirmarExclusao(id);
    } else if (acao === "alternar-senha") {
      alternarSenha(id);
    } else if (acao === "alternar-senha-form") {
      sincronizarFormulario();
      estado.senhaFormVisivel = !estado.senhaFormVisivel;
      renderModal();
    } else if (acao === "escolher-arquivo") {
      const entrada = document.getElementById("arquivo-entrada");
      if (entrada) entrada.click();
    } else if (acao === "exportar-backup") {
      exportarBackup();
    } else if (acao === "importar-backup") {
      importarBackup();
    } else if (acao === "baixar-planilha") {
      baixarPlanilha();
    }
  });

  document.addEventListener("input", function (evento) {
    const campo = evento.target;
    if (campo.dataset.operacaoCampo && estado.formularioOperacao) {
      estado.formularioOperacao[campo.dataset.operacaoCampo] = campo.value;
      return;
    }
    if (campo.dataset.campoForm && estado.formulario) {
      estado.formulario.dados[campo.dataset.campoForm] = campo.value;
      return;
    }
    if (campo.dataset.campo === "busca") {
      estado.busca = campo.value;
      clearTimeout(temporizadorBusca);
      temporizadorBusca = setTimeout(aplicarFiltro, 300);
    }
  });

  document.addEventListener("change", function (evento) {
    const campo = evento.target;

    if (campo.id === "arquivo-entrada") {
      estado.arquivoBackup = campo.files && campo.files[0] ? campo.files[0] : null;
      renderModal();
      return;
    }

    if (campo.dataset.operacaoCampo && estado.formularioOperacao) {
      estado.formularioOperacao[campo.dataset.operacaoCampo] = campo.value;
      return;
    }

    if (campo.dataset.campoForm && estado.formulario) {
      estado.formulario.dados[campo.dataset.campoForm] = campo.value;
      return;
    }

    const chave = campo.dataset.campo;
    if (chave === "filtro-tipo") {
      estado.tipo = campo.value;
      aplicarFiltro();
    } else if (chave === "filtro-status") {
      estado.status = campo.value;
      aplicarFiltro();
    } else if (chave === "filtro-condicao") {
      estado.condicao = campo.value;
      aplicarFiltro();
    } else if (chave === "rel-tipo") {
      estado.relTipo = campo.value;
    } else if (chave === "rel-status") {
      estado.relStatus = campo.value;
    } else if (chave === "rel-condicao") {
      estado.relCondicao = campo.value;
    }
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && estado.modal) fecharModal();
  });

  window.addEventListener("hashchange", function () {
    fecharModal();
    render();
    if (rotaAtual() === "/operacoes" && !estado.operacoesCarregadas) {
      carregarOperacoes().then(render).catch(function () {
        estado.carregandoOperacoes = false;
        avisar("Não foi possível carregar as operações. Aplique a migração do Supabase.", "danger");
        render();
      });
    }
  });

  /* -------------------------------- partida -------------------------------- */

  let dadosCarregados = false;

  async function carregarDados() {
    if (dadosCarregados) return;
    dadosCarregados = true;
    estado.carregando = true;
    render();
    try {
      estado.equipamentos = await carregarRemoto();
    } catch (erro) {
      avisar("Não foi possível carregar os equipamentos.", "danger");
    }
    try {
      await carregarTipos();
    } catch (erro) {
      avisar("Não foi possível carregar os tipos. Aplique a migração do Supabase.", "danger");
    }
    estado.carregando = false;
    render();
  }

  if (!location.hash || location.hash === "#") {
    let jaEntrou = false;
    try {
      jaEntrou = sessionStorage.getItem(CHAVE_ACESSO) === "1";
    } catch (erro) {
      jaEntrou = false;
    }
    location.hash = jaEntrou ? "#/" : "#/entrar";
  }
  render();
  if (rotaAtual() !== "/entrar") {
    carregarDados();
    if (rotaAtual() === "/operacoes") {
      carregarOperacoes().then(render).catch(function () {
        estado.carregandoOperacoes = false;
        avisar("Não foi possível carregar as operações. Aplique a migração do Supabase.", "danger");
      });
    }
  }
})();
