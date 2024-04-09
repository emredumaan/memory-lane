import styles from './profilePicture.module.css'

interface ProfilePictureProps {
    name: string
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ name }) => {

    const getFirstLetters = () => {
        let words = name.trim().toUpperCase().split(' ')
        let firstletters = ''
        for (let i = 0; i < words.length; i++) {
            if(i > 1) break
            firstletters += words[i].split('')[0]
        }
        return firstletters 
    }

    return (
        <span className={styles.pp}>
            {getFirstLetters()}
        </span>
    )
}

export default ProfilePicture