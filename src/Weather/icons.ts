import cloudDay from './icons/cloud-day.svg';
import cloudNight from './icons/cloud-night.svg';
import partlyCloudyDay from './icons/partlycloudy-day.svg';
import partlyCloudyNight from './icons/partlycloudy-night.svg';
import rainDay from './icons/rain-day.svg';
import rainNight from './icons/rain-night.svg';
import rainSnowDay from './icons/rain-snow-day.svg';
import rainSnowNight from './icons/rain-snow-night.svg';
import snowDay from './icons/snow-day.svg';
import snowNight from './icons/snow-night.svg';
import sunDay from './icons/sun-day.svg';
import sunNight from './icons/sun-night.svg';
import thunderDay from './icons/thunder-day.svg';
import thunderNight from './icons/thunder-night.svg';
import unknownDay from './icons/unknown-day.svg';
import unknownNight from './icons/unknown-night.svg';

export const weatherIcons: Record<string, { day: string; night: string }> = {
  cloud: { day: cloudDay, night: cloudNight },
  'partly-cloudy': { day: partlyCloudyDay, night: partlyCloudyNight },
  rain: { day: rainDay, night: rainNight },
  'rain-snow': { day: rainSnowDay, night: rainSnowNight },
  snow: { day: snowDay, night: snowNight },
  sun: { day: sunDay, night: sunNight },
  thunder: { day: thunderDay, night: thunderNight },
  unknown: { day: unknownDay, night: unknownNight },
};
