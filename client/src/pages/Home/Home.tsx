import styles from './home.module.css'
import { FaPlus } from "react-icons/fa6"
import { FaReact } from "react-icons/fa6"
import { FaNodeJs } from "react-icons/fa6"
import { FaDatabase } from "react-icons/fa6"

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <h1>an Open Source <span className='mark'>Diary App</span>.</h1>
            <p className={styles.p}>
                You may create diary entries and if you want,
                you may publish them to other users with this app.
            </p>
            <div className={styles.features}>
                <div>
                    <h3>Features</h3>
                    <ul>
                        <li><FaPlus size='.9rem' /> Create account & log in</li>
                        <li><FaPlus size='.9rem' /> Create diary entries with a rich text editor</li>
                        <li><FaPlus size='.9rem' /> Set your entries as public or private</li>
                        <li><FaPlus size='.9rem' /> Read other users entries</li>
                    </ul>
                </div>
                <div>
                    <h3>Developed with</h3>
                    <div className={styles.techStack}>
                        <div>
                            <FaReact size='4rem' />
                            <span>React</span>
                        </div>
                        <div>
                            <FaNodeJs size='4rem' />
                            <span>Node.js</span>
                        </div>
                        <div>
                            <FaDatabase size='4rem' />
                            <span>MySQL</span>
                        </div>
                    </div>
                </div>

            </div>
            <p className={styles.p}>
                This web app is created by
                <a className={styles.link} target='_blank' href="https://emre.duman.web.tr"> Emre DUMAN </a>
                as a portfolio project.
            </p>
        </div>
    )
}

export default Home