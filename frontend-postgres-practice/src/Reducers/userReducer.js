const initialState = {
  currentUser: {},
  loading: false,
  error: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_USER_REQUEST':
      return {
        ...state,
        loading: true,
        error: false,
      };
    case 'FETCH_SIGNUP_REQUEST':
      return {
        ...state,
        loading: true,
        error: false,
      };
    case 'FETCH_SIGNUP_FAILURE':
      return {
        ...state,
        loading: false,
        error: true,
      };
    case 'FETCH_SIGNUP_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
      };
    case 'LOGIN_USER_REQUEST':
      return {
        ...state,
        loading: true,
        error: false,
      };
    case 'LOGIN_USER_FAILURE':
      return {
        currentUser: {},
        loading: true,
        error: true,
      };
    case 'LOGIN_USER_SUCCESS':
      return {
        ...state,
        currentUser: action.user,
        loading: false,
        error: false,
      };
    case 'EDIT_USER_SUCCESS':
      if (state.users.findIndex) {
        const index = state.users.findIndex(user => user.id === action.user.id);
        return {
          ...state,
          users: [
            ...state.users.slice(0, index),
            action.user,
            ...state.users.slice(index + 1),
          ],
          loading: false,
          error: false,
        };
      } else {
        return { ...state, loading: false, error: false };
      }
    case 'DELETE_USER_SUCCESS':
      return {
        currentUser: {},
        loading: false,
        error: false,
      };
    case 'LOGOUT_REQUEST':
      return {
        currentUser: {},
        loading: false,
        error: false,
      };
    default:
      return state;
  }
};
