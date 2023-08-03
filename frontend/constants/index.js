const dotenv = require('dotenv');
dotenv.config();

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || 'localhost';
const dev = process.env.NODE_ENV !== 'production';

const protocol = dev ? 'http' : 'https';

module.exports = {
    port,
    hostname,
    dev,
    protocol,
};