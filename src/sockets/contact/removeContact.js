import {
    emitNotifyToArray
} from '../../helpers/socketHelper';

const removeContact = (io, socket, clients) => {
    socket.on("remove-contact", (data) => {
        let currentUser = {
            id: socket.request.user._id
        };

        if (clients[data.contactId]) {
            emitNotifyToArray(clients, data.contactId, io, "response-remove-contact", currentUser);
        }
    });
}

module.exports = removeContact;