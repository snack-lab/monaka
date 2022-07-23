const userAgentCheck = (ua, userEntries) => {
  let uaValue  = "Unknown";
  for (let u of userEntries) {
    if (ua.indexOf(u.key) !== -1) {
      uaValue = u.value;
      break;
    }
  }
  return uaValue;
}

const userAgentDataBrowserCheck = (targetBrand, brands) => {
  let _browser = "Unknown";
  for (let b of brands) {
    if (targetBrand.includes(b.brand)) {
      _browser = b.brand;
      break;
    }
  }
  return _browser;
}

const ua = () => {
  const uaPlatforms = [
    { key: "windows nt 6.3", value: "Windows 8.1" },
    { key: "windows nt 10", value:  "Windows 10" },
    { key: "windows nt 11", value:  "Windows 11" },
    { key: "mac os x", value:  "Mac OS X" },
    { key: "android", value:  "Android" },
    { key: "linux", value: " Linux" },
    { key: "cros", value:  "Chrome OS" },
    { key: "iphone", value:  "iPhone" },
    { key: "ipad", value: "iPad" },
  ];

  const uaBrands = [
    { key: "edge", value: "Microsoft Edge (Legacy)" },
    { key: "edg", value: "Microsoft Edge (Chromium)" },
    { key: "trident", value: "Internet Explorer" },
    { key: "chrome", value: "Google Chrome" },
    { key: "firefox", value: "Firefox" },
    { key: "safari", value: "Safari" },
  ];

  const ua = navigator.userAgent.toLowerCase();
  const os = userAgentCheck(ua, uaPlatforms);
  const browser = userAgentCheck(ua, uaBrands);

  return { os: os, browser: browser }
}

const uad = async () => {
  const uadBrands = ["Google Chrome", "Microsoft Edge"];
  const uaData = navigator.userAgentData;
  const highEntropyValues = await uaData.getHighEntropyValues(["brands","platform"]);
  const os = highEntropyValues.platform;
  const browser = userAgentDataBrowserCheck(uadBrands, highEntropyValues.brands);

  return { os: os, browser: browser }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (navigator.userAgentData) {
    console.debug(await uad());
  } else {
    console.debug(await ua());
  }
});


