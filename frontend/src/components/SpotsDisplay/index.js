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
        <>
            <h1 id="header">Spots</h1>
            <div className="all-spots-page">
                {allSpots && (
                    <div className='spots-container'>
                        {allSpots.map(spot => {
                            return (
                                <>
                                    <div className='spot-card' key={`spotId-${spot.id}`} >
                                        <NavLink to={`/spots/${spot.id}`} >
                                            <img src={spot.previewImage} alt={`previewimg-${spot.id}`} height={315} width={350} />
                                            <div className="spot-data">
                                                <div className="spot-name-price">
                                                    <h3 id="spot-name">{spot.name}</h3>
                                                    <p className="spot-review"><i className="fa-solid fa-star"></i> {spot.avgRating}</p>
                                                    <p id="spot-price">${spot.price} night</p>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}
