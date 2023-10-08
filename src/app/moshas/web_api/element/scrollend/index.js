const container = document.querySelector(".container");

// The browser is no longer animating or translating scroll.
// The user's touch has been released.
// The user's pointer has released the scroll thumb.
// The user's keypress has been released.
// Scroll to fragment has completed.
// Scroll snap has completed.
// scrollTo() has completed.
// The user has scrolled the visual viewport.
container.addEventListener('scrollend', (event) => {
alert("scroll end!")
})
