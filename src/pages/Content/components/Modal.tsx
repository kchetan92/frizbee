import React, { useState } from 'react';

const Modal = () => {
  const [expand, setExpanded] = useState<boolean>(false);
  const [stage, setStage] = useState<stageOptions>('initial');
  return (
    <div className={'modal-container ' + (expand ? 'expanded' : '')}>
      <NavBar expanded={expand} setExpanded={setExpanded} />
      <Logo />
      {stage === 'initial' ? (
        <button
          className="block-button white"
          onClick={() => setStage('capturing')}
        >
          Image Capture
        </button>
      ) : (
        <CaptureMode />
      )}
    </div>
  );
};

const NavBar = (pr: {
  expanded: boolean;
  setExpanded: (a: boolean) => void;
}) => {
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
          onClick={() => {
            pr.setExpanded(!pr.expanded);
          }}
        >
          <img src={chrome.runtime.getURL('/assets/img/Icons/Contract.png')} />
        </button>
      )}
      <button>
        <img src={chrome.runtime.getURL('/assets/img/Icons/Move.png')} />
      </button>
      <button>
        <img src={chrome.runtime.getURL('/assets/img/Icons/Settings.png')} />
      </button>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="logo-container">
      <img src={chrome.runtime.getURL('icon-128.png')} />
    </div>
  );
};

type stageOptions = 'initial' | 'capturing';

const CaptureMode = () => {
  return <button className="block-button red">Stop</button>;
};

export default Modal;
