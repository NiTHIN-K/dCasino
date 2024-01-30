import React from 'react';
import { useState, useEffect, useRef, useContext } from 'react'
import styled, { keyframes, css } from 'styled-components';

import arrowIcon from '../images/arrow.png'
import { ToastContext } from '../App';

function ParticipantsModule(props) {

  useEffect(()=>{
    if(props.gameState == 'results'){
      // scroll down to the winner
      let winner = document.getElementById(props.winner)
      if(winner){
        // Scroll to winner within it's parent
        // winner.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'})
        // winner.scrollIntoView({behavior: 'smooth'})
      }
    }
  }, [props.gameState])

  let viewRef = useRef(null)
  let [atBottom, setAtBottom] = useState(true)
  let [atTop, setAtTop] = useState(true)

  useEffect(scrollHandler, [props.pool])

  function scrollHandler() {
    let currentlyAtBottom = viewRef.current.scrollHeight - viewRef.current.scrollTop == viewRef.current.clientHeight
    if(currentlyAtBottom != atBottom){
      setAtBottom(currentlyAtBottom)
    }
    setAtTop(viewRef.current.scrollTop == 0)
  }

  return (
    <>
      <ScrollUpButton img={arrowIcon} atTop={atTop} onClick={() => viewRef.current.scrollTop = 0} />
      <ParticipantsView ref={viewRef} onScroll={scrollHandler}>
        {Object.keys(props.pool).length > 0 &&
          Object.keys(props.pool).slice(0).reverse().map((addr) => <Participant id={props.winner} gameState={props.gameState} myAddress={props.myAddress} winner={props.winner} hoveredAddress={props.hoveredAddress} key={addr} address={addr} amount={props.pool[addr]} />)}
      </ParticipantsView>
      <ScrollDownButton img={arrowIcon} atBottom={atBottom} onClick={() => { viewRef.current.scrollTo(0, viewRef.current.scrollHeight) }}/>
    </>
  )
}

function Participant(props) {

  

  let setToast = useContext(ToastContext)


  function handleAddressClicked(){
    navigator.clipboard.writeText(props.address)
    setToast({
      text: "Address copied to clipboard",
      type: "success",
      time: 2,
      img: '🗒️'
    })
  }


  function stringToColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  }

  let isMe = props.address == props.myAddress  
  let isWinner = props.address == props.winner
  let isHovered = props.hoveredAddress == props.address

  return (
    <>
      <ParticipantView gameState={props.gameState} isMe={isMe} isWinner={isWinner} isHovered={isHovered} color={stringToColor(props.address)} >
        <ParticipantAddress onClick={handleAddressClicked}>{props.address}</ParticipantAddress>
        <ParticipantAmount>{`${props.amount} ETH`}</ParticipantAmount>
      </ParticipantView>
      
    </>

  )
}

const popIn = keyframes`
  0%{
    transform: scale(.9);
    min-height: 0;
    height: 0;
    opacity: 0;
  }
  100%{
    transform: scale(1);
    min-height: 50px;
    height: 50px;
    opacity: 1;
  }
`

const ParticipantsView = styled.div`
  position: relative;
  width: 100%;
  min-height: 690px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  scroll-behavior: smooth;
  max-height: 690px;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const WinnerParticipantCSS = css`
  background-color: #9ae59a;
`
const HoveredParticipantCSS = css`
  background-color: rgb(255 255 255 / .08);
`



const ParticipantView = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  transition-duration: 150ms;

  border-left: 5px solid ${props => props.color};

  background-color: ${props => props.isMe ? 'rgb(255 255 255 / .4)' : 'transparent'};
  ${props => props.isHovered && HoveredParticipantCSS}
  ${props => props.gameState == 'results' && props.isWinner && WinnerParticipantCSS}

  animation: ${popIn} 200ms forwards;
`



const ParticipantAddress = styled.p`
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  cursor: pointer;
  transition-duration: 50ms;
  user-select: none;

  &:active{
    color: #333;
  }
`

const ParticipantAmount = styled.p`
  font-weight: bold;
`

const ScrollButton = styled.div`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #fff;

  opacity: 0;

  position: absolute;
  left: -40px;

  transition-duration: 100ms;
  cursor: pointer;

  background-image: url(${props => props.img});
  bacgkground-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  filter: invert(1);

  &:hover {
    opacity: .5;
  }
`

const ScrollUpButton = styled(ScrollButton)`
  top: 0px;
  
  opacity: ${props => props.atTop ? 0 : .8};
  pointer-events: ${props => props.atTop ? 'none' : 'auto'};

  &:active {
    transform: scale(.9);
  }
`

const ScrollDownButton = styled(ScrollButton)`
  bottom: 0px;

  transform: rotate(180deg);

  &:active {
    transform: scale(.9) rotate(180deg);
  }
  
  opacity: ${props => props.atBottom ? 0 : .8};
  pointer-events: ${props => props.atBottom ? 'none' : 'auto'};
`



export default ParticipantsModule;