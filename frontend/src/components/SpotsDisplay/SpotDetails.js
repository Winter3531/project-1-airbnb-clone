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
                <div className="spot-details">
                    <h1>{spot.name}</h1>
                    <h3>{spot.city}, {spot.state}, {spot.country}</h3>
                    {spot.SpotImages.map(image => <img src={image.url} alt={`imageId-${image.id}`} key={image.id} />)}
                    <div>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
                    <p>{spot.description}</p>
                    <div className="callout-box" >
                        <div>${spot.price}/night</div>
                        <button
                            onClick={e => alert("Feature coming soon!")}
                        >Reserve</button>
                    </div>
                </div>
            )}
        </div>
    )
}
