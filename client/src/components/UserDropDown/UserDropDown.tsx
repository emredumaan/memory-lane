import { useAuth } from '../../contexts/AuthContext'
import styles from './userDropDown.module.css'
import { Link } from 'react-router-dom'
import { FaBookBookmark, FaGear, FaArrowRightFromBracket} from "react-icons/fa6"

const UserDropDown: React.FC = () => {
    const { logout } = useAuth()

    return (
        <div className={styles.dropDown}>
            <Link to='/me'><FaBookBookmark /> My lanes</Link>
            <Link to='/settings'><FaGear /> Settings</Link>
            <button onClick={logout} type='button'><FaArrowRightFromBracket /> Logout</button>
        </div>
    )
}

export default UserDropDown