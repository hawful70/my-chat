import {
    emitNotifyToArray
} from '../../helpers/socketHelper';

const removeRequestContactSent = (io, socket, clients) => {
    socket.on("remove-request-contact", (data) => {
        let currentUser = {
            id: socket.request.user._id
        };

        if (clients[data.contactId]) {
            emitNotifyToArray(clients, data.contactId, io, "response-remove-request-contact", currentUser);
        }
    });
}

module.exports = removeRequestContactSent;