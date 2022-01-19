import JSZip from 'jszip';
import FileSaver from 'file-saver';

const exportImages = (imgData: Set<string>) => {
  return new Promise((resolve, reject) => {
    if (imgData.size === 0) reject();
    const padding = numberOfDigits(imgData.size);
    const zip = new JSZip();

    let imgNum = 0;
    imgData.forEach((dataURL) => {
      const data = atob(dataURL.substring('data:image/png;base64,'.length));
      const dataAsArray = new Uint8Array(data.length);
      for (var i = 0, len = data.length; i < len; ++i) {
        dataAsArray[i] = data.charCodeAt(i);
      }
      const blob = new Blob([dataAsArray.buffer], { type: 'image/png' });
      const fileNumber = (imgNum++).toString().padStart(padding, '0');
      zip.file('screenshot' + fileNumber + '.png', blob);
    });

    zip.generateAsync({ type: 'blob' }).then(function (blob) {
      FileSaver.saveAs(blob, 'frizbee-export.zip');
    });
  });
};

const numberOfDigits = (num: number) => {
  for (let i = 0; i < 10; i++) {
    if (num < 10 ** i) {
      return i;
    }
  }
  return 10;
};

export default exportImages;
