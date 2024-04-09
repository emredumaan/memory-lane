import styles from './footer.module.css'
import { FaGithub } from "react-icons/fa6"
import logo from '../../assets/wide-logo.svg'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.brand}>
                <span>
                    <Link to='/'>
                        <img src={logo} alt="Logo" />
                    </Link>
                </span>
                <a target='_blank' href="https://github.com/emredumaan/memory-lane">
                    <FaGithub size='1.2rem' /> Source code
                </a>
            </div>

            <div className={styles.credit}>
                    This web app is created by
                    <Link target='_blank' to='https://emre.duman.web.tr'> Emre DUMAN </Link>
                    as a portfolio project.
            </div>

        </footer>
    )
}

export default Footer