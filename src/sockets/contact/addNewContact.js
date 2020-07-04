import {
    emitNotifyToArray
} from './../../helpers/socketHelper';

const addNewContact = (io, socket, clients) => {
    socket.on("add-new-contact", (data) => {
        let currentUser = {
            id: socket.request.user._id,
            username: socket.request.user.username,
            avatar: socket.request.user.avatar,
            address: socket.request.user.address ? socket.request.user.address : ""
        };

        if (clients[data.contactId]) {
            emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser);
        }
    });
}

module.exports = addNewContact;