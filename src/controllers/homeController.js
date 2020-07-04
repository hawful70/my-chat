import {
  notification,
  contact,
  message
} from '../services/index';

import {
  bufferToBase64,
  lastItemOfArray,
  convertTimestamp
} from './../helpers/clientHelper';

import request from 'request';
import {
  result
} from 'lodash';

const getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    let o = {
      format: "urls"
    };

    let bodyString = JSON.stringify(o);

    let options = {
      url: "https://global.xirsys.net/_turn/vinh-awesome-chat",
      method: "PUT",
      headers: {
        "Authorization": "Basic " + Buffer.from("vinhdev:2299db34-b948-11ea-853a-0242ac150003").toString("base64"),
        "Content-Type": "application/json",
        "Content-Length": bodyString.length
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        return reject(error);
      }

      let bodyJson = JSON.parse(body);
      resolve(bodyJson.v.iceServers);
    })
  })
}

const home = async (req, res) => {
  let results = await Promise.all([
    notification.getNotification(req.user._id),
    notification.countNotiUnread(req.user._id),
    contact.getContacts(req.user._id),
    contact.getContactsSent(req.user._id),
    contact.getContactsReceive(req.user._id),
    contact.countAllContacts(req.user._id),
    contact.countAllContactsSent(req.user._id),
    contact.countAllContactsReceive(req.user._id),
    message.getAllConversationItems(req.user._id),
    getICETurnServer()
  ]);


  return res.render('main/home/index', {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: results[0],
    countNotiUnread: results[1],
    contacts: results[2],
    contactsSent: results[3],
    contactsReceive: results[4],
    countAllcontacts: results[5],
    countAllcontactsSent: results[6],
    countAllcontactsReceive: results[7],
    allConversationWithMessages: results[8].allConversationWithMessages,
    bufferToBase64,
    lastItemOfArray,
    convertTimestamp,
    iceServerList: JSON.stringify(results[9])
  });
};

module.exports = {
  home
};