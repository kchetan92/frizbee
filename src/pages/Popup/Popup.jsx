import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const startRecording = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: 'start_recording' },
        function (response) {
          console.log(response);
        }
      );
    });
  };

  const stopRecording = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: 'stop_recording' },
        function (response) {
          console.log(response);
        }
      );
    });
  };

  const showModal = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: 'show_modal' },
        function (response) {
          console.log(response);
        }
      );
    });
  };

  return (
    <div className="App">
      <button
        onClick={() => {
          startRecording();
        }}
      >
        Start Recording
      </button>
      <button
        onClick={() => {
          stopRecording();
        }}
      >
        Stop Recording
      </button>
      <button
        onClick={() => {
          showModal();
        }}
      >
        Show Modal
      </button>
    </div>
  );
};

export default Popup;
