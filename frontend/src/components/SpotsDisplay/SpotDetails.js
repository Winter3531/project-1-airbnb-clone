import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { csrfFetch } from "../../store/csrf";
import { spotDataThunk } from "../../store/spots";


export default function SpotDetails () {
    const {spotId} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(spotDataThunk(spotId))
    }, [dispatch])

    const spot = useSelector(state => state.spots.details)

    console.log()

return (
    <div>
        Spot!
        {spot.address}
        {spot.SpotImages.map(image => <img src={image.url} />)}
    </div>
)
}
