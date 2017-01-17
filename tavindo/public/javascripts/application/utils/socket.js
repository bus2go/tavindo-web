import SocketIO from 'socket.io-client';

import store from './store';

const socket = SocketIO();

socket.onEvent = (event, action) => {
    socket.on(event, data => {
        console.log('[SOCK] socket.onEvent(' + event + ')', action, data);
        store.dispatch(action(data));
    });
};

socket.fireEvent = (event, data) => {
    console.log('[SOCK] socket.fireEvent(' + event + ')', data);
    socket.emit(event, data);
};

export default socket;