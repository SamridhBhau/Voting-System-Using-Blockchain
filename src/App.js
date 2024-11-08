// src/App.js
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Voting from "./build/contracts/Voting.json";
import getCandidateInfo from "./script.js";

const App = () => {
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Connect to Web3
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      setWeb3(web3);

      // Get accounts
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      // Get contract
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Voting.networks[networkId];
      const instance = new web3.eth.Contract(
        Voting.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(instance);

      // Get candidates
      const candidateCount = await instance.methods.candidatesCount().call();
      const candidates = [];
      for (let i = 1; i <= candidateCount; i++) {
        let candidate = await instance.methods.getCandidate(i).call();
        candidates.push(candidate);
      }
      setCandidates(candidates);
      console.log(candidates);
    };

    init();
  }, []);

  const vote = async (candidateId) => {
    await contract.methods.vote(candidateId).send({ from: account });
    // Refresh candidates list
    const candidateCount = await contract.methods.candidatesCount().call();
    const candidates = [];
    for (let i = 1; i <= candidateCount; i++) {
      const candidate = await contract.methods.getCandidate(i).call();
      candidates.push(candidate);
    }
    setCandidates(candidates);
  };

  return (
    <div>
      <h1>Election 2024</h1>
      <p>Account: {account}</p>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index}>
            {candidate[0]} - {web3.utils.toNumber(candidate[1])} votes
            <button onClick={() => vote(index + 1)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
