import React from 'react'
import styled from 'styled-components'


const Text = styled.h1`
position: fixed;
top: ${props => props.top};
left: ${props => props.left};
right: ${props => props.right};
color:${props => `rgba(${props.theme.textRgba},0.1)`};
font-size: calc(5rem + 5vw);
z-index:0;

@media (max-width: 768px) {
  font-size: calc(3rem + 3vw);
  top: ${props => props.top ? `calc(${props.top} + 2%)` : 'auto'};
  right: ${props => props.right ? `calc(${props.right} - 10%)` : 'auto'};
  left: ${props => props.left ? `calc(${props.left} - 10%)` : 'auto'};
}
`


const BigTitlte = (props) => {
    return (
        <Text  top={props.top}  left={props.left}  right={props.right}>
            {props.text}
        </Text>
    )
}

export default BigTitlte
