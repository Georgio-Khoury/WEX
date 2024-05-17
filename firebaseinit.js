const {initializeFireBase} = require('./firebase')
const {inifire} = require('./firebase')
module.exports.firebase =initializeFireBase()
module.exports.firestore = inifire()