import { csrfFetch } from "./csrf"

const All_SPOT = 'spots/ALL_SPOT';
const DETAILS_SPOT = 'spots/DETAILS_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT'

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

export function createSpot(newSpot) {
    return {
        type: CREATE_SPOT,
        newSpot
    }
}

export const allSpotThunk = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`);
    const data = await response.json();

    console.log(data)

    dispatch(getSpots(data.Spots));
    return response;
}

export const spotDataThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const data = await response.json();

    if (response.ok) {
        dispatch(spotData(data))
        return
    }
}

export const createSpotThunk = (spotObj) => async (dispatch) => {
    const newSpot = await csrfFetch(`/api/spots`, {
        method: 'POST',
        body: JSON.stringify(spotObj)
    });

    if (newSpot.ok){
        const spot = await newSpot.json();
        dispatch(createSpot(spot))
    }
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
            return {
                ...state,
                details: action.spotId
            }

        case CREATE_SPOT:
            const addedState = { ...state.spots};
            console.log("in the reducer", addedState)
            addedState[action.newSpot.id] = action.newSpot;

            return addedState;

        default:
            return state;
    }
}
