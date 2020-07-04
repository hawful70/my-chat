import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeNotification(senderId, receiverId, type) {
    return this.deleteOne({
      $and: [{
          "senderId": senderId
        },
        {
          "receiverId": receiverId
        },
        {
          "type": type
        }
      ]
    }).exec()
  },
  getByUserIdAndLimit(userId, limit) {
    return this.find({
      "receiverId": userId
    }).sort({
      "createdAt": -1
    }).limit(limit).exec()
  },
  countNotiUnread(userId) {
    return this.countDocuments({
      $and: [{
        "receiverId": userId
      }, {
        "isRead": false
      }]
    })
  },
  readMore(userId, skip, limit) {
    return this.find({
      "receiverId": userId
    }).sort({
      "createdAt": -1
    }).skip(skip).limit(limit).exec()
  },
  markAllNotification(userId, targetUsers) {
    return this.updateMany({
      $and: [{
          "receiverId": userId
        },
        {
          "senderId": {
            $in: targetUsers
          }
        }
      ]
    }, {
      "isRead": true
    }).exec()
  }
}

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact",
  APPROVE_CONTACT: "approve_contact"
}

const NOTIFICATION_TYPES_TEMPLATE = {
  ADD_CONTACT: ({
    userId,
    username,
    userAvatar
  }) => {
    return `<div class="noti-readed-false" data-uid="${ userId }">
    <img class="avatar-small" src="images/users/${userAvatar}" alt="" />
    <strong>${username}</strong> send you a request
    </div>`
  },
  APPROVE_CONTACT: ({
    userId,
    username,
    userAvatar
  }) => {
    return `<div class="noti-readed-false" data-uid="${ userId }">
    <img class="avatar-small" src="images/users/${userAvatar}" alt="" />
    <strong>${username}</strong> approved your request
    </div>`
  }
}

const NOTIFICATION_CONTENT = {
  getContent: (userId, username, userAvatar, isRead, type) => {
    if (type === NOTIFICATION_TYPES.ADD_CONTACT) {
      if (!isRead) {
        return NOTIFICATION_TYPES_TEMPLATE.ADD_CONTACT({
          userId,
          username,
          userAvatar
        });
      }

      return NOTIFICATION_TYPES_TEMPLATE.ADD_CONTACT({
        userId,
        username,
        userAvatar
      });
    }

    if (type === NOTIFICATION_TYPES.APPROVE_CONTACT) {
      if (!isRead) {
        return NOTIFICATION_TYPES_TEMPLATE.APPROVE_CONTACT({
          userId,
          username,
          userAvatar
        });;
      }

      return NOTIFICATION_TYPES_TEMPLATE.APPROVE_CONTACT({
        userId,
        username,
        userAvatar
      });;

    }
    return "";
  }
}

module.exports = {
  notificationModel: mongoose.model('notification', NotificationSchema),
  notificationTypes: NOTIFICATION_TYPES,
  notificationContents: NOTIFICATION_CONTENT
};