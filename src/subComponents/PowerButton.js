import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { PowerBtn } from '../components/AllSvgs'


const Power = styled.button`
position: fixed;
top: 2rem;
left: 50%;
transform: translate(-50%, 0);

background-color: #FCF6F4;
padding: 0.3rem;
border-radius: 50%;
border: 1px solid #000;
width: 2.5rem;
height: 2.5rem;

display: flex;
justify-content: center;
align-items:center;
z-index:5; /* Increased z-index to ensure clickability */

cursor: pointer;

&:hover{
    background-color: rgba(0,255,0,0.4);
    box-shadow: 0 0 8px 6px rgba(0,255,0,0.2);
}

&>*:first-child{
    text-decoration: none;
    color: inherit;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    width: 2.8rem; /* Increased for better tappability */
    height: 2.8rem; /* Increased for better tappability */
    top: 1rem;
    padding: 0.4rem; /* Slightly increased padding */
    z-index: 10; /* Further increased z-index for mobile */
}
`

const PowerButton = () => {
    const iconSize = window.innerWidth <= 768 ? 25 : 30; /* Slightly smaller on mobile */
    
    return (
        <Power>
            <NavLink to="/">
                <PowerBtn width={iconSize} height={iconSize} fill='currentColor' />
            </NavLink>
        </Power>
    )
}

export default PowerButton
