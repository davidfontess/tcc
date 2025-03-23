// BANDEIRA DO BRASIL
const quadrado = colorir(retangulo(20,12),"verde");
const losangulo = colorir(poligono([[-7,0],[0,5],[7,0],[0,-5]]),"amarelo");
const bola = colorir(circulo(3),"azul");
desenhar([quadrado,losangulo,bola]);


// ANIMAÇÃO #1
// // código do usuário
const funcaoDeAnimacao = (t) => {
    return rotacionar(retangulo(3, 3), 30 * t); // 30 graus por segundo (t = 1000ms)
};
// aplica a função animar
animar(funcaoDeAnimacao);

// INTERAÇÃO #1
// cria uma figura (um retângulo, por exemplo)
const meuRetangulo = retangulo(2, 1, 0, 0);
// define os manipuladores (handlers) para as interações
const manipuladores = {
    onKeyDown: (event, figura) => {
        // move o retângulo com as setas do teclado
        switch (event.key) {
            case "ArrowUp":
                figura.y += 1;
                break;
            case "ArrowDown":
                figura.y -= 1;
                break;
            case "ArrowLeft":
                figura.x -= 1;
                break;
            case "ArrowRight":
                figura.x += 1;
                break;
        }
    },
    onClick: (event, figura) => {
        // muda a cor do retângulo ao clicar nele
        figura.cor = `hsl(${Math.random() * 360}, 75%, 50%)`;
    },
    onDrag: (event, figura) => {
        // a posição do retângulo é atualizada automaticamente durante o arrasto
        console.log("Arrastando figura para:", figura.x, figura.y);
    }
};
const mundoInicial = [0, 0];
const mudaTempo = (t, mundo) => mundo; // não muda com o tempo
const mudaEventos = (evento, mundo) => {
    const [x, y] = mundo;
    switch (evento) {
        case "ArrowRight":
            return [x + 1, y];
        case "ArrowLeft":
            return [x - 1, y];
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
