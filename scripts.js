/* spots IDs:

A1 B1 C1
A2 B2 C2
A3 B3 C3
*/
document.getElementById('year-holder').textContent = new Date().getFullYear();

const spots = document.querySelectorAll('.spot');
const spanPlayerX = document.getElementById('PlayerX');
const spanPlayerO = document.getElementById('PlayerO');
const resetBtn = document.getElementById('resetBtn');

const Gameboard = (() => {
  let _gameboard = [];
  let _gameEnded = false;
  const getGameBoard = () => _gameboard;
  const addToGameBoard = (spotId, player) => {
    _gameboard.push({ spot: spotId, player: player.getName() })
  }
  const isGameEnded = () => _gameEnded;
  const endTheGame = () => {
    _gameEnded = true
  }
  return { getGameBoard, addToGameBoard, isGameEnded, endTheGame }
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
    play(playerX, event);
  }
  else {
    play(playerO, event);
  }
  changeRoles()
  showPlayerRole();
  checkForDraw();
}

function play(player, event) {
  player.addToSpots(event.target.id);
  Gameboard.addToGameBoard(event.target.id, player);
  renderBoard();
  event.target.classList.add(player.getName() === 'X' ? 'player-1' : 'player-2');
  if (checkForWin(player.getSpots())) {
    Gameboard.endTheGame();
    showWinner(player.getName());
  }
}

function renderBoard() {
  spots.forEach(spot => {
    spot.textContent = getSpotContent(spot.id)
  })
}

function showPlayerRole() {
  if (playerX.getRole()) {
    spanPlayerX.style.display = 'inline';
    spanPlayerO.style.display = 'none';
  }
  else {
    spanPlayerX.style.display = 'none';
    spanPlayerO.style.display = 'inline';
  }
}

function resetBoard() {
  location.reload()
}

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
  if (Gameboard.isGameEnded()) {
    return;
  }
  let spotsArr = [];
  spots.forEach(spot => spotsArr.push(spot));
  const allSpotsClicked = spotsArr.every(spot => spot.textContent != '');
  if (allSpotsClicked === true) {
    setTimeout(() => { alert('Draw!') }, 0);
  }
}

function showWinner(winner) {
  setTimeout(() => {
    alert(`${winner} wins!`);
    spots.forEach(spot => spot.removeEventListener('click', handlePlayersClicks));
  }, 0)
}


// special methods

function print(msg) {
  console.warn(msg);
}
