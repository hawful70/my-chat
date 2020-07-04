import {
    emitNotifyToArray
} from './../../helpers/socketHelper';

const typingOff = (io, socket, clients) => {
    socket.on("user-is-not-typing", (data) => {
        let response = {
            currentUserId: socket.request.user._id
        }

        if (data.groupId) {
            response.currentGroupId = data.groupId;
            if (clients[data.groupId]) {
                emitNotifyToArray(clients, data.groupId, io, "response-user-is-not-typing", response);
            }
        }

        if (data.contactId) {
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-user-is-not-typing", response);
            }
        }

    });
}

module.exports = typingOff;