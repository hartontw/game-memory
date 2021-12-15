import * as newGame from './new-game';

const button = document.querySelector('.menu img');
const newGameDiv = document.querySelector('.menu .new-game');
const viewport = document.querySelector('.viewport');

function closeNewGame() {
  newGame.close();
  newGameDiv.removeEventListener('close', closeNewGame);
  newGameDiv.removeEventListener('confirm', closeNewGame);

  button.classList.remove('closed');
  viewport.classList.remove('pause');

  button.addEventListener('click', openNewGame);
}

function openNewGame() {
  button.removeEventListener('click', openNewGame);

  button.classList.add('closed');
  viewport.classList.add('pause');

  newGame.open();

  newGameDiv.addEventListener('close', closeNewGame);
  newGameDiv.addEventListener('confirm', closeNewGame);
}

button.addEventListener('click', openNewGame);
