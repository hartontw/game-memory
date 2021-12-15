import '../css/style.css';
import * as board from './board';
import { load } from './storage';
import './menu';

const root = document.querySelector(':root');
const viewport = document.querySelector('.viewport');
const game = document.querySelector('.game');

let cards = 16;
let cardSize = 10;
const borderMargin = 0.25;

const gap = () => cardSize * 0.1;
const wp = () => ({
  width: viewport.clientWidth,
  height: viewport.clientHeight,
});

function touchCard(e) {
  const { children } = e.target.parentNode;
  for (let i = 0; i < children.length; i++) {
    children[i].classList.add('flip');
  }
}

function createCard(id, backImage, frontImage) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.id = id;

  const back = document.createElement('img');
  back.classList.add('back');
  back.src = backImage;
  back.alt = 'Card';

  const front = document.createElement('img');
  front.classList.add('front');
  front.src = frontImage;
  front.alt = `Card ${id}`;

  card.appendChild(back);
  card.appendChild(front);

  card.addEventListener('click', touchCard);

  return card;
}

function newGame(e) {
  const config = e ? e.detail.config : load();
  cardSize = config.cardSize;

  const back = `images/backs/${Math.floor(Math.random() * 9)}.jpg`;

  cards = Object.keys(config.images).length;

  for (let i = 0; i < 2; i++) {
    const images = {};
    let keys = Object.keys(config.images);
    keys.forEach((key) => {
      images[key] = config.images[key];
    });

    keys = Object.keys(images);
    while (keys.length > 0) {
      const index = Math.floor(Math.random() * keys.length);
      const key = keys[index];
      const card = createCard(key, back, images[key]);
      game.appendChild(card);
      keys.splice(index, 1);
    }
  }

  setViewport();
}

function setViewport() {
  const { width, height } = wp();
  const cs = height * (cardSize / 100);
  const cols = Math.floor(width / (cs + cs * borderMargin));

  const size = board.getSize(cards, cols);

  const wu = size.cols * cs + size.cols * cs * borderMargin;
  const ml = (width - wu) / 2;

  const hu = size.rows * cs + size.rows * cs * borderMargin;
  const mt = height > hu ? (height - hu) / 2 : height * (gap() / 100);

  root.style.setProperty('--cols', size.cols);
  root.style.setProperty('--rows', size.rows);
  root.style.setProperty('--size', `${cardSize}vh`);
  root.style.setProperty('--gap', `${gap()}vh`);
  root.style.setProperty('--ml', `${ml}px`);
  root.style.setProperty('--mt', `${mt}px`);
}

window.addEventListener('resize', setViewport, true);
document.querySelector('.menu .new-game').addEventListener('confirm', newGame);

newGame();
