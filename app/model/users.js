const Sequelize = require('sequelize');
const dbConfig = require('../db/db-config');


const users = dbConfig.define('users',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true
    },
    device_id:{
        type:Sequelize.INTEGER,
    },
    company_id:{
        type:Sequelize.INTEGER,
    },
    role_id:{
        type:Sequelize.INTEGER,
    },
    email:{
        type:Sequelize.STRING,
    },
    created_at:{
        type:Sequelize.DATE,
    },
    updated_at:{
        type:Sequelize.DATE,
    }
},{
    timestamps:false,

    freezeTableName:true
});

// users.findAll().then(data => {
//     console.log(data)
// });

module.exports = users;