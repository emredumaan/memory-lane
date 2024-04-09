import styles from './button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
}

const Button: React.FC<ButtonProps> = ({text, type, ...rest}) => {
    return (
        <button className={styles.btn} type={type} {...rest}>
            {text}
        </button>
    )
}
export default Button