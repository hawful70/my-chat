import {
    emitNotifyToArray
} from '../../helpers/socketHelper';

const approveRequestContactReceived = (io, socket, clients) => {
    socket.on("approve-request-contact-received", (data) => {
        let currentUser = {
            id: socket.request.user._id,
            username: socket.request.user.username,
            avatar: socket.request.user.avatar,
            address: socket.request.user.address ? socket.request.user.address : ""
        };

        if (clients[data.contactId]) {
            emitNotifyToArray(clients, data.contactId, io, "response-approve-request-contact-received", currentUser);
        }
    });
}

module.exports = approveRequestContactReceived;