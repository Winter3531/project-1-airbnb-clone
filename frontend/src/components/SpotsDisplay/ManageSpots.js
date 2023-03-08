import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { currentSpotsThunk, deleteSpotThunk } from '../../store/spots'
import './manageSpots.css'


export default function ManageSpots() {
    let allSpots = useSelector(state => Object.values(state?.spots));
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state?.session.user)

    allSpots = allSpots.filter(spot => spot.ownerId == sessionUser.id)
    useEffect(() => {
        dispatch(currentSpotsThunk())
    }, [dispatch]);

    const div_name = (allSpots ? "user-spots" : "no-spots");

    function handleDelete (spot) {
        // call a delete thunk
        dispatch(deleteSpotThunk(spot.id))
    }

    return (
        <div>
            {allSpots.length ? (
                <div>
                    <h1>Manage Spots</h1>
                    <div className={div_name} >
                        {allSpots.map(spot => {
                            return (
                                <div className='spot-card' key={`spotId-${spot.id}`} >
                                    <div className="spot-info" >
                                        <h3>{spot.name}</h3>
                                        <img src={spot.previewImage} alt={`previewimg${spot.id}`} height={250} width={320} />
                                        <p>{spot.avgRating}</p>
                                        <p>${spot.price} night</p>
                                    </div>
                                    <div
                                        className="update-delete"
                                    >
                                        <NavLink to={`/spots/update/${spot.id}`} >
                                            <button>
                                                Update
                                            </button>
                                        </NavLink>
                                        <button
                                            onClick={() => handleDelete(spot)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className={div_name}>
                    <NavLink to="/spots/new">
                        <button>
                            Create a New Spot
                        </button>
                    </NavLink>
                    <h1>You have not created any spots yet.</h1>
                </div>
            )}
        </div>
    )
}
