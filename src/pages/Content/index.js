import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { printLine } from './modules/print';

console.log('Content script works!!!!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

let stream = null;
let clickEvent = null;
let numberCounter = 1;
let zip = null;

const getStream = async () => {
  if (stream === null) {
    stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  }
};

const capture = async () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const video = document.createElement('video');

  try {
    if (zip === null) {
      zip = new JSZip();
    }

    video.srcObject = stream;
    let track = stream.getVideoTracks()[0];
    let imageCapture = new ImageCapture(track);

    let imageBitmap = await imageCapture.grabFrame();

    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    context.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);

    const dataURL = canvas.toDataURL('image/png');

    const data = atob(dataURL.substring('data:image/png;base64,'.length));
    const dataAsArray = new Uint8Array(data.length);

    for (var i = 0, len = data.length; i < len; ++i) {
      dataAsArray[i] = data.charCodeAt(i);
    }

    var blob = new Blob([dataAsArray.buffer], { type: 'image/png' });

    const filename = 'screenshot' + numberCounter++ + '.png';
    console.log(filename);

    zip.file(filename, blob);

    // const link = document.createElement('a');
    // link.download = 'screenshot1.png';
    // link.href = frame;
    // link.setAttribute('target', '_blank');
    // link.click();
    // link.remove();

    // window.location.href = frame;
  } catch (err) {
    console.error('Error: ' + err);
  }
};

const stopStream = () => {
  if (stream !== null) stream.getTracks().forEach((track) => track.stop());
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.message === 'start_recording') {
    sendResponse('ok');
    clickEvent = document.addEventListener('click', capture);
    numberCounter = 1;
    zip = null;
    getStream();
    // capture();
  }

  if (request.message === 'stop_recording') {
    sendResponse('ok');
    stopStream();
    document.removeEventListener('click', capture);
    if (zip) {
      zip.generateAsync({ type: 'blob' }).then(function (blob) {
        FileSaver.saveAs(blob, 'export.zip');
      });
    }
  }
});
