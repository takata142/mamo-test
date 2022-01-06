

let express = require('express');
let router  = express.Router();
let dbClient = require('../app/db/db-client');

//HTTPのGETメソッドを待ち受けてnotificationテーブルからレコードを全件取得して返す
router.get('/notification/find',function(req,res,next) {
    const query = req.query;
    dbClient.find(query,function(result){
        res.json(result);
    });
});

//HTTPのPOSTメソッドを待ち受けてnotification情報を登録する
router.post('/notification/register',function(req,res,next){
    const addData = req.body;
    dbClient.register(addData,function(result){
        res.json(result);
    });
});

//HTTPのPUTメソッドを待ち受けてnotification情報を更新する
router.put('/notification/update',function(req,res,next){
    const query = {
        id:req.body.id
    };
    const addData = req.body;
    dbClient.update(addData,query,function(result){
        res.json(result);
    });
});

//HTTPのDELETEメソッドを待ち受けてnotification情報を更新する
router.delete('/notification/remove',function(req,res,next){
    const query = {
        id:body.id
    };
    dbClient.remove(query,function(result){
        res.json(result);
    });
});

module.exports = router;