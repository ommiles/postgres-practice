// API CONSTANTS

const BASE_URL = 'http://localhost:3000';
const USERS_URL = BASE_URL + '/users';
const GET_USER_URL = BASE_URL + '/get_user';
const LOGIN_URL = BASE_URL + '/login';
const USER_URL = id => USERS_URL + '/' + id;

// REDUX ACTIONS

// push a user to the db
export const createUser = info => {
  return dispatch => {
    dispatch({ type: "FETCH_SIGNUP_REQUEST" });
    fetch(USERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          username: info.username,
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw resp;
        }
        return resp.json();
      })
      .then((data) => {
        if (data.message === "Incorrect Username or Password") {
          localStorage.removeItem("token");
          dispatch({ type: "FETCH_SIGNUP_FAILURE" });
        } else {
          let user = data.user;
          dispatch({ type: "FETCH_SIGNUP_SUCCESS", user });
          dispatch({ type: "LOGIN_USER_SUCCESS", user });
          localStorage.setItem("token", data.token);
        }
      });
  }
};

// get user object from db
// gain access to user actions in controller
// with jwt token we are :authorized
export const loginUser = ({ username, password }) => {
  return dispatch => {
    dispatch({ type: 'LOGIN_USER_REQUEST' });
    fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(resp => {
        if (!resp.ok) {
          throw resp;
        }
        return resp.json();
      })
      .then(data => {
        console.log(data);
        if (data.message === 'Incorrect Username or Password') {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGIN_USER_FAILURE' });
        } else {
          localStorage.setItem('token', data.token);
          let user = data.user;
          dispatch({ type: 'LOGIN_USER_SUCCESS', user });
        }
      });
  };
};

// fetch individual user now that 
// we have stored the token to retrieve it
export const persistUser = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (token) {
        return fetch(GET_USER_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(resp => {
          return resp.json();
        })
        .then(data => {
          if (data.message) {
            localStorage.removeItem('token');
          } else {
            let user = data.user;
            dispatch({ type: 'FETCH_LOGIN_SUCCESS', user });
          }
        });
    }
  };
};

export const editUser = user => {
  return dispatch => {
    const token = localStorage.token;
    dispatch({ type: 'FETCH_USER_REQUEST' });
    if (token) {
      return fetch(USER_URL(user.id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: user.username,
        }),
      })
        .then(resp => {
          return resp.json();
        })
        .then(user => dispatch({ type: 'EDIT_USER_SUCCESS', user }));
    }
  };
};

export const deleteUser = userId => {
  return dispatch => {
    dispatch({ type: 'FETCH_USER_REQUEST' });
    fetch(USER_URL(userId), {
      method: 'DELETE',
    })
      .then(resp => resp.json())
      .then(() => {
        localStorage.removeItem('token');
        dispatch({ type: 'DELETE_USER_SUCCESS' });
      });
  };
};

export const logout = () => {
  return dispatch => {
    localStorage.clear();
    dispatch({ type: 'LOGOUT_REQUEST' });
  };
};
