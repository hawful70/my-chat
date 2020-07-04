import {
    emitNotifyToArray
} from './../../helpers/socketHelper';

const typingOn = (io, socket, clients) => {
    socket.on("user-is-typing", (data) => {
        let response = {
            currentUserId: socket.request.user._id
        }


        if (data.groupId) {
            response.currentGroupId = data.groupId;
            if (clients[data.groupId]) {
                emitNotifyToArray(clients, data.groupId, io, "response-user-is-typing", response);
            }
        }

        if (data.contactId) {
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-user-is-typing", response);
            }
        }

    });
}

module.exports = typingOn;