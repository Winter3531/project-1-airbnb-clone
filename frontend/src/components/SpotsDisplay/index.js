import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { NavLink } from 'react-router-dom'

import { allSpotThunk } from "../../store/spots"
import './Spots.css'

export default function SpotsDisplay() {

    const dispatch = useDispatch();
    const allSpots = useSelector(state => Object.values(state?.spots))


    useEffect(() => {
        dispatch(allSpotThunk())
    }, [dispatch])

    return (
        <div className="all-spots-page">
            {allSpots && (
                <div className='spots-container'>
                    {allSpots.map(spot => {
                        return (
                            <div className='spot-card' key={`spotId-${spot.id}`} >
                                <NavLink to={`/spots/${spot.id}`} >
                                    <img className="spot-image-main" src={spot.previewImage} alt={`previewimg-${spot.id}`} height={265} width={300} />
                                    <div className="spot-data">
                                        <div className="spot-name-price-div">
                                            <h3 id="spot-name">{spot.city}, {spot.state}</h3>
                                            <p id="spot-price">${spot.price} night</p>
                                        </div>
                                        <div className="spot-review-div" >
                                            <p id="spot-review" ><i className="fa-solid fa-star"></i> {spot.avgRating}</p>
                                        </div>
                                    </div>
                                </NavLink>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
