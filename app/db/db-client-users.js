

const dbConfig = require('./db-config'); // 接続設定
const users = require('../model/users'); // モデル

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
let DbClientUsers = function(){
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
    users.findAll()
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
    users.findByPk(id)
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
DbClientUsers.prototype.find = function find (query,callback){
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
 DbClientUsers.prototype.register = function register (param, callback) {
    users.create(param)
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
   DbClientUsers.prototype.update = function update (param, query, callback) {
    const filter = {
      where: {
        id: query.id
      }
    };
  
    users.update(param, filter)
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
  DbClientUsers.prototype.remove = function remove (query, callback) {
    const filter = {
      where: {
        id: query.id
      }
    };
  
    users.destroy(filter)
      .then((record) => {
        callback(setResult(200, record, null));
      })
      .catch((err) => {
        callback(setResult(500, null, err));
      });
  };
  
  module.exports = new DbClientUsers();