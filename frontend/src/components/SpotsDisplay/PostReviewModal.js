import { useState } from "react"
import { useDispatch } from "react-redux"

import { useModal } from '../../context/Modal';
import { addReviewThunk, spotReviewsThunk } from "../../store/reviews";
import { spotDataThunk } from "../../store/spots";

export default function PostReviewModal ({spotId}) {

    const dispatch = useDispatch()

    const [review, setReview] = useState('')
    const [stars, setStars] = useState(1)

    const { closeModal } = useModal();
    console.log(review, stars)

    const newReview = {
        review,
        stars
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(addReviewThunk(newReview, spotId))
        .then(dispatch(spotReviewsThunk(spotId)))
        .then(dispatch(spotDataThunk(spotId)))
        .then(closeModal)
    }

    return (
        <>
        <h1>Create a New Review</h1>
            <form
                className="review-input-form"
                onSubmit={handleSubmit}
            >
                <input
                    type='text'
                    value={review}
                    placeholder='Leave your review here...'
                    onChange={e => setReview(e.target.value)}
                    required
                />
                <select
                    id='star-rating'
                    onChange={e => setStars(e.target.value)}
                >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
                <button
                    type="submit"
                >Submit your Review</button>
            </form>
        </>
    )
}
