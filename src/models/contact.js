import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: {
    type: Boolean,
    default: false,
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

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findAllByUser(userId) {
    return this.find({
      $or: [{
          "userId": userId
        },
        {
          "contactId": userId
        }
      ]
    }).exec()
  },
  checkExist(userId, contactId) {
    return this.findOne({
      $or: [{
          $and: [{
              "userId": userId
            },
            {
              "contactId": contactId
            },
          ]
        },
        {
          $and: [{
              "userId": contactId
            },
            {
              "contactId": userId
            }
          ]
        }
      ]
    }).exec()
  },
  removeContact(userId, contactId) {
    return this.deleteOne({
      $or: [{
          $and: [{
              "userId": userId
            },
            {
              "contactId": contactId
            },
            {
              "status": true
            }
          ]
        },
        {
          $and: [{
              "userId": contactId
            },
            {
              "contactId": userId
            },
            {
              "status": true
            }
          ]
        }
      ]
    }).exec()
  },
  removeRequestContactSent(userId, contactId) {
    return this.deleteOne({
      $and: [{
          "userId": userId
        },
        {
          "contactId": contactId
        },
        {
          "status": false
        }
      ]
    }).exec()
  },
  removeRequestContactReceived(userId, contactId) {
    return this.deleteOne({
      $and: [{
          "contactId": userId
        },
        {
          "userId": contactId
        },
        {
          "status": false
        }
      ]
    }).exec()
  },
  approveRequestContactReceived(userId, contactId) {
    return this.update({
      $and: [{
          "contactId": userId
        },
        {
          "userId": contactId
        },
        {
          "status": false
        },
      ]
    }, {
      "status": true,
      "updatedAt": Date.now()
    }).exec()
  },
  getContacts(userId, limit) {
    return this.find({
      $and: [{
          $or: [{
            "userId": userId
          }, {
            "contactId": userId
          }]
        },
        {
          "status": true
        },
      ]
    }).sort({
      "updatedAt": -1
    }).limit(limit).exec()
  },
  getContactsSent(userId, limit) {
    return this.find({
      $and: [{
          "userId": userId
        },
        {
          "status": false
        },
      ]
    }).sort({
      "createdAt": -1
    }).limit(limit).exec()
  },
  getContactsReceive(userId, limit) {
    return this.find({
      $and: [{
          "contactId": userId
        },
        {
          "status": false
        },
      ]
    }).sort({
      "createdAt": -1
    }).limit(limit).exec()
  },
  countAllContacts(userId) {
    return this.countDocuments({
      $and: [{
          $or: [{
            "userId": userId
          }, {
            "contactId": userId
          }]
        },
        {
          "status": true
        },
      ]
    }).exec()
  },
  countAllContactsSent(userId) {
    return this.countDocuments({
      $and: [{
          "userId": userId
        },
        {
          "status": false
        },
      ]
    }).exec()
  },
  countAllContactsReceive(userId) {
    return this.countDocuments({
      $and: [{
          "contactId": userId
        },
        {
          "status": false
        },
      ]
    }).exec()
  },
  readMoreContacts(userId, skipNumber, limit) {
    return this.find({
      $and: [{
          $or: [{
            "userId": userId
          }, {
            "contactId": userId
          }]
        },
        {
          "status": true
        },
      ]
    }).sort({
      "updatedAt": -1
    }).skip(skipNumber).limit(limit).exec()
  },
  readMoreContactsSent(userId, skipNumber, limit) {
    return this.find({
      $and: [{
          "userId": userId
        },
        {
          "status": false
        },
      ]
    }).sort({
      "createdAt": -1
    }).skip(skipNumber).limit(limit).exec()
  },
  readMoreContactsReceive(userId, skipNumber, limit) {
    return this.find({
      $and: [{
          "contactId": userId
        },
        {
          "status": false
        },
      ]
    }).sort({
      "createdAt": -1
    }).skip(skipNumber).limit(limit).exec()
  },
  updateWhenHasNewMessage(userId, contactId) {
    return this.update({
      $or: [{
          $and: [{
              "userId": userId
            },
            {
              "contactId": contactId
            },
          ]
        },
        {
          $and: [{
              "userId": contactId
            },
            {
              "contactId": userId
            }
          ]
        }
      ]
    }, {
      "updatedAt": Date.now()
    }).exec()
  },
  getFriends(userId) {
    return this.find({
      $and: [{
          $or: [{
            "userId": userId
          }, {
            "contactId": userId
          }]
        },
        {
          "status": true
        },
      ]
    }).sort({
      "updatedAt": -1
    }).exec()
  },
};

module.exports = mongoose.model('contact', ContactSchema);