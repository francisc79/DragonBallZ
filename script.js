const gameBoard = document.getElementById('gameBoard');
const movesElement = document.getElementById('moves');

// --- ÁUDIO ---
const bgMusic = document.getElementById('bgMusic'); 
bgMusic.volume = 0.5;

const flipSound = document.getElementById('flipSound'); 
flipSound.volume = 0.8;

// --- LISTA DE PERSONAGENS ---
const allCharacters = [
    'Kayoshin',
    'GokuSS3',
    'Nuvem',
    'Android19',
    'Videl',
    'MajinBuu',
    'Android16',
    'RonKayoshin',
    'Goku SSJ',
    'Android 17',
    'Kuririn',
    'Shenlong',
    'Super Vegeta',
    'Android 20',
    'Android 18',
    'Super Trunks',
    'Gohan SS2',
    'Trunks Espada', 
    'Sr Kaioh',
    'Chaos',
    'Freeza Final',
    'Bubbles',
    'Gohan Crianca',
    'Sr Popo',
    'Mestre Karin',
    'Nappa',
    'Bulma',
    'Tenshinhan',
    'MajinBuuGordo',
    'Goku Bebe',
    'Piccolo',
    'ChiChi',
    'Gohan Chapeu',
    'Mestre Kame',
    'Raditz'
];
// Removi duplicatas (Kuririn e Android19 apareciam 2x na sua lista) para evitar bugs no sorteio.

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;

function startGame() {
    gameBoard.innerHTML = '';
    moves = 0;
    movesElement.innerText = moves;

    // --- LÓGICA DE SORTEIO ---
    let shuffledDb = allCharacters.sort(() => Math.random() - 0.5);
    let selectedCharacters = shuffledDb.slice(0, 10); // Pega 10 personagens
    let cardList = [...selectedCharacters, ...selectedCharacters]; // Duplica para 20 cartas
    cardList.sort(() => Math.random() - 0.5); // Embaralha o tabuleiro

    // Gera o HTML
    cardList.forEach(char => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.character = char;

        card.innerHTML = `
            <div class="front-face">
                <img src="img/${char}.jpg" alt="${char}">
            </div>
            <div class="back-face">
                </div>
        `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    // 1. Bloqueios de lógica
    if (lockBoard) return;
    if (this === firstCard) return;

    // 2. Tenta tocar a música de fundo (se estiver parada)
    // Usamos o .catch apenas para evitar erro no console, não para controlar o jogo
    if (bgMusic.paused) {
        bgMusic.play().catch(error => { console.log("Interaja para tocar a música"); });
    }

    // 3. Toca o som da carta virando
    flipSound.currentTime = 0;
    flipSound.play();

    // 4. Vira a carta visualmente
    this.classList.add('flip');

    // 5. Lógica do Jogo da Memória
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    moves++;
    movesElement.innerText = moves;

    let isMatch = firstCard.dataset.character === secondCard.dataset.character;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    // Remove o clique apenas das cartas acertadas
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();

    // --- VERIFICA SE O JOGO ACABOU ---
    let matchedCards = document.querySelectorAll('.matched').length;
    let totalCards = document.querySelectorAll('.card').length;

    if (matchedCards === totalCards) {
        setTimeout(() => {
            stopMusic(); 
            alert(`Parabéns! Você venceu com ${moves} jogadas!`);
        }, 500);
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Função auxiliar para parar a música
function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0; 
}

function restartGame() {
    stopMusic(); 
    startGame(); 
}

// Inicia o jogo
startGame();