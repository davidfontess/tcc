// inicializa o codemirror
const editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
    mode: 'javascript',
    theme: 'default',
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
    const guideToggle = document.getElementById("guide-toggle");

    const ativo = guidePanel.classList.toggle("active");

    if (ativo) {
        const evitarScroll = localStorage.getItem('evitouScroll') === 'true';
        showSection(ultimaSecaoAtiva, !evitarScroll);
        localStorage.removeItem('evitouScroll');
        guideToggle.textContent = 'Fechar Guia';
    } else {
        guideToggle.textContent = 'Abrir Guia';
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
        darkModeToggle.textContent = 'Claro';
    } else {
        // voltar para o tema padrão (claro)
        editor.setOption('theme', 'default');
        body.classList.remove('dark-mode');
        darkModeToggle.textContent = 'Escuro';
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
        darkModeToggle.textContent = 'Claro';
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
