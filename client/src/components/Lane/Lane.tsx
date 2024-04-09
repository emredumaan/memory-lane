import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TbWorld } from 'react-icons/tb'
import { MdLockOutline } from 'react-icons/md'
import { HiDotsHorizontal } from 'react-icons/hi'
import { BsDot } from "react-icons/bs";
import { toast } from 'react-toastify'
import Axios from 'axios'
import styles from './lane.module.css'

interface LaneProps {
    lane: {
        id: number
        isPublic: boolean
        title: string
        createdAt: string
    }
    fetchData: () => void
}

const Lane: React.FC<LaneProps> = ({ lane, fetchData }) => {
    const [laneOptionMenu, setLaneOptionMenu] = useState<{ active: boolean; id: number }>({
        active: false,
        id: 0
    })

    const { pathname } = useLocation()

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        const currentDate = new Date()

        const timeDifference = currentDate.getTime() - date.getTime()
        const secondsDifference = Math.round(timeDifference / 1000)
        const minutesDifference = Math.round(secondsDifference / 60)
        const hoursDifference = Math.round(minutesDifference / 60)
        const daysDifference = Math.round(hoursDifference / 24)
        const weeksDifference = Math.round(daysDifference / 7)
        const monthsDifference = Math.round(daysDifference / 30)
        const yearsDifference = Math.round(daysDifference / 365)

        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }

        const timeString = new Intl.DateTimeFormat('en-US', options).format(date)

        if (daysDifference === 0) {
            return 'Today, ' + timeString
        } else if (daysDifference === 1) {
            return 'Yesterday, ' + timeString
        } else if (daysDifference < 7) {
            return daysDifference + ' days ago, ' + timeString
        } else if (weeksDifference === 1) {
            return '1 week ago, ' + timeString
        } else if (weeksDifference < 4) {
            return weeksDifference + ' weeks ago, ' + timeString
        } else if (monthsDifference === 1) {
            return '1 month ago, ' + timeString
        } else if (monthsDifference < 12) {
            return monthsDifference + ' months ago, ' + timeString
        } else if (yearsDifference === 1) {
            return '1 year ago, ' + timeString
        } else {
            return yearsDifference + ' years ago, ' + timeString
        }
    }

    const laneOptions = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.preventDefault()
        if (laneOptionMenu.active && laneOptionMenu.id === id) {
            setLaneOptionMenu({ active: false, id: 0 })
        } else {
            setLaneOptionMenu({ active: true, id })
        }
    }

    const deleteLane = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.preventDefault()
        setLaneOptionMenu({ active: false, id: 0 })

        try {
            const response = await Axios.post('/api/delete-lane', { id })
            toast.success(response.data.message)
            fetchData()
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Something went wrong!')
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (!(target.classList.contains(styles.options))) {
                setLaneOptionMenu({ active: false, id: 0 })
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <Link to={`/lanes?id=${lane.id}`}>
            <div className={styles.lane}>
                <div title={lane.isPublic ? 'Public lane' : 'Private lane'} className={styles.image}>
                    {lane.isPublic ? <TbWorld /> : <MdLockOutline />}
                </div>
                <div className={styles.info} title={lane.title}>
                    <span className={styles.title}>{lane.title}</span>
                    <span className={styles.date}>{formatDate(lane.createdAt)}</span>
                </div>
                {pathname === '/me' ? (
                    <>
                        <button type='button' title='options' className={styles.options} onClick={(e) => laneOptions(e, lane.id)}>
                            <HiDotsHorizontal />
                        </button>
                        {laneOptionMenu.active && laneOptionMenu.id === lane.id && (
                            <ul className={styles.optionMenu}>
                                <li>
                                    <button onClick={(e) => deleteLane(e, lane.id)}>Delete</button>
                                </li>
                            </ul>
                        )}
                    </>
                ):
                <BsDot />
                }
            </div>
        </Link>
    )
}

export default Lane
