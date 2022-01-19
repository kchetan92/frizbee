import React, { useState, useRef, useEffect } from 'react';
import CaptureMode from './CaptureMode';
import makeDraggable from './makeDraggable';

const Modal = () => {
  const [expand, setExpanded] = useState<boolean>(false);
  const [stage, setStage] = useState<stageOptions>('initial');
  const moveButton = useRef<HTMLButtonElement | null>(null);
  const modalBody = useRef<HTMLDivElement | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const lastImage = useState<any>(null);

  useEffect(() => {
    if (moveButton?.current && modalBody?.current) {
      makeDraggable(modalBody.current, moveButton.current);
    }
  }, [moveButton, modalBody]);

  const startCapture = async () => {
    if (mediaStream?.current) {
      setStage('capturing');
    } else {
      setStage('loading');
      await getStream(mediaStream);
      if (mediaStream.current) {
        setStage('capturing');
      } else {
        setStage('error');
      }
    }
  };

  const InitialStage = (
    <>
      <Logo />
      <button className="block-button white" onClick={() => startCapture()}>
        Image Capture
      </button>
    </>
  );

  return (
    <div
      className={'modal-container ' + (expand ? 'expanded' : '')}
      ref={modalBody}
    >
      <NavBar expanded={expand} setExpanded={setExpanded} ref={moveButton} />

      {stage === 'initial' && InitialStage}
      {stage === 'loading' && <Loading />}
      {stage === 'capturing' && mediaStream?.current && (
        <CaptureMode mediaStream={mediaStream?.current} />
      )}
      {stage === 'error' && <Error />}
    </div>
  );
};

const NavBar = React.forwardRef(
  (
    pr: {
      expanded: boolean;
      setExpanded: (a: boolean) => void;
    },
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <div className="top-navbar">
        {pr.expanded ? (
          <button
            onClick={() => {
              pr.setExpanded(!pr.expanded);
            }}
          >
            <img src={chrome.runtime.getURL('/assets/img/Icon/Expand.png')} />
          </button>
        ) : (
          <button
            ref={ref}
            onClick={() => {
              pr.setExpanded(!pr.expanded);
            }}
          >
            <img
              src={chrome.runtime.getURL('/assets/img/Icons/Contract.png')}
            />
          </button>
        )}
        <button ref={ref} className="drag-button">
          <img src={chrome.runtime.getURL('/assets/img/Icons/Move.png')} />
        </button>
        <button>
          <img src={chrome.runtime.getURL('/assets/img/Icons/Settings.png')} />
        </button>
      </div>
    );
  }
);

const Logo = () => (
  <div className="logo-container">
    <img src={chrome.runtime.getURL('icon-128.png')} />
  </div>
);

const Loading = () => (
  <>
    <Logo />
    <button className="block-button grey">Loading</button>
  </>
);

const Error = () => (
  <>
    <Logo />
    <button className="block-button grey">Error</button>
  </>
);

const getStream = async (
  stream: React.MutableRefObject<MediaStream | null>
) => {
  stream.current = await navigator.mediaDevices
    .getDisplayMedia({
      video: true,
    })
    .catch((err) => null);
};

type stageOptions = 'initial' | 'loading' | 'capturing' | 'error';

export default Modal;
