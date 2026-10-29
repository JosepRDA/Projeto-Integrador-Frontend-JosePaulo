// ---------- 1. Dados ----------
const verbetes = [
    { titulo: "Microkernel", categoria: "Sistemas Operacionais", palavras: 1200 },
    { titulo: "Bootloaders", categoria: "Sistemas Operacionais", palavras: 900 },
    { titulo: "Paginação de memória", categoria: "Sistemas Operacionais", palavras: 1800 },
    { titulo: "UART", categoria: "Protocolos", palavras: 650 },
    { titulo: "SPI", categoria: "Protocolos", palavras: 700 },
    { titulo: "I2C", categoria: "Protocolos", palavras: 800 },
    { titulo: "Escalonamento", categoria: "RTOS", palavras: 1500 },
    { titulo: "Bare metal vs RTOS", categoria: "RTOS", palavras: 500 },
];

const CLASSES_DA_FAIXA = {
    "Leitura rápida": "faixa-rapida",
    "Leitura média": "faixa-media",
    "Leitura longa": "faixa-longa",
};


// ---------- 2. Funções puras ----------
function calcularTempoLeitura(palavras, palavrasPorMinuto = 200) {
    return Math.ceil(palavras / palavrasPorMinuto);
}

function classificarLeitura(minutos) {
    if (minutos <= 3) return "Leitura rápida";
    if (minutos <= 7) return "Leitura média";
    return "Leitura longa";
}

function analisarVerbetes(lista, palavrasPorMinuto) {
    return lista.map((verbete) => {
        const minutos = calcularTempoLeitura(verbete.palavras, palavrasPorMinuto);
        return {
            ...verbete,
            minutos: minutos,
            faixa: classificarLeitura(minutos),
        };
    });
}

// reduce + filter + map: resume a lista inteira em um único objeto.
function resumirVerbetes(analisados) {
    const totalPalavras = analisados.reduce((total, v) => total + v.palavras, 0);
    const totalMinutos = analisados.reduce((total, v) => total + v.minutos, 0);

    const maisLongo = analisados.reduce((atual, v) =>
        v.palavras > atual.palavras ? v : atual
    );

    const titulosLongos = analisados
        .filter((v) => v.faixa === "Leitura longa")
        .map((v) => v.titulo);

    return {
        totalVerbetes: analisados.length,
        totalPalavras: totalPalavras,
        totalMinutos: totalMinutos,
        maisLongo: maisLongo,
        titulosLongos: titulosLongos,
    };
}


// ---------- 3. Funções que montam elementos (devolvem, não inserem) ----------
function criarCardVerbete(verbete) {
    const card = document.createElement("article");
    card.classList.add("verbete", CLASSES_DA_FAIXA[verbete.faixa]);

    const titulo = document.createElement("h3");
    titulo.textContent = verbete.titulo;

    const meta = document.createElement("p");
    meta.textContent = `${verbete.categoria} · ${verbete.palavras} palavras`;

    const leitura = document.createElement("p");
    leitura.textContent = `${verbete.minutos} min · ${verbete.faixa}`;

    card.append(titulo, meta, leitura);
    return card;
}

// Recebe o objeto de resumo e devolve o bloco de resumo pronto.
function criarBlocoResumo(resumo) {
    const linhas = [
        ["Verbetes analisados", resumo.totalVerbetes],
        ["Total de palavras", resumo.totalPalavras.toLocaleString("pt-BR")],
        ["Tempo total de leitura", `${resumo.totalMinutos} min`],
        ["Verbete mais longo", `${resumo.maisLongo.titulo} (${resumo.maisLongo.palavras} palavras)`],
        ["Leituras longas", resumo.titulosLongos.join(", ")],
    ];

    const bloco = document.createElement("section");
    bloco.classList.add("resumo-verbetes");

    const titulo = document.createElement("h3");
    titulo.textContent = "Resumo da wiki";

    const lista = document.createElement("ul");
    linhas.forEach(([rotulo, valor]) => {
        const item = document.createElement("li");
        item.textContent = `${rotulo}: ${valor}`;
        lista.append(item);
    });

    bloco.append(titulo, lista);
    return bloco;
}


// ---------- 4. Única função que mexe na página ----------
function exibirResultado(analisados, resumo) {
    const areaResultado = document.querySelector("#resultado");

    if (areaResultado === null) {
        console.error('Elemento "#resultado" não encontrado no HTML.');
        return;
    }

    const lista = document.createElement("div");
    lista.classList.add("lista-verbetes");
    analisados.forEach((verbete) => lista.append(criarCardVerbete(verbete)));

    areaResultado.replaceChildren(criarBlocoResumo(resumo), lista);
}


// ---------- 5. Execução ----------
const verbetesAnalisados = analisarVerbetes(verbetes);
const resumoGeral = resumirVerbetes(verbetesAnalisados);
exibirResultado(verbetesAnalisados, resumoGeral);

