const API_URL = "/pessoas";

// Mostrar/ocultar campos de visitante
const areaSelect = document.getElementById("area");
const visitanteCampos = document.querySelectorAll(".visitante-campos");

function toggleCamposVisitante() {
  const mostrar = areaSelect && areaSelect.value === "visitante";
  visitanteCampos.forEach(campo => {
    campo.style.display = mostrar ? "block" : "none";
  });
}

// Inicializar campos quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  carregarPessoas();
  toggleCamposVisitante(); // Garantir estado inicial correto

  // Adicionar event listener para o select
  if (areaSelect) areaSelect.addEventListener("change", toggleCamposVisitante);

  document.getElementById("btn-adicionar")
    .addEventListener("click", adicionarPessoa);
});

async function carregarPessoas() {
  const res = await fetch(API_URL);
  const pessoas = await res.json();

  const louvorLista = document.getElementById("louvor-lista");
  const visitanteLista = document.getElementById("visitante-lista");
  const testemunhoLista = document.getElementById("testemunho-lista");
  const avisoCultoLista = document.getElementById("avisoCulto-lista");
  const avisoPastorLista = document.getElementById("avisoPastor-lista");

  louvorLista.innerHTML = "";
  visitanteLista.innerHTML = "";
  testemunhoLista.innerHTML = "";
  avisoCultoLista.innerHTML = "";
  avisoPastorLista.innerHTML = "";

  pessoas.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("pessoa");

    let extraInfo = "";
    if ((p.area || "").toString().toLowerCase() === "visitante") {
      extraInfo = `<p>Telefone: ${p.telefone || "-"}</p>
                   <p>Mais info: ${p.maisInfo || "-"}</p>`;
    } else {
      extraInfo = `<p>${p.descricao || "-"}</p>`;
    }

    div.innerHTML = `
      <div class="pessoa-info">
        <span class="pessoa-nome">${p.nome}</span>
        ${extraInfo}
      </div>
      <button class="btn-remover" onclick="excluirPessoa(${p.id})">X</button>
    `;

    // normaliza para evitar erro com maiúsculas/espaços (p.ex. "Aviso Culto")
    const areaKey = (p.area || "").toString().toLowerCase().replace(/\s/g, "");
    if (areaKey === "louvor") louvorLista.appendChild(div);
    else if (areaKey === "visitante") visitanteLista.appendChild(div);
    else if (areaKey === "testemunho") testemunhoLista.appendChild(div);
    else if (areaKey === "avisoculto") avisoCultoLista.appendChild(div);
    else if (areaKey === "avisopastor") avisoPastorLista.appendChild(div);
  });
}

async function adicionarPessoa() {
  const nome = document.getElementById("nome").value;
  const area = document.getElementById("area").value;
  const descricao = document.getElementById("descricao").value;
  let telefone = "";
  let maisInfo = "";

  if (!nome) return alert("Digite um nome");

  if (area === "visitante") {
    telefone = document.getElementById("telefone").value;
    maisInfo = document.getElementById("maisInfo").value;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, area, descricao, telefone, maisInfo })
  });

  document.getElementById("nome").value = "";
  document.getElementById("descricao").value = "";
  if (area === "visitante") {
    document.getElementById("telefone").value = "";
    document.getElementById("maisInfo").value = "";
  }

  carregarPessoas();
}

async function excluirPessoa(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  carregarPessoas();
}
