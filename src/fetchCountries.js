export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`
  ).then(res => {
    if (!res.ok || res.status === 404) {
      throw new Error(res.status);
    }
    return res.json();
  });
}
