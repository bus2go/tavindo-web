import { createAction } from 'redux-act';

const loginSuccess = createAction('loginSuccess');
const logoutSuccess = createAction('logoutSuccess');

const modalClose = createAction('modalClose');

const busLinesLoaded = createAction('busLinesLoaded');

const busLineSelected = createAction('busLineSelected', payload => {
    return {
        routeId: payload.routeId,
        itinerary: {
            way: {
                label: payload.data.route_headsign1,
                path: payload.data.route_poly1
            },
            ret: {
                label: payload.data.route_headsign2,
                path: payload.data.route_poly2
            }
        }
    };
});

const busUpdated = createAction('busUpdated', payload => payload);

export {
    loginSuccess,
    logoutSuccess,
    modalClose,
    busLinesLoaded,
    busLineSelected,
    busUpdated
};