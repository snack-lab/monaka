window.addEventListener('load', (e) => {
  const videoFile = document.getElementById('videoUpload');
  videoFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const blob = URL.createObjectURL(file);

    const video = document.querySelector("video");
    video.src = blob;
  })
})