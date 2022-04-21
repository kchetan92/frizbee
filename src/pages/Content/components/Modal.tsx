import React, { useState, useRef, useEffect } from 'react';
import CaptureMode from './CaptureMode';
import makeDraggable from './makeDraggable';

const Modal = (pr: {
  mediaStreamAvailable?: boolean;
  stage?: stageOptions;
}) => {
  const [expand, setExpanded] = useState<boolean>(false);
  const [stage, setStage] = useState<stageOptions>(pr.stage ?? 'initial');
  const moveButton = useRef<HTMLButtonElement | null>(null);
  const modalBody = useRef<HTMLDivElement | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaStreamAvailable = useRef<boolean>(
    pr.mediaStreamAvailable ?? false
  );
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  useEffect(() => {
    if (moveButton?.current && modalBody?.current) {
      makeDraggable(modalBody.current, moveButton.current);
    }
  }, [moveButton, modalBody]);

  useEffect(() => {
    chrome.storage.local.set({
      stage,
    });
  }, [stage]);

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.mediaStreamAvailable && changes.mediaStreamAvailable.newValue) {
      mediaStreamAvailable.current = changes.mediaStreamAvailable.newValue;
    }
    if (changes.stage && changes.stage.newValue !== stage) {
      setStage(changes.stage.newValue);
    }
    if (changes.showModal) {
      debugger;
      setModalVisible(true);
    }
  });

  const startCapture = async () => {
    if (mediaStreamAvailable?.current) {
      setStage('capturing');
    }
    // else {
    //   setStage('loading');
    //   const mediaObj = await getStream(mediaStream);
    //   console.log(mediaObj);
    //   if (mediaStream.current) {
    //     setStage('capturing');
    //     chrome.storage.local.set({
    //       mediaStreamAvailable: true,
    //     });
    //   }

    // }
    else {
      setStage('error');
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

  const Exporting = (
    <div className="exporting-screen">
      <img src={chrome.runtime.getURL('/assets/img/barber_pole.png')} />
    </div>
  );

  return (
    <div
      className={
        'modal-container ' +
        (expand ? 'expanded ' : '') +
        (modalVisible ? '' : 'hide ')
      }
      ref={modalBody}
    >
      <NavBar expanded={expand} setExpanded={setExpanded} ref={moveButton} />

      {stage === 'initial' && InitialStage}
      {stage === 'loading' && <Loading />}
      {stage === 'capturing' && mediaStreamAvailable.current && (
        <CaptureMode setStage={setStage} setModalVisible={setModalVisible} />
      )}
      {stage === 'exporting' && Exporting}
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
        <button
          onClick={() => {
            debugger;
            chrome.storage.local.set({ modalView: 'close' }, () => {});
          }}
        >
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
  return stream.current;
};

export type stageOptions =
  | 'initial'
  | 'loading'
  | 'capturing'
  | 'error'
  | 'exported'
  | 'exporting';

export default Modal;
