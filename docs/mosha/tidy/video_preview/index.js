const videoFile = document.getElementById('videoUpload');

const handleFiles = (event) => {
  console.debug(event.type, event);

  this.#root.querySelector(".preview video")?.remove();

  if (event.target.files.length <= 0) return;

  const arrayFileList = Array.from(event.target.files);
  const mimeTypes = ["video/mp4"];
  const sizeLimit = 1024 * 1024 * 1024 * 1;

  // check mimeType
  const notVideos = arrayFileList.filter(file => !mimeTypes.includes(file.type));
  if (0 < notVideos.length) {
      event.target.value = null;
      return;
  }

  // check size
  const sizeOverVideos = arrayFileList.filter(file => (file.size <= 0 || sizeLimit < file.size));
  if (0 < sizeOverVideos.length) {
      event.target.value = null;
      return;
  }

  const newVideo = document.createElement('video');
  newVideo.controls = true;
  newVideo.width = 350;

  const blob = new Blob(event.target.files, { type: mimeTypes[0] });
  if ('srcObject' in newVideo) {
      try {
          newVideo.srcObject = blob;
      } catch (err) {
          newVideo.src = URL.createObjectURL(blob);
      }
  } else {
      newVideo.src = URL.createObjectURLblob(blob);
  }

  this.#root.querySelector(".preview").appendChild(newVideo);
}

videoFile.onchange = handleFiles;
