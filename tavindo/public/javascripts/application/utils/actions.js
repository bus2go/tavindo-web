import { createAction } from 'redux-act';

const loginSuccess = createAction('loginSuccess');
const logoutSuccess = createAction('logoutSuccess');
const modalClose = createAction('modalClose');
const usersLoadSuccess = createAction('usersLoadSuccess');

export {
    loginSuccess,
    logoutSuccess,
    modalClose,
    usersLoadSuccess
};