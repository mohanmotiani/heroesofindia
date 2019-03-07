const Sequelize = require('sequelize');
const db = require('../database/db');
    
module.exports = db.sequelize.define(
    'event', 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATEONLY
        },
        price: {
            type: Sequelize.DECIMAL
        },
        special: {
            type: Sequelize.BOOLEAN
        },      
        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
    {
        timestamps: false
    }
    
);