const Sequelize = require('sequelize');

//mamosuiteに対する接続設定を定義

const dbConfig = new Sequelize('mamosuite','postgres','Tdenso190',{
    //接続先ホストを指定
    host:'localhost',

    //使用するDB製品を指定
    dialect:'postgres',

    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
});
// const dbConfig = new Sequelize(
//     'postgres://postgres:Tdenso190@localhost:5432/mamosuite',
//     {
//         dialect: 'postgres',
//         pool:{
//             max:5,
//             min:0,
//             acquire: 30000,
//             idle: 10000
//         },
//         logging: false
//     }
// );


module.exports = dbConfig;