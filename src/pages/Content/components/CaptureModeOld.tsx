import React, { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import exportImages from './exportImages';
import { stageOptions } from './Modal';

const CaptureMode = (pr: {
  mediaStream?: MediaStream;
  setStage: (a: stageOptions) => void;
  setModalVisible: (a: boolean) => void;
}) => {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const videoElement = useRef<HTMLVideoElement>(null);
  const zipObject = useRef<any>(null);
  const imgElement = useRef<HTMLImageElement>(null);
  const [latestImage, setNewImage] = useState<string | null>(null);
  const allImages = useRef<Set<string>>(new Set());
  const [imageCount, setImageCount] = useState<number>(0);
  const [mode, setMode] = useState<'running' | 'export'>('running');

  useEffect(() => {
    console.log('added');
    zipObject.current = new JSZip();
    document.addEventListener('click', click);

    return () => {
      document.removeEventListener('click', click);
    };
  }, []);

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.latestImage && changes.latestImage.newValue !== latestImage) {
      setNewImage(changes.latestImage.newValue);
      pr.setModalVisible(true);
    }

    if (pr.mediaStream && changes.takeImage) {
      click();
    }

    if (
      pr.mediaStream &&
      changes.exportNow &&
      changes.exportNow.newValue &&
      changes.exportNow.newValue !== changes.exportNow.oldValue
    ) {
      exportImages(allImages.current)
        .then((e) => {
          pr.setStage('initial');
          allImages.current.clear();
        })
        .catch((e) => pr.setStage('error'));
    }

    if (changes.imageCount && changes.imageCount.newValue) {
      setImageCount(changes.imageCount.newValue);
    }
  });

  const addNewImage = (img: string) => {
    allImages.current.add(img);
    setNewImage(img);
    setImageCount(allImages.current.size);
    chrome.storage.local.set({
      latestImage: img,
      imageCount: allImages.current.size,
    });

    chrome.runtime.sendMessage({ message: 'add_picture', data: img });
  };

  const click = (e?: MouseEvent) => {
    debugger;
    if (!pr.mediaStream) {
      pr.setModalVisible(false);
      chrome.storage.local.set({
        takeImage: Date.now(),
      });
      return;
    }

    if (e) {
      const targetElement = e.target;
      if (!targetElement) return;
      const target: Element = targetElement as Element;
      if (target.closest('.frizbee-02234')) return;
    }

    pr.setModalVisible(false);
    setTimeout(async () => {
      if (videoElement.current && canvasElement.current && pr.mediaStream) {
        videoElement.current.srcObject = pr.mediaStream;
        let track = pr.mediaStream.getVideoTracks()[0];
        let imageCapture = new ImageCapture(track);
        let imageBitmap = await imageCapture.grabFrame();

        canvasElement.current.width = imageBitmap.width;
        canvasElement.current.height = imageBitmap.height;
        const context = canvasElement.current.getContext('2d');
        if (context) {
          context.drawImage(
            imageBitmap,
            0,
            0,
            imageBitmap.width,
            imageBitmap.height
          );

          const dataURL = canvasElement.current.toDataURL('image/png');
          addNewImage(dataURL);
        }
        pr.setModalVisible(true);
      }
    }, 100);
  };

  useEffect(() => {
    if (latestImage && imgElement.current) {
      imgElement.current.setAttribute('src', latestImage);
    }
  }, [latestImage]);

  return (
    <>
      <div className={'image-preview ' + (latestImage === null ? 'empty' : '')}>
        <p className="none-img">None</p>
        <img ref={imgElement} className="preview-img" />
      </div>
      <p className="image-count">{imageCount} Image</p>
      {mode === 'running' && (
        <button className="block-button red" onClick={() => setMode('export')}>
          Stop
        </button>
      )}
      {mode === 'export' && (
        <button
          className="block-button grey"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            pr.setStage('exporting');
            if (pr.mediaStream && allImages.current.size > 0) {
              exportImages(allImages.current)
                .then((e) => pr.setStage('initial'))
                .catch((e) => pr.setStage('error'));
            } else {
              chrome.storage.local.set({
                exportNow: Date.now(),
              });
            }
          }}
        >
          Export
        </button>
      )}
      <canvas className="hidden" ref={canvasElement} />
      <video className="hidden" ref={videoElement} />
    </>
  );
};

export default CaptureMode;
