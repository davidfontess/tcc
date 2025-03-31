// BANDEIRA DO BRASIL
const quadrado = colorir(retangulo(20,12),"verde");
const losangulo = colorir(poligono([[-7,0],[0,5],[7,0],[0,-5]]),"amarelo");
const bola = colorir(circulo(3),"azul");
desenhar([quadrado,losangulo,bola]);

// ANIMAÇÃO #1
const circ = circulo(1);
animar((tempo) => {
    return mover(circ, tempo, 0); // Move no eixo X com o tempo
});

// ANIMAÇÃO #2 (oscilação vertical)
const circ = circulo(1);
animar((tempo) => {
    return mover(circ, 0, Math.sin(tempo) * 3); // Oscila no eixo Y
});

// ANIMAÇÃO #3 (trajetória circular, parecendo planetas)
const sol = circulo(1.5, "amarelo");
const terra = circulo(0.5, "azul");
animar((tempo) => {
    const terraAnimada = mover(
        terra,
        Math.cos(tempo * 0.5) * 5, // Órbita mais lenta
        Math.sin(tempo * 0.5) * 5
    );
    return comporFiguras([sol, terraAnimada]);
});

// ANIMAÇÃO #4 (pulsação)
const triangulo = poligono([[0,1], [-1,-1], [1,-1]]);
animar((tempo) => {
    return colorir(
        redimensionar(
            triangulo,
            1 + Math.sin(tempo)/2 // Oscila entre 0.5 e 1.5
        ),
        tempo % 2 < 1 ? "vermelho" : "azul" // Alterna cores
    );
});

// ANIMAÇÃO #5
const quadrado = retangulo(2, 2);
animar((tempo) => {
    return rotacionar(quadrado, tempo * 90); // roda um retangulo 90°/s
});

// ANIMAÇÃO #6 (pendulo)
const seta = poligono([[0,1], [-0.5,-1], [0.5,-1]]);
animar((tempo) => {
    const angulo = 45 * Math.sin(tempo); // Oscila entre -90° e 90°
    return rotacionar(seta, angulo);
});

// ANIMAÇÃO #7
const roda = circulo(1);
animar((tempo) => {
    const posX = Math.sin(tempo) * 5;
    return mover(
        rotacionar(roda, posX * 36), // 36° por unidade de movimento
        posX,
        0
    );
});

// ANIMAÇÃO #8 (rotação com aceleração)
let velocidade = 0;
const engrenagem = poligono([[1,0], [0.7,0.7], [0,1], [-0.7,0.7], [-1,0]]);
animar((tempo) => {
    velocidade += 0.1; // aceleração constante
    return rotacionar(engrenagem, velocidade * tempo * 10);
});

// INTERAÇÃO #1
// cria uma figura (um retângulo, por exemplo)
const meuRetangulo = retangulo(2, 1, 0, 0);
const mundoInicial = [0, 0];
const mudaTempo = (t, mundo) => mundo; // não muda com o tempo
const mudaEventos = (evento, mundo) => {
    const [x, y] = mundo;
    switch (evento) {
        case "ArrowRight":
            return [x + 1, y];
        case "ArrowLeft":
            return [x - 1, y];
        case "ArrowUp":
            return [x, y + 1];
        case "ArrowDown":
            return [x, y - 1];
        default:
            return [x, y];
    }
};
const visualizar = (mundo) => {
    const [x, y] = mundo;
    return mover(retangulo(3, 1), x, y);
};
// aplica a função interagir ao mundo inicial
interagir(mundoInicial, mudaTempo, mudaEventos, visualizar);
//FIM DE INTERAÇÃO #1

------------------------------------------------------------------------------------------

//EXEMPLOS DE FÍSICA

//INTERAÇÃO FÍSICA #1
let mundo = {
    bola: { x: 0, y: 0, vx: 0, vy: 0 },
    aceleracao: 0.02  // Valor da aceleração constante
};

animar((tempo) => {
    // atualiza posição continuamente com a velocidade atual
    mundo.bola.x += mundo.bola.vx;
    mundo.bola.y += mundo.bola.vy;
    
    return mover(
        colorir(circulo(0.8), "vermelho"),
        mundo.bola.x,
        mundo.bola.y
    );
});

// controles com a aceleração contínua
document.addEventListener("keydown", (e) => {
    switch(e.key) {
        case "ArrowRight":
            mundo.bola.vx += mundo.aceleracao;
            break;
        case "ArrowLeft":
            mundo.bola.vx -= mundo.aceleracao;
            break;
        case "ArrowUp":
            mundo.bola.vy -= mundo.aceleracao;
            break;
        case "ArrowDown":
            mundo.bola.vy += mundo.aceleracao;
            break;
    }
});
//FIM DA INTERAÇÃO FÍSICA #1
