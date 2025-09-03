document.addEventListener("DOMContentLoaded", () => {
  // Seletores do DOM
  const areaSelect = document.getElementById("area");
  const visitanteCampos = Array.from(
    document.querySelectorAll(".visitante-campos")
  );
  const btnAdicionar =
    document.getElementById("btn-adicionar") ||
    document.querySelector(".btn-adicionar");

  // Remove estilos inline que possam atrapalhar a exibição
  visitanteCampos.forEach((c) => c.removeAttribute("style"));

  // Mostrar/ocultar campos de visitante
  function toggleCamposVisitante() {
    const mostrar = areaSelect && areaSelect.value === "visitante";
    visitanteCampos.forEach((campo) =>
      campo.classList.toggle("visible", mostrar)
    );
  }

  // Função para escapar HTML
  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(
      /[&<>"']/g,
      (s) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[s])
    );
  }

  // Carregar registros e popular listas
  async function carregarRegistros() {
    try {
      // Fetch conteúdos e visitantes separadamente
      const [conteudoRes, visitantesRes] = await Promise.all([
        fetch("/conteudo"),
        fetch("/visitantes"),
      ]);
      if (!conteudoRes.ok || !visitantesRes.ok)
        throw new Error("Erro ao buscar dados do servidor");

      const conteudos = await conteudoRes.json();
      const visitantes = await visitantesRes.json();

      // Seletores das listas
      const louvorLista = document.getElementById("louvor-lista");
      const visitanteLista = document.getElementById("visitante-lista");
      const testemunhoLista = document.getElementById("testemunho-lista");
      const avisoCultoLista = document.getElementById("avisoCulto-lista");
      const avisoPastorLista = document.getElementById("avisoPastor-lista");

      // Limpa listas
      [
        louvorLista,
        visitanteLista,
        testemunhoLista,
        avisoCultoLista,
        avisoPastorLista,
      ].forEach((el) => {
        if (el) el.innerHTML = "";
      });

      // Renderiza visitantes
      visitantes.forEach((v) => {
        const div = document.createElement("div");
        div.className = "pessoa";
        div.innerHTML = `
          <div class="pessoa-info">
            <span class="pessoa-nome">${escapeHtml(v.nome)}</span>
            <p>Contato: ${v.contato || "-"}</p>
            <p>Interesse: ${v.interesse || "-"}</p>
            <p>Mais info: ${v.mais_info || "-"}</p>
          </div>
          <button class="btn-remover" data-id="${
            v.id
          }" data-tipo="visitante">X</button>
        `;
        if (visitanteLista) visitanteLista.appendChild(div);
      });

      // Renderiza conteúdos
      conteudos.forEach((c) => {
        const div = document.createElement("div");
        div.className = "pessoa";

        div.innerHTML = `
          <div class="pessoa-info">
            <span class="pessoa-nome">${escapeHtml(c.nome || "-")}</span>
            <p>${c.descricao || "-"}</p>
          </div>
          <button class="btn-remover" data-id="${
            c.id
          }" data-tipo="conteudo">X</button>
        `;

        const tipoNormalized = (c.tipo || "").toLowerCase().replace(/\s/g, "");
        if (tipoNormalized === "louvor" && louvorLista)
          louvorLista.appendChild(div);
        else if (tipoNormalized === "testemunho" && testemunhoLista)
          testemunhoLista.appendChild(div);
        else if (tipoNormalized === "avisoculto" && avisoCultoLista)
          avisoCultoLista.appendChild(div);
        else if (tipoNormalized === "avisopastor" && avisoPastorLista)
          avisoPastorLista.appendChild(div);
      });

      // Conecta botões de remoção
      document.querySelectorAll(".btn-remover").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.currentTarget.dataset.id;
          const tipo = e.currentTarget.dataset.tipo;
          if (!id || !tipo) return;
          try {
            await fetch(`/${tipo}/${id}`, { method: "DELETE" });
            carregarRegistros();
          } catch (err) {
            console.error("Erro ao excluir:", err);
          }
        });
      });
    } catch (err) {
      console.error("Erro ao carregar registros:", err);
    }
  }

  // Adicionar registro
async function adicionarRegistro() {
  const area = document.getElementById("area").value;
  const descricaoEl = document.getElementById("descricao");
  const telefoneEl = document.getElementById("telefone");
  const maisInfoEl = document.getElementById("maisInfo");

  let nome = null;
  let descricao = descricaoEl.value.trim() || null;

  // Nome obrigatório apenas para louvor/testemunho
  if (area !== "avisoculto" && area !== "avisopastor" && area !== "visitante") {
    const nomeEl = document.getElementById("nome");
    nome = nomeEl.value.trim();
    if (!nome) return alert("Digite um nome");
  }

  // Descrição obrigatória para avisos e louvor/testemunho
  if ((area === "avisoculto" || area === "avisopastor" || area === "louvor" || area === "testemunho") && !descricao) {
    return alert("Digite a descrição/mensagem");
  }

  let apiUrl = "";
  let body = {};

  if (area === "visitante") {
    const nomeEl = document.getElementById("nome");
    nome = nomeEl.value.trim();
    if (!nome) return alert("Digite um nome para o visitante");

    apiUrl = "/visitantes";
    body = {
      nome,
      contato: telefoneEl.value.trim() || null,
      interesse: maisInfoEl.value || null,
      mais_info: descricaoEl.value || null
    };
  } else { // louvor, testemunho, avisos
    apiUrl = "/conteudo";
    body = {
      tipo: area,
      nome: (area === "avisoculto" || area === "avisopastor") ? null : nome,
      descricao
    };
  }

  try {
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    // Limpa os campos do formulário
    if (document.getElementById("nome")) document.getElementById("nome").value = "";
    descricaoEl.value = "";
    telefoneEl.value = "";
    maisInfoEl.value = "";

    // Atualiza a lista
    carregarRegistros();
  } catch (err) {
    console.error("Erro ao adicionar registro:", err);
  }
}


  // Liga eventos
  if (areaSelect) areaSelect.addEventListener("change", toggleCamposVisitante);
  if (btnAdicionar) btnAdicionar.addEventListener("click", adicionarRegistro);

  // Estado inicial
  toggleCamposVisitante();
  carregarRegistros();
});
