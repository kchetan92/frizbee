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
      container.setAttribute('style', 'all:initial');
      container.classList.add('frizbee-02234');
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

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

.parent-selector {
  all: initial;
  font-family: 'Inter', sans-serif;
}

 .modal-container {
  width: 152px;
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 300;
  background-color: #1f1f1f;
  color: #fff;
  padding-bottom: 12px;
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

.block-button.grey {
  background: #767676;
  color:#FFF
  cursor:default;
}

.drag-button {
  cursor: grab;
}

.drag-button.dragging {
  cursor: grabbing;
}

.hidden {
  display: none;
}

// .event-catcher {
//   position: fixed;
//   top: 0;
//   left: 0;
//   height: 100%;
//   width: 100%;
//   pointer-events: none;
//   background-color: white;
//   opacity: 0;
//   z-index:4000;
// }

.image-preview {
  padding: 10px;
  min-height: 80px;
  text-align:center;
  font-weight: bold;
}

.image-preview.empty p {
  display: block;
}

.image-preview.empty img {
  display: none;
}

.image-preview p {
  display: none;
}

.image-preview img {
  display: block;
}

.preview-img {
  width: 100%;
}

.none-img {
  margin: 0;
  background: grey;
  padding: 30px 0;
}

.image-count {
  text-align: center;
}

</style>`;
