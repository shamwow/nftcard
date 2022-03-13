import React from 'react';
import ReactDOM from 'react-dom';
import { MetaMaskProvider } from "metamask-react";
import { MoralisProvider } from "react-moralis";


import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { ContextProvider } from './Context.tsx';
import Moralis from 'moralis';

Moralis.start({serverUrl: "https://tdpb1emkxvis.usemoralis.com:2053/server", appId: "qWqVHy0C9NK1xeIVjHnavNhshlhjjurrppEuLN2O"});

ReactDOM.render(
    <MoralisProvider serverUrl="https://tdpb1emkxvis.usemoralis.com:2053/server" appId="qWqVHy0C9NK1xeIVjHnavNhshlhjjurrppEuLN2O">
      <ContextProvider>
        <MetaMaskProvider>
          <App />
        </MetaMaskProvider>
      </ContextProvider>
    </MoralisProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
