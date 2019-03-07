const Sequelize = require('sequelize');
const db = {};
const sequelize = new Sequelize('ModelEntSol','sa', 'Pwd#001',{
    host: 'MM_SPECTRE',
    dialect: 'mssql',
    dialectOptions: {
        "encrypt" : true,
        "instanceName": "MSSQLSERVER01"            
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 1000
    }
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;