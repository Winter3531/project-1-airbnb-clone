import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { createSpotThunk } from "../../store/spots";

import './createspot.css'

export default function CreateSpot() {
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setSTATE] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [imageUrl1, setImageUrl1] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [imageUrl3, setImageUrl3] = useState('');
    const [imageUrl4, setImageUrl4] = useState('');
    const [errors, setErrors] = useState([])

    const dispatch = useDispatch();
    const history = useHistory();


    const newSpot = {
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

    const imagesArr = [previewImage, imageUrl1, imageUrl2, imageUrl3, imageUrl4];

    const newImgObj = []
    for (let i = 0; i < imagesArr.length; i++) {
        let image = imagesArr[i];
        if (image) {
            if (i === 0) {
                newImgObj.push(
                    {
                        url: image,
                        preview: true
                    }
                )
            }
            if (i > 0) {
                newImgObj.push(
                    {
                        url: image,
                        preview: false
                    }
                )
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const validationError = []
        // ADD VALIDATIONS HERE USING STATE AND AN ERRORS ARRAY
        if (!country) validationError.push(["Country is required"]);
        if (!address) validationError.push(["Address is required"]);
        if (!city) validationError.push(["City is required"]);
        if (!state) validationError.push(["State is required"]);
        if (!description) validationError.push(["Description is required"]);
        if (description.length < 30) validationError.push(["Description must be greater then 30 characters"]);
        if (!name) validationError.push(["Name is required"]);
        if (name.length > 50) validationError.push(["Name must be less than 50 characters"]);
        if (!price || isNaN(price)) validationError.push(["Price is required and must be a number"])
        if (!previewImage) validationError.push(["Preview image is required"])
        if (validationError.length) setErrors(validationError)

        let createdSpot = await dispatch(createSpotThunk(newSpot, newImgObj))
        return history.push(`/spots/${createdSpot.id}`)
    }

    return (
        <form className="create-form" onSubmit={handleSubmit}>
            <h1>Create a new Spot</h1>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <h2>Where's your place located?</h2>
            <p>Guests will only get your exact address once they booked a reservation.</p>

            <div className="address-block">
                <div className="street-sub-block">
                    <label>Street Address</label>
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    ></input>
                </div>

                <div className="city-sub-block">
                    <label>City</label>
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    ></input>
                </div>

                <div className="state-sub-block">
                    <label>State</label>
                    <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={e => setSTATE(e.target.value)}
                    ></input>
                </div>

                <div className="country-sub-block">
                    <label>Country</label>
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    ></input>
                </div>
            </div>

            <hr className="line-break"></hr>

            <h2>Describe your place to guests</h2>
            <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>

            <label>Description</label>
            <textarea
                placeholder="Please write at least 30 characters"
                rows="5"
                value={description}
                onChange={e => setDescription(e.target.value)}
            ></textarea>

            <hr className="line-break"></hr>

            <h2>Create a title for your spot</h2>
            <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>

            <div id="name-input-block">
                <label>Name</label>
                <input
                    type="text"
                    placeholder="Name of your spot"
                    value={name}
                    onChange={e => setName(e.target.value)}
                ></input>
            </div>

            <hr className="line-break"></hr>

            <h2>Set a base price for your spot</h2>
            <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>

            <div>
                <label>$</label>
                <input
                    type="text"
                    placeholder="Price per night(USD)"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                ></input>
            </div>

            <hr className="line-break"></hr>

            <h2>Liven up your spot with photos</h2>
            <p>Submit a link to at least one photo to publish your spot.</p>

            <div className="images-inputs">
                <input
                    type="text"
                    placeholder="Preview Image URL"
                    value={previewImage}
                    onChange={e => setPreviewImage(e.target.value)}
                ></input>
                <input
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
                ></input>
            </div>

            <button
                type="submit"
                id="create-spot-submit"
            >
                Create Spot
            </button>
        </form>
    )
}
