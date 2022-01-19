import React, { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';

const CaptureMode = (pr: { mediaStream: MediaStream }) => {
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

  const addNewImage = (img: string) => {
    allImages.current.add(img);
    setNewImage(img);
    setImageCount(allImages.current.size);
  };

  const click = async (e: MouseEvent) => {
    const targetElement = e.target;
    if (!targetElement) return;
    const target: Element = targetElement as Element;
    if (target.closest('.frizbee-02234')) return;
    console.log(allImages);
    if (videoElement.current && canvasElement.current) {
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
    }
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
      {mode === 'running' && <button className="block-button red">Stop</button>}
      {mode === 'export' && (
        <button className="block-button grey">Export</button>
      )}
      <canvas className="hidden" ref={canvasElement} />
      <video className="hidden" ref={videoElement} />
    </>
  );
};

export default CaptureMode;
