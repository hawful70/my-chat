import {
    emitNotifyToArray
} from '../../helpers/socketHelper';

const removeRequestContactReceived = (io, socket, clients) => {
    socket.on("remove-request-contact-received", (data) => {
        let currentUser = {
            id: socket.request.user._id
        };

        if (clients[data.contactId]) {
            emitNotifyToArray(clients, data.contactId, io, "response-remove-request-contact-received", currentUser);
        }
    });
}

module.exports = removeRequestContactReceived;