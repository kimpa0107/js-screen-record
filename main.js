const Record = (() => {
  const ACTION_READY = 0;
  const ACTION_RECORDING = 1;
  const ACTION_FINISHED = 2;

  let recoder = null;

  const btnStart = document.querySelector('.start-record');
  const btnStop = document.querySelector('.stop-record');
  const btnDownload = document.querySelector('.download-record');
  const statusDOM = document.querySelector('.status');

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
          btnDownload.href = URL.createObjectURL(blob);
          btnDownload.download = new Date().getTime() + '.webm';
        };

        recoder.start();

        doAction(ACTION_RECORDING);
      });
  };

  const stop = () => {
    recoder && recoder.stop();
    doAction(ACTION_FINISHED);
  };

  const setStatusText = (dom, text) => {
    dom.innerHTML = text;
  };

  const clearDownloadDOM = () => {
    URL.revokeObjectURL(btnDownload.href);
  };

  const download = () => {
    setTimeout(() => {
      doAction(ACTION_READY);
    }, 1000);
  };

  const showHideFactory = action => {
    let display = '';

    return (dom, isFlex = false) => {
      switch (action) {
        case 'show':
          display = isFlex ? 'flex' : 'block';
          break;

        case 'hide':
          display = 'none';
          break;
      }

      dom.style.display = display;
    };
  };

  const showDOM = showHideFactory('show');
  const hideDOM = showHideFactory('hide');

  const doAction = status => {
    switch (status) {
      case ACTION_READY:
        showDOM(btnStart);
        hideDOM(btnStop);
        hideDOM(btnDownload);
        clearDownloadDOM();
        setStatusText(statusDOM, '');
        break;

      case ACTION_RECORDING:
        clearDownloadDOM();
        hideDOM(btnStart);
        showDOM(btnStop);
        hideDOM(btnDownload);
        setStatusText(statusDOM, 'RECORDING');
        break;

      case ACTION_FINISHED:
        showDOM(btnStart);
        hideDOM(btnStop);
        showDOM(btnDownload, true);
        setStatusText(statusDOM, 'FINISHED');
        break;
    }
  };

  const addEventListener = () => {
    btnStart.addEventListener('click', start);
    btnStop.addEventListener('click', stop);
    btnDownload.addEventListener('click', download);
  };

  return { addEventListener };
})();

Record.addEventListener();
