// https://developer.chrome.com/docs/capabilities/web-apis/window-management
// https://web.dev/patterns/web-apps/multiple-screens
// https://developer.mozilla.org/ja/docs/Web/API/Screen
// https://developer.mozilla.org/en-US/docs/Web/API/Window_Management_API
// https://www.w3.org/TR/window-management/
// https://github.com/michaelwasserman/window-placement-demo

const manageButton = document.querySelector('.manage-button');
const dialog = document.querySelector('.dialog');

let state = "prompt";

async function permissionState() {
  let state;
  try {
    ({ state } = await navigator.permissions.query({ name: "window-management", }));
  } catch (err) {
    if (err.name !== "TypeError") {
      throw new Error(err.message, { cause: err });
    }
    try {
      ({ state } = await navigator.permissions.query({ name: "window-placement", }));
    } catch (err) {
      throw new Error(err.message, { cause: err });
    }
  }

  if (state === "denied") {
    throw new Error("Permission denied");
  }

  return state;
}

async function openDialog() {
  try {
    // if (!window.screen.isExtended) {
    //   return;
    // }

    await permissionState();

    const screenDetails = await window.getScreenDetails();
    let noOfScreens = screenDetails.screens.length;

    screenDetails.addEventListener("currentscreenchange", (event) => {
      const details = screenDetails.currentScreen;
      console.log("The current screen has changed.", event, details);
    });

    screenDetails.addEventListener("screenschange", () => {
      // 使用可能になった画面のセットが変更されたとき
      if (screenDetails.screens.length !== noOfScreens) {
        console.log(`The screen count changed from ${noOfScreens} to ${screenDetails.screens.length}`,);
        noOfScreens = screenDetails.screens.length;
      }
    });

    const select = dialog.querySelector('.screens');
    select.onchange = (event) => {
      const selectedButton = dialog.querySelector('.selected_button');
      selectedButton.value = event.target.value;
    }

    (screenDetails.screens).forEach((screen, index) => {
      console.debug(screen);

      const isPrimary = screen.isPrimary ? '主画面' : '拡張画面';
      const isInternal = screen.isInternal ? '内部ディスプレイ' : '外部ディスプレイ';
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${isInternal} - ${isPrimary}: ラベル:${screen.label}: 横:${screen.width} 縦:${screen.height}`;
      select.appendChild(option);
    });

    dialog.showModal();
  } catch (error)  {
    console.debug(error)
  }
}

async function closeDialog(event) {
  const selected = event.target.returnValue;
  if (selected !== "") {
    try {
      await permissionState();

      //
      const selectedScreen = (await getScreenDetails()).screens[selected];
      console.debug(selectedScreen);

      //
      const select = dialog.querySelector('.screens');
      const option = document.createElement('option');
      select.textContent = "";
      option.value = "";
      select.appendChild(option);
    } catch (error)  {
      console.debug(error)
    }
  }
}


if ('getScreenDetails' in window) {
  manageButton.addEventListener('click', openDialog);
  dialog.addEventListener('close', closeDialog);
}
