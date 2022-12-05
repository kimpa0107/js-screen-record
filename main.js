const Record = (() => {
  let recoder = null;

  const start = () => {
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: true,
      })
      .then(stream => {
        recoder = new MediaRecorder(stream);

        const data = [];
        recoder.ondataavailable = function (e) {
          data.push(e.data);
        };
        recoder.onstop = function () {
          this.stream.getTracks().forEach(track => track.stop());

          const blob = new Blob(data, { type: this.mimeType });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = new Date().getTime() + '.webm';
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(link.href);
          link.remove();
        };
        recoder.start();
      });
  };

  const stop = () => {
    recoder && recoder.stop();
  };

  const addEventListener = () => {
    document.querySelector('.start-record').addEventListener('click', start);
    document.querySelector('.stop-record').addEventListener('click', stop);
  };

  return { addEventListener };
})();

Record.addEventListener();