import { csrfFetch } from "./csrf"

const All_SPOT = 'spots/ALL_SPOT'

export function getSpots (allSpots) {
    return {
        type: All_SPOT,
        allSpots
    }
}

export const allSpotThunk = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`);
    const data = await response.json();

    console.log("xxxxxxxxxxxxxxxx", data.Spots)
    dispatch(getSpots(data.Spots));
    return response;
}

export default function spotsReducer (state = {}, action) {

    switch (action.type) {
        case All_SPOT:
            const newState = {};
            action.allSpots.forEach(spot => {
                newState[spot.id] = spot;
            })

            return {
                ...newState,
                ...state
            };

        default:
            return state;
    }
}
