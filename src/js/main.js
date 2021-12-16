import '../css/style.css';
import * as board from './board';
import { load } from './storage';
import './menu';

const root = document.querySelector(':root');
const viewport = document.querySelector('.viewport');
const game = document.querySelector('.game');
const over = document.querySelector('.game-over');

const borderMargin = 0.25;
const flipTime = 500;

let cards = 16;
let cardSize = 10;
let dynamic = false;
let pairs = 0;
let block = false;
let touch;

let time;
let matches;
let fails;

const gap = () => cardSize * 0.1;
const wp = () => ({
  width: viewport.clientWidth,
  height: viewport.clientHeight,
});

function setViewport() {
  const { width, height } = wp();
  const cs = height * (cardSize / 100);
  const cols = Math.floor(width / (cs + cs * borderMargin));

  const size = board.getSize(cards, cols) || { cols: 1, rows: 1 };

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

function flipCard(card) {
  const back = card.querySelector('.back');
  back.removeEventListener('click', touchCard);
  back.classList.add('flip');
  setTimeout(() => {
    card.querySelector('.front').classList.add('flip');
  }, flipTime / 2);
}

function unflipCard(card) {
  const back = card.querySelector('.back');
  card.querySelector('.front').classList.remove('flip');
  setTimeout(() => {
    back.classList.remove('flip');
  }, flipTime / 2);
  setTimeout(() => {
    back.addEventListener('click', touchCard);
  }, flipTime);
}

function gameOver() {
  viewport.classList.add('pause');
  const timeSpan = new Date() - time;
  const min = Math.floor(timeSpan / 60000);
  const sec = Math.floor((timeSpan - min * 60000) / 1000);
  document.querySelector('.game-over .time').textContent = `⏳️ ${min}:${sec < 10 ? '0' : ''}${sec}`;
  document.querySelector('.game-over .match span').textContent = matches;
  document.querySelector('.game-over .fails span').textContent = fails;
  document.querySelector('.game-over .ratio span').textContent = Math.round((matches / fails) * 10) / 10;
  over.classList.add('open');
}

function dynamicMatch(card) {
  setTimeout(() => {
    card.classList.add('remove');
    touch.classList.add('remove');
    setTimeout(() => {
      card.remove();
      touch.remove();
      cards -= 1;
      if (cards > 0) {
        setViewport();
        touch = undefined;
        block = false;
      } else gameOver();
    }, flipTime);
  }, flipTime);
}

function staticMatch() {
  pairs += 1;
  if (pairs < cards) {
    block = false;
    touch = undefined;
  } else gameOver();
}

function match(card) {
  matches += 1;
  setTimeout(() => {
    if (dynamic) {
      dynamicMatch(card);
    } else {
      staticMatch();
    }
  }, flipTime);
}

function missmatch(card) {
  fails += 1;
  setTimeout(() => {
    unflipCard(card);
    unflipCard(touch);
    setTimeout(() => {
      block = false;
      touch = undefined;
    }, flipTime);
  }, flipTime * 1.5);
}

function firstTouch(card) {
  flipCard(card);
  touch = card;
}

function secondTouch(card) {
  block = true;
  flipCard(card);
  if (card.dataset.id === touch.dataset.id) {
    match(card);
  } else {
    missmatch(card);
  }
}

function touchCard(e) {
  if (block) return;
  const card = e.target.parentNode;
  if (touch) {
    if (card !== touch) secondTouch(card);
  } else firstTouch(card);
}

function createCard(id, backImage, frontImage) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.id = id;

  const back = document.createElement('img');
  back.classList.add('back');
  back.src = backImage;
  back.alt = 'Card';
  back.addEventListener('click', touchCard);

  const front = document.createElement('img');
  front.classList.add('front');
  front.src = frontImage;
  front.alt = `Card ${id}`;

  card.appendChild(back);
  card.appendChild(front);

  return card;
}

function newGame(e) {
  while (game.lastChild) {
    game.removeChild(game.lastChild);
  }

  if (viewport.classList.contains('pause')) viewport.classList.remove('pause');
  if (over.classList.contains('open')) over.classList.remove('open');

  const config = e ? e.detail.config : load();

  cards = Object.keys(config.images).length;
  cardSize = config.cardSize;
  dynamic = config.dynamic;
  pairs = 0;
  block = false;
  touch = undefined;

  time = new Date();
  matches = 0;
  fails = 0;

  const back = `./images/backs/${Math.floor(Math.random() * 9)}.jpg`;

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

window.addEventListener('resize', setViewport, true);
document.querySelector('.menu .new-game').addEventListener('confirm', newGame);
root.style.setProperty('--flip-time', `${flipTime / 1000}s`);

newGame();
