import { createStore, combineReducers } from 'redux';
import { createReducer } from 'redux-act';

import { INFO, WARNING, ERROR } from '../components/modal.view';

import { loginSuccess, logoutSuccess, modalClose, busLinesLoaded, busLineSelected, busUpdated } from './actions';

const LIMIT = 5;

const userReducer = createReducer({
    [loginSuccess]: (state, payload) => { return { ...state, user: payload.user }; },
    [logoutSuccess]: (state, payload) => { return { ...state, user: null }; }
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
    [busLinesLoaded]: (state, payload) => {
        return { ...state, busLines: payload };
    },
    [busLineSelected]: (state, payload) => { return { ...state,
        busLine: { ...state.busLine, 
            selected: payload.routeId,
            itinerary: payload.itinerary,
            cars: {}
        }
    }; },
    [busUpdated]: (state, payload) => {
        let cars = Object.assign({}, state.busLine.cars);
        
        if(cars[payload.ordem] && cars[payload.ordem].dataHora == payload.dataHora) return state;
        
        cars[payload.ordem] = payload;
        return { ...state,
            busLine: { ...state.busLine, cars: cars }
        };
    },
}, {
    busLine: null,
    busLines: null
});

const store = createStore(combineReducers({
    userState: userReducer,
    messagesState: messagesReducer,
    busLineState: busLineReducer
}));

export default store;