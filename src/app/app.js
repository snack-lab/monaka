import "./js/worker/swRegister.js";
import "./js/observer/report.js";
// import "./js/navigation.js";

const std = window.matchMedia('(display-mode: standalone)');
if(std.matches) {
    document.title = `${document.title} (app)`;
}
