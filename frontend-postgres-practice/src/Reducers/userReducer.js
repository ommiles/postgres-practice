const initialState = {
  users: [],
  loading: false,
  error: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case '_REQUEST':
      return {
        ...state,
        loading: true,
        error: false,
      };
    case '_SUCCESS':
      return {
        ...state,
        loading: true,
        error: false,
      };
    case '_FAILURE':
      return {
        ...state,
        loading: true,
        error: false,
      };
    default:
      return state;
  }
};
