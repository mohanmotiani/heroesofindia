'use strict';

require('dotenv').config();

const p = process.env;

module.exports = {
    PORT: p.PORT || 5000,
    API_ROOT: p.API_ROOT || 'http://localhost:5000',
    SECRET: p.SECRET || 'Waves Application Secret'
}
