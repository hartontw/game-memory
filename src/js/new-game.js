import * as editor from './image-editor';
import * as storage from './storage';

// ELEMENTS |---------------------------------------------------------------------------------------

const newGame = document.querySelector('.menu .new-game');
const closeBtn = document.querySelector('.menu .new-game .close-btn');
const acceptBtn = document.querySelector('.menu .new-game .accept-btn');
const cardSizeIn = document.querySelector('#size');
const dynamicIn = document.querySelector('#mode');
const file = document.querySelector('.file');
const imageUpload = document.querySelector('#upload');
const imageEditor = document.querySelector('.image-editor');
const cards = document.querySelector('.cards');

// DATA |-------------------------------------------------------------------------------------------

let config;
const step = 9;
const deleteTime = 500;
cards.style.setProperty('--delete-time', `${deleteTime / 1000}s`);

// EVENTS |-----------------------------------------------------------------------------------------

/**
 * Dispatched when image edition is cancelled
 */
const closeEvent = new CustomEvent('close', {
  detail: {},
  bubbles: false,
  cancelable: false,
  composed: false,
});

/**
 * Dispatched when image edition is confirmed
 */
const confirmEvent = new CustomEvent('confirm', {
  detail: {},
  bubbles: false,
  cancelable: false,
  composed: false,
});

// HANDLERS |---------------------------------------------------------------------------------------

/**
 * Spread click action to final destination (input file)
 */
function onClickUpload() {
  document.querySelector('#upload').click();
  imageUpload.addEventListener('change', onImageSelected);
}

/**
 * Triggers when size input changes
 */
function onChangeSize(e) {
  config.cardSize = Number(e.target.value) + step;
  cards.style.setProperty('--size', `${config.cardSize}vh`);
}

/**
 * Triggers when game mode changes
 */
function onGameMode(e) {
  config.dynamic = e.target.checked;
}

/**
 * Removes card from document and image data from storage
 *
 * @param {number} id Image id
 * @param {string} card Card element
 */
function deleteCard(id, card) {
  delete config.images[id];
  cards.removeChild(card);
  if (Object.keys(config.images).length === 0) {
    config.images = storage.getDefaultImages();
    addImages();
  }
}

/**
 * Triggers when image is select from input file
 */
function onImageSelected() {
  imageUpload.removeEventListener('change', onImageSelected);
  if (imageUpload.files && imageUpload.files[0]) {
    editor.open(imageUpload.files[0]);
    imageEditor.addEventListener('confirm', onImageAdded);
  }
}

/**
 * Triggers when confirmed image edition is done
 *
 * @param {*} e event info
 */
function onImageAdded(e) {
  imageEditor.removeEventListener('confirm', onImageAdded);
  const id = new Date().getTime();
  config.images[id] = e.detail.image;
  cards.appendChild(createCardThumbnail(id, e.detail.image));
}

/**
 * Triggers when confirm button is pressed
 */
function onConfirm() {
  storage.save(config);
  confirmEvent.detail.config = config;
  disable();
  newGame.dispatchEvent(confirmEvent);
}

// PROPERTIES |-------------------------------------------------------------------------------------

/**
 * @returns true is editor is visible
 */
function isVisible() {
  return newGame.classList.contains('open');
}

// FUNCTIONS |--------------------------------------------------------------------------------------

/**
 * Enables new game window
 */
function enable() {
  config = storage.load();
  cards.style.setProperty('--size', `${config.cardSize}vh`);
  cardSizeIn.value = config.cardSize - step;
  dynamicIn.checked = config.dynamic;
  addImages();
  newGame.classList.add('open');
  subscribe();
}

/**
 * Disables new game window
 */
function disable() {
  editor.close();
  unsubscribe();
  removeImages();
  newGame.classList.remove('open');
}

/**
 * Subscribe to all events
 */
function subscribe() {
  file.addEventListener('click', onClickUpload);
  cardSizeIn.addEventListener('change', onChangeSize);
  dynamicIn.addEventListener('change', onGameMode);
  closeBtn.addEventListener('click', close);
  acceptBtn.addEventListener('click', onConfirm);
}

/**
 * Unsubscribe to all events
 */
function unsubscribe() {
  file.removeEventListener('click', onClickUpload);
  cardSizeIn.removeEventListener('change', onChangeSize);
  dynamicIn.removeEventListener('change', onGameMode);
  closeBtn.removeEventListener('click', close);
  acceptBtn.removeEventListener('click', onConfirm);
}

/**
 * Creates card thumbnail element
 *
 * @param {number} id Image id
 * @param {string} image Image data
 * @returns Card thumbnail element
 */
function createCardThumbnail(id, image) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.id = id;

  const thumb = document.createElement('img');
  thumb.classList.add('thumbnail');
  thumb.src = image;
  thumb.alt = `Image ${id}`;

  const delbtn = document.createElement('img');
  delbtn.classList.add('delete');
  delbtn.src = 'images/icons/btn-delete.svg';
  delbtn.alt = `Delete Image ${id}`;

  card.appendChild(thumb);
  card.appendChild(delbtn);

  let timeOut;

  const stopDeleting = () => {
    if (timeOut) {
      clearTimeout(timeOut);
      timeOut = undefined;
    }
    if (card.classList.contains('deleting')) {
      card.classList.remove('deleting');
    }
  };

  const startDeleting = () => {
    stopDeleting();
    if (!card.classList.contains('deleting')) {
      card.classList.add('deleting');
    }
    timeOut = setTimeout(() => {
      deleteCard(id, card);
    }, deleteTime);
  };

  card.addEventListener('mousedown', startDeleting);
  card.addEventListener('mouseup', stopDeleting);

  return card;
}

/**
 * Reads stored images and create thumbnails in the document
 */
function addImages() {
  const keys = Object.keys(config.images);
  keys.forEach((key) => {
    cards.appendChild(createCardThumbnail(key, config.images[key]));
  });
}

/**
 * Removes all thumbnails images from the document
 */
function removeImages() {
  const images = cards.querySelectorAll('.card');
  for (let i = images.length - 1; i >= 0; i--) {
    images[i].remove();
  }
}

// EXPORTS |----------------------------------------------------------------------------------------

/**
 * Opens new game menu
 */
export function open() {
  if (isVisible()) return;
  enable();
}

/**
 * Closes new game menu
 */
export function close() {
  if (!isVisible()) return;
  disable();
  newGame.dispatchEvent(closeEvent);
}
