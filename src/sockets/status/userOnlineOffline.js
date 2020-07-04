import {
    emitNotifyToArray
} from './../../helpers/socketHelper';

const UserOnlineOffline = (io, socket, clients) => {
    socket.on("check-status", () => {
        let listUsersOnline = Object.keys(clients);

        socket.emit("server-send-list-users-online", listUsersOnline);

        socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);
    })
}

module.exports = UserOnlineOffline;