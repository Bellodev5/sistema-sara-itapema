const API_URL = "/pessoas";
let grafico;
let tipoGraficoAtual = "bar";

async function carregarDados() {
  // COMENTANDO A BUSCA REAL DA API PARA TESTE
  /*
  const res = await fetch(API_URL);
  const pessoas = await res.json();
  
  // Inicialização de contagem por culto
  const contagem = {
    domingoManha: 1,
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
  */

  // DADOS FICTÍCIOS PARA TESTE
  const contagem = {
    domingoManha: 45,   // 45 pessoas no domingo manhã
    domingoNoite: 62,   // 62 pessoas no domingo noite  
    feMilagres: 38,     // 38 pessoas no fé & milagres
    arena: 29           // 29 pessoas na arena
  };

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
        "#3498db",  // Azul
        "#2ecc71",  // Verde
        "#f39c12",  // Laranja
        "#e74c3c"   // Vermelho
      ],
      borderColor: [
        "#2980b9",
        "#27ae60", 
        "#e67e22",
        "#c0392b"
      ],
      borderWidth: 2
    }]
  };

  if (grafico) grafico.destroy();

  const opcoes = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: tipoGraficoAtual === 'pie' || tipoGraficoAtual === 'doughnut',
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Distribuição de Visitantes por Culto',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  // Adicionar configuração de escala apenas para gráficos de barra
  if (tipoGraficoAtual === 'bar') {
    opcoes.scales = {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
          font: {
            size: 14
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      x: {
        ticks: {
          font: {
            size: 14
          }
        },
        grid: {
          display: false
        }
      }
    };
  }

  grafico = new Chart(ctx, {
    type: tipoGraficoAtual,
    data: dados,
    options: opcoes
  });
}

// FUNÇÃO PARA TROCAR TIPO DE GRÁFICO (chamada pelos botões do HTML)
function trocarTipoGrafico(tipo) {
  tipoGraficoAtual = tipo;
  carregarDados(); // Recarrega o gráfico com o novo tipo
}

// FUNÇÃO PARA ALTERNAR ENTRE DADOS FICTÍCIOS E REAIS
function alternarModoTeste() {
  // Quando quiser voltar para dados reais, descomente o código da API
  // e comente a parte dos dados fictícios
}

document.addEventListener("DOMContentLoaded", carregarDados);