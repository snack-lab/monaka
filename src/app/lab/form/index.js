if ("showPicker" in HTMLInputElement.prototype) {
  const pickerButton = document.querySelectorAll(".show_picker");

  pickerButton.forEach((b) => {
    b.addEventListener("click", (e) => {
      const input = e.currentTarget.nextElementSibling;
      try {
        input.showPicker();
      } catch (error) {
        console.log(error);
      }
    });
  });
} else {
  console.log("Not supported.");
}
