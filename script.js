const gameBoard = document.getElementById('gameBoard');
const movesElement = document.getElementById('moves');

// --- CONFIGURAÇÃO DE ÁUDIO ---
const musicSolo = document.getElementById('musicSolo'); 
musicSolo.volume = 0.4; // Volume do modo Solo

const musicVs = document.getElementById('musicVs'); 
musicVs.volume = 0.5;   // Volume do modo Versus
const flipSound = document.getElementById('flipSound'); 
flipSound.volume = 0.8; // Efeito sonoro alto

const winSound = document.getElementById('winSound'); 
winSound.volume = 1.0; // Vitória no máximo

// --- LISTA DE PERSONAGENS ---
const allCharacters = [
    'Kayoshin', 'GokuSS3', 'Nuvem', 'Android19', 'Videl', 'MajinBuu', 
    'Android16', 'Goku SSJ', 'Android 17', 'Kuririn', 'Shenlong', 
    'Super Vegeta', 'Android 20', 'Android 18', 'Super Trunks', 
    'Gohan SS2', 'Trunks Espada', 'Sr Kaioh', 'Chaos', 'Freeza Final', 
    'Gohan Crianca', 'Sr Popo', 'Mestre Karin', 'Nappa', 'Bulma', 
    'Tenshinhan', 'Goku Bebe', 'Piccolo', 'ChiChi', 'Mestre Kame', 'Raditz'
];

// --- AVATARES ---
const maleAvatars = ['Goku SSJ', 'Vegeta Scouter', 'Piccolo', 'Gohan SS2', 'Trunks Espada', 'Mestre Kame'];
const femaleAvatars = ['Bulma', 'ChiChi', 'Android 18', 'Videl'];

// VARIÁVEIS DO JOGO
let isMultiplayer = false;
let currentPlayer = 1; 
let scores = { 1: 0, 2: 0 };
let names = { 1: '', 2: '' };
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;

// --- FUNÇÕES DE MENU ---

function selectMode(mode) {
    const inputsDiv = document.getElementById('inputsSection');
    const player2Input = document.getElementById('player2Name');
    
    inputsDiv.style.display = 'block';
    
    if (mode === 1) {
        isMultiplayer = false;
        player2Input.style.display = 'none';
    } else {
        isMultiplayer = true;
        player2Input.style.display = 'block';
    }
}

function getAvatarByName(name) {
    const lowerName = name.toLowerCase().trim();
    const isFemale = lowerName.endsWith('a') || lowerName === 'videl' || lowerName === 'pan';
    const list = isFemale ? femaleAvatars : maleAvatars;
    const randomChar = list[Math.floor(Math.random() * list.length)];
    return `img/${randomChar}.jpg`;
}

function initGame() {
    names[1] = document.getElementById('player1Name').value || 'Goku';
    names[2] = document.getElementById('player2Name').value || 'Vegeta';

    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('scoreBoard').style.display = 'flex';
    document.getElementById('soloStats').style.display = 'none';
    
    // Configura Jogador 1
    document.getElementById('p1NameDisplay').innerText = names[1];
    document.getElementById('p1Avatar').src = getAvatarByName(names[1]);

    if (isMultiplayer) {
        document.getElementById('p2Card').style.display = 'flex';
        document.querySelector('.vs').style.display = 'block';
        document.getElementById('p2NameDisplay').innerText = names[2];
        document.getElementById('p2Avatar').src = getAvatarByName(names[2]);
        document.getElementById('p1Score').innerText = "0";
        document.getElementById('p2Score').innerText = "0";
        updateTurnIndicator();
    } else {
        document.getElementById('p2Card').style.display = 'none';
        document.querySelector('.vs').style.display = 'none';
        document.getElementById('p1Score').innerText = "0 moves";
    }

    startGame();

    // ♫ TOCA A MÚSICA DE FUNDO AO INICIAR ♫
    stopAllAudio(); // Garante que nada mais está tocando
   if (isMultiplayer) {
        musicVs.play().catch(e => console.log(e));
    } else {
        musicSolo.play().catch(e => console.log(e));
    }
}

// --- LÓGICA DO JOGO ---

function startGame() {
    gameBoard.innerHTML = '';
    moves = 0;
    scores = { 1: 0, 2: 0 };
    currentPlayer = 1;
    movesElement.innerText = moves;
    
    if (isMultiplayer) updateScoreUI();

    let shuffledDb = allCharacters.sort(() => Math.random() - 0.5);
    let selectedCharacters = shuffledDb.slice(0, 10);
    let cardList = [...selectedCharacters, ...selectedCharacters];
    cardList.sort(() => Math.random() - 0.5);

    cardList.forEach(char => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.character = char;
        card.innerHTML = `<div class="front-face"><img src="img/${char}.jpg"></div><div class="back-face"></div>`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // Apenas o efeito sonoro
    flipSound.currentTime = 0;
    flipSound.play();
    
    this.classList.add('flip');
    // ... restante da função ...


    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (!isMultiplayer) {
        moves++;
        document.getElementById('p1Score').innerText = moves + " moves"; 
    }

    let isMatch = firstCard.dataset.character === secondCard.dataset.character;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    if (isMultiplayer) {
        scores[currentPlayer]++;
        updateScoreUI();
        setTimeout(checkWinCondition, 500);
        resetBoard(false);
    } else {
        setTimeout(checkWinCondition, 500);
        resetBoard();
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        
        if (isMultiplayer) switchTurn();
        
        resetBoard();
    }, 1000);
}

function switchTurn() {
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    updateTurnIndicator();
}

function updateTurnIndicator() {
    const p1Card = document.getElementById('p1Card');
    const p2Card = document.getElementById('p2Card');
    
    if (currentPlayer === 1) {
        p1Card.classList.add('active');
        p2Card.classList.remove('active');
    } else {
        p1Card.classList.remove('active');
        p2Card.classList.add('active');
    }
}

function updateScoreUI() {
    document.getElementById('p1Score').innerText = scores[1];
    document.getElementById('p2Score').innerText = scores[2];
}

function resetBoard(switchPlayer = true) {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function checkWinCondition() {
    let matchedCards = document.querySelectorAll('.matched').length;
    let totalCards = document.querySelectorAll('.card').length;

    if (matchedCards === totalCards) {
        // ♫ PARA A MÚSICA E TOCA VITÓRIA ♫
        stopAllAudio();
        winSound.play().catch(e => console.log(e));
        
        let headerMsg = "";
        let scoreMsg = "";

        if (isMultiplayer) {
            if (scores[1] > scores[2]) headerMsg = `VITÓRIA DE ${names[1].toUpperCase()}!`;
            else if (scores[2] > scores[1]) headerMsg = `VITÓRIA DE ${names[2].toUpperCase()}!`;
            else headerMsg = "EMPATE!";
            scoreMsg = `${names[1]}: ${scores[1]} pts <br> ${names[2]}: ${scores[2]} pts`;
        } else {
            headerMsg = "MISSÃO CUMPRIDA!";
            scoreMsg = `${names[1]}, completou com <br> <strong>${moves} movimentos</strong>!`;
        }

        setTimeout(() => {
            document.getElementById('winnerText').innerText = headerMsg;
            document.getElementById('finalScore').innerHTML = scoreMsg;
            document.getElementById('gameOverScreen').style.display = 'flex';
        }, 500);
    }
}

// Função auxiliar para parar tudo
function stopAllAudio() {
    // Para a música Solo
    musicSolo.pause();
    musicSolo.currentTime = 0;
    
    // Para a música Versus
    musicVs.pause();
    musicVs.currentTime = 0;
    
    // Para a música de Vitória
    winSound.pause();
    winSound.currentTime = 0;
}
function restartSetup() {
    stopAllAudio();
    
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('inputsSection').style.display = 'none';
    
    gameBoard.innerHTML = ''; 
    document.getElementById('scoreBoard').style.display = 'none';
}

function playAgain() {
    stopAllAudio();
    document.getElementById('gameOverScreen').style.display = 'none';
    
    startGame();
    
    // Toca a música certa baseada no modo atual
    if (isMultiplayer) {
        musicVs.play().catch(e => console.log(e));
    } else {
        musicSolo.play().catch(e => console.log(e));
    }
}