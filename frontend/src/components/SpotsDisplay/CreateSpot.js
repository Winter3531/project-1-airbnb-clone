import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { createSpotThunk } from "../../store/spots";

export default function CreateSpot() {
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setSTATE] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [previewImage, setPreviewImage] = useState('');
    const [imageUrl1, setImageUrl1] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [imageUrl3, setImageUrl3] = useState('');
    const [imageUrl4, setImageUrl4] = useState('');

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
        lat: 50,
        lng: 50,
    }

    const handleSubmit = (e) => {
        dispatch(createSpotThunk(newSpot))
        // history.push('/spots')
        e.preventDefault()
    }


    return (
        <form className="create-form" onSubmit={handleSubmit}>
            <h1>Create a new Spot</h1>
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
                placeholder="STATE"
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

            <button type="submit" >
                Create Spot
            </button>
        </form>
    )
}
