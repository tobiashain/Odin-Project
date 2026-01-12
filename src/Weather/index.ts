import '../shared';
import { DOMHandler } from './dom-handler';
import Weather from './weather';

const weather = new Weather();
const domHandler = new DOMHandler();

weather.getWeather().then((data) => {
  if (!data) {
    console.log('No weather data available');
    return;
  }
  domHandler.updateDOM(data);
  const loader = document.querySelector('#loader');
  if (loader) loader.className = 'disabled';
});
