import addNewContact from './contact/addNewContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import approveRequestContactReceived from './contact/approveRequestContactReceived';
import removeContact from './contact/removeContact';
import chatTextEmoji from './chat/chatTextEmoji';
import tyingOn from './chat/typingOn';
import tyingOff from './chat/typingOff';
import chatImage from './chat/chatImage';
import chatAttachment from './chat/chatAttachment';
import chatVideo from './chat/chatVideo';
import userOnlineOffline from './status/userOnlineOffline';
import newGroupChat from './group/newGroupChat';
import {
    pushSocketIdToArray,
    removeSocketIdFromArray
} from './../helpers/socketHelper';

const initSockets = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id)
        })

        addNewContact(io, socket, clients);

        removeRequestContactSent(io, socket, clients);

        removeRequestContactReceived(io, socket, clients);

        approveRequestContactReceived(io, socket, clients);

        chatTextEmoji(io, socket, clients);

        removeContact(io, socket, clients);

        tyingOn(io, socket, clients);

        tyingOff(io, socket, clients);

        chatImage(io, socket, clients);

        chatAttachment(io, socket, clients);

        chatVideo(io, socket, clients);

        userOnlineOffline(io, socket, clients);

        newGroupChat(io, socket, clients);

        socket.on("disconnect", () => {
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);

            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdFromArray(clients, group._id, socket)
            })

            // change status when offline
            socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
        })
    })
}

module.exports = initSockets