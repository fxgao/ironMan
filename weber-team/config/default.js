let os = require('os')
module.exports = {
    hostname: os.hostname(),
    port: 80,
    dburl: 'mongodb://localhost:27017/IconMan',
    session: {
        name:'SID',
        secret:'SID',
        cookie:{
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        }
    }
}