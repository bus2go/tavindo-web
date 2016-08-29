import { createStore, combineReducers } from 'redux';
import { createReducer } from 'redux-act';

import { INFO, WARNING, ERROR } from '../components/modal.view';

import { loginSuccess, logoutSuccess, modalClose, busLineSelected, busLineCarsLoaded, busLineItineraryLoaded } from './actions';

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

const busLineReducer = createReducer({
    [busLineSelected]: (state, payload) => { return { ...state, 
        busLine: { ...state.busLine, selected: payload.linha }
    }; },
    [busLineCarsLoaded]: (state, payload) => { return { ...state,
        busLine: { ...state.busLine, cars: payload.cars }
    }; },
    [busLineItineraryLoaded]: (state, payload) => { return { ...state,
        busLine: { ...state.busLine, itinerary: payload.itinerary }
    }; },
}, {
    busLine: null
});

const store = createStore(combineReducers({
    userState: userReducer,
    messagesState: messagesReducer,
    busLineState: busLineReducer
}));

export default store;