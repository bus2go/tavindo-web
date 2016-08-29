import { createAction } from 'redux-act';

const loginSuccess = createAction('loginSuccess');
const logoutSuccess = createAction('logoutSuccess');

const modalClose = createAction('modalClose');

const busLineSelected = createAction('busLineSelected');
const busLineCarsLoaded = createAction('busLineCarsLoaded');
const busLineItineraryLoaded = createAction('busLineItineraryLoaded');

export {
    loginSuccess,
    logoutSuccess,
    modalClose,
    busLineSelected,
    busLineCarsLoaded,
    busLineItineraryLoaded
};