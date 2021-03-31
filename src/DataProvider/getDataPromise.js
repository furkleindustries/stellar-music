import { apiKey } from './apiKey';
import fetch from 'cross-fetch';
import { hostUrl } from './hostUrl';

const type = 'observations';
const location = 'paris,fr';

const dataStub = {
  'id': 'MID_E8199',
  'dataSource': 'MADIS_MESONET2',
  'loc': {
      'long': -75.151,
      'lat': 39.94367
  },
  'place': {
      'name': 'philadelphia',
      'city': 'philadelphia',
      'state': 'pa',
      'country': 'us'
  },
  'profile': {
      'tz': 'America/New_York',
      'tzname': 'EST',
      'tzoffset': -18000,
      'isDST': false,
      'elevM': 12,
      'elevFT': 39
  },
  'obTimestamp': 1614720677,
  'obDateTime': '2021-03-02T16:31:17-05:00',
  'ob': {
      'type': 'station',
      'timestamp': 1614720677,
      'dateTimeISO': '2021-03-02T16:31:17-05:00',
      'recTimestamp': 1614721368,
      'recDateTimeISO': '2021-03-02T16:42:48-05:00',
      'tempC': 3.9,
      'tempF': 39,
      'dewpointC': -11.3,
      'dewpointF': 12,
      'humidity': 32,
      'pressureMB': 1023,
      'pressureIN': 30.2,
      'spressureMB': 1022,
      'spressureIN': 30.17,
      'altimeterMB': 1023,
      'altimeterIN': 30.2,
      'windKTS': 1,
      'windKPH': 2,
      'windMPH': 1,
      'windSpeedKTS': 1,
      'windSpeedKPH': 2,
      'windSpeedMPH': 1,
      'windDirDEG': 247,
      'windDir': 'WSW',
      'windGustKTS': 6,
      'windGustKPH': 11,
      'windGustMPH': 7,
      'flightRule': null,
      'visibilityKM': null,
      'visibilityMI': null,
      'weather': 'Mostly Sunny',
      'weatherShort': 'Mostly Sunny',
      'weatherCoded': '::FW',
      'weatherPrimary': 'Mostly Sunny',
      'weatherPrimaryCoded': '::FW',
      'cloudsCoded': 'FW',
      'icon': 'fair.png',
      'heatindexC': 3.9,
      'heatindexF': 39,
      'windchillC': 3.9,
      'windchillF': 39,
      'feelslikeC': 3.9,
      'feelslikeF': 39,
      'isDay': true,
      'sunrise': 1614684689,
      'sunriseISO': '2021-03-02T06:31:29-05:00',
      'sunset': 1614725625,
      'sunsetISO': '2021-03-02T17:53:45-05:00',
      'snowDepthCM': null,
      'snowDepthIN': null,
      'precipMM': 0,
      'precipIN': 0,
      'solradWM2': 274,
      'solradMethod': 'observed',
      'ceilingFT': null,
      'ceilingM': null,
      'light': 34,
      'uvi': null,
      'QC': 'O',
      'QCcode': 10,
      'trustFactor': 100,
      'skywxSrc': 'KPHL',
      'sky': 19
  },
  'relativeTo': {
      'lat': 39.95233,
      'long': -75.16379,
      'bearing': 131,
      'bearingENG': 'SE',
      'distanceKM': 1.455,
      'distanceMI': 0.904
  }
};

export const getDataPromise = (localeString) => {
  const xhr = new XMLHttpRequest();

  const spaceRe = new RegExp(/\s/g);
  xhr.open('GET', `https://aerisweather1.p.rapidapi.com/observations/${localeString.replace(spaceRe, '')}`);
  xhr.setRequestHeader('x-rapidapi-key', '732eeb2fbcmsh95fa2800d19deefp12cce6jsndc9a1e410d37');
  xhr.setRequestHeader('x-rapidapi-host', 'aerisweather1.p.rapidapi.com');

  xhr.send(null);

  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      resolve(JSON.parse(xhr.responseText).response);
    };

    xhr.onerror = reject;
  });
};
