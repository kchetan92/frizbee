import React from 'react';
import './IndexPage.css';
import './IndexPage.scss';

const IndexPage = () => {
  return <div className="App"><p>Hello</p>
    <button onClick={() => {
      chrome.identity.getAuthToken({ interactive: true }, function (token) {
        console.log(token);
      });
    }}>Login</button></div>;
};

export default IndexPage;
