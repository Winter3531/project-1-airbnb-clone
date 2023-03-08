import { useParams, useHistory } from "react-router-dom"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateSpotThunk } from "../../store/spots";


// ******************* COMMENTED CODE IS FOR UPDATING ALL PICTURES ********


export default function UpdateSpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams()


    // useEffect(() => {
    //     dispatch(spotDataThunk(Number(spotId)))
    // }, [dispatch])

    const spot = useSelector(state => {
        const allSpots = Object.values(state?.spots)
        for (let spot of allSpots) {
            if (spot.id === Number(spotId)) {
                return spot
            }
        }
    })

    // const spotImages = useSelector(state => Object.values(state?.spots?.details?.SpotImages))


    const [country, setCountry] = useState(spot.country);
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setSTATE] = useState(spot.state);
    const [description, setDescription] = useState(spot.description);
    const [name, setName] = useState(spot.name);
    const [price, setPrice] = useState(spot.price);
    const [previewImage, setPreviewImage] = useState(spot.previewImage);
    // const [imageUrl1, setImageUrl1] = useState(spotImages[1].url);
    // const [imageUrl2, setImageUrl2] = useState(spotImages[2].url);
    // const [imageUrl3, setImageUrl3] = useState(spotImages[3].url);
    // const [imageUrl4, setImageUrl4] = useState(spotImages[4].url);

    const history = useHistory();


    const updatedSpot = {
        address,
        city,
        state,
        country,
        name,
        description,
        price,
        lat: 45.72967,
        lng: -108.52902,
    }

    // const imagesArr = [previewImage, imageUrl1, imageUrl2, imageUrl3, imageUrl4];

    // const newImgObj = []
    // for (let i = 0; i < imagesArr.length; i++) {
    //     let image = imagesArr[i];
    //     if (image) {
    //         if (i === 0) {
    //             newImgObj.push(
    //                 {
    //                     url: image,
    //                     preview: true
    //                 }
    //             )
    //         }
    //         if (i > 0) {
    //             newImgObj.push(
    //                 {
    //                     url: image,
    //                     preview: false
    //                 }
    //             )
    //         }
    //     }
    // }

    async function handleSubmit(e) {
        e.preventDefault()
        // ADD VALIDATIONS HERE USING STATE AND AN ERRORS ARRAY
        dispatch(updateSpotThunk(updatedSpot, spotId))

        history.push(`/spots/${spotId}`)
    }


    return (
        // dont render until spot and spotImages
        <div>
            {spot && /*spotImages &&*/ (
                <form className="create-form" onSubmit={handleSubmit}>
                    <h1>Update your Spot</h1>
                    <h2>Where's your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <label>Country</label>
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    ></input>

                    <label>Street Address</label>
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    ></input>

                    <label>City</label>
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    ></input>

                    <label>State</label>
                    <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={e => setSTATE(e.target.value)}
                    ></input>

                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amentities like fast wif or parking, and what you love about the neighborhood.</p>

                    <textarea
                        placeholder="Please write at least 30 characters"
                        rows="5"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    ></textarea>

                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input
                        type="text"
                        placeholder="Name of your spot"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    ></input>

                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>

                    <label>$</label>
                    <input
                        type="text"
                        placeholder="Price per night(USD)"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    ></input>

                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input
                        type="text"
                        placeholder="Preview Image URL"
                        value={previewImage}
                        onChange={e => setPreviewImage(e.target.value)}
                    ></input>
                    {/* <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl1}
                        onChange={e => setImageUrl1(e.target.value)}
                    ></input>
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl2}
                        onChange={e => setImageUrl2(e.target.value)}
                    ></input>
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl3}
                        onChange={e => setImageUrl3(e.target.value)}
                    ></input>
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl4}
                        onChange={e => setImageUrl4(e.target.value)}
                    ></input> */}

                    <button type="submit" >
                        Update Spot
                    </button>
                </form>
            )}
        </div>
    )
}
