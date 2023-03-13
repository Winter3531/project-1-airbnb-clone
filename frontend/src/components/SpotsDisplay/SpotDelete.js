import { useDispatch, useSelector } from "react-redux";

import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spots";
import { currentSpotsThunk } from "../../store/spots";

import './spotdelete.css'

export default function SpotDelete({ spotId }) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async (e) => {
        e.preventDefault();
        await dispatch(deleteSpotThunk(spotId))
            .then(closeModal)
    }

    return (
        <div className="delete-confirmation-form">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot?</p>
            <div>
                <button
                    onClick={handleDelete}
                >
                    Yes
                </button>
                <button
                    onClick={closeModal}
                >
                    No
                </button>
            </div>
        </div>
    )
}
