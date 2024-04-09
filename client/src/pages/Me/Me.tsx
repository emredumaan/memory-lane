import styles from './me.module.css'
import { IoSearchOutline } from "react-icons/io5"
import { useEffect, useState } from 'react'
import Axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import { toast } from 'react-toastify'
import Lane from '../../components/Lane'
import { Link } from 'react-router-dom'

interface LaneType {
    id: number
    title: string
    createdAt: string
    isPublic: boolean
}

enum Filter {
    All = 'all',
    Public = 'public',
    Private = 'private'
}

const Me: React.FC = () => {
    const [lanes, setLanes] = useState<LaneType[]>([])
    const [totalCount, setTotalCount] = useState<number>(-1)
    const [filter, setFilter] = useState<Filter>(Filter.All)
    const [searchTimeout, setSearchTimeout] = useState<number>(0)
    const [searchInputValue, setSearchInputValue] = useState<string>('')

    const fetchData = async (fcLanes: LaneType[] = lanes ,searchQuery: string = '') => {
        try {
            const response = await Axios.get(`/api/my-lanes?limit=${fcLanes.length + 20}&filter=${filter}${searchQuery ? '&search=' + searchQuery : ''}`)
            setLanes(response.data.lanes)
            setTotalCount(parseInt(response.data.totalCount))
        } catch (err) {
            toast.error('Something went wrong while fetching the lanes.')
        }
    }

    useEffect(() => {
        const resettedLanes: LaneType[] = []
        setLanes(resettedLanes)
        setSearchInputValue('')
        fetchData(resettedLanes)
    }, [filter])

    const search = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTotalCount(1)
        setSearchInputValue(e.target.value)
        const searchValue = encodeURI(e.target.value.trim())
        clearTimeout(searchTimeout)
        const timeout = setTimeout(() => {
            fetchData(lanes,searchValue)
        }, 250)
        setSearchTimeout(timeout)
    }

    const toggleFilter = (clickedFilter: Filter) => {
        if (clickedFilter === filter) setFilter(Filter.All)
        else setFilter(clickedFilter)
    }

    if(totalCount === 0 && searchInputValue === '' && filter === Filter.All)  return (
        <>
            <div className={styles.noLanes}>
                <span>You have no lanes yet. </span>  
                <Link to="/create">Let's create one!</Link>
            </div>
        </>
    )

    return (
        <div className={styles.container}>
            <>
                <h1>Your Lanes</h1>
                <div className={styles.filters}>
                    <button onClick={() => toggleFilter(Filter.Public)}
                        className={filter === Filter.Public ? styles.active : ''}
                        type='button'
                    >public</button>

                    <button onClick={() => toggleFilter(Filter.Private)}
                        className={filter === Filter.Private ? styles.active : ''}
                        type='button'
                    >private</button>
                </div>
                <div className={styles.search}>
                    <IoSearchOutline />
                    <input type="search" name="search" placeholder='Search lanes...' id="search" 
                        value={searchInputValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => search(e)}
                    />
                </div>
                <div className={styles.lanes}>
                    <InfiniteScroll
                        style={{ overflow: 'visible' }}
                        dataLength={lanes.length}
                        next={fetchData}
                        hasMore={(lanes.length < totalCount)}
                        loader={
                            <p className={styles.infiniteInfo}>
                                Loading...
                            </p>
                        }
                        endMessage={
                            <p className={styles.infiniteInfo}>
                                End of the results.
                            </p>
                        }
                    >
                        {
                            lanes.map((lane, key) => (
                                <Lane fetchData={fetchData} lane={lane} key={key} />
                            ))
                        }
                    </InfiniteScroll>
                </div>
            </>
        </div>
    )
}

export default Me