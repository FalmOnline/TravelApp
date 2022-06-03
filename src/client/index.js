//should import the main function of your application javascript, it should import your scss, and it should export your main function from your application javascript.
import { onChangeValue, getLocationFetch, updateUIPlaces, postData } from './js/geonames';
import { formatDate, populateDates, datePicker, dates, day, months, month, nextMonth, prevMonth, monthEl, year, toggleDates, goToNextMonth, goToPrevMonth } from './js/date-picker';
import { getWeather, getWeatherFetch, postDataWeather, updateUIWeather } from './js/weather';
import { getWeatherAndImage, getLocation } from './js/app.js';
import { getImage, getImageFetch, postDataImg, updateUIImg } from './js/pixabay.js';

import './js/app.js';
import './js/date-picker';
import './js/geonames.js';
import './js/listeners';
import './js/pixabay.js';
import './js/weather';

import './styles/resets.scss';
import './styles/base.scss';
import './styles/date-picker.scss';
import './styles/footer.scss';
import './styles/form.scss';
import './styles/header.scss';






export {
    getLocation, getWeatherAndImage,
    formatDate, populateDates, toggleDates, goToNextMonth, goToPrevMonth,
    onChangeValue, getLocationFetch, updateUIPlaces, postData,
    getImage, getImageFetch, postDataImg, updateUIImg,
    getWeather, getWeatherFetch, postDataWeather, updateUIWeather
}