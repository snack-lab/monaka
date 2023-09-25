const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.debug(event.submitter.value);
    console.debug(event.submitter.name);
})