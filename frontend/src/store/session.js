import { csrfFetch } from "./csrf"
// All actions specific to the session user info/session user redux reducerlo

const SET_USER = 'session/SET_USER'
const REMOVE_USER = 'session/REMOVE_USER'

export function setUser (user) {
    return {
        type: SET_USER,
        user
    }
}

export function removeUser () {
    return {
        type: REMOVE_USER
    }
}

export const login = (user) => async (dispatch) => {
    const {credential, password} = user;
    const response = await csrfFetch(`/api/session`, {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password,
        }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
}

export const restore = () => async (dispatch) => {
    const res = await csrfFetch(`/api/session`);
    const data = await res.json();
    dispatch(setUser(data.user));
    return res;
}

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

const initialState = {
    user: null
}

export default function sessionReducer (state = initialState, action) {
    let newState;
    switch (action.type) {
        case SET_USER:
            return newState = {user: action.user};

        case REMOVE_USER:
            newState = initialState;
            return newState;

        default:
            return state;
    }
}
