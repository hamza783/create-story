import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import 'font-awesome/css/font-awesome.min.css'

const InputButton = styled.button`
  height: 100%;
  border-radius: 0;
  background: white;
  padding: 0 8px;
  border: none;
  color: ${({ color, disabled }) => disabled ? 'grey' : color};
  cursor: ${({ disabled }) => disabled ? 'auto' : 'pointer'};

  i {
    font-size: 18px;
  }
`

const InputContainer = styled.div`
  display: flex;
  border: 1px solid #8490A8;
  margin: 0 8px;
  border-radius: 2px;
  align-items: center;
  height: 36px;
`

const StyledInput = styled.input`
  margin: 0;
  width: 100%;
  border: none;
  font-size: 14px;
  font-weight: 400;
  padding: 8px;

  &:focus {
    outline: none;
  }
`

const StyledTextArea = styled.textarea`
  margin: 0;
  width: 100%;
  height: 90%;
  border: none;
  font-size: 14px;
  font-weight: 400;
  padding: 8px;

  &:focus {
    outline: none;
  }
`


const PromptInput = (props) => {
  const { value, setValue, placeholderText, onSubmit, onCancel, showSubmit, isTextArea } = props

  return (
    <InputContainer className="input-container" { ...props }>
      {!isTextArea && (
        <StyledInput
          type='textarea'
          placeholder={placeholderText}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      )}
      {isTextArea && (
        <StyledTextArea
          placeholder={placeholderText}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      )}
      {showSubmit && (
        <InputButton
          disabled={!value}
          onClick={onSubmit}
          color={'green'}
        >
          <i className="fa fa-check" />
        </InputButton>
        )}
      <InputButton
        onClick={onCancel}
        color='red'
      >
        <i className="fa fa-times" aria-hidden="true" ></i>
      </InputButton>
    </InputContainer>
  )
}

PromptInput.propTypes = {
  placeholderText: PropTypes.string,
  value: PropTypes.string,
  setValue: PropTypes.func,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  showSubmit: PropTypes.bool,
  isTextArea: PropTypes.bool
}

PromptInput.defaultProps = {
  placeholderText: '',
  value: '',
  setValue: () => {},
  onCancel: () => {},
  onSubmit: () => {},
  showSubmit: true,
  isTextArea: false
}

export default PromptInput
