import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String,
  },
  receiver: {
    id: String,
    name: String,
    avatar: String,
  },
  text: String,
  file: {
    data: Buffer,
    contentType: String,
    fileName: String
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  updatedAt: {
    type: Number,
    default: null
  },
  deleteddAt: {
    type: Number,
    default: null
  },
});

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: "personal",
  GROUP: "group"
}

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file"
}

MessageSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  getMesagesPersonal(senderId, receiveId, limit) {
    return this.find({
      $or: [{
          $and: [{
              "senderId": senderId
            },
            {
              "receiverId": receiveId
            }
          ]
        },
        {
          $and: [{
              "receiverId": senderId
            },
            {
              "senderId": receiveId
            }
          ]
        }
      ]
    }).sort({
      "createdAt": -1
    }).limit(limit).exec()
  },
  getMesagesGroup(receiverId, limit) {
    return this.find({
      "receiverId": receiverId
    }).sort({
      "createdAt": -1
    }).limit(limit).exec()
  }
}

module.exports = {
  messageModel: mongoose.model('message', MessageSchema),
  messageTypes: MESSAGE_TYPES,
  messageConversationTypes: MESSAGE_CONVERSATION_TYPES
};