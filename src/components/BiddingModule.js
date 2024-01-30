import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useRef, useState } from 'react';

function BiddingModule(props) {

  let [bidAmount, setBidAmount] = useState("")
  let [bidOption, setBidOption] = useState("ETH")
  let [conversionRate, setConversionRate] = useState(0)
  

  useEffect(() => {
    getEthToUSDRate();
    setInterval(getEthToUSDRate, 10000)
  }, [])

  async function getEthToUSDRate() {
    let cachedData = localStorage.getItem('eth-usd-price')
    if (cachedData) {
      setConversionRate(cachedData)
    }
    let data = await fetch('https://api.etherscan.io/api?module=stats&action=ethprice').then(res => res.json())
    if (data.status === '1') {
      let ethUSDPrice = data.result.ethusd
      localStorage.setItem('eth-usd-price', ethUSDPrice)
      setConversionRate(ethUSDPrice)
    }
  }

  let usdSelected = bidOption === 'USD'

  return (
    <BiddingView>
      <BidInput bidAmount={bidAmount} bidOption={bidOption} conversionRate={conversionRate} setBidAmount={setBidAmount} usdSelected={usdSelected} />
      <BidCurrencySelection>
        <BidAmountOptionGreen selected={bidOption == "USD"} onClick={() => { setBidOption("USD") }}>USD</BidAmountOptionGreen>
        <BidAmountOptionOrange selected={bidOption == "ETH"} onClick={() => { setBidOption("ETH") }}>ETH</BidAmountOptionOrange>
        <BidAmountOptionOrange selected={bidOption == "FINNEY"} onClick={() => { setBidOption("FINNEY") }}>FINNEY</BidAmountOptionOrange>
      </BidCurrencySelection>
      <BidButton disabled={false} onClick={() => { props.bid(bidAmount, bidOption) }}>BUY IN</BidButton>
      <AltButton disabled={false} >BREAK</AltButton>
    </BiddingView>
  )
}

function USDConversion(props) {
  let amount = props.amount * props.conversionRate
  if (props.option == 'FINNEY') {
    amount /= 1000;
  }
  return (
    <USDText option={props.option}>
      {
        props.conversionRate ? `$${amount.toFixed(2)}` : ''
      }
    </USDText>
  )
}

function BidInput({ bidAmount, bidOption, conversionRate, setBidAmount, usdSelected }) {
  return (
    <BidInputContainer>
      <USDConversion amount={bidAmount} option={bidOption} conversionRate={conversionRate} />
      <USDSymbol usdSelected={usdSelected}>$</USDSymbol>
      <BidNumberInput type="number" placeholder="0" value={bidAmount} onChange={(e) => { setBidAmount(e.target.value) }} usdSelected={usdSelected}/>
    </BidInputContainer>
  )
}

const USDText = styled.p`
  position: absolute;
  top: -35px;
  left: 5px;
  opacity: ${props => props.option === 'USD' ? 0 : .95};
  transition-duration: 100ms;

  color: #7ad67a;
  font-size: 24px;
  max-width: 300px;
`

const USDSymbol = styled.p`
  position: absolute;
  top: 0;
  left: 8px;
  font-size: 26px;
  line-height: 50px;
  transition-duration: 100ms;
  z-index: 1;
  color: #a1e3a1;
  opacity: ${props => props.usdSelected ? .7 : 0};
`

const BidInputContainer = styled.div`
  position: relative;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
`

const BiddingView = styled.div`
  width: 100%;
  height: 100%;  

  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 80px;
  grid-template-rows: 50px 1fr;
`

const BidNumberInput = styled.input`
  width: 100%;
  height: 100%;
  
text-indent: 0;
position: relative;
  font-size: 30px;
  padding-left: 10px;
  background: #111;
  outline: none;
  transition: ease 100ms;
  caret-color: rgb(255 255 255 / .15);

  grid-column: 1 / 2;
  grid-row: 1 / 2;

  border: 2px solid #222;
  border-radius: 7px;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  -moz-appearance: textfield;



  transition-duration: 100ms;
  padding-left: ${props => props.usdSelected ? '25px' : '10px'};


  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    background: #0d0d0d;
    border-color: #ccc;
  }
`

const Button = styled.button`
  border-radius: 7px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  letter-spacing: .5px;

  
  font-size: 25px;
  border: none;
  cursor: pointer;
  user-select: none;

  opacity: ${props => props.disabled ? 0.5 : 1};
  filter: ${props => props.disabled ? 'grayscale(100%)' : 'none'};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  transition-duration: 100ms;

  &:hover{
    filter: brightness(1.2);
    transform: scale(.98);
  }

  &:active{
    filter: brightness(1.4);
    transform: scale(.95);
  }
`

const BidButton = styled(Button)`
  background: linear-gradient(90deg, rgba(78,134,175,1) 0%, rgba(0,86,181,1) 100%);
`

const AltButton = styled(Button)`
  font-size: 18px;
  background: linear-gradient(90deg, rgba(249,223,139,1) 0%, rgba(242,184,61,1) 100%);
`

const BidCurrencySelection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 5px;

  grid-column: 2 / 3;
  grid-row: 1 / 2;
  cursor: pointer;
`

const BidAmountOption = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;
  border-radius: 7px;
  font-size: 12px;

  user-select: none;
  transition-duration: 150ms;

  filter: ${props => props.selected ? 'none' : 'grayscale(1)'};
  opacity: ${props => props.selected ? 1 : 0.3};

  
  &:hover{
    ${props => props.selected ? selectedHoverCSS : ''}
    ${props => !props.selected ? unselectedHoverCSS : ''}
  }

  &:active{
    transform: scale(0.95);
  }
`

const BidAmountOptionOrange = styled(BidAmountOption)`
  color: #f7743b!important;
`

const BidAmountOptionGreen = styled(BidAmountOption)`
  color: #7ad67a!important;
`

const unselectedHoverCSS = css`
    opacity: 1;
    filter: grayscale(0.5);
`

const selectedHoverCSS = css`
filter: brightness(1.2);
`

export default BiddingModule;