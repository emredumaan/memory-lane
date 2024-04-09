import styles from './input.module.css'
import React, { useState, ChangeEvent } from 'react'

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    passdToggle?: boolean
    register: any
    inputName: string
    error?: string
}

const Input: React.FC<FloatingLabelInputProps> = ({ label, error='', register, inputName, required, type, passdToggle = false, ...rest }) => {
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>('')
    const [inputType, setInputType] = useState('password')

    const handleFocus = () => {
        setIsFocused(true)
    }

    const handleBlur = () => {
        setIsFocused(inputValue !== '')
        setTimeout(() => {
        }, 190)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
    }
    
    const handlePassToggle = () => {
        if (inputType === 'text') setInputType('password')
        if (inputType === 'password') setInputType('text')
    }

    return (
        <div className={`${styles.inputWrapper} ${isFocused || inputValue !== '' ? styles.focused : ''} ${error ? styles.hasError : ''}`}>
            <input
                {...rest}
                type={passdToggle ? inputType : type}
                onFocus={handleFocus}
                {...register(inputName,{required ,onChange: handleChange, onBlur: handleBlur, value: inputValue})}
            />
            <label>{label}</label>
            {error && <span className={styles.errorMessage}>{error}</span>}
            {passdToggle && inputValue !== '' && <button onClick={handlePassToggle} type='button' className={styles.passToggle}>{inputType === 'text' ? 'hide' : 'show'}</button>}
        </div>
    )
}

export default Input