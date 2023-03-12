import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { currentSpotsThunk } from '../../store/spots'
import OpenModalButton from "../OpenModalButton";
import './manageSpots.css'
import SpotDelete from "./SpotDelete";


export default function ManageSpots() {

    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    let allSpots = useSelector(state => Object.values(state?.spots));
    const sessionUser = useSelector(state => state?.session.user)

    allSpots = allSpots.filter(spot => spot.ownerId == sessionUser.id)
    useEffect(() => {
        dispatch(currentSpotsThunk())
    }, [dispatch, allSpots.length]);

    const div_name = (allSpots ? "user-spots" : "no-spots");

    const closeMenu = () => setShowMenu(false);

    // function handleDelete(spot) {
    //     // call a delete thunk
    //     dispatch(deleteSpotThunk(spot.id))
    // }

    return (
        <>
            {sessionUser && (

                <div className="manage-spots">
                    {allSpots.length ? (
                        <div>
                            <h1 id="header">Manage Spots</h1>
                            <div className={div_name} >
                                {allSpots.map(spot => {
                                    return (
                                        <>
                                            <div className='manage-spot-card' key={`spotId-${spot.id}`} >
                                                <div className="manage-spot-info" >
                                                    <h3>{spot.name}</h3>
                                                    <img src={spot.previewImage} alt={`previewimg${spot.id}`} id="spot-img" height={290} width={350} />
                                                    <div className="manage-spot-data" >
                                                        <p>${spot.price} night</p>
                                                        <p><i className="fa-solid fa-star"></i>{spot.avgRating}</p>
                                                    </div>
                                                </div>
                                                <div className="update-delete" >
                                                    <NavLink to={`/spots/update/${spot.id}`} >
                                                        <button id="spot">
                                                            Update
                                                        </button>
                                                    </NavLink>
                                                    <OpenModalButton
                                                        buttonText="Delete Spot"
                                                        onButtonClick={closeMenu}
                                                        modalComponent={<SpotDelete spotId={spot.id} />}
                                                    />
                                                </div>
                                            </div>
                                        </>
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
            )}
        </>
    )
}
