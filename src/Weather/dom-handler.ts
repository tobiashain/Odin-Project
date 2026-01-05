import type { Density, WeatherReturnData } from './types';

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
    this.humidity.innerText = `Humidity: ${data.humidity}%`;
    this.wind.innerText = `Wind: ${data.winddir}, ${data.windspeed} km/h`;
    this.pressure.innerText = `Pressure: ${data.pressure} mbar`;

    let [hours, minutes] = data.sunset.split(':').map(Number);
    let inputMinutes = hours! * 60 + minutes!;

    let nowUTC = new Date();
    let nowHoursUTC = nowUTC.getUTCHours() + data.tzoffset;
    let nowMinutesUTC = nowHoursUTC * 60 + nowUTC.getUTCMinutes();

    // Normalize minutes in case offset pushes it over 24 hours
    nowMinutesUTC = ((nowMinutesUTC % (24 * 60)) + 24 * 60) % (24 * 60);

    if (inputMinutes > nowMinutesUTC) {
      this.solarTransit.innerText = `Sunset: ${data.sunset}`;
    } else {
      this.solarTransit.innerText = `Sunrise: ${data.sunrise}`;
    }

    if (data.preciptype) {
      if (
        data.preciptype.includes('rain') ||
        data.preciptype.includes('snow')
      ) {
        this.createParticles(data.density);
        this.animateParticles('rain-drop', data.density.windX, data.windspeed);
        this.animateParticles('snow-flake', data.density.windX, data.windspeed);
      }
    }
  }

  private createParticles(density: Density) {
    const PARTICLES = 100;

    const rainParticles = density.rain * PARTICLES;
    const snowParticles = density.snow * PARTICLES;

    const createParticle = (type: string) => {
      const el = document.createElement('div');
      el.className = type === 'rain' ? 'rain-drop' : 'snow-flake';
      el.style.left = Math.random() * this.weather.clientWidth + 'px';
      el.style.top = Math.random() * this.weather.clientHeight + 'px';
      this.weather.appendChild(el);
    };

    for (let i = 0; i < rainParticles; i++) {
      createParticle('rain');
    }

    for (let i = 0; i < snowParticles; i++) {
      createParticle('snow');
    }
  }

  private animateParticles(type: string, windDir: number, windSpeed: number) {
    const elements = Array.from(this.weather.children).filter((el) =>
      el.classList.contains(type),
    ) as HTMLElement[];
    const step = () => {
      for (let el of elements) {
        let top = parseFloat(el.style.top);
        let left = parseFloat(el.style.left);

        const dirSign = windDir > 0 ? 1 : windDir < 0 ? -1 : 0;

        left += windSpeed * -dirSign * 0.05;
        top += type === 'rain' ? 3 : 1; // speed
        if (top > this.weather.clientHeight) {
          top = -10;
          left = Math.random() * this.weather.clientWidth;
        }

        if (left > this.weather.clientWidth) {
          left = -10;
        } else if (left < -10) {
          left = this.weather.clientWidth;
        }

        el.style.top = top + 'px';
        el.style.left = left + 'px';

        const angle = -windSpeed * dirSign;
        el.style.transform = `rotate(${angle}deg)`;
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
