// Criação da biblioteca
const MeuDesenho = (function () {
    let stage; // variável para armazenar o estágio

    function iniciar(canvasId) {
        // configuração inicial do CreateJS Stage
        stage = new createjs.Stage(canvasId);
    }

    function desenharCirculo(x, y, raio, cor) {
        // cria e configura um círculo
        const circulo = new createjs.Shape();
        circulo.graphics.beginFill(cor).drawCircle(0, 0, raio);
        circulo.x = x;
        circulo.y = y;
        stage.addChild(circulo);
    }

    function atualizar() {
        // atualiza o estágio para mostrar as alterações
        if (stage) {
            stage.update();
        } else {
            console.error("Você precisa chamar a função iniciar() antes de atualizar.");
        }
    }

    // expor funções públicas
    return {
        iniciar,
        desenharCirculo,
        atualizar
    };
})();
