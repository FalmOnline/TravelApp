import { onChangeValue, placenameInput } from './geonames';
import { selectedDateEl, days, nextMonth, prevMonth, toggleDates, goToNextMonth, goToPrevMonth } from './date-picker';
import { getWeatherAndImage } from './app';

const planTrip = document.querySelector('.btn-submit');

function getInfo(e) {
    if(placenameInput.value.length > 0) {
        preventDefault(e);
        getWeatherAndImage();
    } else {
        preventDefault(e);
    }
}

function preventDefault(e) {
    e.preventDefault();
}

placenameInput.addEventListener('input', onChangeValue);
selectedDateEl.addEventListener('click', toggleDates);
days.addEventListener('click', toggleDates);
nextMonth.addEventListener('click', goToNextMonth);
prevMonth.addEventListener('click', goToPrevMonth);
planTrip.addEventListener('click', getInfo);




