import {
    emitNotifyToArray
} from './../../helpers/socketHelper';

const chatTextEmoji = (io, socket, clients) => {
    socket.on("chat-text-emoji", (data) => {
        let response = {
            currentUserId: socket.request.user._id,
            message: data.message
        }

        if (data.groupId) {
            response.currentGroupId = data.groupId;
            if (clients[data.groupId]) {
                emitNotifyToArray(clients, data.groupId, io, "response-chat-text-emoji", response);
            }
        }

        if (data.contactId) {
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-chat-text-emoji", response);
            }
        }

    });
}

module.exports = chatTextEmoji;