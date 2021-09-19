if (navigator.userAgentData) {

  const uaData = navigator.userAgentData;
  const brands = uaData.brands.map((b) => {
    return `brand:${b.brand} version:${b.version}`;
  });
  const mobileness = uaData.mobile;
  const platform = uaData.platform;

  const ul = document.querySelector('.ua-data');
  const li = document.createElement('li');

  // brands
  const li_brands = li.cloneNode(false);
  li_brands.appendChild(document.createTextNode(brands.toString()));
  ul.appendChild(li_brands);

  // mobile
  const li_mobile = li.cloneNode(false);
  li_mobile.appendChild(document.createTextNode(mobileness === 1 ? "Mobile" : "Not Mobile"));
  ul.appendChild(li_mobile);

  // platform
  const li_platform = li.cloneNode(false);
  li_platform.appendChild(document.createTextNode(platform));
  ul.appendChild(li_platform);

  // high entropy values
  (async() => {
    const highEntropyValues = await uaData.getHighEntropyValues(
      ["platform", "platformVersion", "architecture", "bitness", "model", "uaFullVersion"]);
    // const platform = highEntropyValues.platform;
    // const platformVersion = highEntropyValues.platformVersion;
    // const architecture = highEntropyValues.architecture;
    // const bitness = highEntropyValues.bitness;
    // const model = highEntropyValues.model; // デバイスモデル
    // const uaFullVersion = highEntropyValues.uaFullVersion;

    for (const [key,value] of Object.entries(highEntropyValues)) {
      let li_entropyValues = (li.cloneNode(false));
      if (Array.isArray(value) && key === "brands") {
        const b = value.map((b) => {
          return `brand:${b.brand} version:${b.version}`;
        });
        li_entropyValues.appendChild(document.createTextNode(`High Entropy Values - ${key}: ${b}`));
      } else {
        li_entropyValues.appendChild(document.createTextNode(`High Entropy Values - ${key}: ${value}`));
      }

      ul.appendChild(li_entropyValues);
    }
  })();
}