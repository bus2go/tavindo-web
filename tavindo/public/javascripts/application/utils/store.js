import { createStore, combineReducers } from 'redux';
import { createReducer } from 'redux-act';

import { INFO, WARNING, ERROR } from '../components/modal.view';

import { loginSuccess, logoutSuccess, modalClose, usersLoadSuccess } from './actions';

const userReducer = createReducer({
    [loginSuccess]: (state, payload) => { return { ...state, user: payload.user }; },
    [logoutSuccess]: (state, payload) => { return { ...state, user: payload.user }; }
}, {
    user: null
});

const messagesReducer = createReducer({
    [loginSuccess]: (state, payload) => { return { ...state, 
        messages: [ ...state.messages, payload.message ]
    }; },
    [logoutSuccess]: (state, payload) => { return { ...state, 
        messages: [ ...state.messages, payload.message ]
    }; },
    [modalClose]: (state) => { return { ...state,
        messages: []
    }; }
}, {
    messages: []
});

const usersReducer = createReducer({
    [usersLoadSuccess]: (state, payload) => { return { ...state, users: payload.users }; }
}, {
    users: []
});

const store = createStore(combineReducers({
    userState: userReducer,
    messagesState: messagesReducer,
    usersState: usersReducer
}));

export default store;