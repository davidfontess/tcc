// BANDEIRA DO BRASIL
const quadrado = colorir(retangulo(20,12),"verde");
const losangulo = colorir(poligono([[-7,0],[0,5],[7,0],[0,-5]]),"amarelo");
const bola = colorir(circulo(3),"azul");
desenhar([quadrado,losangulo,bola]);

// REUTILIZANDO FUNÇÕES
const desenharCarro = () => {
const capo = mover(colorir(retangulo(3,2),"azul"),0,1);
const base = colorir(retangulo(6,2),"azul");
const roda = mover(circulo(1),-1.5,-1.5);
const roda2 = mover(circulo(1),1.5,-1.5);
const carro = comporFiguras([capo,base,roda,roda2]); 
return carro;
};

const conjuntoDeCarros = comporFiguras([
    desenharCarro(),
    mover(desenharCarro(),0,5),
    mover(desenharCarro(),0,-5),
    mover(desenharCarro(),-7,0),
    mover(desenharCarro(),7,0),
    mover(desenharCarro(),-7,5),
    mover(desenharCarro(),-7,-5),
    mover(desenharCarro(),7,5),
    mover(desenharCarro(),7,-5)
]);

desenhar(conjuntoDeCarros);


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
const meuRetangulo = retangulo(2, 1, 0, 0);

// define o tipo de mundo (agora como objeto com propriedades)
const mundoInicial = { x: 0, y: 0 };

// função de atualização por tempo (não muda com o tempo)
const idTempo = (t, mundo) => mundo;

// função de atualização por eventos
const mudEvt = (evt, mundo) => {
    switch (evt) {
        case "ArrowRight":
            return { ...mundo, x: mundo.x + 1 };
        case "ArrowLeft":
            return { ...mundo, x: mundo.x - 1 };
        case "ArrowUp":
            return { ...mundo, y: mundo.y + 1 };
        case "ArrowDown":
            return { ...mundo, y: mundo.y - 1 };
        default:
            return mundo;
    }
};

const apresentaMundo = (mundo) => {
    return mover(retangulo(3, 1), mundo.x, mundo.y);
};

interagir(mundoInicial, idTempo, mudEvt, apresentaMundo);
//FIM DE INTERAÇÃO #1

------------------------------------------------------------------------------------------

//EXEMPLOS DE FÍSICA

//INTERAÇÃO FÍSICA #1
const mundoInicial = {
    x: 0, 
    y: 0,
    vx: 0,
    vy: 0,
    aceleracao: 0.02  // valor da aceleração constante
};

// função de atualização por tempo (física)
const idTempo = (t, mundo) => {
    return {
        ...mundo,
        x: mundo.x + mundo.vx,
        y: mundo.y + mundo.vy
    };
};

// função de atualização por eventos
const mudEvt = (evt, mundo) => {
    switch(evt) {
        case "ArrowLeft":
            return { ...mundo, vx: mundo.vx - mundo.aceleracao };
        case "ArrowRight":
            return { ...mundo, vx: mundo.vx + mundo.aceleracao }; 
        case "ArrowUp":
            return { ...mundo, vy: mundo.vy + mundo.aceleracao };
        case "ArrowDown":
            return { ...mundo, vy: mundo.vy - mundo.aceleracao };
        default:
            return mundo;
    }
};

const apresentaMundo = (mundo) => {
    return mover(
        colorir(circulo(0.8), "vermelho"),
        mundo.x,
        mundo.y
    );
};

interagir(mundoInicial, idTempo, mudEvt, apresentaMundo);
//FIM DA INTERAÇÃO FÍSICA #1
