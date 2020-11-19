const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'ceph',
    host: 'localhost', //Update host as needed
    database: 'cephs_citchen',
    password: '',
    port: 64847 //Update port as needed
})

export default pool;