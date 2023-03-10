import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { spotReviewsThunk } from "../../store/reviews";
import { spotDataThunk } from "../../store/spots";
import PostReviewModal from "./PostReviewModal";
import OpenModalButton from "../OpenModalButton";
import ReviewDelete from "./ReviewDelete";


export default function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    const sessionUser = useSelector(state => state?.session?.user?.id)
    const spot = useSelector(state => state?.spots[spotId]);
    const allReviews = useSelector(state => Object.values(state?.reviews)).reverse();

    const MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "Spetember",
        "October",
        "November",
        "December"
    ]

    useEffect(() => {
        dispatch(spotDataThunk(spotId));
        dispatch(spotReviewsThunk(spotId));
    }, [dispatch, allReviews?.length, spotId])

    const pluralReview = spot?.numReviews > 1 ? 'Reviews' : 'Review'

    const dotNoDot = spot?.numReviews < 1 ? <div>"Star" {spot?.avgStarRating}</div> : <div>"Star" {spot?.avgStarRating} · {spot?.numReviews} {pluralReview}</div>

    const closeMenu = () => setShowMenu(false);

    return (
        <div>
            {spot && allReviews && (
                <div className="spot-details">
                    <h2>{spot.name}</h2>
                    <h3>{spot.city}, {spot.state}, {spot.country}</h3>
                    {spot?.SpotImages?.map(image => <img src={image.url} alt={`imageId-${image.id}`} key={image.id} />)}
                    <h2>Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}</h2>
                    <p>{spot.description}</p>
                    <div className="callout-box" >
                        {dotNoDot}
                        <div>${spot.price}/night</div>
                        <button
                            onClick={e => alert("Feature coming soon!")}
                        >Reserve</button>
                    </div>
                    <div className="review-listing" >
                        {dotNoDot}
                        {!allReviews.length && sessionUser !== spot.ownerId ? (
                            <div>
                                <h3>Be the first to post a review!</h3>
                            </div>
                        ) : (
                            <div>
                                {allReviews && allReviews.map(review => (
                                    <div key={`review-${review.id}`} >
                                        <h3>{review?.User?.firstName} {review?.User?.lastName}</h3>
                                        {console.log(MONTHS[(Number(review?.createdAt.slice(4,7))) - 1])}
                                        <p>{MONTHS[(Number(review?.createdAt.slice(5,7))) - 1]} {review?.createdAt.slice(0,4)}</p>
                                        <p>{review?.review}</p>
                                        {review.userId === sessionUser && (
                                                <OpenModalButton
                                                    buttonText="Delete Review"
                                                    onButtonClick={closeMenu}
                                                    modalComponent={<ReviewDelete reviewId={review.id} spotId={spotId}/>}
                                                />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {sessionUser !== spot?.ownerId && (
                <OpenModalButton
                    buttonText="Post Review"
                    onButtonClick={closeMenu}
                    modalComponent={<PostReviewModal spotId={spotId} />}
                />
            )}
        </div>
    )
}
