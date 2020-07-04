import {
    groupChat
} from '../services/index';


const addNewGroup = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let arrayMemberIds = req.body.arrayIds;
        let groupChatName = req.body.groupChatName;

        let newGroupChat = await groupChat.addNewGroup(currentUserId, arrayMemberIds, groupChatName);
        return res.status(200).send({
            groupChat: newGroupChat
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = {
    addNewGroup
};