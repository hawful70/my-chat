import {
    emitNotifyToArray,
    pushSocketIdToArray
} from './../../helpers/socketHelper';

const newGroupChat = (io, socket, clients) => {
    socket.on("new-group-created", (data) => {
        clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);

        let response = {
            groupChat: data.groupChat
        }

        data.groupChat.members.forEach(member => {
            if (clients[member.userId] && member.userId != socket.request.user._id) {
                emitNotifyToArray(clients, member.userId, io, "response-new-group-created", response);
            }
        })
    });

    socket.on("member-received-group-chat", data => {
        clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    })
}

module.exports = newGroupChat;