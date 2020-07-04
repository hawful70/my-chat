import {
    contact
} from '../services/index';

const findUsersContact = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;

        let users = await contact.findUsersContact(currentUserId, keyword);
        return res.render('main/contacts/sections/_findUsersContact', {
            users
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

const searchFriends = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;

        let users = await contact.searchFriends(currentUserId, keyword);
        return res.render('main/groupChat/sections/_searchFriends', {
            users
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

const addNew = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let newContact = await contact.addNew(currentUserId, contactId);
        return res.status(200).send({
            success: !!newContact
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}

const removeContact = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let removeRequest = await contact.removeContact(currentUserId, contactId);
        return res.status(200).send({
            success: !!removeRequest
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}

const removeRequestContactSent = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let removeRequest = await contact.removeRequestContactSent(currentUserId, contactId);
        return res.status(200).send({
            success: !!removeRequest
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}

const removeRequestContactReceived = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let removeRequest = await contact.removeRequestContactReceived(currentUserId, contactId);
        return res.status(200).send({
            success: !!removeRequest
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}


const approveRequestContactReceived = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;

        let approveRequest = await contact.approveRequestContactReceived(currentUserId, contactId);
        return res.status(200).send({
            success: !!approveRequest
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}

const readMoreContacts = async (req, res) => {
    try {
        let skipNumberNoti = +(req.query.skipNumber);
        let newContactsUser = await contact.readMoreContacts(req.user._id, skipNumberNoti);
        return res.status(200).send(newContactsUser);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

const readMoreContactsSent = async (req, res) => {
    try {
        let skipNumberNoti = +(req.query.skipNumber);
        let newContactsUser = await contact.readMoreContactsSent(req.user._id, skipNumberNoti);
        return res.status(200).send(newContactsUser);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

const readMoreContactsReceive = async (req, res) => {
    try {
        let skipNumberNoti = +(req.query.skipNumber);
        let newContactsUser = await contact.readMoreContactsReceive(req.user._id, skipNumberNoti);
        return res.status(200).send(newContactsUser);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = {
    findUsersContact,
    addNew,
    removeContact,
    removeRequestContactSent,
    removeRequestContactReceived,
    approveRequestContactReceived,
    readMoreContacts,
    readMoreContactsSent,
    readMoreContactsReceive,
    searchFriends
};