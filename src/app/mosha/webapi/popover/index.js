const supported = () => {
    return HTMLElement.prototype.hasOwnProperty("popover");
}

if (supported) {

  const po3btn = document.querySelector("#po3");
  const po3 = document.querySelector("#popover3");

  po3.addEventListener("beforetoggle", (event) => {
    console.log(`state: ${event.newState}`);
  });

  po3.addEventListener("toggle", (event) => {
    setTimeout(() => {
        if (event.target.matches(":popover-open")) {
            event.target.hidePopover();
        }
    }, 5000);
  });

  po3btn.addEventListener("mouseover", () => {
    if (po3.matches(":popover-open")) return;
    po3.showPopover();
  });

  po3btn.addEventListener("mouseleave", () => {
    if (!po3.matches(":popover-open")) return;
    po3.hidePopover();
  });

  const po4Parent = document.querySelector("#popover4");
  const po5Child = document.querySelector("#popover5");

  po4Parent.addEventListener("mouseover", () => {
    if (po5Child.matches(":popover-open")) return;
    po5Child.showPopover();
  });

  po4Parent.addEventListener("mouseleave", () => {
    if (!po5Child.matches(":popover-open")) return;
    po5Child.hidePopover();
  });

  const po8Parent = document.querySelector("#popover8");
  const po9Child = document.querySelector("#popover9");

  po8Parent.addEventListener("mouseover", () => {
    if (po9Child.matches(":popover-open")) return;
    po9Child.showPopover();
  });

  po8Parent.addEventListener("mouseleave", () => {
    if (!po9Child.matches(":popover-open")) return;
    po9Child.hidePopover();
  });

  const po10btn = document.querySelector("#po10");
  const po10 = document.querySelector("#popover10");
  po10.popover = "manual";
  po10btn.popoverTargetElement = po10;
  po10btn.popoverTargetAction = "toggle";

  const po11 = document.querySelector("#popover11");
  document.addEventListener('keydown', (event) => {
    if (event.key === "p") {
      po11.togglePopover();
    }
  });

} else {
  console.debug('Popover API not supported');
}
