import React from 'react';
import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';

function TitleModule(props) {

  return (
    <>
      <TitleView>
        <TitleText>D-🎰</TitleText>
        <TitleInformation>
          <TitleInformationText fontSize={"secondary"}><Bold>Round: </Bold>{props.round}</TitleInformationText>
          <TitleInformationText fontSize={"primary"}><Bold>Participants: </Bold>{props.numberOfParticipants}</TitleInformationText>
        </TitleInformation>
        <p></p>
        <p></p>
        <p></p>
      </TitleView>
    </>
  )
}

const TitleView = styled.h1`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  user-select: none;
  cursor: default;
  transition-duration: 100ms;
`

const TitleText = styled.p`
  font-size: 40px;
  margin-top: 20px;
`

const TitleInformation = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const TitleInformationText = styled.p`
  font-size: ${props => props.fontSize === "primary" ? "20px" : "16px"};
  margin-bottom: 10px;
  font-weight: 500;
`

const Bold = styled.span`
  font-weight: bold;
`

export default TitleModule;