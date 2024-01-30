import './App.css';
import React, { useEffect, useState} from 'react';
// import { ethers } from "ethers";
import Wallet from './Wallet';

import Toast from './Toast';
import Casino from './Casino'

import disconnectIcon from './images/disconnected.png'
import metamaskLogo from './images/metamask.svg'
import ContractConsumer from './ContractConsumer';
export const ToastContext = React.createContext(null);

function App() {

  let [nextChainId, setNextChainId] = useState(0)

  let [page, setPage] = useState('main')

  let [loggedIn, setLoggedIn] = useState(null)
  let [account, setAccount] = useState(null)
  let [chainId, setChainId] = useState(0)
  let [chainName, setChainName] = useState('')

  let [chainData, setChainData] = useState(null)

  let [toastConfig, setToastConfig] = useState({
    type: null,
    text: null,
    img: null,
    time: null
  })

  

  useEffect(() => {
    if (!window.ethereum) {
      setPage('no_ethereum')
      return;
    }

    const handleChainChanged = (id) => {
      setChainId(parseInt(id, 16))
      setToastConfig({
        time: 3,
        type: 'notice',
        text: "Switched to another chain.",
        img: '⛓️'
      })
    }

    const handleAccountChanged = (accounts) => {
      if (accounts.length) {
        setAccount(accounts[0]);
        setToastConfig({
          time: 3,
          type: 'success',
          text: "Your wallet has been connected.",
          img: '⚡'
        })
      } else {
        setAccount('0x0');
        setToastConfig({
          time: 3,
          type: 'warning',
          text: "Your wallet has been disconnected.",
          img: disconnectIcon
        })
      }
    }

    const handleConnect = async (chainIdObj) => {
      // This only runs once in the user's lifetime
    }

    const clearAccount = () => {
      setAccount('0x0');
    };

    const handleStartup = async () => {
      window.ethereum.request({ method: 'eth_accounts' }).then(async accounts => {
        console.log("Success, looking for accounts: ", accounts)
        if (accounts[0]) {
          setAccount(accounts[0])
        }else{
          setAccount('0x0')
        }
      }).catch(err => {
        console.log("An error occurred while connecting: ", err)
      })

      window.ethereum.request({ method: 'eth_chainId' }).then(id => {
        console.log("Fetching chain id: ", id)
        setChainId(parseInt(id, 16))
      }).catch(err => {
        console.log("An error occurred while looking for chain ID: ", err)
      }) 

      if(!chainData){
        let localChainData = localStorage.getItem("blockchain_data_list");
        if(localChainData){
          setChainData(JSON.parse(localChainData))
        }else{
          let newChainData = await fetchChainData()
          setChainData(newChainData)
          localStorage.setItem("blockchain_data_list", JSON.stringify(newChainData))
        }
        
      }
    }

    handleStartup()

    window.ethereum.on('accountsChanged', handleAccountChanged);
    window.ethereum.on('connect', handleConnect);
    window.ethereum.on('disconnect', clearAccount);
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      // Return function of a non-async useEffect will clean up on component leaving screen, or from re-render to due dependency change
      window.ethereum.off('accountsChanged', handleAccountChanged);
      window.ethereum.off('connect', handleConnect);
      window.ethereum.off('disconnect', clearAccount);
      window.ethereum.off('chainChanged', handleChainChanged)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log("Account state has been updated: ", account)
    if(account !== null){
      setLoggedIn(account !== '0x0')
    }
  }, [account])

  useEffect(() => {
    updateChainName() // Need to define and invoke this function seperately because useEffect cannot take an async callback
                      // Also seperated this logic because it is reused in the chainData useEffect
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])

  useEffect(()=>{
    if(chainData){
      console.log("Length: ", JSON.stringify(chainData).length)
      if(nextChainId){
        updateChainName()
        setNextChainId(0)
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainData])

  // Helper functions

  const updateChainName = async () => {
    if(!chainData){
      setNextChainId(chainId)
      return;
    }
    console.log("Chain data ", chainData)
    let obj = chainData.find((item) => item.chainId === chainId)
    if (!obj) {
      setChainName('')
    }else{
      setChainName(obj.title ? obj.title : obj.name)
    }
  }


  async function fetchChainData() {
    return await fetch('https://chainid.network/chains.json').then(res => res.json())
  }

  const requestCredentials = async () => {
    try {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if(accounts[0]){
        setAccount(accounts[0])
        return true;
      }
    } catch (err) {
      console.log("An error occurred while requesting credentials: ", err)
    }
    return false
  }


  // Wallet functions



  // const NITH_KEY = "0x7Be15B3F2FAcEe083788CBDF1d9E1cFbAA6c75c"

  // async function getBalance(key) {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   let balance = await provider.getBalance(NITH_KEY)
  //   return balance;
  // }

  // async function sendMoney(recipient, amount) {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   const signer = provider.getSigner()

  //   const tx = {
  //     to: recipient,
  //     value: ethers.utils.parseEther(amount.toString())
  //   }

  //   signer.sendTransaction(tx).then(res => {
  //     console.log(res)
  //     console.log(res.hash)
  //   })
  // }

  return (
    <div id="app">
      {
        page === 'no_ethereum' ?
          <NoEthereum /> :
          <ToastContext.Provider value={setToastConfig}>
            {
              loggedIn === null ?
                <></> :
                (
                  loggedIn ?
                    <>
                      <ContractConsumer />
                      <Casino account={account} myAddress={account}/>
                      <Wallet account={account} chainName={chainName} chainId={chainId} />
                    </> :
                    <>
                      <ConnectWalletButton requestCredentials={requestCredentials} />
                    </>
                )
            }
            <Toast config={toastConfig} />
          </ToastContext.Provider>
      }
    </div>
  );
}

function NoEthereum() {
  return (
    <div className='no-ethereum'>
      <p >No ethereum provider detected</p>
      <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Get MetaMask</a>
    </div>
  )
}

function ConnectWalletButton(props) {
  let [connecting, setConnecting] = useState(false)

  const handleRequestCredentials = async () => {
    setConnecting(true)
    let credentialsAuthenticated = await props.requestCredentials()
    if(!credentialsAuthenticated){
      setConnecting(false)
    }
  }

  let customClass = `request-credentials-button ${connecting ? 'connecting' : ''}`

  return (
    <div className={customClass} onClick={handleRequestCredentials}>
      <img src={metamaskLogo} alt="MetaMask" />
      {
        connecting === true ?
          <div className="spinner" /> :
          <div>Connect Wallet</div>
      }
    </div>
  )

}

export default App;

