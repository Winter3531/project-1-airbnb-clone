import { csrfFetch } from "./csrf"

const All_SPOT = 'spots/ALL_SPOT';
const DETAILS_SPOT = 'spots/DETAILS_SPOT';

export function getSpots(allSpots) {
    return {
        type: All_SPOT,
        allSpots
    }
}

export function spotData(spotId) {
    return {
        type: DETAILS_SPOT,
        spotId
    }
}

export const allSpotThunk = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`);
    const data = await response.json();

    dispatch(getSpots(data.Spots));
    return response;
}

export const spotDataThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const data = await response.json();

    dispatch(spotData(data))
    console.log("LOG FROM THE THUNK", data)
    return response;
}

export default function spotsReducer(state = {}, action) {

    switch (action.type) {
        case All_SPOT:
            const newState = {};
            action.allSpots.forEach(spot => {
                newState[spot.id] = spot;
            })

            return {
                ...newState,
            };

        case DETAILS_SPOT:
            console.log("FROM THE REDUCER", action.spotId)
            return {
                // ...state,
                details: action.spotId
            }

        default:
            return state;
    }
}
