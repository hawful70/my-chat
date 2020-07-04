import GroupChatModel from './../models/chat-group';

const addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
    return new Promise(async (resolve, reject) => {
        try {
            arrayMemberIds.unshift({
                userId: `${currentUserId}`
            });

            let newGroupItem = {
                name: groupChatName,
                userAmount: arrayMemberIds.length,
                userId: `${currentUserId}`,
                members: arrayMemberIds
            }

            let newGroup = await GroupChatModel.createNew(newGroupItem);
            resolve(newGroup);
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    addNewGroup
}