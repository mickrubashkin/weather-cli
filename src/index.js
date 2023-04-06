import fs from 'node:fs/promises';

import * as dotenv from 'dotenv';

dotenv.config();

const isFileExists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    return false;
  }
};

const getWeatherData = async ({
  city, lat, lon, mode,
}) => {
  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  const params = new URLSearchParams({
    mode,
    appid: process.env.WEATHER_API_KEY ?? '',
  });

  if (city) {
    params.append('q', city);
  } else {
    params.append('lat', lat);
    params.append('lon', lon);
  }

  url.search = params.toString();

  const response = await fetch(url);
  return response.text();
};

const getLocationByIP = async () => {
  const url = new URL('https://ipinfo.io/json');
  const params = new URLSearchParams({
    token: process.env.IP_API_KEY ?? '',
  });

  url.search = params.toString();

  const response = await fetch('https://ipinfo.io/json?token=a5f460426eb72e');
  const jsonResponse = await response.json();

  return jsonResponse;
};

export default async (options) => {
  const {
    city,
    lat,
    lon,
    mode,
    output,
    force,
    current,
  } = options;

  let [latitude, longitude] = [lat, lon];

  if (current) {
    const currentLocation = await getLocationByIP();
    [latitude, longitude] = currentLocation.loc.split(',');
  }

  const weather = await getWeatherData({
    city, lat: latitude, lon: longitude, mode,
  });

  if (await isFileExists(output) && !force) {
    throw new Error(`File ${output} already exists`);
  }

  if (output) {
    await fs.writeFile(output, weather);
  } else {
    console.log(weather);
  }
};
