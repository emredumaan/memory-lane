import { Link } from "react-router-dom"
import logo from "../../assets/wide-logo.svg"
import styles from './navbar.module.css'
import { useEffect, useState } from "react"
import { IoClose, IoMenuOutline } from "react-icons/io5"
import { useAuth } from "../../contexts/AuthContext"
import ProfilePicture from "../ProfilePicture"
import UserDropDown from "../UserDropDown"
import { useLocation } from "react-router-dom"

const Navbar: React.FC = () => {
    const { isAuthenticated, user } = useAuth()
    const { pathname, search } = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target?.classList.contains(styles.userProfile) === false) setIsDropDownOpen(false)
        }

        document.body.addEventListener('click', handleClickOutside)
        return () => {
            document.body.removeEventListener('click', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
        setIsMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset'
    }, [isMenuOpen])

    const toggleMenu = () => {
        setIsMenuOpen((status) => !status)
    }

    const toggleDropDown = () => {
        setIsDropDownOpen((status) => !status)
    }

    return (
        <nav className={`${isMenuOpen ? styles.hasOpenMenu : ''}`}>
            <div className={styles.hamburger}>
                <button type="button" onClick={toggleMenu}>
                    {isMenuOpen ? <IoClose /> : <IoMenuOutline />}
                </button>
            </div>
            <div className={styles.brand}>
                <Link to='/'>
                    <img src={logo} alt="Logo" />
                </Link>
            </div>
            <div className={styles.left}>
                <div className={`${styles.links} ${isMenuOpen ? styles.open : ''}`}>
                    <Link className={pathname === '/' ? styles.active : ''} to="/">Home</Link>
                    <Link className={(pathname === '/lanes' && !search) ? styles.active : ''} to="/lanes">Public lanes</Link>
                    {!isAuthenticated && (
                        <>
                            <Link className={pathname === '/signin' ? styles.active : ''} to="/signin">Sign in</Link>
                            <Link className={styles.featured} to="/signup">Sign up</Link>
                        </>
                    )}
                    {isAuthenticated && (
                        <Link className={styles.featured} to="/create">Create</Link>
                    )}
                </div>
                <div>
                    {isAuthenticated && (
                        <span onClick={toggleDropDown} className={`${styles.userProfile} ${isDropDownOpen ? styles.open : ''}`}>
                            <ProfilePicture name={user?.name || ''} />
                            {isDropDownOpen && <UserDropDown />}
                        </span>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
