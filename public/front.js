document.addEventListener("DOMContentLoaded", () => {
  const areaSelect = document.getElementById("area");
  const visitanteCampos = Array.from(document.querySelectorAll(".visitante-campos"));
  const btnAdicionar = document.getElementById("btn-adicionar") || document.querySelector(".btn-adicionar");

  visitanteCampos.forEach((c) => c.removeAttribute("style"));

  function toggleCamposVisitante() {
    const mostrar = areaSelect && areaSelect.value === "visitante";
    visitanteCampos.forEach((campo) =>
      campo.classList.toggle("visible", mostrar)
    );
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, (s) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[s])
    );
  }

  // 🔹 Carregar registros
  async function carregarRegistros() {
    try {
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
      [louvorLista, visitanteLista, testemunhoLista, avisoCultoLista, avisoPastorLista].forEach((el) => {
        if (el) el.innerHTML = "";
      });

      // 🔹 Renderiza visitantes
      visitantes.forEach((v) => {
        const div = document.createElement("div");
        div.className = "pessoa";
        div.innerHTML = `
          <div class="pessoa-info">
            <p>Mais info: ${escapeHtml(v.maisinfo)}</p>
            <p>Culto: ${escapeHtml(v.culto)}</p>
            <p>Telefone: ${escapeHtml(v.telefone)}</p>
            <p>Endereço: ${escapeHtml(v.endereco)}</p>
          </div>
          <button class="btn-remover" data-id="${v.id}" data-tipo="visitante">X</button>
        `;
        if (visitanteLista) visitanteLista.appendChild(div);
      });

      // 🔹 Renderiza conteúdos (GERENCIAMENTO)
      conteudos.forEach((c) => {
        if (c.louvor) {
          const div = document.createElement("div");
          div.className = "pessoa";
          div.innerHTML = `
            <div class="pessoa-info">
              <span class="pessoa-nome">${escapeHtml(c.louvor)}</span>
            </div>
            <button class="btn-remover" data-id="${c.id}" data-tipo="conteudo">X</button>
          `;
          if (louvorLista) louvorLista.appendChild(div);
        }

        if (c.testemunho) {
          const div = document.createElement("div");
          div.className = "pessoa";
          div.innerHTML = `
            <div class="pessoa-info">
              <span class="pessoa-nome">${escapeHtml(c.testemunho)}</span>
            </div>
            <button class="btn-remover" data-id="${c.id}" data-tipo="conteudo">X</button>
          `;
          if (testemunhoLista) testemunhoLista.appendChild(div);
        }

        if (c.avisoculto) {
          const div = document.createElement("div");
          div.className = "pessoa";
          div.innerHTML = `
            <div class="pessoa-info">
              <p>${escapeHtml(c.avisoculto)}</p>
            </div>
            <button class="btn-remover" data-id="${c.id}" data-tipo="conteudo">X</button>
          `;
          if (avisoCultoLista) avisoCultoLista.appendChild(div);
        }

        if (c.avisospastor) {
          const div = document.createElement("div");
          div.className = "pessoa";
          div.innerHTML = `
            <div class="pessoa-info">
              <p>${escapeHtml(c.avisospastor)}</p>
            </div>
            <button class="btn-remover" data-id="${c.id}" data-tipo="conteudo">X</button>
          `;
          if (avisoPastorLista) avisoPastorLista.appendChild(div);
        }
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

  // 🔹 Adicionar registro
  async function adicionarRegistro() {
    const area = document.getElementById("area").value;
    const descricaoEl = document.getElementById("descricao");
    const telefoneEl = document.getElementById("telefone");
    const maisInfoEl = document.getElementById("maisInfo");
    const cultoEl = document.getElementById("culto");
    const enderecoEl = document.getElementById("endereco");
    const nomeEl = document.getElementById("nome");

    let apiUrl = "";
    let body = {};

    if (area === "visitante") {
      apiUrl = "/visitantes";
      body = {
        maisInfo: maisInfoEl.value || null,
        culto: cultoEl.value || null,
        telefone: telefoneEl.value.trim() || null,
        endereco: enderecoEl.value.trim() || null,
      };
    } else {
      apiUrl = "/conteudo";
      if (area === "louvor") {
        body = { louvor: nomeEl.value.trim() };
      } else if (area === "testemunho") {
        body = { testemunho: nomeEl.value.trim() };
      } else if (area === "avisoculto") {
        body = { avisoCulto: descricaoEl.value.trim() };
      } else if (area === "avisopastor") {
        body = { avisosPastor: descricaoEl.value.trim() };
      }
    }

    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Limpa os campos
      if (nomeEl) nomeEl.value = "";
      if (descricaoEl) descricaoEl.value = "";
      if (telefoneEl) telefoneEl.value = "";
      if (maisInfoEl) maisInfoEl.value = "";
      if (cultoEl) cultoEl.value = "";
      if (enderecoEl) enderecoEl.value = "";

      carregarRegistros();
    } catch (err) {
      console.error("Erro ao adicionar registro:", err);
    }
  }

  // Liga eventos
  if (areaSelect) areaSelect.addEventListener("change", toggleCamposVisitante);
  if (btnAdicionar) btnAdicionar.addEventListener("click", adicionarRegistro);

  toggleCamposVisitante();
  carregarRegistros();
});
