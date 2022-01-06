//モデルの作成

const { timeStamp } = require('console');
const Sequelize = require('sequelize');
const dbConfig = require('../db/db-config');

//notificationテーブルのEntityモデル
const notification = dbConfig.define('notification',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true
        
    },
    user_id:{
        type:Sequelize.INTEGER,
    },
    notification_code:{
        type:Sequelize.INTEGER,
    },
    notification_name:{
        type:Sequelize.STRING,
    },
    notification_date:{
        type:Sequelize.DATE,
    },
    created_at:{
        type:Sequelize.DATE,
    },
    updated_at:{
        type:Sequelize.DATE,
    },
    deleted_at:{
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

module.exports = notification;