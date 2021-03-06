 //array com as 8 imagens dos cards
 let listaImagem = ['fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt',
					'fa-cube','fa-leaf','fa-bicycle','fa-bomb'];
//array com as 8 imagens so que 2 elementos de cada
let listaImagemCard = ['fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt',
						'fa-cube','fa-anchor','fa-leaf','fa-bicycle',
						'fa-diamond','fa-bomb','fa-leaf','fa-bomb',
						'fa-bolt','fa-bicycle','fa-paper-plane-o','fa-cube'];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * funcao que inicia o processo apos o load da pagina html
 */
window.onload = function initElement() {
    //gerar card randomicos no jogo
	inserirCardRandomico();
	//execucao apos finalizar animacao
    document.addEventListener('animationend',fimAnimacao);
    //obter todos os card's
    const listaCard = document.getElementsByClassName('card');
	//percorre os card
	for(const card of listaCard) {
        //adicionar o evento de click no card
        card.addEventListener('click',clickCard);
    }
    //obter botao restart
    const restart = document.getElementById('restart');
	//adicionar o evento de click no botao reiniciar
    restart.addEventListener('click', reiniciar);
	//obter botao play
    const buttonPlay = document.getElementById('play');
	//adicionar o evento de click no botao play
    buttonPlay.addEventListener('click', playAgain);
    //funcao que efetua o tratamento do cronometro
    window.setInterval('calcularCronometro()',1000);
};
/*
 * Funcao que obtem a lista de imagens a serem usadas,
 * executa o metodo shuffle, remove uma imagem caso ja esteja no card 
 * e posteriormente insere a nova imagem
 */
function inserirCardRandomico() {
	//array randomico
	let array = shuffle(listaImagemCard);
	//contador
	let count = 0;
	for(let card of document.getElementsByClassName('open')){
		//remove qualquer uma das imagem caso exista
		for(let img of listaImagem){
			card.classList.remove(img);
		}
		//adiciona de acordo com a o array randomico
		card.classList.add(array[count]);
		count++;
	}
}
/*
 * Metodo que efetua todo tratamento do botao reiniciar
 */
function reiniciar(){
	//gerar card randomicos no jogo
	inserirCardRandomico();
	//retornando as estrelas
	numEstrelas = 3;
	//substitui a estrela preenchida pela a de contorno
    for(let estrela of document.getElementById('stars').children){
        estrela.firstElementChild.classList.add('fa-star');
        estrela.firstElementChild.classList.remove('fa-star-o');
    }
	//zerar os card validados
	cardsValidados = [];
	//zera os pares concluidos 
	paresCompletos = 0;
    //retornando o movimento
    movimento = 0;
    atualizarMovimento();
    //fechando todos os card
    for(let card of document.getElementsByClassName('card')){
        card.classList.remove('flipper');
    }
    //removendo todos os certos
    for(let face of document.getElementsByClassName('open')){
        face.classList.remove('certo');
    }
    //zerar o cronometro
    zerarCronometro();
}
//array de cards cardsValidados
let cardsValidados = [];
/*
 * Metodo que efetua o tramento ao evento click nos cards
 */
function clickCard(evt) {
    let card = this;
    //click apenas para abrir o card, caso contrario nao faz nada
    if(card.classList.contains('flipper') || cardsValidados.length === 2){
        return;
    }
    //vira o card
    card.classList.add('flipper');
    //adiciona ele ao array
    cardsValidados.push(card);
    //iniciar cronometro se estiver parado
    if(!cronometroIniciado) {
        iniciarCronometro();
    }
}
/* 
 * Metodo desenvolvido afim de executar algumas etapas apos finalizar a animacao
 * na tela. 
 */
function fimAnimacao(evt) {
	//Obtem o elemento que sofre o evento
	let elemento = evt.target;
	//inicia o tratamento apos o flip
	if(evt.animationName == 'efeito-flipper'){
        validarCard(elemento);
        return;	
    }
    //inicia o tratamento apos o animacao de combinacao errada
	if(evt.animationName == 'efeito-errado'){
        elemento.classList.remove('errado');
        elemento.parentNode.classList.remove('flipper');
        return;	
    }
	//inicia o tratamento apos o animacao de combinacao errada
	if(evt.animationName == 'efeito-certo'){
		fimDeJogo();
        return;	
    }
}
/*
 * Metodo que efetua a validacao do card para identificar se sao iguais ou diferentes
 */
function validarCard(card) {
    //caso lista de card validados seja 2 inicia validacao
    if(cardsValidados.length === 2){
        const card1 = cardsValidados[0];
        const card2 = cardsValidados[1];
        const cardOpen1 = card1.lastElementChild;
        const cardOpen2 = card2.lastElementChild;
        
        //valida se as figuras sao iguais
        if(cardOpen1.classList.item(cardOpen1.classList.length-1) 
            === cardOpen2.classList.item(cardOpen2.classList.length-1)){
            //fluxo de acerto do jogo
            cardOpen1.classList.add('certo');
            cardOpen2.classList.add('certo');
			//incrementa um par descoberto
			paresCompletos += 1;
        } else {
            //fluxo de erro do jogo
            cardOpen1.classList.add('errado');
            cardOpen2.classList.add('errado');
        }
		//remove os cards a serem validados
		cardsValidados = [];
		//preencher incremento de movimento
        movimento += 1;
        //executa fluxo para atualiza a quantidade de movimento
        atualizarMovimento();
    }
}
//quantidade de movimento efetuado
let movimento = 0;
//numero de estrelas que o jogado ainda possui
let numEstrelas = 3;
/*
 * Metodo que incrementa a quantidade os movimentos efetuados
 * e efetua o controle das apresentacao das estrelas
 */
function atualizarMovimento(){
    //define o texto a ser utilizado na apresentacao do movimento
	const texto = movimento + (movimento > 1 ? ' Moves' : ' Move');
    //obtem elemento
	const ele = document.getElementById('move');
    //inserir nova contagem do movimento
	ele.textContent = texto;
    //tratamento para eliminar as estrelas com 10, 14 e 18 movimentos
    if( movimento === 11 || movimento === 19) {
        //obtem as estrelas fechadas
		const estrelas = document.getElementsByClassName('fa-star');
        //obtem a ultima da lista
		const estrela = estrelas[estrelas.length-1];
        //remove a estrela fechada
		estrela.classList.remove('fa-star');
		//inclui a estrela de contorno
        estrela.classList.add('fa-star-o');
		//diminiu as estrelas do jogado
		numEstrelas -= 1;
    }
}
//contagem dos pares ja completados na rodada
let paresCompletos = 0;
//variavel que informa foi executado o fim do jogo
let executouFimJogo = false;
/*
 * Metodo que valida se ocorreu o fim do jogo,
 * e executa a apresentacao do resultado
 */
function fimDeJogo(){
	//valida se fechou todos os pares do jogo
	if(paresCompletos === 8 && !executouFimJogo){
        //parar o cronometro no fim do jogo
        pararCronometro();
        //nao executar 2 vezes, pois eh chamado apos o concluir o evento do card
		executouFimJogo = true;
		//preencher desempenho no jogo
		let desempenho = document.getElementById('desempenho');
		//inserir informacoes do usuario
		desempenho.innerHTML = `With ${movimento} moves, ${numEstrelas} stars and ${tempo} time.<br>Woooooo!`;
		//abrir resultado
        abrirModalResultado();
        //animacao do checking
        let clipped1 = document.getElementById('clipped1');
        let clipped2 = document.getElementById('clipped2');
        let check1 = document.getElementById('check1');
        let check2 = document.getElementById('check2');
        clipped1.classList.add('animacaoclipped1');
        clipped2.classList.add('animacaoclipped2');
        check1.classList.add('animacaocheck1');
        check2.classList.add('animacaocheck2');
	}
}
/*
 * Metodo que abre o resultado
 */
function abrirModalResultado(){
    //obter o resultado
    let resultado = obterElementoResultado();
    //abrir o modal
    resultado.showModal();
}
/*
 * Metodo que fecha o resultado
 */
function fecharModalResultado(){
    //obter o resultado
    let resultado = obterElementoResultado();
    //fechar o modal
    resultado.close();
}
/*
 * Obter o elemento resultado e ativar/desativar o invisivel dele
 */
function obterElementoResultado(){
    //obtem o elemento
    let resultado = document.getElementById('resultado');
    //ativa/desativa o invisivel
    resultado.classList.toggle('invisivel');
    //retonar o elemento
    return resultado;
}
/*
 * Metodo que trata o evento click do botao Play Again
 */
function playAgain(){
	//retorna o fim do jogo para false
	executouFimJogo = false;
	//reiniciar o jogo
	reiniciar();
    //fechar o resultado
	fecharModalResultado();
}
//variaveis usadas para tratar o cronometro
let tempoInicial, hora, min, sec, tempo;
let cronometroIniciado = false;
/*
 * Funcao que inicia o cronometro
 */
function iniciarCronometro(){
    //obter o tempo inicial para calcular o percorrido
    tempoInicial = new Date();
    //iniciar a atualizacao do cronometro
    cronometroIniciado = true;
}
/*
 * Funcao que para o cronometro
 */
function pararCronometro(){
    //para de atualizar o cronometro
    cronometroIniciado = false;
    //atualizar na tela o cronometro
    preencherCronometro();
}
/*
 * Funcao que calcula o cronometro
 */
function calcularCronometro(){
    //executar apenas se tiver iniciado o jogo
    if(cronometroIniciado){
        //calcular o tempo ja percorrido
        let tempoPercorrido = Math.floor((new Date() - tempoInicial)/1000);
        //calcular as horas
        hora = Math.floor(tempoPercorrido / 3600) % 24;
        //calcular os minutos
        min  = Math.floor(tempoPercorrido / 60) % 60;
        //calcular os segundos
        sec  = tempoPercorrido % 60;
        //atualizar na tela o cronometro
        preencherCronometro();
    }
};
/*
 * Funcao que atualiza o cronometro na tela
 */
function preencherCronometro(){
    //montar a variavel tempo
    tempo = '';
    tempo += (hora < 10 ? '0' : '') + hora + ':';
    tempo += (min < 10 ? '0' : '') + min + ':';
    tempo += (sec < 10 ? '0' : '') + sec;
    //obter elemento cronometro
    let cronometro = document.getElementById('cronometro');
    //atualizar valor
    cronometro.textContent = tempo;
}
/*
 * Funcao que zera o cronometro
 */
function zerarCronometro(){
    //zera as variaveis de hora, min e sec
    hora = 0;
    min = 0;
    sec = 0;
    //para o cronometro
    pararCronometro();
}