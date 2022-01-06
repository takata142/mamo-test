const momentRandom = require('moment-random');
const moment = require("moment")
let m = moment();

//sleepDate.php
//-----------------------------------------------------------------------------
/**
 * 指定日時取得処理
 *
 * @param Carbon $start_time
 * @param Carbon $end_time
 * @return array
 */
    // public static function getDesignationDateTime(Carbon $start_time, Carbon $end_time)
    // {
    //     $now = Carbon::now();
    //     // 取得日付の最初の時間
    //     $day_start = Carbon::parse($now->format("Y-m-d") . " " . $start_time->format("H:i:s"));
    //     //未来日の確認
    //     if($day_start->isFuture()){
                //未来日であれば一日前にする
    //         $day_start->subDay();
    //     }
    //     // 取得日付の最後の時間
    //     $day_end = Carbon::parse($day_start->copy()->format("Y-m-d") . " " . $end_time->format("H:i:s"));
           //day_endがday_startより前か確認
    //     if($day_end->lt($day_start)){
        　　//前であれば一日加算
        //         $day_end->addDay();
        //     }
        //     return [
        //         "start" => $day_start,
        //         "end" => $day_end,
        //     ];
        // }
    

//指定日日時取得処理    
module.exports.getDesignationDateTime = function(start_time,end_time){
    // 取得日付の最初の時間
    let day_start = m.format("YYYY-MM-DD" + " " + start_time) 
    let ds = moment(day_start)
    //未来日の確認
    if (m.isBefore(ds, "days")){
        //未来日であれば一日前にする
        ds = m.clone().subtract(1,"days")
        day_start = ds.format("YYYY-MM-DD" + " " +start_time)
    }
    
    // 取得日付の最後の時間
    let day_end =  m.clone().format("YYYY-MM-DD" + " " + end_time) 
    let de = moment(day_end)
    //day_endがday_startより小さいか確認
    if (m.isAfter(de,"seconds")){
        //小さければ一日加算
        de = m.clone().add(1,"day");
        day_end = de.format("YYYY-MM-DD" + " " + end_time)
    }
    return {"start":day_start,"end":day_end};
}




// ------------------------------------------------------------------------------------
    
// /**
//  * 利用者睡眠データ取得処理
//  *
//  * @param User $user
//  * @param Carbon $start
//  * @param Carbon $end
//  * @return array
//  */
//     public static function getUserSleepData(User $user, Carbon $start, Carbon $end) {
module.exports.getUserSleepData = function(users,start,end){


    // 夜間帯開始時間
    // $midnight_start_time = Carbon::parse(config("constants.midnight_start_time"));
    const midnight_start_time = "18:00:00";
    // 夜間帯終了時間
    // $midnight_end_time = Carbon::parse(config("constants.midnight_end_time"));
    const midnight_end_time = "17:59:00";
    // 算出処理で使う日付のリストを取得
    // $date_list = self::getDateList($start, $end);
    let date_List = getDateList(start,end);
        //console.log(date_List)

    // $resultを定義
    // $result = [];
    let result = [];

    // foreach ($date_list as $date) {
    date_List.forEach(function(date){

        // 夜間開始時刻を定義            
        // $midnight_start = Carbon::parse($date->format("Y-m-d") . " " . $midnight_start_time->format("H:i:s"));
        let midnight_start = date + " " + midnight_start_time;
        // 夜間終了時刻を定義
        // $midnight_end = Carbon::parse($date->copy()->addDay()->format("Y-m-d") . " " . $midnight_end_time->copy()->format("H:i:s"));
        // let ydate = new Date(date)
        // let dateTomorrow = getDateListTomorrow(ydate)
        // let midnight_end = dateTomorrow + " " + midnight_end_time;

        let midnightStartDate = m.format(midnight_start)
        let tomorrow = moment(midnightStartDate)
        let midnight_end = tomorrow.add(1,"day").format("YYYY-MM-DD" + " " + midnight_end_time)
        //console.log(midnight_start,midnight_end)

        //各イベントに対して一旦時間を決めテスト
        // 起床時間(today_wake_up)		7:00:00	
        // 入床時間(bed_in)				21:00:00	
        // 入眠時間(sleep_in)			23:00:00	
        // 起床時間(wake_up)			4:00:00 ~ 09:00:00	


        // 当日起床時間
        // イベントテーブルから発生日が前日の夜間開始時刻から当日の夜間開始時刻までの間で
        // $today_wake_up = Event::whereBetween('arise_date', [$midnight_start->copy()->subDay(), $midnight_start])
            // $userのidと同じ値のuser_id,
            // ->where('user_id', $user->id)
            // 通知イベントがconstants.sleep_event.wake_upと同じ値(3)の通知コード
            // ->where('event_code', config('constants.sleep_event.wake_up'))
            // 発生日の降順に表示
            // ->orderByDesc('arise_date')
            // 発生日のデータを一つ取得
            // ->value('arise_date');
            let twt = "07:00:00"
            let today_wake_up = eventTime(date,twt);
            //console.log(today_wake_up)



        // 入床
        // 最初のイベントを取得
        // イベントテーブルから発生日が夜間開始時刻から夜間終了時刻までの間で
        // $first_event = Event::whereBetween('arise_date', [$midnight_start, $midnight_end])
            // $userのidと同じ値のuser_id,
            // ->where('user_id', $user->id)
            // 発生日の降順に表示
            // ->orderBy('arise_date')
            // 通知コードを一つ取得
            // ->value('event_code');
            let first_event = [{event_code : 1}];
            //console.log(first_event[0].event_code)

        // 値をnullにして$bed_inを定義
        // $bed_in = null;
        let bed_in = null;
        // 夜間時刻開始後の最初のイベントが入床ではない場合
        // if ($first_event != config('constants.sleep_event.bed_in')) {
        if (first_event[0].event_code != 1){
            // 夜間時刻開始後の最初のイベントが入床ではない場合は3時間前から検索
            // イベントテーブルから発生日が夜間開始時刻三時間前から夜間開始時刻までの間で
            // $bed_in = Event::whereBetween('arise_date', [$midnight_start->copy()->subHour(3), $midnight_start])
                // $userのidと同じ値のuser_id,
                // ->where('user_id', $user->id)
                // 通知イベントがonstants.sleep_event.bed_inと同じ値(1)の通知コード
                // ->where('event_code', config('constants.sleep_event.bed_in'))
                // 発生日の降順に表示
                // ->orderByDesc('arise_date')
                // 発生日のデータを一つ取得
                // ->value('arise_date');
                let bt = "17:00:00"
                bet_in = eventTime(date,bt);
                //console.log(bet_in)
        // }
        }
        // $bed_inがnullの場合
        // if (is_null($bed_in)) {
        if (bed_in === null){
            // イベントテーブルから発生日が夜間開始時刻から夜間終了時刻の間で
            // $bed_in = Event::whereBetween('arise_date', [$midnight_start, $midnight_end])
                // $userのidと同じ値のuser_id,
                // ->where('user_id', $user->id)
                // 通知イベントがonstants.sleep_event.bed_inと同じ値(1)の通知コード
                // ->where('event_code', config('constants.sleep_event.bed_in'))
                // 発生日の降順に表示
                // ->orderBy('arise_date')
                // 発生日のデータを一つ取得
                // ->value('arise_date');
                let bt = "21:00:00"
                bed_in = eventTime(date,bt);
                //console.log(bed_in)
        // }
        }

        // 入眠
        // 値をnullにして$sleep_inを定義
        // $sleep_in = null;
        let sleep_in = null;
        // $bed_inがnullでない場合
        // if (!is_null($bed_in)) {
        if (bed_in != null){
            // イベントテーブルから発生日が入床時刻から夜間終了時刻の間で
            // $sleep_in = Event::whereBetween('arise_date', [$bed_in, $midnight_end])
                // $userのidと同じ値のuser_id,
                // ->where('user_id', $user->id)
                // 通知イベントがconstants.sleep_event.sleep_inと同じ値(2)の通知コード
                // ->where('event_code', config('constants.sleep_event.sleep_in'))
                // 発生日の降順に表示
                // ->orderBy('arise_date')
                // 発生日のデータを一つ取得
                // ->value('arise_date');
                let st = "23:00:00"
                sleep_in = eventTime(date,st);
                //console.log(sleep_in)
        // }
        }

        // 起床
        // 値をnullで$wake_upを定義
        // $wake_up = null;
        let wake_up = null;
        // $sleep_inがnullでない場合
        // if (!is_null($sleep_in)) {
        if (sleep_in != null){
            // 夜間開始時刻の日付を一日追加して$end_timeに定義
            // $end_time = $midnight_start->copy()->addDay();
            // let yd = new Date(date)
            // let td = getDateListTomorrow(yd)
            // let end_time = td + " " + midnight_start_time;
            // console.log("Date",end_time)

            let startDate = m.clone().format(midnight_start)
            let addDay = moment(startDate)
            let td = addDay.clone().add(1,"day").format("YYYY-MM-DD")
            let end_time = addDay.add(1,"day").format("YYYY-MM-DD" + " " + midnight_start_time)
            // console.log(end_time)
            // イベントテーブルから発生日が入床時刻から翌日の夜間開始時刻の間で
            // $wake_up = Event::whereBetween('arise_date', [$sleep_in, $end_time])
                // $userのidと同じ値のuser_id,
                // ->where('user_id', $user->id)
                // 通知イベントがconstants.sleep_event.wake_upと同じ値(3)の通知コード
                // ->where('event_code', config('constants.sleep_event.wake_up'))
                // 発生日の降順に表示
                // ->orderByDesc('arise_date')
                // 発生日のデータを一つ取得
                // ->value('arise_date');

                // テスト用にランダムで起床時間を作成
                let randomTime = momentRandom('2021-10-20 09:00:00','2021-10-20 04:00:00')
                let wt = randomTime.format("HH:mm:ss")    
                //let wt = "07:30:00"
                wake_up = eventTime(td,wt); 
                //console.log(wake_up)

        // }
        }

        // 入眠のイベントがある場合、寝付き時間を測定
        let asleep_time = null;
        // if (!is_null($sleep_in)) {
        if (sleep_in != null){
        //  入床から入眠までの分の差を$asleep_timeを定義し取得
        //  $asleep_time = $bed_in->diffInMinutes($sleep_in);
            let si = new Date(sleep_in[0].arise_date);
            let bi = new Date(bed_in[0].arise_date);

            asleep_time = (si.getTime() - bi.getTime())/(60*1000)
                //console.log(asleep_time);
        // } else {
        }else{
        //  入眠イベントがない場合nullを定義
        //  $asleep_time = null;
            asleep_time = null;
        // }
        }

        // 起床のイベントがある場合、睡眠時間とぐっすり時間を測定
        // 値をnullで$sleep_timeを定義
        // $sleep_time = null;
        let sleep_time = null;
        // 値をnullで$deep_sleep_timeを定義
        // $deep_sleep_time = null;
        let deep_sleep_time = null;
        // $wake_upがnullでない場合
        // if (!is_null($wake_up)) {
        if (wake_up != null){
            // 睡眠データを取得
            // $sleep_data = self::calcSleepTime($user, $sleep_in, $wake_up);
            let sleep_data = calcSleepTime(users,sleep_in,wake_up);
            // $sleep_timeを定義して睡眠時間を取得
            // $sleep_time = $sleep_data["sleep_time"];
            sleep_time = sleep_data[0].sleep_time
            // $deep_sleep_timeを定義してぐっすり時間を取得
            // $deep_sleep_time = $sleep_data["deep_sleep_time"];
            deep_sleep_time = sleep_data[0].deep_sleep_time
            
        // }
        }
        

        // $result[$date->format("Y-m-d")] = [
        result.push(
            {
            // is_null($today_wake_up)の結果がtureの場合null,falseの場合当日起床時時間を('Y-m-d H:i')の形に
            // 'today_wake_up_time' => is_null($today_wake_up) ? null : $today_wake_up->format('Y-m-d H:i'),
            "today_wake_up_time" : today_wake_up = null ? null : today_wake_up[0].arise_date,
            // is_null($bed_in)の結果がtureの場合null,falseの場合入床時間を('Y-m-d H:i')の形に
            // 'bed_in_time' => is_null($bed_in) ? null : $bed_in->format('Y-m-d H:i'),
            "bed_in_time" : bed_in = null ? null : bed_in[0].arise_date,
            // is_null($sleep_in)の結果がtureの場合null,falseの場合入眠時間を('Y-m-d H:i')の形に
            // 'sleep_in_time' => is_null($sleep_in) ? null : $sleep_in->format('Y-m-d H:i'),
            "sleep_in_time" : sleep_in = null ? null : sleep_in[0].arise_date,
            // is_null($wake_up)の結果がtureの場合null,falseの場合起床時間を('Y-m-d H:i')の形に
            // 'wake_up_time' => is_null($wake_up) ? null : $wake_up->format('Y-m-d H:i'),
            "wake_up_time" : wake_up = null ? null : wake_up[0].arise_date,
            // is_null($asleep_time)の結果がtureの場合null,falseの場合寝つき時間
            // 'asleep_time' => is_null($asleep_time) ? null : $asleep_time,
            "asleep_time" : asleep_time = null ? null : asleep_time,
            // 睡眠時間を'sleep_time'に
            // 'sleep_time' => $sleep_time,
            "sleep_time" : sleep_time,
            // ぐっすり時間を'deep_sleep_time'に
            // 'deep_sleep_time' => $deep_sleep_time
            "deep_sleep_time" : deep_sleep_time
            }
        // ];
        )
    // }
    })  
    // return $result;

    return result;
// }
    
}


// /**
//  * 日付リスト取得処理
//  *
//  * @param Carbon $start
//  * @param Carbon $end
//  * @return array
//  */
//     public static function getDateList(Carbon $start, Carbon $end)
//     {
//         do {
//             $dates[] = $start->copy();
//         } while ($start->addDay() <= $end);

//         return $dates;
//     }

//日付リスト取得処理
let dates = []
function getDateList(start,end){
    // 
    for (let i = start;i < end;i.add(1,"day")){
        let d = i.format("YYYY-MM-DD")
        dates.push(d)
    }
    return dates
}




/*********************************************************************************
 * private method
 *********************************************************************************/

/**
 * 睡眠時間計算処理
 *
 * @param User $user
 * @param Carbon $sleep_in
 * @param Carbon $wake_up
 * @return array
 */
//  private static function calcSleepTime(User $user, Carbon $sleep_in, Carbon $wake_up) {
function calcSleepTime(users,sleep_in,wake_up){
    // 値をnullで$sleep_timeを取得
    // $sleep_time = null;
    let sleep_time = null;
    // 値をnullで$deep_sleep_timeを取得
    // $deep_sleep_time = null;
    let deep_sleep_time = null;
    let result = null;
    // 寝たきりモード対応(寝たきりの場合、睡眠レベル3と4しか見ません)
    // ユーザー詳細テーブルが定義済みでnullでなく,寝たきりモードがconstants.sensitivity_mode.onと同じ値(1)の場合
        const detail = null;
        const sensitivity_mode = 2;
    // if(isset($user->detail) && $user->detail->sensitivity_mode === config('constants.sensitivity_mode.on')) {
    if (typeof detail != undefined && sensitivity_mode === 1){

        // 睡眠時間
        // 一分データテーブルから$userのidと同じ値のuser_id,
        // $sleep_time = SleepData1minute::where('user_id', $user->id)
            // 睡眠レベルがdeep_sleep(4)かsleep(3)が含まれる
            // ->whereIn('sleep_stage', [config('constants.sleep_stage.deep_sleep'), config('constants.sleep_stage.sleep')])
            // 発生日が入眠時刻以上で
            // ->where('arise_date', '>=', $sleep_in)
            // 起床時刻より小さい
            // ->where('arise_date', '<', $wake_up)
            // データをカウント
            // ->count();
            sleep_time = 420;

        // ぐっすり時間
        // 一分データテーブルから$userのidと同じ値のuser_id,
        // $deep_sleep_time = SleepData1minute::where('user_id', $user->id)
            // 睡眠レベルがdeep_sleep(4)のデータ
            // ->whereIn('sleep_stage', [config('constants.sleep_stage.deep_sleep')])
            // 発生日が入眠時刻以上で
            // ->where('arise_date', '>=', $sleep_in)
            // 起床時刻より小さい
            // ->where('arise_date', '<', $wake_up)
            // データをカウント
            // ->count();
            deep_sleep_time = 240;
            //console.log("test")
    }
    // } else {
        // イベントテーブルから発生日が入眠時刻と起床時刻の間で
        // $sleep_data = Event::whereBetween('arise_date', [$sleep_in, $wake_up])
            // $userのidと同じ値のuser_id
            // ->where('user_id', $user->id)
            // 通知コードにsleep_in(2)かwake_up(3)が含まれるデータ
            // ->whereIn('event_code', [config('constants.sleep_event.sleep_in'), config('constants.sleep_event.wake_up')])
            // 発生日を昇順に取得
            // ->orderBy('arise_date');
        let siarise = sleep_in[0].arise_date;
        let waarise = wake_up[0].arise_date;
        let sleep_data = [
            {id:1, user_id:1, device_id:1, arise_date:siarise.toString(), event_code:2},
            {id:2, user_id:2, device_id:2, arise_date:waarise.toString(), event_code:3}
        ];
            

        // 値を0で$event_codeを定義
        // $event_code = 0;
        let event_code = 0;
        // 値をnullでstart_timeを定義
        // $start_time = null;
        let start_time = null;
        // sleep_dataからレコードを一行ずつ取得しforeach
        // foreach($sleep_data->cursor() as $event) {
        let count = 0;
        sleep_data.forEach(function(eventData){
            // 在床中の場合でも睡眠レベルが1または2となる場合があるため、イベントを見ながら算出する
            // switch ($event->event_code) {
            switch (eventData.event_code){
                // 入眠した時
                // case config('constants.sleep_event.sleep_in'):
                case 2:
                    // $eventから発生日を取り出して$start_timeに入れる
                    // $start_time = $event->arise_date;
                    start_time = eventData.arise_date;
                    count += 1;
                    // ブレーク
                    // break;
                    break;
                // 起床した時
                // case config('constants.sleep_event.wake_up'):
                case 3:
                    // $start_timeがnullではない場合
                    // if (!is_null($start_time)) {
                    if (start_time != null){
                        // 睡眠時間 
                        // 入眠時刻から起床時刻の睡眠時間を計算
                        // $sleep_time += $event->arise_date->diffInMinutes($start_time);
                        let st = new Date(start_time);
                        let wt = new Date(sleep_data[1].arise_date);

                        sleep_time = (st.getTime() - wt.getTime())/(-60*1000)

                        
                        //sleep_time += 
                        // ぐっすり時間
                        // 一分データテーブルから$userのidと同じ値のuser_id,
                        // $deep_sleep_time += SleepData1minute::where('user_id', $user->id)
                            // 睡眠レベルがdeep_sleep(4)かsleep(3)が含まれる
                            // ->whereIn('sleep_stage', [config('constants.sleep_stage.deep_sleep'), config('constants.sleep_stage.sleep')])
                            // 発生日が入眠時刻以上で
                            // ->where('arise_date', '>=', $start_time)
                            // 起床時刻より小さい
                            // ->where('arise_date', '<', $event->arise_date)
                            // データをカウント
                            // ->count();
                            deep_sleep_time = 300;
                            count += 1
                    }else{
                    // } else {
                        // 睡眠時間
                        // 入眠時刻から起床時刻の睡眠時間を計算
                        // $sleep_time += $event->arise_date->diffInMinutes($sleep_in);
                        let st = new Date(start_time);
                        let wt = new Date(sleep_data[1].arise_date);

                        let sleep_time = (st.getTime() - wt.getTime())/(-60*1000)
                        // ぐっすり時間
                        // 一分データテーブルから$userのidと同じ値のuser_id,
                        // $deep_sleep_time += SleepData1minute::where('user_id', $user->id)
                            // 睡眠レベルがdeep_sleep(4)かsleep(3)が含まれる
                            // ->whereIn('sleep_stage', [config('constants.sleep_stage.deep_sleep'), config('constants.sleep_stage.sleep')])
                            // 発生日が入眠時刻以上で
                            // ->where('arise_date', '>=', $sleep_in)
                            // 起床時刻より小さい
                            // ->where('arise_date', '<', $event->arise_date)
                            // データをカウント
                            // ->count();
                            deep_sleep_time = 340;
                            count += 1
                    // }
                    }
                    // ブレーク
                    // break;
                    count += 1
                    break;
            // }
                }
            // $eventのevent_codeを値にして$event_codeに定義
            // $event_code = $event->event_code;
            event_code = eventData.event_code;
        // }
        })
        
        
        // $event_codeとsleep_in(2)が同じ場合
        // if ($event_code == config('constants.sleep_event.sleep_in')) {
        if (event_code == 2){
            // 入眠時刻から起床時刻の睡眠時間を計算
            // $sleep_time += $wake_up->diffInMinutes($start_time);
            // 一分データテーブルから$userのidと同じ値のuser_id,
            // $deep_sleep_time += SleepData1minute::where('user_id', $user->id)
                // 睡眠レベルがdeep_sleep(4)かsleep(3)が含まれる
                // ->whereIn('sleep_stage', [config('constants.sleep_stage.deep_sleep'), config('constants.sleep_stage.sleep')])
                // 発生日が入眠時刻以上で
                // ->where('arise_date', '>=', $start_time)
                // 起床時刻より小さい
                // ->where('arise_date', '<', $wake_up)
                // データをカウント
                // ->count();
        // }
        }
    
    // }
    

    // $result = [
    result = [
        // is_null($sleep_time)の結果がtureの場合null,falseの場合$sleep_time
        // 'sleep_time' => is_null($sleep_time) ? null : $sleep_time,
        {"sleep_time": sleep_time = null ? null : sleep_time,
        // is_null($deep_sleep_time)の結果がtureの場合null,falseの場合$deep_sleep_time
        // 'deep_sleep_time' => is_null($deep_sleep_time) ? null : $deep_sleep_time
        "deep_sleep_time": deep_sleep_time = null ? null : deep_sleep_time}
    // ];
    ]
    

    // return $result;
    return result
}
// }


//----------------------------------------------------------------------

// module.exports.dateFormat = function(last_arise_date){
//     let time = []
//     let timeStr = last_arise_date[0].arise_date;
//     let ymdhi = ["年","月","日","時","分"]
//     let words = timeStr.split(/[-" ":]/);

//     for(let i = 0; i < (words.length-1); i++){
//         time += words[i] + ymdhi[i]
//         return time
//     }

// }

// イベント発生日取得処理
function eventTime(date,et){
    let dateEt = date + " " + et;
    return [{arise_date:dateEt}]
}

// 平均起床時間取得処理
module.exports.getAverage = function(timeList){
    let list = [];
    // wake_up_timeの日時を当日にする(平均時間を求めるため)
    for (let i = 0;i < timeList.length;i++){
        list.push(m.format("YYYY-MM-DD" + " " + timeList[i]))
    }
    let sum = 0;
    for (let i = 0;i<list.length;i++){
        let date = moment(list[i])
        sum += date
    }
    let avg = sum/list.length
    //let result = moment(avg).format("HH:mm:ss");

    return avg
}


// 日付一日後取得処理
// function getDateListTomorrow(date) {
//     let formatedTomorrow = date.getFullYear()+'-'+("00"+
//     (date.getMonth()+1)).slice(-2)+'-'+
//     ("00"+(date.getDate()+1)).slice(-2);
//     return  formatedTomorrow
// }

//2か月前日付取得処理
// module.exports.getTwoMonthAgo = function(){
//     let today = new Date();
//     let y = today.getFullYear();
//     let m = ("00" + (today.getMonth()-1)).slice(-2);
//     let d = ("00" + (today.getDate()-1)).slice(-2);
//     let result = y + "-" + m + "-" + d;
//     return result
// }

//日付リスト取得処理(旧)
// let dates = new Array;
// function getDateList(start,end) {
//     for(var d = start; d < end; d.setDate(d.getDate()+1)) {
//         let formatedDate = d.getFullYear()+'-'+
//         ("00"+(d.getMonth()+1)).slice(-2)+'-'+
//         ("00"+d.getDate()).slice(-2);
//         dates.push(formatedDate);
//     }
//     return  dates
// }
//console.log(getDateList(this.start,this.end))


// //年月日取得処理
// module.exports.getNowYMD = function(n){
//     let today = new Date();
//     let y = today.getFullYear();
//     let m = ("00" + (today.getMonth()+1)).slice(-2);
//     let d = ("00" + (today.getDate()+n)).slice(-2);
//     let result = y + "-" + m + "-" + d;
//     return result
// }

//現在日時取得処理
// module.exports.nowTime = function(){
//     let nt = new Date();
//     let y = nt.getFullYear();
//     let m = ("00" + (nt.getMonth()+1)).slice(-2);
//     let d = ("00" + nt.getDate()).slice(-2);
//     let h = ("00" + nt.getHours()).slice(-2);
//     let i = ("00" + nt.getMinutes()).slice(-2);
//     let s = ("00" + nt.getSeconds()).slice(-2);
//     let result = y + "-" + m + "-" + d + " " + h + ":" + i + ":" + s;
//     return result
// }