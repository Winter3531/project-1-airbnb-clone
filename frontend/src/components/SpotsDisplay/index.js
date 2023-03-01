import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { NavLink, Route } from 'react-router-dom'

import { allSpotThunk } from "../../store/spots"
import './spots.css'
import SpotDetails from "./SpotDetails"

export default function SpotsDisplay() {

    const dispatch = useDispatch();
    const allSpots = useSelector(state => Object.values(state.spots))


    useEffect(() => {
        dispatch(allSpotThunk())
    }, [dispatch])

    return (
        <div className='spots-container'>
            {allSpots.map(spot => {
                return (
                    <div className='spot-card' key={spot.id} >
                        <NavLink
                            to={`/spots/${spot.id}`}
                        >
                            <label>{spot.name}</label>
                            <img src={spot.previewImage} alt={`previewimg${spot.id}`} height={300} width={300} />
                        </NavLink>
                        <p>{spot.avgRating}</p>
                        <p>${spot.price} night</p>
                    </div>
                )
            })}
        </div>
    )
}
