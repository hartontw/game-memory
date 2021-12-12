import { basename } from 'path';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const base = mode === 'production' ? `/ ${basename(process.cwd())} /` : '/';

export default {
  root: 'src',
  base,
  mode,
  publicDir: '../public',
  build: {
    outDir: '../dist',
    assetsDir: './',
  },
};
