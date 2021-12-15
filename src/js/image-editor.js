import 'croppie/croppie.css';
import Croppie from 'croppie';

// ELEMENTS |---------------------------------------------------------------------------------------

const imageEditor = document.querySelector('.image-editor');
const closeBtn = document.querySelector('.controls .close-btn');
const acceptBtn = document.querySelector('.controls .accept-btn');
const resizer = document.querySelector('.resizer');

// DATA |-------------------------------------------------------------------------------------------

const resize = new Croppie(resizer, {
  showZoomer: true,
  mouseWheelZoom: 'ctrl',
});

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
 * Handles accept button and dispatch edit event
 */
function onImageEdited() {
  resize.result('blob').then((blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      confirmEvent.detail.image = reader.result;
      disable();
      imageEditor.dispatchEvent(confirmEvent);
    };
  });
}

// PROPERTIES |-------------------------------------------------------------------------------------

/**
 * @returns true is editor is visible
 */
function isVisible() {
  return imageEditor.classList.contains('open');
}

// FUNCTIONS |--------------------------------------------------------------------------------------

/**
 * Enables editor window
 */
function enable() {
  imageEditor.classList.add('open');
  subscribe();
}

/**
 * Disables editor window
 */
function disable() {
  imageEditor.classList.remove('open');
  unsubscribe();
}

/**
 * Subscribe to all events
 */
function subscribe() {
  closeBtn.addEventListener('click', close);
  acceptBtn.addEventListener('click', onImageEdited);
}

/**
 * Unsubscribe to all events
 */
function unsubscribe() {
  closeBtn.removeEventListener('click', close);
  acceptBtn.removeEventListener('click', onImageEdited);
}

// EXPORTS |----------------------------------------------------------------------------------------

/**
 * Opens image editor
 *
 * @param {string} imageFile Image to edit
 */
export function open(imageFile) {
  if (isVisible()) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    resize.bind({
      url: e.target.result,
    }).then(() => {
      enable();
    });
  };

  reader.readAsDataURL(imageFile);
}

/**
 * Closes image editor
 */
export function close() {
  if (!isVisible()) return;

  disable();
  imageEditor.dispatchEvent(closeEvent);
}
