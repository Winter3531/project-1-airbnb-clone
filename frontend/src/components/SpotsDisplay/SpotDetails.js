import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { spotReviewsThunk } from "../../store/reviews";
import { spotDataThunk } from "../../store/spots";
import PostReviewModal from "./PostReviewModal";
import OpenModalButton from "../OpenModalButton";
import ReviewDelete from "./ReviewDelete";

import './spotdetails.css'



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

    const dotNoDot = spot?.numReviews < 1 ? <div><i className="fa-solid fa-star"></i> {spot?.avgStarRating} </div> : <div><i className="fa-solid fa-star"></i> {spot?.avgStarRating} · {spot?.numReviews} {pluralReview} </div>

    let noReviews = true;
    allReviews?.map(review => {
        if (review.userId === sessionUser) {
            return noReviews = false;
        }
    })

    // for (let review of allReviews){
    //     console.log(review.userId, sessionUser)
    //     if(review.userId === sessionUser){
    //         noReviews = false;
    //         return;
    //     }
    // }

    const closeMenu = () => setShowMenu(false);

    return (
        <div className="spot-details-page">
            {spot && allReviews && (
                <div className="spot-details">
                    <h1>{spot.name}</h1>
                    <h3>{spot.city}, {spot.state}, {spot.country}</h3>
                    {spot && spot?.SpotImages && (
                        <div className="images-container">
                            <img src={spot?.SpotImages[0]?.url} alt={`imageId-preview-image`} className="spot-detail-images" />
                            <div className="sub-images-container">
                                {spot?.SpotImages?.slice(1).map(image => <img src={image.url} alt={`imageId-${image.id}`} key={image.id} className="spot-detail-images" />)}
                            </div>
                        </div>
                    )}
                    <div className="spot-description-price-reserve">
                        <div className="spot-owner-desription">
                            <h2>Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}</h2>
                            <p>{spot.description}</p>
                        </div>
                        <div className="callout-box" >
                            <div id="callout-box-upper">
                                {dotNoDot}
                                <div id="price">${spot.price}/night</div>
                            </div>
                            <button
                                id="reserve-button"
                                onClick={e => alert("Feature coming soon!")}
                            >Reserve</button>
                        </div>
                    </div>
                    <hr></hr>
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
                                        <p>{MONTHS[(Number(review?.createdAt.slice(5, 7))) - 1]} {review?.createdAt.slice(0, 4)}</p>
                                        <p>{review?.review}</p>
                                        {review.userId === sessionUser && (
                                            <OpenModalButton
                                                buttonText="Delete Review"
                                                onButtonClick={closeMenu}
                                                modalComponent={<ReviewDelete reviewId={review.id} spotId={spotId} />}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {sessionUser && sessionUser !== spot?.ownerId && noReviews && (
                        <OpenModalButton
                            buttonText="Post Review"
                            onButtonClick={closeMenu}
                            modalComponent={<PostReviewModal spotId={spotId} />}
                        />
                    )}
                </div>
            )}
        </div>
    )
}
