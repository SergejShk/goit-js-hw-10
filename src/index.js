import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const debounce = require('lodash.debounce');

const refs = {
  inputRef: document.querySelector('#search-box'),
  countryListRef: document.querySelector('.country-list'),
  countryInfoRef: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.inputRef.addEventListener('input', debounce(onFormSubmit, DEBOUNCE_DELAY));

function onFormSubmit(e) {
  e.preventDefault();
  searchQuery = e.target.value.trim();

  if (searchQuery === '') {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(data => {
      if (data.length > 10) {
        clearMarkup();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length >= 2 && data.length <= 10) {
        clearMarkupCountryInfo();
        renderListCountries(data);
        return;
      }
      renderListCountries(data);
      const countryNameRef = refs.countryListRef.querySelector('.country-name');
      countryNameRef.classList.add('country-name--largest');
      renderCountryInfo(...data);
      console.log(countryNameRef);
    })
    .catch(err => {
      console.log(err);
      clearMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderListCountries(arr) {
  const itemsMarkkup = arr
    .map(el => {
      return `<li class="country__item">
                <img class="country__img-flag" src="${el.flags.svg}" alt="flag">
                <p class="country-name">${el.name}</p>
              </li>`;
    })
    .join('');
  refs.countryListRef.innerHTML = itemsMarkkup;
}

function renderCountryInfo(data) {
  const { capital, population, languages } = data;
  const nameLanguages = languages.map(language => language.name).join(', ');

  const countryInfoMarkup = `<p class="country-info"><span class="country-info--bold">Capital: </span>${capital}</p>
                              <p class="country-info"><span class="country-info--bold">Population: </span>${population}</p>
                              <p class="country-info"><span class="country-info--bold">Languages: </span>${nameLanguages}</p>`;
  refs.countryInfoRef.innerHTML = countryInfoMarkup;
}

function clearMarkup() {
  refs.countryListRef.innerHTML = '';
  refs.countryInfoRef.innerHTML = '';
}

function clearMarkupCountryInfo() {
  refs.countryInfoRef.innerHTML = '';
}
