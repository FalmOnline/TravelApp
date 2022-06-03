
import { selectedInfo } from './app';
console.log('---------------- date-picker ---------------------');

const datePicker = document.querySelector('.date-picker');
const selectedDateEl = document.querySelector('.selected-date');

const dates = document.querySelector('.dates');
const monthEl = document.querySelector('.month');
const nextMonth = document.querySelector('.next-month');
const prevMonth = document.querySelector('.prev-month');
const days = document.querySelector('.days');


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();


let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

let newMonth = month;
let newYear = year;

console.log('format date');
console.log(formatDate(date));
console.log('selectedDateEl');
console.log(selectedDateEl);

selectedDateEl.textContent = formatDate(date);
selectedDateEl.dataset.value = selectedDate;

function formatDate(d) {
    let day = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
	// Create a new date instance dynamically with JS
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 9) {
       month = `0${month + 1}`;
    } else {
        month = month + 1;
    }
 
    return day + ' / ' + month + ' / ' + year;
}

populateDates();

monthEl.textContent = `${months[month]} ${year}`;


function toggleDates(e) {
    dates.classList.toggle('active');
}

function goToNextMonth (e) {
    newMonth++;
    if(newMonth > 11) {
        newMonth = 0;
        newYear++;
    }
    monthEl.textContent = `${months[newMonth]} ${newYear}`;
    populateDates();
}

function goToPrevMonth (e) {
    newMonth--;
    if(newMonth < 0) {
        newMonth = 11;
        newYear--;
    }
    monthEl.textContent = `${months[newMonth]} ${newYear}`;
    populateDates();
}

function populateDates (e) {
    days.innerHTML = '';

    let nr_days = 31;

    switch(newMonth) {
        case 1:
            nr_days = 28;
            break;
        case 3:
            nr_days = 30;  
            break;
        case 5:
            nr_days = 30;  
            break;
        case 8:
            nr_days = 30;  
            break;
        case 10:
            nr_days = 30;  
            break;
    }

    for (let i = 0; i < nr_days; i++) {
        const dayItem = document.createElement('div');
        dayItem.classList.add('day');
        dayItem.textContent = i + 1;

        if(selectedDay === (i + 1) && selectedYear === year && selectedMonth == month) {
            dayItem.classList.add('selected');
        }

        dayItem.addEventListener('click', function(){

            selectedDay = (i + 1);
            selectedMonth = newMonth;
            selectedYear = newYear;
            selectedDate = new Date(selectedYear + '-' + (selectedMonth + 1) + '-' + (i + 1));

            selectedDateEl.textContent = formatDate(selectedDate);
            selectedDateEl.dataset.value = selectedDate;

            selectedInfo.day = (i>8) ? (i + 1) : '0' + (i+1) ;
            selectedInfo.month = ((selectedMonth + 1) > 9) ? selectedMonth + 1 : '0' + (selectedMonth + 1);
            selectedInfo.year = selectedYear;
            selectedInfo.date = selectedDate;
            console.log('selected info date');
            console.log(selectedInfo);

            populateDates();
        });

        days.appendChild(dayItem);
    }
}


export {datePicker, selectedDateEl, days, date, dates, day, months, month, nextMonth, prevMonth, monthEl, year, selectedDate, toggleDates, goToNextMonth, goToPrevMonth, formatDate, populateDates};




//https://www.youtube.com/watch?v=wY2dao1hJms