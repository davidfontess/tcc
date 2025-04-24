// inicializa o codemirror
const editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
    mode: 'javascript',
    theme: 'default',  // Certifique-se que está usando o tema correto
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    extraKeys: {"Ctrl-Space": "autocomplete"},
    lineWrapping: true
});

// adicionando um exemplo de código no editor
editor.setValue(`// Exemplo de código para desenhar um circulo
const circ = circulo(2); // Cria um circulo de raio 2
desenhar(circ); // Desenha o circulo no canvas`);

//função pra executar o código digitado
function executarCodigo() {
	const codigo = editor.getValue();
	try {
		pararTudo(); // Para tudo antes de executar novo código
		
		const funcaoUsuario = new Function(codigo);
		const resultado = funcaoUsuario();
			
		if (resultado) {
			desenhar(resultado);
		}
	} catch (error) {
		console.error("Erro ao executar o código:", error);
	}
}

// função para parar tudo (animação, interação e limpar canvas)
function pararTudo() {
    // para a animação se estiver rodando
    if (animacaoAtual) {
        cancelAnimationFrame(animacaoAtual);
        animacaoAtual = null;
    }
    
    // remove todos os listeners de interação do stage
    stage.off("stagemousedown");
    stage.off("stagemouseup");
    stage.off("stagemousemove");
    
    // remove o listener de teclado
    document.onkeydown = null;
    
    // remove todos os listeners do Ticker
    createjs.Ticker.removeAllEventListeners();
    
    // limpa completamente o canvas
    stage.removeAllChildren();
    stage.update();
    
    // adiciona de volta apenas o listener básico para atualizar o stage
    createjs.Ticker.addEventListener("tick", () => {
        stage.update();
    });
}

let ultimaSecaoAtiva = 'intro';

function toggleGuide() {
    const guidePanel = document.getElementById("guide-panel");

    const ativo = guidePanel.classList.toggle("active");

    if (ativo) {
        const evitarScroll = localStorage.getItem('evitouScroll') === 'true';
        showSection(ultimaSecaoAtiva, !evitarScroll);
        localStorage.removeItem('evitouScroll'); // limpa o flag
    }
}

// Sistema de abas do guia
function setupGuideTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove a classe active de todas as abas e conteúdos
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Adiciona active na aba clicada
            tab.classList.add('active');
            
            // Mostra o conteúdo correspondente
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGuideTabs);

// pra os exemplos do guia serem clicáveis
function loadExample(code) {
    editor.setValue(code);
    
    // Fecha o guia, mas NÃO rola para o topo quando reabrir
    document.getElementById("guide-panel").classList.remove("active");
    
    // Salva o estado dizendo que foi um clique de exemplo
    localStorage.setItem('evitouScroll', 'true');
}
	
// função para parar a animação e limpar o canvas
function pararAnimacao() {
	// cancela a animação atual se existir
	if (animacaoAtual) {
		cancelAnimationFrame(animacaoAtual);
		animacaoAtual = null;
	}
	stage.removeAllChildren();
	stage.update();

	// não limpa o canvas aqui - isso será feito pelas funções de desenho
}

// tamanho inicial da fonte (verifica se há um valor salvo)
let tamanhoFonte = localStorage.getItem('editorFontSize') || 16;
tamanhoFonte = parseInt(tamanhoFonte);

// função para atualizar e salvar o tamanho da fonte
function atualizarFonte(novoTamanho) {
    tamanhoFonte = novoTamanho;
    document.querySelector('.CodeMirror').style.fontSize = tamanhoFonte + 'px';
    localStorage.setItem('editorFontSize', tamanhoFonte);
}

// event listeners atualizados
document.getElementById('aumentar-fonte').addEventListener('click', function() {
    const novoTamanho = Math.min(tamanhoFonte + 2, 24);
    atualizarFonte(novoTamanho);
});

document.getElementById('diminuir-fonte').addEventListener('click', function() {
    const novoTamanho = Math.max(tamanhoFonte - 2, 10);
    atualizarFonte(novoTamanho);
});

// aplica o tamanho inicial
atualizarFonte(tamanhoFonte);

// variável para controlar o estado do tema
let darkMode = false;

// elementos que serão afetados pelo dark mode
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// função para alternar entre os temas
function toggleDarkMode() {
    darkMode = !darkMode;
    
    if (darkMode) {
        // ativar modo dracula (escuro)
        editor.setOption('theme', 'dracula');
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️ Claro';
    } else {
        // voltar para o tema padrão (claro)
        editor.setOption('theme', 'default');
        body.classList.remove('dark-mode');
        darkModeToggle.textContent = '🌓 Escuro';
    }
    
    // Salvar preferência no localStorage
    localStorage.setItem('darkMode', darkMode);
}

// Adicionar evento de clique ao botão
darkModeToggle.addEventListener('click', toggleDarkMode);

// Função para inicializar o sumário
function setupGuideSections() {
    const sections = document.querySelectorAll('.guide-section');
    const summaryList = document.getElementById('summary-list');
    
    // Cria itens do sumário
    sections.forEach(section => {
        const title = section.querySelector('h1, h2').textContent;
        const sectionId = section.id;
        
        const listItem = document.createElement('li');
        listItem.textContent = title;
        listItem.dataset.section = sectionId;
        
        listItem.addEventListener('click', () => {
            showSection(sectionId);
        });
        
        summaryList.appendChild(listItem);
    });
    
    // Mostra apenas a introdução inicialmente
    showSection('intro');
}

// Função para mostrar uma seção específica
function showSection(sectionId, scrollToTop = true) {
    ultimaSecaoAtiva = sectionId;

    // Esconde todas as seções
    document.querySelectorAll('.guide-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    targetSection.classList.add('active');

    // Só faz scroll se for permitido
    if (scrollToTop) {
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, 50);
    }

    // Atualiza item ativo no sumário
    document.querySelectorAll('#summary-list li').forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionId);
    });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    setupGuideTabs();
    setupGuideSections();
    
    // Aplica preferências do tema
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        darkMode = true;
        editor.setOption('theme', 'dracula');
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️ Claro';
    }

    // Aplica o tamanho de fonte
    atualizarFonte(tamanhoFonte);

    // Inicializa seção do guia
    setTimeout(() => {
        document.getElementById('guide-panel').classList.add('active');
        const secaoInicial = localStorage.getItem('ultimaSecaoAtiva') || 'intro';
        showSection(secaoInicial);
    }, 100);

    // Eventos nos exemplos com data-code
    document.querySelectorAll('.code-example').forEach(div => {
        div.addEventListener('click', () => {
            const code = div.getAttribute('data-code').replace(/\\n/g, '\n');
            loadExample(code);
        });
    });
});

//
//	GIZ
//

const canvasSize = 400;
const coordMax = 10;
const step = canvasSize / (2 * coordMax);
const stage = new createjs.Stage("demoCanvas");
let animacaoAtual = null;

// função pra converter coordenadas do sistema cartesiano para o canvas
const converterCoordenadas = (x, y) => [
	canvasSize / 2 + x * step,
	canvasSize / 2 - y * step
];
	

// classe base das figuras
class Figura {
	constructor(cor = "black") {
		this.x = 0;
		this.y = 0;
		this.cor = cor;
		this.angulo = 0;
	}
	clone() {
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
	}
	redimensionar(fator) {
		// método genérico que será sobrescrito pelas classes filhas
	}
}
	
class PlanoCartesiano extends Figura {
	constructor() {
		super("gray");  // Cor padrão
	}
	redimensionar() {// não faz nada, mantém apenas por compatibilidade
	}
}

// classe para retângulos
class Retangulo extends Figura {
	constructor(x, y, largura, altura, cor = "black") {
		super(cor);
		this.x = x;
		this.y = y;
		this.largura = largura;
		this.altura = altura;
		this.angulo = 0;
	}
	redimensionar(fator) {
		this.largura *= fator;
		this.altura *= fator;
	}
}

class Circulo extends Figura {
	constructor(raio, cor = "black") {
		super(cor);
		this.raio = raio;
	}
	redimensionar(fator) {
		this.raio *= fator;
	}
}

class Linha extends Figura {
	constructor(x1, y1, x2, y2, cor = "black") {
		super(cor);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
	redimensionar(fator) {
		this.x1 *= fator;
		this.y1 *= fator;
		this.x2 *= fator;
		this.y2 *= fator;
	}
}

class Polilinha extends Figura {
	constructor(pontos, cor = "black") {
		super(cor);
		this.pontos = pontos;
	}
	redimensionar(fator) {
		this.pontos = this.pontos.map(([x, y]) => [x * fator, y * fator]);
	}
}

class Poligono extends Figura {
	constructor(pontos, cor = "black") {
		super(cor);
		this.pontos = pontos;
	}
	redimensionar(fator) {
		this.pontos = this.pontos.map(([x, y]) => [x * fator, y * fator]);
	}
}

class Texto extends Figura {
	constructor(conteudo, tamanho = "12px", cor = "black") {
		super(cor);
		this.conteudo = conteudo;
		this.tamanho = tamanho;
	}
	redimensionar(fator) {
		const tamanhoNumerico = parseFloat(this.tamanho);
		const unidade = this.tamanho.replace(tamanhoNumerico, '');
		this.tamanho = `${tamanhoNumerico * fator}${unidade}`;
	}
}

class FiguraComposta extends Figura {
	constructor(figuras = []) {
		super();
		this.figuras = figuras;
	}
	redimensionar(fator) {
		this.figuras.forEach(figura => figura.redimensionar(fator));
	}
}

// agora como instancia constante, e não função
const planoCartesiano = new PlanoCartesiano();

const retangulo = (largura, altura, x = 0, y = 0) => {
	return new Retangulo(x, y, largura, altura);
};

const circulo = (raio) => {
	return new Circulo(raio);
};

const poligono = (pontos) => {
	return new Poligono(pontos);
};

const polilinha = (pontos) => {
	return new Polilinha(pontos);
};

const linha = (x1, y1, x2, y2) => {
	return new Linha(x1, y1, x2, y2);
};

const texto = (conteudo, tamanho, cor) => {
	return new Texto(conteudo, tamanho, cor);
};

const colorirFundo = (cor) => {
	const fundo = new createjs.Shape();
	fundo.graphics.beginFill(traduzirCor(cor)).drawRect(0, 0, canvasSize, canvasSize);
	stage.addChild(fundo);
};

//função para compor as figuras em uma figura composta
const comporFiguras = (figs) => new FiguraComposta(figs);

// função pra mover figuras (antigo transladar)
const mover = (fig, dx, dy) => {
	if (fig instanceof FiguraComposta) {
		return new FiguraComposta(fig.figuras.map(f => mover(f, dx, dy)));
	} else {
		let novaFigura = fig.clone();
		novaFigura.x += dx;
		novaFigura.y += dy;
		return novaFigura;
	}
};

// função pra rotacionar figuras
const rotacionar = (figura, angulo) => {
	const rad = (Math.PI / 180) * -angulo; // Converte para radianos e inverte para sentido horário
	
	const rotacionarPonto = (x, y, cx, cy) => {
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		return [
			cos * (x - cx) - sin * (y - cy) + cx,
			sin * (x - cx) + cos * (y - cy) + cy
		];
	};

	if (figura instanceof FiguraComposta) {
		const centro = calcularCentroFiguraComposta(figura);
		const novasFiguras = figura.figuras.map(f => {
			const novaFigura = f.clone();
			
			if (novaFigura instanceof Linha) {
				[novaFigura.x1, novaFigura.y1] = rotacionarPonto(novaFigura.x1, novaFigura.y1, centro[0], centro[1]);
				[novaFigura.x2, novaFigura.y2] = rotacionarPonto(novaFigura.x2, novaFigura.y2, centro[0], centro[1]);
			} else if (novaFigura instanceof Polilinha || novaFigura instanceof Poligono) {
				novaFigura.pontos = novaFigura.pontos.map(([x, y]) => rotacionarPonto(x, y, centro[0], centro[1]));
			} else {
				[novaFigura.x, novaFigura.y] = rotacionarPonto(novaFigura.x, novaFigura.y, centro[0], centro[1]);
				novaFigura.angulo = angulo; // Ângulo absoluto, não acumulado
			}
			
			return novaFigura;
		});
		
		return new FiguraComposta(novasFiguras);
	} else {
		const novaFigura = figura.clone();
		
		if (novaFigura instanceof Linha) {
			const centro = [(novaFigura.x1 + novaFigura.x2)/2, (novaFigura.y1 + novaFigura.y2)/2];
			[novaFigura.x1, novaFigura.y1] = rotacionarPonto(novaFigura.x1, novaFigura.y1, ...centro);
			[novaFigura.x2, novaFigura.y2] = rotacionarPonto(novaFigura.x2, novaFigura.y2, ...centro);
		} else if (novaFigura instanceof Polilinha || novaFigura instanceof Poligono) {
			const centro = calcularCentro(novaFigura.pontos);
			novaFigura.pontos = novaFigura.pontos.map(p => rotacionarPonto(...p, ...centro));
		} else {
			novaFigura.angulo = angulo; // Ângulo absoluto
		}
		
		return novaFigura;
	}
};

const redimensionar = (figura, fator) => {
	if (figura instanceof FiguraComposta) {
		// calcula o centro da figura composta
		const centro = calcularCentroFiguraComposta(figura);

		// rdimensiona cada figura em relação ao centro da figura composta
		const novasFiguras = figura.figuras.map(f => {
			const novaFigura = f.clone();
			novaFigura.redimensionar(fator);

			// ajusta a posição da figura para manter a proporção em relação ao centro
			novaFigura.x = centro[0] + (f.x - centro[0]) * fator;
			novaFigura.y = centro[1] + (f.y - centro[1]) * fator;

			return novaFigura;
		});

		return new FiguraComposta(novasFiguras);
	} else {
		let novaFigura = figura.clone();
		novaFigura.redimensionar(fator);
		return novaFigura;
	}
};

//dunção para calcular o centro de uma figura composta
const calcularCentroFiguraComposta = (figuraComposta) => {
	let somaX = 0, somaY = 0;
	figuraComposta.figuras.forEach(f => {
		somaX += f.x || 0; // se a figura não tiver x, usa 0
		somaY += f.y || 0; // se a figura não tiver y, usa 0
	});
	return [somaX / figuraComposta.figuras.length, somaY / figuraComposta.figuras.length];
};

//função para colorir figuras
const colorir = (fig, cor) => {
	if (fig instanceof FiguraComposta) {
		return new FiguraComposta(fig.figuras.map(f => colorir(f, cor)));
	} else {
		let novaFigura = fig.clone();
		novaFigura.cor = cor;
		return novaFigura;
	}
};

const calcularCentro = (pontos) => {
	let somaX = 0, somaY = 0;
	pontos.forEach(p => {
		somaX += p[0];
		somaY += p[1];
	});
	return [somaX / pontos.length, somaY / pontos.length];
};

// função para traduzir cores do português para o inglês
// TODO: mudar as cores para cores mais bonitas e adicionar cores escuras e claras.
// talvez adicinar função pra isso? escurescer(); e clarear();?
const traduzirCor = (cor) => {
	const cores = {
		"preto": "black",
		"branco": "white",
		"vermelho": "red",
		"verde": "green",
		"azul": "blue",
		"amarelo": "yellow",
		"rosa": "pink",
		"roxo": "purple",
		"laranja": "orange",
		"cinza": "gray",
		"marrom": "brown"
	};
	return cores[cor.toLowerCase()] || cor;
};

//função para atualizar o stage (limpa e redesenha tudo)
const atualizarStage = (figuras) => {
	stage.removeAllChildren(); // limpa o stage
	figuras.forEach(figura => desenhar(figura, stage)); // redesenha todas as figuras
};

// função para animar uma figura com base no tempo
// versão com controle opcional de mostrar ou não o plano
const animar = (funcaoDeAnimacao, mostrarPlano = false) => {
	pararAnimacao();
	
	const inicio = Date.now();
	
	const atualizar = () => {
		const tempoDecorrido = (Date.now() - inicio) / 1000;
		const figuraAnimada = funcaoDeAnimacao(tempoDecorrido);
		
		// cria um array com as figuras a serem desenhadas
		const figuras = [];
		
		// adiciona o plano primeiro (como fundo)
		if(mostrarPlano) {
			figuras.push(planoCartesiano);
		}
		
		// adiciona a figura animada
		figuras.push(figuraAnimada);
		
		// desenha tudo
		desenhar(figuras);
		
		animacaoAtual = requestAnimationFrame(atualizar);
	};

	animacaoAtual = requestAnimationFrame(atualizar);
};

// correções do professor
// função genérica para interagir com uma figura
const interagir = (mundoInicial, idTempo, mudEvt, apresentaMundo, mostrarPlano = false) => {
	let mundo = mundoInicial;
	let selectedShape = null;
	let offset = { x: 0, y: 0 };

	// função para renderizar o mundo
	const renderizar = () => {
		const figuras = [];
		
		// adiciona o plano se necessário
		if(mostrarPlano) {
			figuras.push(planoCartesiano);
		}
		
		// adiciona a representação do mundo
		figuras.push(apresentaMundo(mundo));
		
		// desenha tudo
		desenhar(figuras);
	};

	// atualiza com base no tempo
	const atualizarTempo = (tempo) => {
		mundo = idTempo(tempo, mundo);
		renderizar();
	};

	// atualiza com base em eventos
	const atualizarEventos = (evento) => {
		mundo = mudEvt(evento, mundo);
		renderizar();
	};

	// configura os listeners (mantidos iguais)
	document.addEventListener("keydown", (event) => {
		atualizarEventos(event.key);
	});

	stage.on("stagemousedown", (event) => {
		const { stageX, stageY } = event;
		
		if (event.nativeEvent.button === 2) {
			atualizarEventos("clikRight");
		} else if (event.nativeEvent.button === 0) {
			atualizarEventos("clickLeft");
		}
		
		const [x, y] = converterCoordenadas(mundo.x, mundo.y);
		if (Math.abs(stageX - x) < 10 && Math.abs(stageY - y) < 10) {
			selectedShape = mundo;
			offset.x = stageX - x;
			offset.y = stageY - y;
		}
	});

	stage.on("stagemouseup", () => {
		selectedShape = null;
	});

	stage.on("stagemousemove", (event) => {
		if (selectedShape) {
			const { stageX, stageY } = event;
			mundo = {
				...mundo,
				x: (stageX - offset.x - canvasSize / 2) / step,
				y: (canvasSize / 2 - (stageY - offset.y)) / step
			};
			renderizar();
		}
	});

	// inicia a animação
	createjs.Ticker.addEventListener("tick", () => {
		const tempo = Date.now() / 1000;
		atualizarTempo(tempo);
	});
	
	// renderiza inicialmente
	renderizar();
};


//método desenhar atualizado para centralizar figuras na origem (0,0)
const desenhar = (figuraOuLista) => {
	stage.removeAllChildren(); // limpa o canvas uma vez
	
	// converte para array se for uma única figura
	const figuras = Array.isArray(figuraOuLista) ? figuraOuLista : [figuraOuLista];
	
	// desenha todas as figuras
	figuras.forEach(figura => {
		if (figura instanceof FiguraComposta) {
			figura.figuras.forEach(f => desenharFigura(f));
		} else {
			desenharFigura(figura);
		}
	});
};


// função auxiliar para desenhar uma única figura
const desenharFigura = (figura) => {
	if (figura instanceof FiguraComposta) {
		// se for uma figura composta, desenha cada subfigura
		figura.figuras.forEach(f => desenharFigura(f));
	} else {
		let shape = new createjs.Shape();
		if (figura instanceof Retangulo) {
			let [cx, cy] = converterCoordenadas(figura.x, figura.y);
			shape.graphics.beginFill(traduzirCor(figura.cor));
			shape.setTransform(cx, cy, 1, 1, figura.angulo); //aplicando a rotação
			shape.graphics.drawRect(-figura.largura * step / 2, -figura.altura * step / 2, 
									figura.largura * step, figura.altura * step);
			shape.graphics.endFill();
			stage.addChild(shape); //adiciona no stage
		} else if (figura instanceof Circulo) {
			shape.graphics.beginFill(traduzirCor(figura.cor));
			let [x, y] = converterCoordenadas(figura.x, figura.y);
			shape.graphics.drawCircle(0, 0, figura.raio * step);
			shape.x = x;
			shape.y = y;
			shape.graphics.endFill();
			stage.addChild(shape); //adiciona no stage
		} else if (figura instanceof Linha) {
			let [x1, y1] = converterCoordenadas(figura.x1, figura.y1);
			let [x2, y2] = converterCoordenadas(figura.x2, figura.y2);
			shape.graphics.setStrokeStyle(1).beginStroke(traduzirCor(figura.cor));
			shape.graphics.moveTo(x1, y1).lineTo(x2, y2);
			shape.graphics.endStroke();
			stage.addChild(shape); //adiciona no stage
		} else if (figura instanceof Polilinha) {
			shape.graphics.setStrokeStyle(1).beginStroke(traduzirCor(figura.cor));
			shape.graphics.moveTo(...converterCoordenadas(...figura.pontos[0]));
			figura.pontos.slice(1).forEach(p => shape.graphics.lineTo(...converterCoordenadas(...p)));
			shape.graphics.endStroke();
			stage.addChild(shape); //adiciona no stage
		} else if (figura instanceof Poligono) {
			shape.graphics.beginFill(traduzirCor(figura.cor));
			shape.graphics.setStrokeStyle(1).beginStroke(traduzirCor(figura.cor));
			shape.graphics.moveTo(...converterCoordenadas(...figura.pontos[0]));
			figura.pontos.slice(1).forEach(p => shape.graphics.lineTo(...converterCoordenadas(...p)));
			shape.graphics.lineTo(...converterCoordenadas(...figura.pontos[0]));
			shape.graphics.endFill();
			shape.graphics.endStroke();
			stage.addChild(shape); //adiciona no stage
		} else if (figura instanceof Texto) {
			let text = new createjs.Text(figura.conteudo, figura.tamanho + " Arial", traduzirCor(figura.cor));
			let [x, y] = converterCoordenadas(figura.x, figura.y);
			text.x = x;
			text.y = y;
			text.textAlign = "center"; // centraliza o texto no ponto
			text.textBaseline = "middle";
			text.rotation = figura.angulo; // aplica rotação ao texto
			stage.addChild(text); // adiciona ao stage
		} else if (figura instanceof PlanoCartesiano) {
			const shape = new createjs.Shape();
			const cor = traduzirCor(figura.cor || "gray");
			const textoSize = "13px Arial";
			
			// linhas de grade (-10 a 10)
			for (let x = -10; x <= 10; x++) {
				const [canvasX, canvasY1] = converterCoordenadas(x, -10);
				const [_, canvasY2] = converterCoordenadas(x, 10);
				shape.graphics.setStrokeStyle(0.7).beginStroke(cor)
					.moveTo(canvasX, canvasY1)
					.lineTo(canvasX, canvasY2);
				
				// números no eixo X (-9 a 9, exceto zero)
				if (x >= -9 && x <= 9 && x !== 0) {
					const text = new createjs.Text(x.toString(), textoSize, "black");
					text.x = canvasX;
					text.y = canvasSize/2 + 8;
					text.textAlign = "center";
					text.textBaseline = "top";
					stage.addChild(text);
				}
			}
			
			for (let y = -10; y <= 10; y++) {
				const [canvasX1, canvasY] = converterCoordenadas(-10, y);
				const [canvasX2, _] = converterCoordenadas(10, y);
				shape.graphics.setStrokeStyle(0.7).beginStroke(cor)
					.moveTo(canvasX1, canvasY)
					.lineTo(canvasX2, canvasY);
				
				// números no eixo Y (-9 a 9, exceto zero) - AGORA À DIREITA
				if (y >= -9 && y <= 9 && y !== 0) {
					const text = new createjs.Text(y.toString(), textoSize, "black");
					text.x = canvasSize/2 + 8;  // Posição à direita do eixo Y
					text.y = canvasY;
					text.textAlign = "left";  // Alinhado à esquerda (para ficar à direita do eixo)
					text.textBaseline = "middle";
					stage.addChild(text);
				}
			}
			
			// eixos X e Y
			shape.graphics.setStrokeStyle(1.2).beginStroke("black")
				.moveTo(canvasSize/2, 0)
				.lineTo(canvasSize/2, canvasSize)
				.moveTo(0, canvasSize/2)
				.lineTo(canvasSize, canvasSize/2);
			
			stage.addChild(shape);
		}

		// aplica a rotação na figura
		if (shape) {
			shape.rotation = figura.angulo; // define o ângulo de rotação
		}
	}
};

//configura o Ticker para atualizar o stage continuamente
// isso tem que ficar no final do código!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
createjs.Ticker.addEventListener("tick", () => {
	stage.update();
});
