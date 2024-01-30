import { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

function Toast(props) {
  // Lifecycle logic
  let [data, setData] = useState(props.config)

  let [pause, setPause] = useState(false)
  let [open, setOpen] = useState(false)

  let [toastQueue, setToastQueue] = useState([])

  useEffect(() => {
    if (!open) {
      setData(props.config ? { ...props.config } : { ...EMPTY_TOAST })
    } else {
      let currentQueue = toastQueue
      currentQueue.push(props.config)
      setToastQueue([...currentQueue])
    }
  }, [props.config])

  useEffect(() => {
    data.type ? setOpen(true) : setOpen(false)
  }, [data])

  useEffect(() => {
    if (!open && toastQueue.length > 0) {
      let currentQueue = toastQueue
      let nextConfig = currentQueue.shift()
      setToastQueue([...currentQueue])
      setTimeout(() => {
        setData({ ...nextConfig })
      }, 300)

    }
  }, [open])


  // Constants
  const EMPTY_TOAST = {
    type: null,
    text: null,
    img: null,
    time: null
  }

  const TYPE_STYLING_MAP = {
    "success": '#39c071',
    "warning": '#dd302f',
    "notice": '#e6b035'
  }

  // Helper functions
  function handlePauseAction(pauseAction) {
    console.log(pauseAction)
    setPause(pauseAction)
  }

  function progressComplete() {
    setOpen(false)
  }

  let { type, text, img, time } = data
  let color = TYPE_STYLING_MAP[type]

  return (
    <ToastBody open={open} color={color} handlePauseAction={handlePauseAction} >
        <ToastSidebar>
          <ToastImage src={img} />
        </ToastSidebar>
        <ToastContent>
          <ToastText> {text} </ToastText>
        </ToastContent>
        <ToastProgress progressComplete={progressComplete} open={open} pause={pause} time={time} color={color} />
    </ToastBody>
  );
}

// Subcomponents

function ToastBody({ children, open, color, handlePauseAction }) {
  return (
    <StyledToastBody open={open} color={color} onMouseEnter={()=>{handlePauseAction(true)}} onMouseLeave={()=>{handlePauseAction(false)}}>
      {children}
    </StyledToastBody>
  )
}

function ToastProgress({ progressComplete, open, pause, time, color }) {
  return (
    <StyledToastProgress onAnimationEnd={progressComplete} open={open} pause={pause} time={time} color={color} />
  )
}

function ToastImage(props) {

  function isImgLink(link){
    return link.includes('png') || link.includes('jpg') || link.includes('jpeg') || link.includes('svg')
  }

  return (
    !props.src ?
      <></> :
      (
        isImgLink(props.src) ?
          <StyledToastImage src={props.src} alt={props.type} /> :
          <StyledToastImageText> {props.src} </StyledToastImageText>
      )
  )
}

// Styled subcomponents

const shrink = keyframes`
  0%{
    transform: scaleX(1);
    right: -5px;
  }
  100%{
    transform: scaleX(0);
    right: -5px;
  }
`

const StyledToastImage = styled.img`
  width: 26px;
  height: auto;
`

const StyledToastImageText = styled.div`
  font-size: 26px;
`

const ToastSidebar = styled.div`
  min-width: 50px;
  height: 100%;
  position: relative;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  font-size: 26px;
`

const ToastText = styled.p`
  font-size: 17px;
  font-weight: 500;
  margin: 0;
`

const ToastContent = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;  
`

const StyledToastProgress = styled.div`
  position: absolute;
  top: -5px;
  left: -5px;
  height: 5px;
  background-color: ${props => props.color ? props.color : '#39c071'};
  transform-origin: left;

  opacity: ${props => props.open ? '1' : '0'};
  animation-play-state: ${props => props.pause ? 'paused' : 'running'}!important;
  ${props => props.open ? shrinkingToastProgress : ''}
`

const shrinkingToastProgress = css`
  animation: ${shrink} ${props => props.time}s linear;
`

const StyledToastBody = styled.div`
    width: 400px;
    height: 70px;
    position: fixed;
    top: 10px;
    right: 10px;
    margin: 0;

    display: flex;
    flex-direction: row;
    padding: 25px;

    background: #151515;
    box-shadow: 0px 10px 20px 5px rgb(0 0 0 / .1);
    border: 5px solid #333;

    transition-duration: 200ms;


    transform: translateY(${props => props.open ? '0' : '-10'}px);
    pointer-events: ${props => props.open ? 'all' : 'none'};
    opacity: ${props => props.open ? '1' : '0'};
`

export default Toast;
