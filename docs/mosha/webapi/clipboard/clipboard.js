const supported = "clipboard" in navigator ? true : false;
const readQueryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
const writeQueryOpts = { name: 'clipboard-write', allowWithoutGesture: false };

const readPermission = await navigator.permissions.query(readQueryOpts);
const writePermission = await navigator.permissions.query(writeQueryOpts);

readPermission.onchange = () => console.log(permissionStatus.state);
writePermission.onchange = () => console.log(permissionStatus.state);

const imageTypes = {
  png: 'image/png',
  svg: 'image/svg+xml',
  avif: 'web image/avif', // web custom formats
  webp: 'web image/webp', // web custom formats
  jpeg: 'web image/jpeg', // web custom formats
  gif: 'web image/gif'    // web custom formats
}

/**
 *
 * @returns {boolean}
 */
const textSupport = () => {
  if (
    !supported ||
    !('supports' in window.ClipboardItem) ||
    !window.ClipboardItem.supports('text/plain')
  ) {
    return false;
  }
  return true;
}

/**
 *
 * @returns {boolean}
 */
const htmlSupport = () => {
  if (
    !supported ||
    !('supports' in window.ClipboardItem) ||
    !window.ClipboardItem.supports('text/html')
  ) {
    return false;
  }
  return true;
}

/**
 *
 * @param {imageTypes} type
 * @returns {boolean}
 */
const imageSupport = (type) => {
  if (
    !('supports' in window.ClipboardItem) ||
    !window.ClipboardItem.supports(type)
  ) {
    return false;
  }
  return true;
}

/**
 *
 * @param {string} text
 */
export const copyText = async (text) => {
  if (textSupport(type) || writePermission.state !== "granted") {
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error(err.name, err.message);
  }
}

/**
 *
 * @returns {string}
 */
export const pasteText = async () => {
  try {
    const text = await navigator.clipboard.readText();
    return text
  } catch (err) {
    console.error(err.name, err.message);
  }
}

/**
 *
 * @param {imageTypes} type
 * @param {Blob|Array<Blob>} blob
 */
export const copyImage = async (type, blob) => {
  if (imageSupport(type) || writePermission.state !== "granted") {
    return;
  }
  try {
    let clipboardItem;
    if (Array.isArray(blob)) {
      const blobs = Object.fromEntries(blob.map((b) => [[b.type], b]));
      clipboardItem = new window.ClipboardItem(blobs);
    } else {
      clipboardItem = new window.ClipboardItem({[blob.type]: blob});
    }
    await navigator.clipboard.write([clipboardItem]);
  } catch (err) {
    console.error(err.name, err.message);
  }
}

/**
 *
 * @param {imageTypes} type
 * @returns
 */
export const pasteImage = async (type) => {
  if (imageSupport(type) || readPermission.state !== "granted") {
    return;
  }
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const itemType of clipboardItem.types) {
        if (itemType !== type) {
          continue;
        }
        const blob = await clipboardItem.getType(itemType);
        if (!blob) {
          console.error('No image in the clipboard.');
        }
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}
