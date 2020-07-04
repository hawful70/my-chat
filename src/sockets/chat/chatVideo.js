import {
    emitNotifyToArray
} from './../../helpers/socketHelper';

const chatVideo = (io, socket, clients) => {
    socket.on("caller-to-check-online", (data) => {
        if (clients[data.listenerId]) {
            let response = {
                callerId: socket.request.user._id,
                listenerId: data.listenerId,
                callerName: data.callerName
            }
            emitNotifyToArray(clients, data.listenerId, io, "server-request-peer-id-of-listener", response);
        } else {
            socket.emit("server-send-listener-is-offline");
        }
    });

    socket.on("listener-emit-peerId-to-server", (data) => {
        let response = {
            callerId: data.callerId,
            listenerId: data.listenerId,
            callerName: data.callerName,
            listenerName: data.listenerName,
            listenerPeerId: data.listenerPeerId
        }

        if (clients[data.callerId]) {
            emitNotifyToArray(clients, data.callerId, io, "server-send-peer-id-of-listener-to-caller", response);
        }
    });

    socket.on("caller-request-call-to-server", (data) => {
        let response = {
            callerId: data.callerId,
            listenerId: data.listenerId,
            callerName: data.callerName,
            listenerName: data.listenerName,
            listenerPeerId: data.listenerPeerId
        }

        if (clients[data.listenerId]) {
            emitNotifyToArray(clients, data.listenerId, io, "server-send-request-call-to-listener", response);
        }
    });

    socket.on("caller-cancel-request-call-to-server", (data) => {
        let response = {
            callerId: data.callerId,
            listenerId: data.listenerId,
            callerName: data.callerName,
            listenerName: data.listenerName,
            listenerPeerId: data.listenerPeerId
        }

        if (clients[data.listenerId]) {
            emitNotifyToArray(clients, data.listenerId, io, "server-send-cancel-request-call-to-listener", response);
        }
    });

    socket.on("listener-reject-request-call-to-server", (data) => {
        let response = {
            callerId: data.callerId,
            listenerId: data.listenerId,
            callerName: data.callerName,
            listenerName: data.listenerName,
            listenerPeerId: data.listenerPeerId
        }

        if (clients[data.callerId]) {
            emitNotifyToArray(clients, data.callerId, io, "server-send-reject-call-to-caller", response);
        }
    });

    socket.on("listener-accept-request-call-to-server", (data) => {
        let response = {
            callerId: data.callerId,
            listenerId: data.listenerId,
            callerName: data.callerName,
            listenerName: data.listenerName,
            listenerPeerId: data.listenerPeerId
        }

        if (clients[data.callerId]) {
            emitNotifyToArray(clients, data.callerId, io, "server-send-accept-call-to-caller", response);
        }
        if (clients[data.listenerId]) {
            emitNotifyToArray(clients, data.listenerId, io, "server-send-accept-call-to-listener", response);
        }
    });
}

module.exports = chatVideo;