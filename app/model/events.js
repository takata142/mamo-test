//モデルの作成
const Sequelize = require('sequelize');
const dbConfig = require('../db/db-config');

//events table
const events = dbConfig.define('events',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true
        
    },
    user_id:{
        type:Sequelize.INTEGER,
    },
    device_id:{
        type:Sequelize.INTEGER,
    },
    arise_data:{
        type:Sequelize.DATE,
    },
    event_code:{
        type:Sequelize.INTEGER,
    },
    created_at:{
        type:Sequelize.DATE,
    },
    updated_at:{
        type:Sequelize.DATE,
    },
},{
    //create_at類が必要ならtrue
    timestamps:false,

    //テーブル名を複数形にしたくない場合はtrue
    freezeTableName:true
});

// notification.findAll().then(data => {
//     console.log(data)
// });

module.exports = events;