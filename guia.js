// ==================================================
// GUIA BÁSICO PARA DESENHAR E MANIPULAR FIGURAS USANDO GIZ
// ==================================================

// 1. DESENHAR O PLANO CARTESIANO
// O plano cartesiano é desenhado automaticamente ao inicializar o canvas.
// Ele inclui eixos X e Y, linhas de grade e números nos eixos.

// 2. DESENHAR UM RETÂNGULO
const ret = retangulo(4, 2); // Cria um retângulo de largura 4 e altura 2
desenhar(ret); // Desenha o retângulo no canvas

// 3. DESENHAR UM CÍRCULO
const circ = circulo(3); // Cria um círculo de raio 3
desenhar(circ); // Desenha o círculo no canvas

// 4. DESENHAR UM POLÍGONO
const poli = poligono([[0, 0], [2, 3], [4, 0]]); // Cria um polígono com os pontos fornecidos
desenhar(poli); // Desenha o polígono no canvas

// 5. DESENHAR UMA POLILINHA
const plinha = polilinha([[0, 0], [2, 3], [4, 0]]); // Cria uma polilinha com os pontos fornecidos
desenhar(plinha); // Desenha a polilinha no canvas

// 6. DESENHAR UMA LINHA
const lin = linha(0, 0, 4, 4); // Cria uma linha de (0, 0) a (4, 4)
desenhar(lin); // Desenha a linha no canvas

// 7. DESENHAR TEXTO
const txt = texto("Olá, Mundo!", "16px", "vermelho"); // Cria um texto com o conteúdo "Olá, Mundo!"
desenhar(txt); // Desenha o texto no canvas

// 8. COLORIR O FUNDO
colorirFundo("azul"); // Colore o fundo do canvas de azul

// 9. COMPOR FIGURAS
const figurasCompostas = comporFiguras([ret, circ, poli]); // Cria uma figura composta com as figuras fornecidas
desenhar(figurasCompostas); // Desenha a figura composta no canvas

// 10. MOVER FIGURAS
const retMovido = mover(ret, 2, 3); // Move o retângulo 2 unidades no eixo X e 3 unidades no eixo Y
desenhar(retMovido); // Desenha o retângulo movido no canvas

// 11. ROTACIONAR FIGURAS
const retRotacionado = rotacionar(ret, 45); // Rotaciona o retângulo em 45 graus
desenhar(retRotacionado); // Desenha o retângulo rotacionado no canvas

// 12. REDIMENSIONAR FIGURAS
const retRedimensionado = redimensionar(ret, 2); // Redimensiona o retângulo por um fator de 2
desenhar(retRedimensionado); // Desenha o retângulo redimensionado no canvas

// 13. COLORIR FIGURAS
const retColorido = colorir(ret, "verde"); // Colore o retângulo de verde
desenhar(retColorido); // Desenha o retângulo colorido no canvas

// 14. ANIMAR FIGURAS
animar((tempo) => {
    const x = Math.sin(tempo) * 5; // Move a figura ao longo do eixo X com base no tempo
    const y = Math.cos(tempo) * 5; // Move a figura ao longo do eixo Y com base no tempo
    return mover(circ, x, y); // Retorna a figura movida
});

// 15. INTERAGIR COM FIGURAS
// TODO : ADICIONAR INTERAGIR

// ==================================================
// EXEMPLO COMPLETO: DESENHA UM CÍRCULO, MOVE-O E O ANIMA
// ==================================================
const circExemplo = circulo(2); // Cria um círculo de raio 2
const circMovidoExemplo = mover(circExemplo, 3, 3); // Move o círculo para (3, 3)
desenhar(circMovidoExemplo); // Desenha o círculo movido

animar((tempo) => {
    const x = Math.sin(tempo) * 5; // Move o círculo ao longo do eixo X com base no tempo
    const y = Math.cos(tempo) * 5; // Move o círculo ao longo do eixo Y com base no tempo
    return mover(circExemplo, x, y); // Retorna o círculo movido
});

// ==================================================
// FIM DO GUIA
// ==================================================
