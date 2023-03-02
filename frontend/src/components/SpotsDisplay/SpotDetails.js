import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { csrfFetch } from "../../store/csrf";
import { spotDataThunk } from "../../store/spots";


export default function SpotDetails () {
    const {spotId} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("in the useEffect", spotId)
        dispatch(spotDataThunk(spotId))
    }, [dispatch])

    const spot = useSelector(state => state?.spots?.details)

    console.log("LOG FROM THE DETAIL COMPONENT", spot)

    // const imagesUrl = []
    // spot.SpotImages.map(image => {
    //     imagesUrl.push(image.url)
    // })

    // console.log(imagesUrl)

return (
    <div>
        {/* {spot.SpotImages.map(image =>  <img src={image.url} />)} */}
        {/* <p>{spot.address} {spot.city}, {spot.state}, {spot.country}</p> */}
        {/* <p>{spot.Owner.firstName} {spot.Owner.lastName}</p> */}
        {/* <p>{spot.description}</p> */}
        {/* <p>${spot.price}/night</p> */}
    </div>
)
}
