document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "/pessoas";

  // query AFTER DOMContentLoaded (garante que os elementos existam)
  const areaSelect = document.getElementById("area");
  const visitanteCampos = Array.from(
    document.querySelectorAll(".visitante-campos")
  );
  // procura botão por id ou por class (pra compatibilidade com seu HTML/CSS)
  const btnAdicionar =
    document.getElementById("btn-adicionar") ||
    document.querySelector(".btn-adicionar");

  // remove style inline que possa bloquear o display controlado por classes
  visitanteCampos.forEach((c) => c.removeAttribute("style"));

  function toggleCamposVisitante() {
    const mostrar = areaSelect && areaSelect.value === "visitante";
    visitanteCampos.forEach((campo) =>
      campo.classList.toggle("visible", mostrar)
    );
  }

  // Carrega lista de pessoas e popula as seções
  async function carregarPessoas() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const pessoas = await res.json();

      const louvorLista = document.getElementById("louvor-lista");
      const visitanteLista = document.getElementById("visitante-lista");
      const testemunhoLista = document.getElementById("testemunho-lista");
      const avisoCultoLista = document.getElementById("avisoCulto-lista");
      const avisoPastorLista = document.getElementById("avisoPastor-lista");

      [
        louvorLista,
        visitanteLista,
        testemunhoLista,
        avisoCultoLista,
        avisoPastorLista,
      ].forEach((el) => {
        if (el) el.innerHTML = "";
      });

      (pessoas || []).forEach((p) => {
        const div = document.createElement("div");
        div.className = "pessoa";

        const areaNormalized = (p.area || "")
          .toString()
          .toLowerCase()
          .replace(/\s/g, "");
        const extraInfo =
          areaNormalized === "visitante"
            ? `<p>Telefone: ${p.telefone || "-"}</p><p>Mais info: ${
                p.maisInfo || "-"
              }</p>`
            : `<p>${p.descricao || "-"}</p>`;

        div.innerHTML = `
          <div class="pessoa-info">
            <span class="pessoa-nome">${escapeHtml(p.nome)}</span>
            ${extraInfo}
          </div>
          <button class="btn-remover" data-id="${p.id}">X</button>
        `;

        if (areaNormalized === "louvor" && louvorLista)
          louvorLista.appendChild(div);
        else if (areaNormalized === "visitante" && visitanteLista)
          visitanteLista.appendChild(div);
        else if (areaNormalized === "testemunho" && testemunhoLista)
          testemunhoLista.appendChild(div);
        else if (areaNormalized === "avisoculto" && avisoCultoLista)
          avisoCultoLista.appendChild(div);
        else if (areaNormalized === "avisopastor" && avisoPastorLista)
          avisoPastorLista.appendChild(div);
      });

      // conecta botões de remoção (delegação simples)
      document.querySelectorAll(".btn-remover").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.dataset.id;
          if (id) excluirPessoa(id);
        });
      });
    } catch (err) {
      console.error("carregarPessoas erro:", err);
    }
  }

  async function adicionarPessoa() {
    const nome = document.getElementById("nome").value.trim();
    const area = document.getElementById("area").value;
    let descricao = "";
    let telefone = "";
    let maisInfo = "";
  
    if (!nome) return alert("Digite um nome");
  
    if (area === "visitante") {
      // Pega telefone
      telefone = document.getElementById("telefone").value.trim() || "-";
  
      // Pega texto visível do select "maisInfo"
      const maisInfoSelect = document.getElementById("maisInfo");
      maisInfo = maisInfoSelect.value 
        ? maisInfoSelect.options[maisInfoSelect.selectedIndex].text
        : "-";
    } else {
      descricao = document.getElementById("descricao").value.trim() || "-";
    }
  
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, area, descricao, telefone, maisInfo })
    });
  
    // Limpa os campos do formulário
    document.getElementById("nome").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("maisInfo").value = "";
  
    // Atualiza a lista
    carregarPessoas();
  }

  async function excluirPessoa(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      carregarPessoas();
    } catch (err) {
      console.error("excluirPessoa erro:", err);
    }
  }

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

  // liga eventos
  if (areaSelect) areaSelect.addEventListener("change", toggleCamposVisitante);
  if (btnAdicionar) btnAdicionar.addEventListener("click", adicionarPessoa);

  // estado inicial
  toggleCamposVisitante();
  carregarPessoas();
});
