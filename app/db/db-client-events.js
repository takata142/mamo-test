//CRUD処理で使用する共通処理

//const Sequelize = require('sequelize');
const dbConfig = require('../db/db-config');
const events = require('../model/events');

//フロントエンドに返すクエリ実行結果
let result = {
    status:null,
    record:null,
    message:''
};


//クエリ実行結果を初期化する
let initializeResult = function initializeResult(){
    result.status = null,
    result.record = null,
    result.message = ''
};

//クエリ実行結果をセットする
let setResult = function setResult(status,record,message){
    initializeResult();
    result.status = status;
    if(record){
        result.record = record;
    }else{
        result.message = message;
    }

    return result;
};

//コンストラクタ
let DbClientEvents = function(){
    dbConfig
    .authenticate()
    .then(()=>{
        console.log('Connection has been established successfully.');
    })
    .catch((err)=>{
        console.error('Unable to connect to the database:',err);
    });
}

//レコード全件取得
//READ(SELECT)
const findAll = function findAll(callback){
    events.findAll()
    .then((record) => {
        callback(setResult(200,record,null));
    })
    .catch((err) => {
        callback(setResult(500,null,err));
    });
};

//idに紐づくレコードを一件取得
//READ(SELECT)
const findByPk = function findByPk(id,callback){
    events.findByPk(id)
    .then((record)=> {
        if(record){
            callback(setResult(200,record,null));
        }else{
            callback(setResult(400,null,null));
        }
    })
    .catch((err)=> {
        callback(setResult(500,null,err));
    });
};

//レコード取得
//READ(SELECT)
DbClientEvents.prototype.find = function find (query,callback){
    if(query.id){
        findByPk(query.id,callback);
    }else{
        findAll(callback)
    }
};

/**
 * レコード登録
 * @param {*} param
 * @param {*} callback
 * CREATE(INSERT)
 */
 DbClientEvents.prototype.register = function register (param, callback) {
    events.create(param)
      .then((record) => {
        callback(setResult(200, record, null));
      })
      .catch((err) => {
        callback(setResult(500, null, err));
      });
  };
  
  /**
   * レコード更新
   * @param {*} param
   * @param {*} query
   * @param {*} callback
   * UPDATE(UPDATE)
   */
   DbClientEvents.prototype.update = function update (param, query, callback) {
    const filter = {
      where: {
        id: query.id
      }
    };
  
    events.update(param, filter)
      .then((record) => {
        callback(setResult(200, record, null));
      })
      .catch((err) => {
        callback(setResult(500, null, err));
      });
  };
  
  /**
   * レコード削除
   * @param {*} query
   * @param {*} callback
   * DELETE(DELETE)
   */
   DbClientEvents.prototype.remove = function remove (query, callback) {
    const filter = {
      where: {
        id: query.id
      }
    };
  
    events.destroy(filter)
      .then((record) => {
        callback(setResult(200, record, null));
      })
      .catch((err) => {
        callback(setResult(500, null, err));
      });
  };
  
  module.exports = new DbClientEvents();