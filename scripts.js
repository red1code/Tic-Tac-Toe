/*
A1 B1 C1
A2 B2 C2
A3 B3 C3
*/
document.getElementById('year-holder').textContent = new Date().getFullYear();

const spots = document.querySelectorAll('.spot');
const spanPlayer1 = document.getElementById('Player1');
const spanPlayer2 = document.getElementById('Player2');
const resetBtn = document.getElementById('rstBtn');

const Gameboard = (() => {
  const _gameboard = [];
  const getGameBoard = () => _gameboard;
  const addToGameBoard = (spotId, player) => {
    _gameboard.push({
      spot: spotId,
      player: player.getName()
    })
  }
  return {
    getGameBoard,
    addToGameBoard
  }
})();

const Player = (name, color) => {
  let _role = false;
  let _spots = [];
  const getName = () => name;
  const getColor = () => color;
  const getRole = () => _role;
  const getSpots = () => _spots;
  const changeRole = () => {
    _role = !_role;
  }
  const addToSpots = spot => {
    _spots.push(spot);
  }
  return { getName, getColor, getRole, getSpots, changeRole, addToSpots }
}

const playerX = Player('X', '#1c58b9');
const playerO = Player('O', '#3aaa57');
playerX.changeRole();

renderBoard();
showPlayerRole();

spots.forEach(spot => {
  spot.addEventListener('click', handlePlayersClicks)
});

resetBtn.addEventListener('click', resetBoard);

async function handlePlayersClicks(event) {
  if (event.target.textContent != '') { // check if the spot is already clicked
    event.preventDefault();
    return;
  }
  if (playerX.getRole() === true) {
    playerX.addToSpots(event.target.id);
    Gameboard.addToGameBoard(event.target.id, playerX);
    renderBoard();
    event.target.classList.add('player-1');

    if (checkForWin(playerX.getSpots())) {
      await showWinner('PlayerX');
      return;
    }
    changeRoles()
    showPlayerRole();
  }
  else {
    playerO.addToSpots(event.target.id);
    Gameboard.addToGameBoard(event.target.id, playerO);
    renderBoard();
    event.target.classList.add('player-2');
    if (checkForWin(playerO.getSpots())) {
      await showWinner('PlayerO');
      return;
    }
    changeRoles()
    showPlayerRole();
  }
  checkForDraw();
}

function renderBoard() {
  spots.forEach(spot => {
    spot.textContent = getSpotContent(spot.id)
  })
}

function showPlayerRole() {
  if (playerX.getRole()) {
    spanPlayer1.style.display = 'inline';
    spanPlayer2.style.display = 'none';
  }
  else {
    spanPlayer1.style.display = 'none';
    spanPlayer2.style.display = 'inline';
  }
}

function resetBoard() {
  location.reload()
}

// private methods

function changeRoles() {
  playerX.changeRole();
  playerO.changeRole();
}

function getSpotContent(spotId) {
  let content = '';
  Gameboard.getGameBoard().map(item => {
    if (item.spot === spotId) {
      content = item.player;
    }
  });
  return content;
}

function checkForWin(playedSpots) {
  const winChains = [
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2'],
    ['A3', 'B3', 'C3'],
    ['A1', 'A2', 'A3'],
    ['B1', 'B2', 'B3'],
    ['C1', 'C2', 'C3'],
    ['A1', 'B2', 'C3'],
    ['C1', 'B2', 'A3']
  ];
  let result;
  winChains.map(item => {
    const isWin = item.every(spot => playedSpots.includes(spot));
    if (isWin === true) {
      result = item;
      return;
    }
  });
  return result ? result : null;
}

function checkForDraw() {
  let spotsArr = [];
  spots.forEach(spot => spotsArr.push(spot));
  const isDrwa = spotsArr.every(spot => spot.textContent != '');
  if (isDrwa === true) {
    setTimeout(() => { alert('Draw!') }, 0);
  }
}

function showWinner(winner) {
  return new Promise((resolve, reject) => {
    resolve(setTimeout(() => {
      alert(`${winner} wins!`);
      spots.forEach(spot => spot.removeEventListener('click', handlePlayersClicks));
    }, 0))
  })
}
