import React from 'react'
import styled from 'styled-components'
import { DarkTheme } from '../components/Themes'
import LogoImg from '../assets/Images/logicloomer.webp'

const Logo = styled.div`
display: inline-block;
position: fixed;
left: 2rem;
top: 2rem;
z-index:3;
width: 50px;
height: 50px;

img {
  width: 100%;
  height: auto;
}
`

const LogoComponent = (props) => {
    return (
        <Logo>
          <img src={LogoImg} alt="Logicloomer" />
        </Logo>
    )
}

export default LogoComponent
