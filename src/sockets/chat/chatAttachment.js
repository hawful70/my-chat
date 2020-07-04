import {
    emitNotifyToArray
} from './../../helpers/socketHelper';

const chatAttachment = (io, socket, clients) => {
    socket.on("chat-attachment", (data) => {
        let response = {
            currentUserId: socket.request.user._id,
            message: data.message
        }

        if (data.groupId) {
            response.currentGroupId = data.groupId;
            if (clients[data.groupId]) {
                emitNotifyToArray(clients, data.groupId, io, "response-chat-attachment", response);
            }
        }

        if (data.contactId) {
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-chat-attachment", response);
            }
        }

    });
}

module.exports = chatAttachment;