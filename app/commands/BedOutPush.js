'use strict';

/**
 * 日替時刻(8:00)から24時間内で離床イベントが発生した場合に通知を行う。
 * アクティブな利用者ユーザーを対象に、最新のイベントを取得し、離床イベントだった場合通知を行う。
 */

 const notification = require("../model/notification")
 const dbusers = require("../model/users")
 const events = require("../model/events")
 let util = require("./export/util");
 let moment = require("moment");
 const Sequelize = require("sequelize");
const { where } = require("sequelize");
 const Op = Sequelize.Op;
 let now = moment();


//日替わり時刻(08:00:00)をstart_timeとして定義
// $start_time = Carbon::parse(config('constants.date_change_time'));
const start_time = "08:00:00";

//start_timeをコピーしsubMinute()で1分減らした時刻(07:59:00)をend_timeとして定義
// $end_time = $start_time->copy()->subMinute();
const end_time = "07:59:00";

//SleepDataのgetDesignationDateTime($start_time, $end_time)を使い、現在の日付の最初の時間(08:00:00)と最後の時間(07:59:00)を取得しcurrent_dayに定義
// $current_day = SleepData::getDesignationDateTime($start_time, $end_time);
const current_day = util.getDesignationDateTime(start_time,end_time);


//curren_dayで定義した最初の時間をday_startとして定義
// $day_start = $current_day["start"];
let day_start = current_day["start"];

//current_dayで定義した最後の時間をday_endとして定義
// $day_end = $current_day["end"];
let day_end = moment(current_day["end"]);
let daystest = moment(day_start)
console.log(typeof(day_end))
console.log(now)

// notification.findByPk(1).then(data =>{
//     console.log(typeof(data.notification_name))
//     console.log(typeof(data.notification_date))
//     if (data.notification_date < day_end){
//         console.log("123")
//     }else{
//         console.log("321")
//     }
// })

// notification.findAndCountAll({
//     where:{
//         user_id:1,  
//     },
//     order:[
//         ['id','DESC']
//     ],
//     offset:1,
//     limit:1

// }).then(data =>{
//     console.log("order",data)
// })

async function testdata(){

    const result = notification.findAll({
        where:{
            id:1
        }
    })
    return result
}

async function main(){
    console.log("2")
    const ntestdata = await testdata()
    console.log(ntestdata)

// 指定範囲外の場合通知しない
//現在時刻がday_startとday_endの間に無ければreturn
// if (!Carbon::now()->between($day_start,$day_end)) {
//     return;
// }
if (now < day_start || now > day_end){
    return;
}


// ユーザーテーブルからアクティブな顧客データの取得
// device_idの値がNullでないdevice_id,
// $users = User::whereNotNull('device_id')
                //role_typeがconstants.role_type.customerと同じ値(3)のrole_id,
//             ->where('role_id', config('constants.role_type.customer'))
                //ステータスがアクティブなstatus,
//             ->where('status', UserStatus::ACTIVE)
                //一行ごとに処理
//             ->cursor();

// let users = []
// users = dbusers.findAll({
//     where:{
//         device_id:{
//             [Op.ne]:null
//         },
//         role_id:3,
//         status:'ACTIVE'
//     }
// }).then(data =>{
//     users = data
//     console.log(users)
// })
// console.log("users:",users)
//仮データ
let users = [
    {id:1,device_id:1,company_id:1,role_id:3,email:"test1@example.com",password:"12345",vital_graph_display:1,
     device_token:"devicetoken",device_arm:"devicearm",arm_mode:"armmode",confirmation_token:"confirmationtoken",
     remember_token:"remembertoken",status:"active",last_login:"2021-10-11 18:00:00",created_at:"2021-10-11 14:00:00",
     updated_at:"2021-10-13 14:45:00"},
];


//foreach ($users as $user) {
users.forEach(function(user){

    // デバイス未設定の場合は処理なし
    // if (is_null($user->device_id)) {
    //     continue;
    // }
    if (user.device_id === null){
        return;
    }

    // 最後に通知した情報の取得
    // 通知テーブルから$userのidと同じ値のuser_id,
    // $alert = Notification::where('user_id', $user->id)
            //指定された日付の間で通知された通知日時,
    //     ->whereBetween('notification_date', [$day_start, $day_end])
            //通知イベントでconstants.notification_event.midnight_wake_up_pushと同じ値(13)の通知コード,
    //     ->where('notification_code', config('constants.notification_event.midnight_wake_up_push'))
            //idの降順に表示,
    //     ->orderByDesc('id')
            //通知日時の値を一つ取得,
    //     ->value('notification_date');
    let alert = [{notification_date:"2021-10-12 14:45:17"}]

    //alertが定義済みでnullではない場合
    // if (isset($alert)) {
    //     $day_start = $alert;
    // }
    if (typeof alert != undefined){
        day_start = alert
    }


    // 最新イベントデータ
    //イベントテーブルから$userのidと同じ値のユーザーID,
    // $last_arise_date = Event::where('user_id', $user->id)
            //$userのdevice_idと同じ値のデバイスID,
    //     ->where('device_id', $user->device_id)
            //イベント発生日がday_startより大きく,
    //     ->where('arise_date', '>', $day_start)
            //イベント発生日がday_end以下で,
    //     ->where('arise_date', '<=', $day_end)
            //イベントコードがconstants.sleep_event.wake_upの値(4),
    //     ->where('event_code', config('constants.sleep_event.bed_out'))
            //イベント発生日を降順で,
    //     ->orderByDesc('arise_date')
            //イベント発生日のデータを一つ取得,
    //     ->value('arise_date');
    let last_arise_date = [{arise_date:"2021-10-12 14:45:17"}]
    //let last_arise_date = [{"id":1,"user_id":1,"device_id":1,"arise_date":"2021-10-12 14:45:17","event_code":4,"created_at":"2021-10-12 14:45:17","updated_at":"2021-10-12 14:45:17"}]


    //last_arise_dateが定義済みでnullでない場合
    // if (isset($last_arise_date)) {
    if (typeof last_arise_date != undefined){

    //     // 通知データ作成
            //notificationインスタンスの作成
    //     $notification = new Notification();
            //通知データのユーザーIDを$userデータのidの値に,
    //     $notification->user_id = $user->id;
            //通知データの通知コードをconstants.notification_event.midnight_wake_up_pushの値(13)に,
    //     $notification->notification_code = config('constants.notification_event.midnight_wake_up_push');
            //通知データの通知名をconstants.notification_title.midnight_wake_up_pushの値("離床しました")に,
    //     $notification->notification_name = config('constants.notification_title.midnight_wake_up_push');
            //通知データの通知日時を$last_arise_dateの値に,
    //     $notification->notification_date = $last_arise_date->format('Y-m-d H:i:00');
            //通知データを登録
    //     $notification->save();

            //user_detailsテーブルからからユーザー名と$notificationから通知名を取得し$titleとして定義
    //     $title = $user->detail->user_name . ' 様が' . $notification->notification_name;
            let title = "○○" + "様が" + "離床しました";

            //$messageを定義
    //     $message = '';
            let message = " ";

            //$last_arise_dateの日時を$timeに定義
    //     $time = $last_arise_date->format('Y年m月d日 H時i分');
            let time = []
            let timeStr = last_arise_date[0].arise_date;
            let ymdhi = ["年","月","日","時","分"]
            let words = timeStr.split(/[-" ":]/);

            for(let i = 0; i < (words.length-1); i++){
                time += words[i] + ymdhi[i]
            }


            // 管理者へ通知
            //管理者を$admin_userとして定義
            // $admin_user = $user->company->user();
            //通知の作成
            // $this->notification(
                    //通知データ,
            //     $notification,
                    //ユーザーデータ,
            //     $user,
                    //管理者データ,
            //     $admin_user,
                    //ユーザー詳細データの夜間離床通知,
            //     $user->detail->midnight_wakeup_push,
                    //ユーザー詳細データの夜間離床通知開始時間,
            //     Carbon::parse($user->detail->midnight_wakeup_push_start_time),
                    //ユーザー詳細データの夜間離床通知終了時間,
            //     Carbon::parse($user->detail->midnight_wakeup_push_end_time),
                    //タイトル, メッセージ, 日時
            //     $title, $message, $time);
            console.log(title,time)
            // notification.findByPk(1).then(data =>{
            //     console.log(data)
            // });
            // events.findByPk(1).then(data => {
            //     console.log(data.user_id)
            // });
            // notification.findAll({where:{notification_name:"BetOutPush"}}).then(data =>{
            //     console.log("id:",data)
            // })
           

        //     followテーブルが定義済みでnullでない場合
        //     if (isset($user->follow)) {
                // フォローテーブルのfollower_userを$follower_userとして定義,
                // $follower_user = $user->follow->follower_user;
                // 通知の作成,
                // $this->notification(
                //     通知データ,
                //     $notification,
                //     ユーザーデータ,
                //     $user,
                //     フォロ―ユーザーデータ,
                //     $follower_user,
                //     ユーザー詳細データの夜間離床通知,
                //     $follower_user->detail->midnight_wakeup_push,
                //     ユーザー詳細データの夜間離床通知開始時間,
                //     Carbon::parse($follower_user->detail->midnight_wakeup_push_start_time),
                //     ユーザー詳細データの夜間離床通知終了時間,
                //     Carbon::parse($follower_user->detail->midnight_wakeup_push_end_time),
                //     タイトル, メッセージ, 日時
                //     $title, $message, $time);
        //     }
    }

})


}

main()


