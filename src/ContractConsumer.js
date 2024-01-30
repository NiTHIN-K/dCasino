import './App.css';
import { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components';
import { ethers, BigNumber } from "ethers";
import { ToastContext } from './App';
function ContractConsumer() {

  let [provider, setProvider] = useState(null)
  let [contract, setContract] = useState(null)
  let [bidAmount, setBidAmount] = useState(0);
  let [contractBalance, setContractBalance] = useState(0);

  let setToast = useContext(ToastContext)


  function handleAddressClicked(winner){
    setToast({
      text: "Winner " + winner.substr(0,7) + "..." + winner.substr(-4) + "!",
      type: "success",
      time: 2,
      img: '🗒️'
    })
  }


  async function getContractBalance(){
    let balance = await provider.getBalance(contract.address)
    setContractBalance(ethers.utils.formatEther(balance.toString()))
  }

  useEffect(() => {
    // connect to a contract with an address and ABI
    const contractAddress = "0xd273dc79A9801dC24CEdE1f2c41a45CAb8314e65";
    const abi = [
      {
        "inputs": [],
        "name": "acceptOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint64",
            "name": "subscriptionId",
            "type": "uint64"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "have",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "want",
            "type": "address"
          }
        ],
        "name": "OnlyCoordinatorCanFulfill",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferRequested",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "requestId",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "randomWords",
            "type": "uint256[]"
          }
        ],
        "name": "rawFulfillRandomWords",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "requestId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256[]",
            "name": "randomWords",
            "type": "uint256[]"
          }
        ],
        "name": "RequestFulfilled",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "requestId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint32",
            "name": "numWords",
            "type": "uint32"
          }
        ],
        "name": "RequestSent",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "spin",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getLastRandomNumber",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_requestId",
            "type": "uint256"
          }
        ],
        "name": "getRequestStatus",
        "outputs": [
          {
            "internalType": "bool",
            "name": "fulfilled",
            "type": "bool"
          },
          {
            "internalType": "uint256[]",
            "name": "randomWords",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "lastRequestId",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "requestIds",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "s_requests",
        "outputs": [
          {
            "internalType": "bool",
            "name": "fulfilled",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "winnerHistory",
        "outputs": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider)
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("Contract loaded!")
    console.log(contract)
    setContract(contract)
    contract.on("RequestFulfilled", (requestId, randomWords)=>{
      console.log("RequestFulfilled", requestId, randomWords)
    })
  }, [])

  return (
    <>
      <FullSizeDiv>
       { !contract ? <h1>Loading contract...</h1> :
        <>
          <h1>Contract Interactions</h1>
          <NumberInput type="number" value={bidAmount} onChange={e=>setBidAmount(e.target.value)} />
          <button onClick={() => {
            contract.spin({value: ethers.utils.parseEther(bidAmount.toString())})
            .then((tx) => {
              console.log(tx)
              return tx.wait()
            })
            .then((receipt) => {
              console.log(receipt)
            })
          }}>Bid</button>
          <button onClick={() => {
            contract.winnerHistory(2)
            .then((tx) => {
              handleAddressClicked(tx.recipient)
              console.log("Winner: ", tx.recipient)
              console.log("Amount: ", ethers.utils.formatEther(tx.amount.toString()))
            })
          }}>Get Last Winner</button>
          <button onClick={getContractBalance}>Get Contract Balance</button>
          <p>Balance: {contractBalance}</p>
        </>}
      </FullSizeDiv>
    </>
  );
}

const NumberInput = styled.input`
  width: 100px;
  color: black;
`

const FullSizeDiv = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 40px;

  & > h1{
    margin: 12px 0;
  }

  & > p{
    margin: 6px 0;
  }

  & > button{
    width: 100px;
    height: 40px;
    margin: 10px 0;
    background: #b8403f;
    color: white;
    font-weight: bold;
    outline: none;
    border: none;
    cursor: pointer;
  }
`

export default ContractConsumer;

