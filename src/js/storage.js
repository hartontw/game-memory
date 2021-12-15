// DATA
const storage = sessionStorage;

/**
 * @returns default images
 */
export function getDefaultImages() {
  const images = {};
  for (let i = 0; i < 15; i++) {
    images[i] = `images/default/${i}.jpg`;
  }
  return images;
}

/**
 * @returns default config
 */
export function getDefaultConfig() {
  return {
    cardSize: 10,
    dynamic: false,
    images: getDefaultImages(),
  };
}

/**
 * Save configuration
 *
 * @param {Object} config Config info to store
 */
export function save(config) {
  storage.setItem('config', JSON.stringify(config));
}

/**
 * Load configuration
 *
 */
export function load() {
  const config = storage.getItem('config');
  if (config) return JSON.parse(config);
  return getDefaultConfig();
}
