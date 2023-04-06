import fs from 'node:fs/promises';

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
    appid: process.env.API_KEY ?? '',
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

export default async (options) => {
  const {
    city, lat, lon, mode, output, force,
  } = options;

  const weather = await getWeatherData({
    city, lat, lon, mode,
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
