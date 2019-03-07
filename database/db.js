const Sequelize = require('sequelize');
const db = {};
const sequelize = new Sequelize('ModelEntSol','sa', 'Pwd#0001',{
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

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;