const {initializeFireBase,inifire} = require('../firebase')

module.exports.firebase = initializeFireBase()
module.exports.firestore= inifire()