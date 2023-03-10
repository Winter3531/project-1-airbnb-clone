import { useDispatch } from 'react-redux';

import { useModal } from '../../context/Modal';
import { deleteReviewThunk } from '../../store/reviews';
import { spotDataThunk } from '../../store/spots';

export default function ReviewDelete ({reviewId, spotId}) {

    const dispatch = useDispatch()
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(deleteReviewThunk(reviewId))
            .then(dispatch(spotDataThunk(spotId)))
            .then(closeModal)
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button
                onClick={handleSubmit}
            >Yes</button>
            <button
                onClick={closeModal}
            >No</button>
        </>
    )
}
