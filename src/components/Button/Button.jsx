import React from 'react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const StyledButton = styled.button`
  background-color: ${props => props.backgroundColor};
  color: ${props => props.labelFontColor};
  border: none;
  border-radius: ${props => props.borderRadius};
  padding: 8px 16px;

  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 300ms, color 300ms;

  &:hover {
    background-color: ${props => props.backgroundColorHover};
    color: ${props => props.labelFontColorHover};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const SpinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #ffffff;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  animation: ${SpinnerAnimation} 0.8s linear infinite;
  margin-right: 8px;
`

const GenerateIcon = styled.span`
  font-size: 12px;
  margin-right: 2px;
`

const Button = (props) => {
  const { onClick, isLoading, value, linkTo, icon, labelFontColor, labelFontColorHover, backgroundColor, backgroundColorHover, borderRadius } = props

  return (
    <StyledButton
      onClick={onClick}
      disabled={isLoading}
      labelFontColor={labelFontColor}
      labelFontColorHover={labelFontColorHover}
      backgroundColor={backgroundColor}
      backgroundColorHover={backgroundColorHover}
      borderRadius={borderRadius}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          Loading...
        </>
      ) : (
        <>
          {icon && <GenerateIcon>{icon}</GenerateIcon>}
          {linkTo ? <Link style={{ color: 'white', textDecoration: 'none' }} to={linkTo}>{value}</Link> : value}
        </>
      )}
    </StyledButton>
  )
}

Button.propTypes = {
  value: PropTypes.string,
  icon: PropTypes.string,
  labelFontColor: PropTypes.string,
  labelFontColorHover: PropTypes.string,
  backgroundColor: PropTypes.string,
  backgroundColorHover: PropTypes.string,
  borderRadius: PropTypes.string,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func
}

Button.defaultProps = {
  value: '',
  icon: '',
  labelFontColor: 'white',
  labelFontColorHover: 'white',
  backgroundColor: '#2D5EC9',
  backgroundColorHover: '#2850A5',
  borderRadius: '8px',
  isLoading: false,
  onClick: () => {}
}

export default Button
