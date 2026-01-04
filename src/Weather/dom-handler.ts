import type { WeatherReturnData } from './types';

export class DOMHandler {
  private weather: HTMLDivElement;
  private icon: HTMLImageElement;
  private condition: HTMLDivElement;
  private temp: HTMLDivElement;
  private maxTemp: HTMLDivElement;
  private minTemp: HTMLDivElement;
  private feelslike: HTMLDivElement;
  private description: HTMLDivElement;
  private address: HTMLDivElement;
  private humidity: HTMLDivElement;
  private wind: HTMLDivElement;
  private pressure: HTMLDivElement;
  private solarTransit: HTMLDivElement;

  constructor() {
    this.weather = DOMHandler.getElement('#weather');
    this.icon = DOMHandler.getElement('#icon');
    this.condition = DOMHandler.getElement('#condition');
    this.temp = DOMHandler.getElement('#temp');
    this.maxTemp = DOMHandler.getElement('#max-temp');
    this.minTemp = DOMHandler.getElement('#min-temp');
    this.feelslike = DOMHandler.getElement('#feelslike');
    this.description = DOMHandler.getElement('#description');
    this.address = DOMHandler.getElement('#address');
    this.humidity = DOMHandler.getElement('#humidity');
    this.wind = DOMHandler.getElement('#wind');
    this.pressure = DOMHandler.getElement('#pressure');
    this.solarTransit = DOMHandler.getElement('#solar-transit');
  }

  public updateDOM(data: WeatherReturnData) {
    this.weather.className = `${data.classCondition} ${data.isDay ? 'day' : 'night'}`;
    this.icon.src = data.icon;
    this.condition.innerText = data.condition;
    this.temp.innerText = `${data.temp} °C`;
    this.maxTemp.innerText = `↑ ${data.tempMax} °C`;
    this.minTemp.innerText = `↓ ${data.tempMin} °C`;
    this.feelslike.innerText = `Feels like ${data.feelslike} °C`;
    this.description.innerText = data.description;
    this.address.innerText = data.address;
    this.humidity.innerText = `Humidity: ${data.humidity}`;
    this.wind.innerText = `Wind: North, ${data.windspeed} km/h`;
    this.pressure.innerText = `Pressure: ${data.pressure} mbar`;
    this.solarTransit.innerText = `Sunset: ${data.sunset}`;

    //if (
    //  data.classCondition === 'rain' ||
    //  data.classCondition === 'snow' ||
    //  data.classCondition === 'rain-snow' ||
    //  data.classCondition === 'thunder'
    //) {
    //  this.createParticles(data.classCondition)
    //}

    this.createParticles('snow');
    this.animateParticles('snow');
  }

  private createParticles(type: string) {
    for (let i = 0; i < 100; i++) {
      const el = document.createElement('div');
      el.className = type === 'rain' ? 'rain-drop' : 'snow-flake';
      el.style.left = Math.random() * this.weather.clientWidth + 'px';
      el.style.top = Math.random() * this.weather.clientHeight + 'px';
      this.weather.appendChild(el);
    }
  }

  private animateParticles(type: string) {
    const elements = Array.from(this.weather.children).filter(
      (el) =>
        el.classList.contains('rain-drop') ||
        el.classList.contains('snow-flake'),
    ) as HTMLElement[];
    console.log(elements);
    const step = () => {
      for (let el of elements) {
        let top = parseFloat(el.style.top);
        top += type === 'rain' ? 5 : 1; // speed
        if (top > this.weather.clientHeight) {
          top = -10;
          el.style.left = Math.random() * this.weather.clientWidth + 'px';
        }
        el.style.top = top + 'px';
      }
      requestAnimationFrame(step);
    };
    step();
  }

  private static getElement<T extends HTMLElement = HTMLElement>(
    selector: string,
  ): T {
    const el = document.querySelector(selector);
    if (!el) {
      throw new Error(`Missing required element: ${selector}`);
    }
    return el as T;
  }
}
