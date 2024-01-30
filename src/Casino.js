import React from 'react';
import { useState, useReducer, useEffect, useRef } from 'react';
import './Casino.css';

import BiddingModule from './components/BiddingModule';
import ClockModule from './components/ClockModule';
import GameModule from './components/GameModule';
import TitleModule from './components/TitleModule';
import ParticipantsModule from './components/ParticipantsModule';

function Casino(props) {

  const ROUND_TIME = 500;
  const BOT_SPEED = 1500000;
  const BOT_AMOUNT = 10000;
  const INITIAL_POOL = {};

  let [botTimeout, setBotTimeout] = useState(null)

  let [timerInterval, setTimerInterval] = useState(null)
  let [time, setTime] = useState(ROUND_TIME) // Number of seconds

  let [hoveredAddress, setHoveredAddress] = useState(null)
  let [winner, setWinner] = useState('')
  let [round, setRound] = useState(1)
  let [pool, dispatchPool] = useReducer(poolReducer, INITIAL_POOL)

  let [gameState, setGameState] = useState('bidding')
  let [spinAnimation, setSpinAnimation] = useState(0)

  let [winnerIndex, setWinnerIndex] = useState(null)

  useEffect(()=>{
    console.log("Game state: " + gameState)
  }, [gameState])



  useEffect(()=>{
    if(time <= 0){
      // Clear intervals and timeouts when the game ends
      clearTimeout(botTimeout)
      clearInterval(timerInterval)
      setGameState('spinning')
    }
  }, [time])

  /* Main game logic */

  useEffect(()=>{
    if(gameState == 'spinning'){
      let currentWinner = selectWinner()
      setWinner(currentWinner)
      calculateSpinAnimation(currentWinner)
    }else if(gameState == 'bidding') {
      setTime(ROUND_TIME)
      setTimerInterval(setInterval(decrementTime, 1000))
    }
    return () => clearInterval(timerInterval)
  }, [gameState])

  
  /* Bot logic */
  // useEffect(() => {
  //   clearTimeout(botTimeout)
  //   if(gameState != 'bidding') return;
  //   let newTimeout = setTimeout(() => {
  //     let amt = Math.floor(Math.random() * Math.random() * BOT_AMOUNT)
  //     dispatchPool({ type: "add", data: { address: randomAddress(), amount: amt } })
  //   }, Math.floor(Math.random() * BOT_SPEED))
  //   setBotTimeout(newTimeout)
  // }, [pool])


  /* Helper functions */

  function calculateSpinAnimation(participant){
    let runningTotal = 0
    for(let p in pool){
      if(p == participant){
        break;
      }else{
        runningTotal += pool[p]
      }
    }
    let poolTotal = Object.values(pool).reduce((a, b) => a + b, 0)
    let deg = -(360*40 + ((Math.random()*pool[participant] + runningTotal) / poolTotal) * 360)
    setSpinAnimation(deg) 
  }

  function spinAnimationComplete(){
    setGameState('results')
    setTimeout(resetGame, 5000);
  }

  function decrementTime(){
    setTime(t=>t-1)
  }


  function resetGame(){
    console.log("Resetting game")
    setGameState('bidding')
    setRound(round=>round+1)
    setWinner('')
    dispatchPool({type: "reset"})
  }
  

  function poolReducer(state, action) {
    switch (action.type) {
      case 'add':
        if (state[action.data.address]) {
          return {
            ...state,
            [action.data.address]: state[action.data.address] + action.data.amount
          }
        } else {
          return {
            ...state,
            [action.data.address]: action.data.amount
          }
        }
      case 'reset':
        return INITIAL_POOL
      default:
        return state
    }
  }
  

  function bid(amount, option) {
    if(gameState != "bidding" || amount == 0) return;
    dispatchPool({ type: "add", data: { address: props.account, amount: amount * (option == "FINNEY" ? .001 : 1) } })
  }


  function randomAddress() {
    let chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let uid = Array(40).fill(0).map((item) => chars[Math.floor(Math.random() * chars.length)]).join("")
    return '0x' + uid
  }

  function selectWinner(){
    let poolEntries = Object.entries(pool)
    let total = poolEntries.reduce((acc, item) => acc + item[1], 0)
    let randomWinner = Math.floor(Math.random() * total)
    for(let i = 0; i < poolEntries.length; i++){
      if(poolEntries[i][1] < randomWinner){
        randomWinner -= poolEntries[i][1]
      }else{
        setWinnerIndex(i)
        return poolEntries[i][0]
      }
    }
  }

  function setHoveredSlice(slice){
    if(slice == null){
      setHoveredAddress(null)
    }else{
      setHoveredAddress(Object.keys(pool)[slice])
    }
  }

  return (
    <div id="casino">
      <div id="title-section" className="box">
        <TitleModule round={round} numberOfParticipants={Object.keys(pool).length} />
      </div>
      <div id="bidding-section" className="box">
        <BiddingModule bid={bid} />
      </div>
      <div id="clock-section" className="box">
        <ClockModule time={time}/>
      </div>
      <div id="participants-section" className="box">
        <ParticipantsModule myAddress={props.myAddress} pool={pool} winner={winner} hoveredAddress={hoveredAddress} gameState={gameState}/>
      </div>
      <div id="game-section" className="box">
        <GameModule pool={pool} winner={winner} winnerIndex={winnerIndex} gameState={gameState} spinAnimation={spinAnimation} spinAnimationComplete={spinAnimationComplete} setHoveredSlice={setHoveredSlice} winSlice={winnerIndex}  />
      </div>
    </div>
  )
}

export default Casino;