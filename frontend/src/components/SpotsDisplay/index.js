import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { NavLink } from 'react-router-dom'

import { allSpotThunk } from "../../store/spots"
import './spots.css'

export default function SpotsDisplay() {

    const dispatch = useDispatch();
    const allSpots = useSelector(state => Object.values(state?.spots))


    useEffect(() => {
        dispatch(allSpotThunk())
    }, [dispatch])

    return (
        <div>
            {allSpots && (
                <div className='spots-container'>
                    {allSpots.map(spot => {
                        return (
                            <div className='spot-card' key={`spotId-${spot.id}`} >
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
            )}
        </div>
    )
}
