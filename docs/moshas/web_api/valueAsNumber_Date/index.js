const inputText = document.querySelector("#t");
const inputNUmber = document.querySelector("#num");
const inputDate = document.querySelector("#d");
const inputMonth = document.querySelector("#m");
const inputDateTimeLocal = document.querySelector("#dtl");

const button = document.querySelector("#check");

button.onclick = () => {
    console.debug("Text",inputText?.valueAsNumber);
    console.debug("NUmber",inputNUmber?.valueAsNumber);

    console.debug("Date",inputDate?.valueAsNumber, inputDate?.valueAsDate);
    console.debug("Month",inputMonth?.valueAsNumber, inputMonth?.valueAsDate);
    console.debug("datetime-local",inputDateTimeLocal?.valueAsNumber, inputDateTimeLocal?.valueAsDate);
}
