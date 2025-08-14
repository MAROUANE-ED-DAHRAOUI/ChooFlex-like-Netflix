// Login actions
export const loginStart = () => ({
  type: "LOGIN_START",
});

export const loginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const loginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error, // Added payload for error message
});

// Register actions (optional - if you want separate register actions)
export const registerStart = () => ({
  type: "REGISTER_START",
});

export const registerSuccess = (user) => ({
  type: "REGISTER_SUCCESS",
  payload: user,
});

export const registerFailure = (error) => ({
  type: "REGISTER_FAILURE",
  payload: error,
});

// Logout action
export const logout = () => ({
  type: "LOGOUT",
});

// Optional: Clear errors action
export const clearErrors = () => ({
  type: "CLEAR_ERRORS",
});
