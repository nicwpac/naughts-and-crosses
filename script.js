let gamePlaying = false;

let gameContainer; //= document.getElementById("game-container");
const playerList = document.getElementById("player-list");
const victorDiv = document.getElementById("victor");

const gameBoard = ((size = 9) => {
    let board = new Array(size).fill(null);
    const getSquareCount = () => board.length;

    const getBoardSquare = (squareNumber) => board[squareNumber];
    const setBoardSquare = (squareNumber, marker) => { 
        if (!gamePlaying || board[squareNumber] != null) return;
        board[squareNumber] = marker;
        displayCTRL.getDisplaySquare();
        checkWin();
    };

    const checkWin = () => {
        let boardFull = true;
        board.forEach((sqr) => {
            if (sqr == null) boardFull = false;
        });

        function updateSquares(sqr1, sqr2, sqr3) {
            const squares = [sqr1, sqr2, sqr3];
            squares.forEach((sqr) => {
                console.log(sqr, displayCTRL.getDisplaySquare(sqr));
                displayCTRL.getDisplaySquare(sqr).classList.add("square-win");
            });
        }

        const tie = false;

        if (getBoardSquare(0) != null && getBoardSquare(0) == getBoardSquare(1) && getBoardSquare(1) == getBoardSquare(2)) {
            updateSquares(0, 1, 2);
            gamePlaying = false;
        }
        else if (getBoardSquare(3) != null && getBoardSquare(3) == getBoardSquare(4) && getBoardSquare(4) == getBoardSquare(5)) {
            updateSquares(3, 4, 5);
            gamePlaying = false;
        }
        else if (getBoardSquare(6) != null && getBoardSquare(6) == getBoardSquare(7) && getBoardSquare(7) == getBoardSquare(8)) {
            updateSquares(6, 7, 8);
            gamePlaying = false;
        }
        else if (getBoardSquare(0) != null && getBoardSquare(0) == getBoardSquare(3) && getBoardSquare(3) == getBoardSquare(6)) {
            updateSquares(0, 3, 6);
            gamePlaying = false;
        }
        else if (getBoardSquare(1) != null && getBoardSquare(1) == getBoardSquare(4) && getBoardSquare(4) == getBoardSquare(7)) {
            updateSquares(1, 4, 7);
            gamePlaying = false;
        }
        else if (getBoardSquare(2) != null && getBoardSquare(2) == getBoardSquare(5) && getBoardSquare(5) == getBoardSquare(8)) {
            updateSquares(2, 5, 8);
            gamePlaying = false;
        }
        else if (getBoardSquare(0) != null && getBoardSquare(0) == getBoardSquare(4) && getBoardSquare(4) == getBoardSquare(8)) {
            updateSquares(0, 4, 8);
            gamePlaying = false;
        }
        else if (getBoardSquare(2) != null && getBoardSquare(2) == getBoardSquare(4) && getBoardSquare(4) == getBoardSquare(6)) {
            updateSquares(2, 4, 6);
            gamePlaying = false;
        }
        else if (boardFull) {
            gamePlaying = false;
            tie = true;
        }

        if (gamePlaying == false) {
            const gameEndMsg = document.createElement("h2");

            if (!tie)
                gameEndMsg.textContent = `"${playerMgr.getCurrentPlayer().name} wins!"`;
            else
                gameEndMsg.textContent = "It's a tie!";

            victorDiv.append(gameEndMsg);
        } 
    };

    const reset = () => {
        if (gameContainer == undefined) displayCTRL.initDisplay();
        displayCTRL.resetDisplay();
        board = new Array(size).fill(null);
        displayCTRL.initDisplay();
    };

    return { getSquareCount, getBoardSquare, setBoardSquare, checkWin, reset };
})();

const displayCTRL = (() => {
    const size = gameBoard.getSquareCount();

    const displaySquares = [];

    const initDisplay = () => {
        gameContainer = document.createElement("div");
        gameContainer.id = "game-container";
        const location = document.getElementById("game");
        location.append(gameContainer);

        for (let i = 0; i < size; i++) {
            const newSquare = document.createElement("div");
            newSquare.addEventListener("click", () => {
                const idx = Array.from(gameContainer.children).indexOf(newSquare);

                gameBoard.setBoardSquare(idx, playerMgr.getCurrentPlayer().marker);
                newSquare.textContent = gameBoard.getBoardSquare(idx);

                playerMgr.setNextPlayer();
            });
            newSquare.classList.add("square");
            gameContainer.appendChild(newSquare);
            displaySquares.push(newSquare);
        }
    };

    const resetDisplay = () => {
        displaySquares.length = 0;
        gameContainer.replaceChildren();
    };

    const getDisplaySquare = (squareNumber) => displaySquares[squareNumber];
    console.log(displaySquares);
    return { initDisplay, getDisplaySquare, resetDisplay };
})();

const playerMgr = (() => {
    const players = [];

    const createPlayer = (name, marker) => {
        const player = { name, marker };
        players.push(player);

        const playerListItem = document.createElement("li");
        playerListItem.textContent = name;
        playerListItem.style.listStyleType = `"Player ${players.length}: "`;
        playerList.append(playerListItem);
    };

    const getPlayers = () => players;
    const getCurrentPlayer = () => players[0];
    const setNextPlayer = () => players.push(players.shift());

    return { createPlayer, getPlayers, getCurrentPlayer, setNextPlayer }
})();

const startGameBtn = document.getElementById("btn-start-game");
startGameBtn.addEventListener("click", () => {
    if (playerMgr.getPlayers().length > 1) {
        gameBoard.reset();
        gamePlaying = true
        startGameBtn.textContent = gamePlaying ? "Reset Game" : "Start Game";
    }
    else {
        alert("Please ensure you have at least two players.");
    }
});

const addPlayerNameInput = document.getElementById("input-add-player-name");
const addPlayerMarkerInput = document.getElementById("input-add-player-marker");
const addPlayerBtn = document.getElementById("btn-add-player");
addPlayerBtn.addEventListener("click", () => {
    let pName = addPlayerNameInput.value;
    let pMarker = addPlayerMarkerInput.value;
    
    if (pName === "" && pMarker === "") {
        alert("Please enter a player name and marker before adding player.");
    }
    else if (pName == "") {
        alert("Please enter a player name before adding player.");
    }
    else if (pMarker == "") {
        alert("Please enter a player marker before adding player.");
    }
    
    playerMgr.createPlayer(pName, pMarker);
    
    addPlayerNameInput.value = "";
    addPlayerMarkerInput.value = "";
});

