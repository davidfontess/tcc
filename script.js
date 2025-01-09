// função para selecionar o canvas e desenhar
const iniciarDesenho = (programa) => {
    const canvas = document.getElementById("meuCanvas");
    const cena = programa(); // chama a função do usuário que retorna a cena
    desenharCena(canvas, cena);
  };
  
  const circuloSolido = (raio, x, y, cor) => ({
    tipo: "circulo",
    raio,
    x,
    y,
    cor,
  });
  
  // desenhar no canvas com base em uma cena
  const desenharCena = (canvas, cena) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // limpa o canvas antes de desenhar
    cena.forEach((forma) => {
      if (forma.tipo === "circulo") {
        ctx.beginPath();
        ctx.arc(forma.x, forma.y, forma.raio, 0, Math.PI * 2);
        ctx.fillStyle = forma.cor;
        ctx.fill();
      }
    });
  };
  
  // função do usuário para desenhar um círculo
  programa = () => [
    circuloSolido(50, 100, 100, "vermelho")
  ];
  
  // inicia o desenho
  iniciarDesenho(programa);
  
