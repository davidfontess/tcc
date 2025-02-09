// Tradução de cores em português para inglês/hexadecimal
const cores = {
    vermelho: "red",
    azul: "blue",
    verde: "green",
    preto: "black",
    branco: "white",
    amarelo: "yellow",
    roxo: "purple",
    laranja: "orange",
    cinza: "gray",
    rosa: "pink",
    marrom: "brown",
    azulClaro: "lightblue",
  };
  
  // Função para traduzir a cor
  const traduzirCor = (cor) => cores[cor] || cor;
  
  // Funções para criar formas e configurar o fundo
  const criarCirculo = (raio, x, y, cor) => ({
    tipo: "circulo",
    raio,
    x,
    y,
    cor: traduzirCor(cor),
  });
  
  const criarRetangulo = (largura, altura, x, y, cor) => ({
    tipo: "retangulo",
    largura,
    altura,
    x,
    y,
    cor: traduzirCor(cor),
  });
  
  const criarLinha = (x1, y1, x2, y2, espessura, cor) => ({
    tipo: "linha",
    x1,
    y1,
    x2,
    y2,
    espessura,
    cor: traduzirCor(cor),
  });
  
  const criarTriangulo = (x1, y1, x2, y2, x3, y3, cor) => ({
    tipo: "triangulo",
    x1,
    y1,
    x2,
    y2,
    x3,
    y3,
    cor: traduzirCor(cor),
  });
  
  const colorirFundo = (cor) => ({
    tipo: "fundo",
    cor: traduzirCor(cor),
  });
  
  // Função para renderizar o programa usando EaselJS
  const renderizarCena = (canvasId, cena) => {
    const canvas = document.getElementById(canvasId);
    const stage = new createjs.Stage(canvas);
  
    // Renderiza cada elemento na cena
    cena.forEach((forma) => {
      if (forma.tipo === "fundo") {
        const fundo = new createjs.Shape();
        fundo.graphics.beginFill(forma.cor).drawRect(0, 0, canvas.width, canvas.height);
        stage.addChild(fundo);
      } else if (forma.tipo === "circulo") {
        const circulo = new createjs.Shape();
        circulo.graphics.beginFill(forma.cor).drawCircle(0, 0, forma.raio);
        circulo.x = forma.x;
        circulo.y = forma.y;
        stage.addChild(circulo);
      } else if (forma.tipo === "retangulo") {
        const retangulo = new createjs.Shape();
        retangulo.graphics.beginFill(forma.cor).drawRect(0, 0, forma.largura, forma.altura);
        retangulo.x = forma.x;
        retangulo.y = forma.y;
        stage.addChild(retangulo);
      } else if (forma.tipo === "linha") {
        const linha = new createjs.Shape();
        linha.graphics
          .setStrokeStyle(forma.espessura)
          .beginStroke(forma.cor)
          .moveTo(forma.x1, forma.y1)
          .lineTo(forma.x2, forma.y2);
        stage.addChild(linha);
      } else if (forma.tipo === "triangulo") {
        const triangulo = new createjs.Shape();
        triangulo.graphics
          .beginFill(forma.cor)
          .moveTo(forma.x1, forma.y1)
          .lineTo(forma.x2, forma.y2)
          .lineTo(forma.x3, forma.y3)
          .closePath();
        stage.addChild(triangulo);
      }
    });
  
    stage.update(); // Renderiza a cena no canvas
  };
  
  // Código do usuário
  const programa = () => [
    colorirFundo("azulClaro"),
    criarCirculo(50, 100, 300, "vermelho"),
    criarRetangulo(100, 50, 250, 150, "verde"),
    criarLinha(50, 50, 250, 250, 5, "preto"),
    criarTriangulo(300, 280, 350, 350, 250, 350, "roxo"),
  ];
  
  // Inicializa o programa no canvas
  renderizarCena("meuCanvas", programa());
  
