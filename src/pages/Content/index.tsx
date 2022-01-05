import React from 'react';
import { render } from 'react-dom';

import ModalComponent from './components/Modal';

const Modal = () => {
  return <ModalComponent />;
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'show_modal') {
    console.log('show modal');
    const shadow = getShadow();
    if (shadow.shadowRoot) {
      const container = shadow.shadowRoot.getElementById('container');
      if (container) {
        render(<Modal />, container);
      }
    }
  }
});

const getShadow = (() => {
  let shadowContainer: HTMLDivElement | null = null;

  const maker = () => {
    if (!shadowContainer) {
      const container: HTMLDivElement = document.createElement('div');
      document.body.appendChild(container);
      container.attachShadow({ mode: 'open' });
      if (container.shadowRoot)
        container.shadowRoot.innerHTML =
          css + `<div id="container" class="parent-selector"></div>`;
      shadowContainer = container;
    }
    return shadowContainer;
  };

  return maker;
})();

const css = `<style>
:root {
  --grey8: #1f1f1f;
  --white: #fff;
}

.parent-selector {
  all: initial
}

 .modal-container {
  width: 152px;
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 300;
  background-color: #1f1f1f;
  color: #fff;
}

 .modal-container.expanded {
  width: 300px;
}

 .top-navbar {
  padding: 12px;
  display: flex;
  justify-content: space-between;
}

.top-navbar button {
  background: none;
  border: none;
}

.top-navbar button img {
  width: 24px;
  height: 24px;
}

 .modal {
  height: 300px;
  width: 200px;
  position: fixed;
  top: 10px;
  right: 10px;
  background: pink;
  z-index: 300;
}

 .modal img {
  width: 100%;
  height: auto;
}

 .modal.hide {
  opacity: 0;
}

.logo-container {
  text-align: center;
  padding: 12px 0;
}

.logo-container img{
  width: 24px;
}

.block-button {
  width:100%;
  font-weight:bold;
  padding: 12px 0;
  text-align:center;
  border:none;
  cursor:pointer;
}

.block-button.white {
  background: #FFF;
  color: #1f1f1f;
}

.block-button.red {
  background: #D12610;
  color: #fff;
}
</style>`;
