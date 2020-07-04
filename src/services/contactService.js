import ContactModel from './../models/contact';
import UserModel from './../models/user';
import {
    notificationModel,
    notificationTypes
} from './../models/notification';
import uniqBy from "lodash/uniqBy";

const LIMIT_NUMBER_TAKEN = 10;

const findUsersContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let deprecateUserIds = [currentUserId];
        let contactsByUser = await ContactModel.findAllByUser(currentUserId);

        contactsByUser.forEach((contact) => {
            deprecateUserIds.push(contact.userId);
            deprecateUserIds.push(contact.contactId);
        })

        deprecateUserIds = uniqBy(deprecateUserIds);
        let users = await UserModel.findAllForAddContact(deprecateUserIds, keyword);

        resolve(users);
    })
}

const searchFriends = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let friendIds = [];
        let friends = await ContactModel.getFriends(currentUserId);

        friends.forEach(friend => {
            friendIds.push(friend.userId);
            friendIds.push(friend.contactId);
        });

        friendIds = uniqBy(friendIds);
        friendIds = friendIds.filter(id => id != currentUserId);

        let users = await UserModel.findAllToAddGroupChat(friendIds, keyword);

        resolve(users);
    })
}

const addNew = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await ContactModel.checkExist(currentUserId, contactId);
        if (contactExists) {
            return reject(false);
        }

        let newContactItem = {
            userId: currentUserId,
            contactId: contactId
        }

        let newContact = await ContactModel.createNew(newContactItem);

        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: notificationTypes.ADD_CONTACT
        }

        await notificationModel.createNew(notificationItem);

        resolve(newContact);
    })
}

const removeContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let removeReq = await ContactModel.removeContact(currentUserId, contactId);
        if (removeReq.deletedCount === 0) {
            return reject(false);
        }

        resolve(true);
    })
}

const removeRequestContactSent = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let removeReq = await ContactModel.removeRequestContactSent(currentUserId, contactId);
        if (removeReq.deletedCount === 0) {
            return reject(false);
        }

        await notificationModel.removeNotification(currentUserId, contactId, notificationTypes.ADD_CONTACT)
        resolve(true);
    })
}

const removeRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let removeReq = await ContactModel.removeRequestContactReceived(currentUserId, contactId);
        if (removeReq.deletedCount === 0) {
            return reject(false);
        }

        resolve(true);
    })
}


const approveRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let approveReq = await ContactModel.approveRequestContactReceived(currentUserId, contactId);
        if (approveReq.nModified === 0) {
            return reject(false);
        }

        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: notificationTypes.APPROVE_CONTACT
        }

        await notificationModel.createNew(notificationItem);

        resolve(true);
    })
}

const getContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    return await UserModel.getNormalUserById(contact.userId);
                } else {
                    return await UserModel.getNormalUserById(contact.contactId);
                }
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}

const getContactsSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsSent(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
                return await UserModel.getNormalUserById(contact.contactId);
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}

const getContactsReceive = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsReceive(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
                return await UserModel.getNormalUserById(contact.userId);
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}

const countAllContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContacts(currentUserId);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
}

const countAllContactsSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContactsSent(currentUserId);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
}

const countAllContactsReceive = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContactsReceive(currentUserId);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
}

const readMoreContacts = (currentUserId, skipNumberContact) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContactsUser = await ContactModel.readMoreContacts(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);
            let contactsUserMap = newContactsUser.map(async (contact) => {
                if (contact.contactId == currentUserId) {
                    return await UserModel.getNormalUserById(contact.userId);
                } else {
                    return await UserModel.getNormalUserById(contact.contactId);
                }
            });
            let userContents = await Promise.all(contactsUserMap);

            resolve(userContents);

        } catch (error) {
            reject(error);
        }
    })
}

const readMoreContactsSent = (currentUserId, skipNumberContact) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContactsUser = await ContactModel.readMoreContactsSent(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);
            let contactsUserMap = newContactsUser.map(async (contact) => {
                return await UserModel.getNormalUserById(contact.contactId);
            });
            let userContents = await Promise.all(contactsUserMap);
            resolve(userContents);

        } catch (error) {
            reject(error);
        }
    })
}

const readMoreContactsReceive = (currentUserId, skipNumberContact) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContactsUser = await ContactModel.readMoreContactsReceive(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);
            let contactsUserMap = newContactsUser.map(async (contact) => {
                return await UserModel.getNormalUserById(contact.userId);
            });
            let userContents = await Promise.all(contactsUserMap);
            resolve(userContents);

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    findUsersContact,
    addNew,
    removeContact,
    removeRequestContactSent,
    removeRequestContactReceived,
    approveRequestContactReceived,
    getContacts,
    getContactsSent,
    getContactsReceive,
    countAllContacts,
    countAllContactsSent,
    countAllContactsReceive,
    readMoreContacts,
    readMoreContactsSent,
    readMoreContactsReceive,
    searchFriends
}