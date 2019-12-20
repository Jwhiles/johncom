import { Elm } from './src/Main.elm';

Elm.Main.init({
  node: document.querySelector('main'),
  flags: null // Null here as the flag is just used to generate static pages
});
