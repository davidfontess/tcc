class Figura {
    constructor(x = 0, y = 0, cor = "black") {
        this.x = x;
        this.y = y;
        this.cor = cor;
    }
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

class Retangulo extends Figura {
    constructor(base, altura, x = 0, y = 0, cor = "black") {
        super(x, y, cor);
        this.base = base;
        this.altura = altura;
    }
}

class Circulo extends Figura {
    constructor(raio, x = 0, y = 0, cor = "black") {
        super(x, y, cor);
        this.raio = raio;
    }
}

class Poligono extends Figura {
    constructor(pontos, x = 0, y = 0, cor = "black") {
        super(x, y, cor);
        this.pontos = pontos;
    }
}

class FiguraComposta extends Figura {
    constructor(figuras = []) {
        super();
        this.figuras = figuras;
    }
}

function comporFiguras(figs) {
    return new FiguraComposta(figs);
}

function transladar(fig, dx, dy) {
    if (fig instanceof FiguraComposta) {
        return new FiguraComposta(fig.figuras.map(f => transladar(f, dx, dy)));
    } else {
        let novaFigura = fig.clone();
        novaFigura.x += dx;
        novaFigura.y += dy;
        return novaFigura;
    }
}

function colorir(fig, cor) {
    let novaFigura = fig.clone();
    novaFigura.cor = cor;
    return novaFigura;
}

function desenhar(figura, stage) {
    if (figura instanceof FiguraComposta) {
        figura.figuras.forEach(f => desenhar(f, stage));
    } else {
        let shape = new createjs.Shape();
        shape.graphics.beginFill(figura.cor);
        if (figura instanceof Retangulo) {
            shape.graphics.drawRect(figura.x, figura.y, figura.base, figura.altura);
        } else if (figura instanceof Circulo) {
            shape.graphics.drawCircle(figura.x, figura.y, figura.raio);
        }
        shape.graphics.endFill();
        stage.addChild(shape);
    }
    stage.update();
}

// exemplo de uso
const stage = new createjs.Stage("canvasId");
const parede = colorir(new Retangulo(100, 150, 0, 0), "yellow");
const casaModelo = comporFiguras([parede]);
const duasCasas = comporFiguras([
    transladar(casaModelo, -150, 0),
    transladar(casaModelo, 150, 0)
]);
desenhar(duasCasas, stage);
