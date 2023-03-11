import { csrfFetch } from "./csrf"

const All_SPOT = 'spots/ALL_SPOT';
const DETAILS_SPOT = 'spots/DETAILS_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT'
const CURRENT_SPOT = 'spots/CURRENT_SPOT'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'

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

export function currentSpots(userSpots) {
    return {
        type: CURRENT_SPOT,
        userSpots
    }
}

export function updateSpot(updatedSpot) {
    return {
        type: UPDATE_SPOT,
        updatedSpot
    }
}

export function deleteSpot(spotId) {
    return {
        type: DELETE_SPOT,
        spotId
    }
}



export const allSpotThunk = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`);
    const data = await response.json();

    // console.log(data)

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

export const createSpotThunk = (spotObj, images) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        body: JSON.stringify(spotObj)
    });

    const spot = await response.json();
    console.log(response)

    for await (let image of images) {
        const addImage = await csrfFetch(`/api/spots/${spot.id}/images`, {
            method: 'POST',
            body: JSON.stringify(image)
        });
    }
    if (response.ok) {
        dispatch(createSpot(spot))
        return spot
    }

}

export const currentSpotsThunk = (user) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/current`)
    const allSpots = await response.json();

    if (response.ok) {
        dispatch(currentSpots(Object.values(allSpots)))
        return allSpots
    }
}

export const updateSpotThunk = (updateSpot, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify(updateSpot)
    })

    if (response.ok) {
        const spotData = await response.json()
        dispatch(spotData);
        return spotData
    }
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })

    if (response.ok){
        dispatch(deleteSpot(spotId))
        return response.json()
    }
}



export default function spotsReducer(state = {}, action) {

    let newState = {};
    switch (action.type) {
        case All_SPOT:
            action.allSpots.forEach(spot => {
                newState[spot.id] = spot;
            })

            return {
                ...newState,
            };

        case DETAILS_SPOT:
            return {
                // ...state,
                // details: action.spotId
                ...state, [action.spotId.id]: action.spotId
            }

        case CREATE_SPOT:
            const addedState = { ...state.spots };
            // console.log("in the reducer", addedState)
            addedState[action.newSpot.id] = action.newSpot;

            return addedState;

        case CURRENT_SPOT:
            action.userSpots[0].forEach(spot => {
                newState[spot.id] = spot
            })
            return newState

        case UPDATE_SPOT:
            const updatedState = { ...state.spots };
            // console.log("in the reducer", addedState)
            updatedState[action.newSpot.id] = action.newSpot;

            return updatedState;

        case DELETE_SPOT:
            newState = { ...state }
            let spot = action.spotId
            delete newState[spot]
            return newState

        default:
            return state;
    }
}
