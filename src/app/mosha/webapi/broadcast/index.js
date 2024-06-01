const channelSelectedButton = document.querySelector('.channel-selected-button');
const messageSendButton = document.querySelector('.message-send-button');
const channelCloseButton = document.querySelector('.channel-close-button');
const appMessageContainer = document.querySelector('.app-message');
let bc = null;

const showMessage = (channelName, message) => {
  if (channelName === "1") {
    const channel = document.querySelector('.channel1');
    const d = document.createElement('div');
    d.textContent = message;
    channel.appendChild(d);
  } else if (channelName === "2") {
    const channel = document.querySelector('.channel2');
    const d = document.createElement('div');
    d.textContent = message;
    channel.appendChild(d);
  }
}

const appMessage = (text, options = { timeout: 2000 }) => {
  appMessageContainer.textContent = text;
  setTimeout(() => appMessageContainer.textContent = null, options.timeout);
}

const selected = () => {
  const selectedChannel = document.querySelector('.channelNo');
  if (bc) {
    bc.close();
  }
  bc = new BroadcastChannel(selectedChannel.value);
  console.debug(`Channel No: ${bc.name}`);
  bc.addEventListener('message', () => showMessage(event.target.name, event.data));
  bc.addEventListener('messageerror', (event) => console.error(event));
  appMessage(`チャンネル:${bc.name}をオープンしました。`);
}

const send = () => {
  if (bc) {
    const message = document.querySelector('.message');
    if (message.value) {
      bc.postMessage(message.value);
      showMessage(bc.name, message.value);
    }
  }
}

const close = () => {
  if (bc) {
    bc.close();
      appMessage(`チャンネル:${bc.name}をクローズしました。`);
  }
}

channelSelectedButton.addEventListener('click', selected);
messageSendButton.addEventListener('click', send);
channelCloseButton.addEventListener('click', close);
