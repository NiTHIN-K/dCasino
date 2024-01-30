import React from 'react';
import styled from 'styled-components';

function ClockModule(props) {

  function formatTime(t){
    if(t <= 0) return "00:00"
    let minutes = Math.floor(t / 60)
    let seconds = t % 60
    let catchZeros = (n) => (n < 10 ? '0' : '') + n
    return `${catchZeros(minutes)}:${catchZeros(seconds)}`
  }

  return (
    <>
      <ClockView time={props.time}>
        <ClockText time={props.time} runningOut={props.time <= 5}>{formatTime(props.time)}</ClockText>
      </ClockView>
    </>
  )
}

const ClockView = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.time == 0 ? '#eee' : 'transparent'};
  transition-duration: 50ms;
`

const ClockText = styled.p`
  font-size: 60px;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  text-align: center;
  transition-duration: 50ms;

  color: ${props => props.time == 0 ? '#ff704d' : props.runningOut ? '#f1d54e' : '#aaa'};
`

export default ClockModule;