const API_URL = "/pessoas";
  let grafico;

  async function carregarDados() {
    const res = await fetch(API_URL);
    const pessoas = await res.json();

    // Inicialização de contagem por culto
    const contagem = {
      domingoManha: 0,
      domingoNoite: 0,
      feMilagres: 0,
      arena: 0
    };

    pessoas.forEach(p => {
      const cultoKey = (p.culto || "").toString();
      if (contagem[cultoKey] !== undefined) {
        contagem[cultoKey]++;
      }
    });

    atualizarGrafico(contagem);
  }

  function atualizarGrafico(contagem) {
    const ctx = document.getElementById("graficoPessoas").getContext("2d");

    const dados = {
      labels: ["Domingo 10:00", "Domingo 20:00", "Fé & Milagres", "Arena"],
      datasets: [{
        label: "Quantidade de Pessoas",
        data: [
          contagem.domingoManha,
          contagem.domingoNoite,
          contagem.feMilagres,
          contagem.arena
        ],
        backgroundColor: [
          "#1e90ff",
          "#28a745",
          "#ffc107",
          "#dc3545"
        ]
      }]
    };

    if (grafico) grafico.destroy();

    grafico = new Chart(ctx, {
      type: "bar", // pode trocar para 'pie' ou 'doughnut'
      data: dados,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
  document.addEventListener("DOMContentLoaded", carregarDados);
