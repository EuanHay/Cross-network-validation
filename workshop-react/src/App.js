import React from 'react'
import logo from './logo.svg';
import './App.css';

const ethers = require('ethers')

const contractArtifact = require('./build/contracts/CaptureTheFlag.json')
console.log(contractArtifact)
const contractAddress = contractArtifact.networks[window.ethereum.networkVersion].address
const contractAbi = contractArtifact.abi

let provider
let network

async function identifyNetwork () {
  provider = new ethers.providers.Web3Provider(window.ethereum)
  network = await provider.ready
  return network
}


function App() {
  return (
    <div className="App">
      <head>
        <title>GSNv2 Test</title>
      </head>
      <button onClick={identifyNetwork()}>Identify Network</button>
    </div>
  );
}

export default App;
