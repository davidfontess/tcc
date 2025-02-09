<!DOCTYPE html>
<html>
<head>
    <title>Desenho com EaselJS</title>
    <script src="https://code.createjs.com/easeljs-0.8.2.min.js"></script>
</head>
<body>
    <canvas id="demoCanvas" width="400" height="400"></canvas>
    <script>
        const canvasSize = 400;
        const coordMax = 10;
        const step = canvasSize / (2 * coordMax);

        const stage = new createjs.Stage("demoCanvas");

        const converterCoord = (x, y) => [
          canvasSize / 2 + x * step,
          canvasSize / 2 - y * step
        ];

        const desenharPlanoCartesiano = () => {
          const eixo = new createjs.Shape();
          eixo.graphics.setStrokeStyle(1).beginStroke("black");
          
          eixo.graphics.moveTo(0, canvasSize / 2).lineTo(canvasSize, canvasSize / 2);
          eixo.graphics.moveTo(canvasSize / 2, 0).lineTo(canvasSize / 2, canvasSize);
          
          for (let i = -coordMax; i <= coordMax; i++) {
            if (i !== 0 && i !== 10 && i !== -10) {
              let [x, y] = converterCoord(i, 0);
              eixo.graphics.setStrokeStyle(0.3).moveTo(x, 0).lineTo(x, canvasSize);
              [x, y] = converterCoord(0, i);
              eixo.graphics.moveTo(0, y).lineTo(canvasSize, y);
            }
          }

          stage.addChild(eixo);
          
          const textFormat = "12px Arial";
          for (let i = -coordMax; i <= coordMax; i++) {
            if (i !== 0 && i !== 10 && i !== -10) {
              let [x, y] = converterCoord(i, 0.3);
              let textX = new createjs.Text(i, textFormat, "black");
              textX.x = x - 6;
              textX.y = y - 12;
              stage.addChild(textX);
              
              [x, y] = converterCoord(0.3, i);
              let textY = new createjs.Text(i, textFormat, "black");
              textY.x = x + 4;
              textY.y = y - 6;
              stage.addChild(textY);
            }
          }
        };


        const criarCirculo = (raio) => (x, y, cor) => {
          const [cx, cy] = converterCoord(x, y);
          const shape = new createjs.Shape();
          shape.graphics.beginFill(cor).drawCircle(0, 0, raio * step);
          shape.x = cx;
          shape.y = cy;
          return shape;
        };

        const criarRetangulo = (largura, altura) => (x, y, cor) => {
          const [rx, ry] = converterCoord(x, y);
          const shape = new createjs.Shape();
          shape.graphics.beginFill(cor).drawRect(-largura * step / 2, -altura * step / 2, largura * step, altura * step);
          shape.x = rx;
          shape.y = ry;
          return shape;
        };

        const criarPoligono = (pontos) => (x, y, cor) => {
          const shape = new createjs.Shape();
          shape.graphics.beginFill(cor);
          shape.graphics.moveTo(...converterCoord(pontos[0][0] + x, pontos[0][1] + y));
          pontos.slice(1).forEach(([px, py]) => {
            shape.graphics.lineTo(...converterCoord(px + x, py + y));
          });
          shape.graphics.closePath();
          return shape;
        };

        const criarLinha = (x1, y1, x2, y2, cor) => {
          const [x1c, y1c] = converterCoord(x1, y1);
          const [x2c, y2c] = converterCoord(x2, y2);
          const shape = new createjs.Shape();
          shape.graphics.setStrokeStyle(2).beginStroke(cor).moveTo(x1c, y1c).lineTo(x2c, y2c);
          return shape;
        };

        const colorirFundo = (cor) => {
          const fundo = new createjs.Shape();
          fundo.graphics.beginFill(cor).drawRect(0, 0, canvasSize, canvasSize);
          stage.addChild(fundo);
        };

        const desenhar = (...elementos) => {
          elementos.forEach(el => stage.addChild(el));
          stage.update();
        };

        colorirFundo("green");
        desenharPlanoCartesiano();

        /*
        não necessariamente precisa definir os desenhos como constante.
        porém acredito que assim seria mais funcional.
        talvez achar uma forma de todos os desenhos sempre
        serem constantes e os usuários não precisem definir com tal?
        */

        //const planoCartesiano = desenharPlanoCartesiano();

        const parede = criarRetangulo(12, 10)(0, -2, "yellow");
        const teto = criarPoligono([[-8, 3], [0, 7], [8, 3]])(0, 0, "red");
        const porta = criarRetangulo(4, 6)(-2, -3, "brown");
        const janela = criarCirculo(2)(3, -1, "blue");

        //desenhar(parede, teto, porta, janela, planoCartesiano);
        desenhar(parede, teto, porta, janela);
        
    </script>
</body>
</html>
