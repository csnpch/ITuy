const config = require('./../../configs')

// status
const uploadDict = {
    slip: {
        path: config.env.ENV === 'production' ? '/usr/src/ituy/uploads/slips/' : 'images/slip/'
    }
}

console.log(`upload path ${uploadDict.slip.path}`)
console.log(`ENV: ${config.env.ENV}`)


module.exports = {
    ...uploadDict
}