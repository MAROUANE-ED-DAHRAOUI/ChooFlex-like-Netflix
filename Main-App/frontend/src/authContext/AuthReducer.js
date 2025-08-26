const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
      return {
        ...state,
        user: null,
        isFetching: true,
        error: null, // Changed from false to null for better error handling
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isFetching: false,
        error: null,
      };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        ...state,
        user: null,
        isFetching: false,
        error: action.payload || "An error occurred", // Store actual error message
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching: false,
        error: null,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return { ...state };
  }
};

export default AuthReducer;
