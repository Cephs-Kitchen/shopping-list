const Pool = require('pg').Pool;
const db = new Pool({
    user: 'ceph',
    host: 'localhost', //Update host as needed
    database: 'cephs_citchen',
    password: 'ceph',
    port: 5400 //Update port as needed
})

module.exports = { db };