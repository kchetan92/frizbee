import React, { useEffect, useRef, useState } from 'react';
import './IndexPage.css';
import './IndexPage.scss';
import exportImages from '../Content/components/exportImages';

const IndexPage = () => {
  const mediaStream = useRef<MediaStream | null>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const videoElement = useRef<HTMLVideoElement>(null);
  const allImages = useRef<Set<string>>(new Set());
  const [latestImage, setNewImage] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState<number>(0);
  const [mediaStreamAvailable, setMediaStreamAvailable] =
    useState<boolean>(false);

  const startCapture = async () => {
    debugger;
    const mediaObj = await getStream(mediaStream);
    if (mediaObj) {
      mediaStream.current = mediaObj;
      console.log('mediaObj saved ', mediaObj);
      chrome.storage.local.set({
        mediaStreamAvailable: true,
        stage: 'initial',
      });
      setMediaStreamAvailable(true);
    }
  };

  const capture = async (cb?: () => void) => {
    debugger;
    if (videoElement.current && canvasElement.current && mediaStream.current) {
      videoElement.current.srcObject = mediaStream.current;
      let track = mediaStream.current.getVideoTracks()[0];
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
        cb && cb();
      }
    }
  };

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

  useEffect(() => {
    chrome.storage.local.set({ modalView: 'open' }, () => {});
    allImages.current.clear();
    setNewImage(null);

    chrome.storage.local.set({
      latestImage: null,
      imageCount: 0,
      stage: 'initial',
    });

    console.log('mediaStreamAvailable, ', mediaStreamAvailable);

    chrome.storage.onChanged.addListener(function (changes, namespace) {
      if (changes.latestImage && changes.latestImage.newValue !== latestImage) {
        setNewImage(changes.latestImage.newValue);
      }

      if (changes.takeImage) {
        debugger;
        capture(() => {
          debugger;
          chrome.storage.local.set({
            showModal: Date.now(),
          });
        });
      }

      if (changes.exportNow) {
        window.alert('download available');
        exportImages(allImages.current).then(() => {
          allImages.current.clear();
          setNewImage(null);
        });
      }
    });
  }, []);

  return (
    <div className="App">
      <p>Hello! Leave this tab open while you use the application</p>
      {mediaStreamAvailable ? (
        <p>Ready to capture</p>
      ) : (
        <button onClick={startCapture}>
          Give permission to capture screen
        </button>
      )}
      <canvas className="hidden" ref={canvasElement} />
      <video className="hidden" ref={videoElement} />
    </div>
  );
};

const getStream = async (
  stream: React.MutableRefObject<MediaStream | null>
) => {
  console.log('gett stream');
  stream.current =
    (await navigator.mediaDevices
      .getDisplayMedia({
        video: true,
      })
      .catch((err) => {
        console.log(err);
      })) || null;
  console.log(stream.current);
  return stream.current;
};

export default IndexPage;
