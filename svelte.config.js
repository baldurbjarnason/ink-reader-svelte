
import autoPreprocess from 'svelte-preprocess';

const mode = process.env.NODE_ENV;
const dev = mode === "development";

module.exports = {
  dev,
  hydratable: true,
  emitCss: true,
  preprocess: autoPreprocess({
    postcss: true,
  })
}