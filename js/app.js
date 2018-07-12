/*
 * Create a list that holds all of your cards
 */


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
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
window.onload = function initElement() {
    //execucao apos finalizar animacao
    document.addEventListener('animationend',fimAnimacao);
    //obter todos os card's
    const listaCard = document.getElementsByClassName('card');
	for(const card of listaCard) {
        //adicionar o evento de click no card
        card.addEventListener('click',clickCard);
	}
};

let cardsAbertos = [];
function clickCard(evt) {
    let card = this;
    //click apenas para abrir o card, caso contrario nao faz nada
    if(card.classList.contains('flipper') || cardsAbertos.length === 2){
        return;
    }
    //vira o card
    card.classList.add('flipper');
    //adiciona ele ao array
    cardsAbertos.push(card);
    //continua o fluxo apos a animacao
}

function fimAnimacao(evt) {
	let card = evt.target;
	//inicia o tratamento apos o flip
	if(evt.animationName == 'efeito-flipper'){
        validarCard(card);
        return;	
    }
}

function validarCard(card) {
    //caso lista de card aberto seja 2 inicia validacao
    if(cardsAbertos.length === 2){
        const card1 = cardsAbertos[0];
        const card2 = cardsAbertos[1];
        const cardOpen1 = card1.lastElementChild;
        const cardOpen2 = card2.lastElementChild;
        
        //valida se as figuras sao iguais
        if(cardOpen1.classList.item(cardOpen1.classList.length-1) 
            === cardOpen2.classList.item(cardOpen2.classList.length-1)){
            //fluxo de acerto do jogo
            cardOpen1.classList.add('certo');
            cardOpen2.classList.add('certo');
        } else {
            //fluxo de erro do jogo
            card1.classList.remove('flipper');
            card2.classList.remove('flipper');
            
        }
        cardsAbertos = [];
    }
}