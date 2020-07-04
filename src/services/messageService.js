import ContactModel from './../models/contact';
import UserModel from './../models/user';
import ChatModel from './../models/chat-group';
import {
    messageModel,
    messageConversationTypes,
    messageTypes
} from './../models/message';
import {
    transError
} from './../../lang/en';
import {
    app
} from "./../config/app";
import {
    sortBy,
    reverse
} from "lodash";
import fsExtra from 'fs-extra';


const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;

const getAllConversationItems = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let usersConversationsPromise = contacts.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    let userContact = await UserModel.getNormalUserById(contact.userId);
                    userContact.updatedAt = contact.updatedAt
                    return userContact;
                } else {
                    let userContact = await UserModel.getNormalUserById(contact.contactId);
                    userContact.updatedAt = contact.updatedAt
                    return userContact;
                }
            });

            let usersConversations = await Promise.all(usersConversationsPromise);
            let groupConversations = await ChatModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let allConversations = usersConversations.concat(groupConversations);

            allConversations = sortBy(allConversations, (item) => {
                return -item.updatedAt;
            })

            let allConversationWithMessagePromise = allConversations.map(async (conversation) => {
                conversation = conversation.toObject();
                if (conversation.members) {
                    let messages = await messageModel.getMesagesGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = reverse(messages);
                } else {
                    let messages = await messageModel.getMesagesPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = reverse(messages);
                }

                return conversation;
            })

            let allConversationWithMessages = await Promise.all(allConversationWithMessagePromise);
            allConversationWithMessages = sortBy(allConversationWithMessages, (item) => {
                return -item.updatedAt;
            })

            resolve({
                allConversationWithMessages
            });
        } catch (error) {
            reject(error);
        }
    })
}

const addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await ChatModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transError.conversation_not_found)
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                }

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: messageConversationTypes.GROUP,
                    messageType: messageTypes.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now()
                }

                let newMessage = await messageModel.createNew(newMessageItem);

                await ChatModel.updateWhenHasNewMessage(getChatGroupReceiver._id,
                    getChatGroupReceiver.messageAmount + 1);

                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getNormalUserById(receiverId);
                if (!getUserReceiver) {
                    return reject(transError.conversation_not_found)
                }

                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                }

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: messageConversationTypes.PERSONAL,
                    messageType: messageTypes.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now()
                }

                let newMessage = await messageModel.createNew(newMessageItem);

                await ContactModel.updateWhenHasNewMessage(sender.id,
                    getUserReceiver._id);

                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    })
}

const addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {

            let imageBuffer = await fsExtra.readFile(messageVal.path);
            let imageContentType = messageVal.mimetype;
            let imageName = messageVal.filename;

            if (isChatGroup) {
                let getChatGroupReceiver = await ChatModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transError.conversation_not_found)
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                }



                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: messageConversationTypes.GROUP,
                    messageType: messageTypes.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file: {
                        data: imageBuffer,
                        contentType: imageContentType,
                        fileName: imageName
                    },
                    createdAt: Date.now()
                }

                let newMessage = await messageModel.createNew(newMessageItem);

                await ChatModel.updateWhenHasNewMessage(getChatGroupReceiver._id,
                    getChatGroupReceiver.messageAmount + 1);

                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getNormalUserById(receiverId);
                if (!getUserReceiver) {
                    return reject(transError.conversation_not_found)
                }

                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                }

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: messageConversationTypes.PERSONAL,
                    messageType: messageTypes.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file: {
                        data: imageBuffer,
                        contentType: imageContentType,
                        fileName: imageName
                    },
                    createdAt: Date.now()
                }

                let newMessage = await messageModel.createNew(newMessageItem);

                await ContactModel.updateWhenHasNewMessage(sender.id,
                    getUserReceiver._id);

                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    })
}

const addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
        try {

            let attachmentBuffer = await fsExtra.readFile(messageVal.path);
            let attachmentContentType = messageVal.mimetype;
            let attachmentName = messageVal.filename;

            if (isChatGroup) {
                let getChatGroupReceiver = await ChatModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transError.conversation_not_found)
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                }

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: messageConversationTypes.GROUP,
                    messageType: messageTypes.FILE,
                    sender: sender,
                    receiver: receiver,
                    file: {
                        data: attachmentBuffer,
                        contentType: attachmentContentType,
                        fileName: attachmentName
                    },
                    createdAt: Date.now()
                }

                let newMessage = await messageModel.createNew(newMessageItem);

                await ChatModel.updateWhenHasNewMessage(getChatGroupReceiver._id,
                    getChatGroupReceiver.messageAmount + 1);

                resolve(newMessage);
            } else {
                let getUserReceiver = await UserModel.getNormalUserById(receiverId);
                if (!getUserReceiver) {
                    return reject(transError.conversation_not_found)
                }

                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                }

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: messageConversationTypes.PERSONAL,
                    messageType: messageTypes.FILE,
                    sender: sender,
                    receiver: receiver,
                    file: {
                        data: attachmentBuffer,
                        contentType: attachmentContentType,
                        fileName: attachmentName
                    },
                    createdAt: Date.now()
                }

                let newMessage = await messageModel.createNew(newMessageItem);

                await ContactModel.updateWhenHasNewMessage(sender.id,
                    getUserReceiver._id);

                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getAllConversationItems,
    addNewTextEmoji,
    addNewImage,
    addNewAttachment
}