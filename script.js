// Recupera vendas salvas no localStorage ou cria um array vazio
let vendas = JSON.parse(localStorage.getItem('vendas')) || [];
let faturamentoMensal = 0;

// Função para atualizar a lista de vendas e o gráfico
function atualizarVendas() {
    const listaVendas = document.getElementById('listaVendas');
    const faturamentoElemento = document.getElementById('faturamentoMensal');
    const desafioElemento = document.getElementById('desafioMes');

    // Limpa a lista de vendas
    listaVendas.innerHTML = '';

    // Atualiza o faturamento total
    faturamentoMensal = vendas.reduce((acc, venda) => acc + venda.total, 0);
    faturamentoElemento.textContent = `R$ ${faturamentoMensal.toFixed(2)}`;

    // Calcula o desafio do mês
    let mediaMensal = 0;
    if (vendas.length > 0) {
        mediaMensal = vendas.reduce((acc, venda) => acc + venda.total, 0) / vendas.length;
    }
    let desafio = "Em andamento...";
    if (faturamentoMensal > mediaMensal) {
        desafio = "Acima da média";
    } else if (faturamentoMensal < mediaMensal) {
        desafio = "Abaixo da média";
    } else {
        desafio = "Na média";
    }
    desafioElemento.textContent = desafio;

    // Preenche a lista de vendas
    vendas.forEach(venda => {
        const item = document.createElement('li');
        item.textContent = `${venda.nomeProduto} - R$ ${venda.precoUnitario} x ${venda.quantidadeVendida} = R$ ${venda.total.toFixed(2)}`;
        listaVendas.appendChild(item);
    });

    // Atualiza o gráfico
    atualizarGrafico();
}

// Função para atualizar o gráfico de vendas
function atualizarGrafico() {
    const ctx = document.getElementById('graficoVendas').getContext('2d');
    const meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const vendasMensais = new Array(12).fill(0);

    vendas.forEach(venda => {
        const mes = new Date(venda.data).getMonth();
        vendasMensais[mes] += venda.total;
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Vendas Mensais',
                data: vendasMensais,
                borderColor: '#28a745',
                fill: false,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Função para registrar uma venda
document.getElementById('vendaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nomeProduto = document.getElementById('nomeProduto').value;
    const precoProduto = parseFloat(document.getElementById('precoProduto').value);
    const quantidadeVendida = parseInt(document.getElementById('quantidadeVendida').value);

    if (!nomeProduto || isNaN(precoProduto) || isNaN(quantidadeVendida)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const total = precoProduto * quantidadeVendida;
    const dataVenda = new Date();

    const venda = {
        nomeProduto,
        precoUnitario: precoProduto,
        quantidadeVendida,
        total,
        data: dataVenda.toISOString()
    };

    vendas.push(venda);
    localStorage.setItem('vendas', JSON.stringify(vendas));

    // Limpar os campos do formulário
    document.getElementById('vendaForm').reset();

    // Atualizar a interface
    atualizarVendas();
});

// Inicializa o site com as vendas salvas
atualizarVendas();
