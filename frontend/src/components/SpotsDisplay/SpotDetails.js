import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { spotDataThunk } from "../../store/spots";


export default function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(spotDataThunk(spotId))
    }, [dispatch, spotId])

    const spot = useSelector(state => state?.spots?.details)

    return (
        <div>
            {spot && (
                <div>
                    <h1>{spot.name}</h1>
                    {spot.SpotImages.map(image => <img src={image.url} alt={`imageId-${image.id}`} key={image.id} />)}
                    <p>{spot.city}, {spot.state}, {spot.country}</p>
                    <p>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
                    <p>{spot.description}</p>
                    <p>${spot.price}/night</p>
                </div>
            )}
            <button
                onClick={e => alert("Feature coming soon!")}
            >Reserve</button>
        </div>
    )
}
