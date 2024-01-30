import { useState} from 'react';
import './Wallet.css';
import walletIcon from './images/blockchain-icon.png';
import copy from './images/copy.png';

function Wallet(props) {
  let [open, setOpen] = useState(false)

  function copyToClipboard(text) {
    return function(){
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className='wallet'>
      <WalletDetails open={open} account={props.account} chainName={props.chainName} chainId={props.chainId} copyToClipboard={copyToClipboard} />
      <WalletButton open={open} toggleWallet={()=>{setOpen(!open)}} />
    </div>
  )
}

function WalletDetails(props){
  let customClass = `wallet-details ${props.open ? 'wallet-open' : ''}`
  return (
    <div className={customClass}>
      <h3>Public Address</h3>
      <p title={props.account} className="wallet-account"><img src={copy} alt="Copy Address" onClick={props.copyToClipboard(props.account)} className="copy-action"/>{props.account}</p>
      <h3>Chain Name</h3>
      <p title={props.chainName}>{props.chainName}</p>
      <h3>Chain ID</h3>
      <p title={props.chainId}>{props.chainId}</p>
    </div>
  )
}

function WalletButton(props){
  let customClass = `wallet-button ${props.open ? 'wallet-open' : ''}`
  return (
    <img src={walletIcon} alt="Wallet" onClick={props.toggleWallet} draggable={false} className={customClass} />
  )
}

export default Wallet;

