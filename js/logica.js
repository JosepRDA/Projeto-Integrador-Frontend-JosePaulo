/*
 * ATIVIDADE PRÁTICA — Aula 09: JavaScript, Lógica de Programação
 * Projeto Integrador: Embedded Wiki
 *
 * TEMA: mini-analisador dos artigos da wiki (tamanho, tempo de leitura e seção).
 *
 * ENTRADA:
 *   - array de artigos (titulo, categoria, palavras)
 *   - prompt: número mínimo de palavras para considerar um artigo "acima do limite"
 *   - prompt em laço: termos de busca de artigos, até digitar "sair"
 * PROCESSAMENTO:
 *   - converte e valida a entrada (Number, null, vazio, NaN, faixa 0-5000)
 *   - classifica cada artigo por tempo de leitura (if / else if / else)
 *   - associa a categoria à pasta da wiki (switch)
 *   - resume: soma, média, artigo mais longo e contagem (for...of)
 * SAÍDA:
 *   - frases com template literal e relatório com console.table
 *
 * PSEUDOCÓDIGO:
 *   1. Declarar o array de artigos
 *   2. Pedir o limite mínimo de palavras e convertê-lo para número
 *   3. Se o limite for inválido: avisar e usar o valor padrão (400)
 *   4. Para cada artigo: calcular o tempo de leitura (palavras / 200)
 *   5. Classificar: >= 1000 palavras Longa; >= 500 Média; senão Rápida
 *   6. Descobrir a pasta da wiki pela categoria (switch)
 *   7. Somar palavras, guardar o mais longo e contar os acima do limite
 *   8. Mostrar o relatório e depois pedir buscas até digitar "sair"
 *
 * TESTE DE MESA (3 primeiras voltas do laço principal, limite digitado = 400):
 *   Volta | artigo | palavras | soma antes | soma depois | maisLonga      | acimaDoLimite
 *   ------+--------+----------+------------+-------------+----------------+--------------
 *     1   | UART   |   420    |      0     |     420     | UART (inicial) | 0 -> 1 (420 >= 400)
 *     2   | SPI    |   380    |    420     |     800     | UART           | 1 -> 1 (380 < 400)
 *     3   | I2C    |   510    |    800     |    1310     | I2C (510 > 420)| 1 -> 2 (510 >= 400)
 *   Conferido com o console: as linhas 1 a 3 do console.table mostram
 *   UART (Rápida), SPI (Rápida) e I2C (Média).
 */

{
  const artigos = [
    { titulo: "UART", categoria: "protocolos", palavras: 420 },
    { titulo: "SPI", categoria: "protocolos", palavras: 380 },
    { titulo: "I2C", categoria: "protocolos", palavras: 510 },
    { titulo: "Microkernel", categoria: "kernel", palavras: 900 },
    { titulo: "Syscalls", categoria: "kernel", palavras: 1250 },
    { titulo: "Escalonamento", categoria: "rtos", palavras: 1600 },
    { titulo: "GPIO e Interrupcoes", categoria: "mcus", palavras: 700 },
    { titulo: "Timers e PWM", categoria: "mcus", palavras: 320 }
  ];

  const LIMITE_PADRAO = 400;
  const PALAVRAS_POR_MINUTO = 200;

  const resposta = prompt("Mostrar artigos com pelo menos quantas palavras? (0 a 5000)");
  let limiteMinimo = Number(resposta);

  const invalida = resposta === null || resposta.trim() === "" ||
    Number.isNaN(limiteMinimo) ||
    limiteMinimo < 0 || limiteMinimo > 5000;

  if (invalida) {
    console.warn(`Entrada inválida (${resposta ?? "cancelado"}). Usando o padrão: ${LIMITE_PADRAO}.`);
    limiteMinimo = LIMITE_PADRAO;
  }

  const relatorio = [];
  let soma = 0;                
  let maisLonga = artigos[0]; 
  let acimaDoLimite = 0;     

  for (const artigo of artigos) {
    const minutos = Math.ceil(artigo.palavras / PALAVRAS_POR_MINUTO);

    let leitura;
    if (artigo.palavras >= 1000) {
      leitura = "Longa";
    } else if (artigo.palavras >= 500) {
      leitura = "Média";
    } else {
      leitura = "Rápida";
    }

    let pasta;
    switch (artigo.categoria) {
      case "kernel":
        pasta = "kernel/ (núcleo do sistema)";
        break;
      case "protocolos":
        pasta = "protocolos/ (comunicação serial)";
        break;
      case "mcus":
        pasta = "mcus/ (microcontroladores)";
        break;
      case "rtos":
        pasta = "rtos/ (sistemas de tempo real)";
        break;
      default:
        pasta = "wiki geral";
    }

    soma += artigo.palavras;
    if (artigo.palavras > maisLonga.palavras) {
      maisLonga = artigo;
    }
    if (artigo.palavras >= limiteMinimo) {
      acimaDoLimite++;
    }

    relatorio.push({
      titulo: artigo.titulo,
      palavras: artigo.palavras,
      minutos,
      leitura,
      pasta
    });
  }

  const media = soma / artigos.length;
  const situacaoLimite = acimaDoLimite > 0 ? "há artigos acima do limite" : "nenhum artigo atinge o limite";

  console.table(relatorio);
  console.log(`Total de palavras: ${soma}`);
  console.log(`Média por artigo: ${media.toFixed(1)} palavras`);
  console.log(`Artigo mais longo: ${maisLonga.titulo} (${maisLonga.palavras} palavras)`);
  console.log(`Artigos com ${limiteMinimo}+ palavras: ${acimaDoLimite} de ${artigos.length} (${situacaoLimite})`);

  let buscas = 0;
  let termo = prompt('Buscar artigo pelo título (ou digite "sair"):');

  while (termo !== null && termo.trim().toLowerCase() !== "sair") {
    const busca = termo.trim().toLowerCase();

    if (busca === "") {
      console.warn("Digite um termo de busca ou \"sair\".");
    } else {
      buscas++;
      let achou = false;

      for (const artigo of artigos) {
        if (artigo.titulo.toLowerCase().includes(busca)) {
          console.log(`Encontrado: ${artigo.titulo} [${artigo.categoria}] - ${artigo.palavras} palavras`);
          achou = true;
        }
      }

      if (!achou) {
        console.warn(`Nenhum artigo encontrado para "${termo}".`);
      }
    }

    termo = prompt('Buscar outro artigo (ou digite "sair"):');
  }

  console.log(`Busca encerrada. Pesquisas válidas realizadas: ${buscas}.`);
}
