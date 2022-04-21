import React, { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import exportImages from './exportImages';
import { stageOptions } from './Modal';

const CaptureMode = (pr: {
  setStage: (a: stageOptions) => void;
  setModalVisible: (a: boolean) => void;
}) => {
  const imgElement = useRef<HTMLImageElement>(null);
  const [latestImage, setNewImage] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState<number>(0);
  const [mode, setMode] = useState<'running' | 'export'>('running');

  useEffect(() => {
    document.addEventListener('click', click);

    chrome.storage.local.get(['latestImage', 'imageCount'], function (res) {
      if (res.latestImage) {
        setNewImage(res.latestImage);
      }
      if (res.imageCount) {
        setImageCount(res.imageCount);
      }
    });

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
    setTimeout(() => {
      chrome.storage.local.set({
        takeImage: Date.now(),
      });
    }, 0);
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
            chrome.storage.local.set({
              exportNow: Date.now(),
            });
          }}
        >
          Export
        </button>
      )}
    </>
  );
};

export default CaptureMode;
