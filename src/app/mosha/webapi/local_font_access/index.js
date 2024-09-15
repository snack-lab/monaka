if ('queryLocalFonts' in window) {
  async function fontFullData() {
    try {
      const status = await navigator.permissions.query({ name: "local-fonts" });
      if (status.state === "denied") {
        alert('Permission denied');
        return;
      }

      if (status.state === "prompt" || status.state === "granted") {
        // const options = { postscriptNames: ["Verdana", "Verdana-Bold", "Verdana-Italic"] }
        // const localFonts = await window.queryLocalFonts(options);
        const localFonts = await window.queryLocalFonts();

        const ul = document.querySelector('#fonts');
        const fragment = document.createDocumentFragment();
        for (const font of localFonts) {
          const fontList = document.createElement('div');

          const props = {
            "PostScript name": font.postscriptName,
            "full name": font.fullName,
            "family": font.family,
            "style": font.style
          }

          for (const [key, value] of Object.entries(props)) {
            const fontDetail = document.createElement('div');
            const k = fontDetail.cloneNode();
            const v = fontDetail.cloneNode();
            k.textContent = key;
            v.textContent = value;

            fontList.appendChild(k);
            fontList.appendChild(v);
          }

          fragment.appendChild(fontList);
        }
        ul.appendChild(fragment);
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  }

  const btn = document.querySelector('#show');
  btn.onclick = async () => await fontFullData();
}
