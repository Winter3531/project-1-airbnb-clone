import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

import { allSpotThunk } from "../../store/spots"
import './spots.css'

export default function SpotsDisplay() {

    const dispatch = useDispatch();
    const allSpots = useSelector(state => Object.values(state.spots))


    useEffect(() => {
        console.log("made it here");
        dispatch(allSpotThunk())
    }, [dispatch])

    console.log("xyxyxyxyxyxy", allSpots)

    return (
        <div className='spots-container'>
            {allSpots.map(spot => {
                return (

                    <div className='spot-card' key={spot.id}>
                        {spot.name}
                        <img src={spot.previewImage} alt={`previewimg${spot.id}`} height={300} width={300} />
                        {spot.avgRating}
                        ${spot.price} night
                    </div>
                )
            })}

        </div>
    )
}
