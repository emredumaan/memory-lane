import { useLocation } from 'react-router-dom'
import styles from './lanes.module.css'
import { useEffect, useState } from 'react'
import Axios from 'axios'
import { toast } from 'react-toastify'
import { Error404 } from '../errors/404'
import { BiUser } from 'react-icons/bi'
import Lane from '../../components/Lane'
import { IoIosArrowUp } from "react-icons/io"
import { BsDot } from 'react-icons/bs'

interface Lane {
    id: number
    title: string
    content: string
    createdAt: string
    isPublic: boolean
}

interface Author {
    id: number
    name: string
}

const PublicLanes : React.FC = () => {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const laneId = params.get('id')
    const [lane, setLane] = useState<Lane>()
    const [lanes, setLanes] = useState<Lane[]>()
    const [author, setAuthor] = useState<Author>()
    const [notFound, setNotFound] = useState<boolean>(false)
    const [onPageTop,setOnPageTop] = useState<boolean>(true)

    const fetchLane = async (id: number) => {
        try {
            const response = await Axios.get('/api/get-lane?id=' + id)
            if (response.data.notFound) return setNotFound(true)
            setLane(response.data.lane)
            setAuthor(response.data.author)
        } catch (err: any) {
            toast.error(err.response.data.message || 'Something went wrong.')
        }
    }

    const fetchPublicLanes = async () => {
        try {
            const response = await Axios.get('/api/get-public-lanes')
            setLanes(response.data.lanes)
        } catch (err: any) {
            toast.error(err.response.data.message || 'Something went wrong.')
        }
    }

    useEffect(()=> {
        if (!laneId) return
        document.addEventListener('scroll',()=> {
            if (window.scrollY > 200) setOnPageTop(false)
            else setOnPageTop(true)
        })
    },[laneId])

    const scrollToTop = () => {
        window.scrollTo(0,0)
    }

    useEffect(() => {
        if (laneId) fetchLane(parseInt(laneId))
        else fetchPublicLanes()
    }, [location])


    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
    }

    if (notFound) return (
        <Error404 />
    )

    if (laneId) return (
        <div className={styles.containerLane}>
            <button onClick={scrollToTop} className={`${styles.backToTop} ${!onPageTop ? styles.active : ''}`}>
                <IoIosArrowUp /> Back to top
            </button>
            <div className={styles.menu}>
                <h1 className={styles.title}>
                    {lane?.title}
                </h1>
                <div className={styles.col}>
                    <span className={styles.author}>
                        <BiUser />
                        {author?.name || '[deleted]'}
                    </span>
                    <BsDot />
                    <span className={styles.date}>
                        {lane && formatDate(lane?.createdAt || '')}
                    </span>
                </div>

            </div>
            <div className={styles.content}
                dangerouslySetInnerHTML={{ __html: lane?.content || '' }}
            ></div>
        </div>
    )

    return (
        <>
            <div className={styles.container}>
                <h1>Last Published Lanes</h1>
                <div className={styles.lanes}>
                    {
                        lanes?.length ? 
                        lanes.map((lane,key)=> <Lane lane={lane} fetchData={fetchPublicLanes} key={key} />)
                        :
                        <span className={styles.noLanes}>There is no published lane.</span>
                    }
                </div>
            </div>
        </>
    )
}

export default PublicLanes