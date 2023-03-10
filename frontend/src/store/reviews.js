import { csrfFetch } from "./csrf"

const SPOT_REVIEWS = 'reviews/SPOT_REVIEWS'
const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'

export function spotReviews(spotReviews) {
    return {
        type: SPOT_REVIEWS,
        spotReviews
    }
}

export function createReview(review) {
    return {
        type: CREATE_REVIEW,
        review
    }
}

export function deleteReview (reviewId) {
    return {
        type: DELETE_REVIEW,
        reviewId
    }
}



export const spotReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();

    if (response.ok) {
        dispatch(spotReviews(data));
        return response;
    }
}

export const addReviewThunk = (reviewData, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
    })

    const review = await response.json();

    if (response.ok) {
        dispatch(createReview(review))
    }
}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (response.ok){
        dispatch(deleteReview(reviewId))
        return response.json()
    }
}



export default function reviewsReducer(state = {}, action) {

    let newState = {};
    switch (action.type) {
        case SPOT_REVIEWS:
            action.spotReviews.Reviews.forEach(rev => {
                newState[rev.id] = rev;
            });
            return newState;

        case CREATE_REVIEW:
            newState = {
                ...state,
                [action.review.id]: action.review
            };
            return newState;

        case DELETE_REVIEW:
            newState = {...state};
            let review = action.reviewId;
            delete newState[review];
            return newState

        default:
            return state;
    }
}
