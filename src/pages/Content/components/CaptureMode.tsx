import React, { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import exportImages from './exportImages';
import { stageOptions } from './Modal';

const CaptureMode = (pr: {
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

    if (changes.imageCount && changes.imageCount.newValue) {
      setImageCount(changes.imageCount.newValue);
    }
  });

  const click = () => {
    pr.setModalVisible(false);
    chrome.storage.local.set({
      takeImage: Date.now(),
    });
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
            // if (pr.mediaStream && allImages.current.size > 0) {
            //   exportImages(allImages.current)
            //     .then((e) => pr.setStage('initial'))
            //     .catch((e) => pr.setStage('error'));
            // } else {
            //   chrome.storage.local.set({
            //     exportNow: Date.now(),
            //   });
            // }
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
