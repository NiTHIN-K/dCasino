import React, { useEffect, useState, useReducer } from 'react';
import styled, { keyframes } from 'styled-components';

import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js'

import arrowIcon from '../images/arrow.png'
Chart.register([Tooltip, ArcElement])

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

function GameModule(props) {
  let [hovSlice, setHovSlice] = useState(null)

  useEffect(() => {
    console.log("hov slice", hovSlice)
    props.setHoveredSlice(hovSlice)
  }, [hovSlice])

  useEffect(()=>{
    if(props.gameState != 'bidding'){
      setHovSlice(null)
      console.log("null now!")
    }
  }, [props.gameState])


  

  let borderColors = Array(Object.keys(props.pool).length).fill('#333')
  let borderWidths = Array(Object.keys(props.pool).length).fill(1)
  // Set hovered slices to white border
  if(props.gameState == 'bidding' && hovSlice != null){
    borderColors[hovSlice] = '#fff'
  }
  if(props.gameState == 'results'){
    // Set winner slice to green border
    borderColors[props.winSlice] = '#47d147'
  }
  if(props.gameState == 'results' && props.winnerIndex != null){
    borderWidths[props.winnerIndex] = 3
  }
  
  return (
    <>
      <GameView spinAnimation={props.spinAnimation} gameState={props.gameState} onAnimationEnd={()=>{props.spinAnimationComplete()}}>
        {Object.keys(props.pool).length > 0 &&
          <Doughnut data={{
            'datasets': [
              {
                'label': 'Round 1',
                'data': Object.keys(props.pool).map((item) => props.pool[item]),
                'backgroundColor': Object.keys(props.pool).map((item) => stringToColor(item)),
                'borderColor': borderColors,
                'borderAlign': 'inner',
                'borderWidth': borderWidths
              }
            ], 
            'labels': Object.keys(props.pool).map((item) => item)
          }} options={
            {
              'onHover': (e, el) => {
                if(props.gameState != 'bidding') return;
                setHovSlice(el.length > 0 ? el[0].index : null)
              },
              plugins: {
                tooltip: {
                  enabled: props.gameState == 'bidding' ? true : false
                }
              },
              // props.gameState == 'bidding' ? true : false
              // props.gameState == 'bidding' ? 'index' : 'null'
              events: props.gameState == 'bidding' ? ['mousemove'] : []
            }} />
        }

      </GameView>
      <WinnerView>
        {props.gameState == "results" && props.winner &&
          <>
            <WinnerText  winner={props.winner}>{`${props.winner.slice(0,11)}...`}</WinnerText>
          </>
        }
      </WinnerView>
      <WheelTick src={arrowIcon} />
    </>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const WheelTick = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 5px;
  left: 333px;
  filter: invert(1);
  transform: rotate(180deg);
`


const GameView = styled.div`
  width: 610px;
  height: 610px;
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 40px;
  left: 40px;

  animation: ${props => props.gameState != 'bidding' ? rotateWheel(props.spinAnimation) : ''} 8s ease-in-out forwards;
`

const WinnerView = styled.div`
  position: relative;
  width: 250px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const WinnerText = styled.p`
  font-size: 24px;
  font-weight: bold;

  text-overflow: ellipses;
  white-space: nowrap;
  max-width: 200px;
  border-bottom: 4px solid ${props => props.winner ? stringToColor(props.winner) : 'transparent'};
  padding: 8px 6px;
  animation: ${fadeIn} 250ms linear;
`

const rotateWheel = (degrees) => keyframes`
  0%{
    transform: rotate(0deg);
  }
  98%{
    transform: rotate(${degrees}deg);
  }
  100%{
    transform: rotate(${degrees}deg) scale(1.05);
  }
`

export default GameModule;