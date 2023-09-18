import decode from './emoji';
const app = getApp();

function formatDateFromNow(y,m,d,h,min){
  var dd = new Date(y,m-1,d,h,min);
  var date = new Date();
  var t = Math.round((date.getTime() - dd.getTime())/1000);
  if(date.getFullYear()!=dd.getFullYear()){
    return y + '年' + m + '月' + d + '日';
  }
  if (t == 0)
      return '刚刚';
  else if (t < 60)
      return t + '秒前'; // 一分钟内
  else if (t < 60 * 60)
      return Math.floor(t / 60) + '分钟前'; //一小时内
  else if (t < 60 * 60 * 24)
      return Math.floor(t / (60 * 60)) + '小时前'; // 一天内
  else if (t < 60 * 60 * 24 * 3)
      return Math.floor(date.getTime/(60*60*24)) ==1 ? '昨天 ' + h + ':' + min : '前天 ' + h + ':' + min; //昨天和前天
  else if (t < 60 * 60 * 24 * 30)
      return m + '月' + d + '日 ' + h + ':' + min; //一个月内
  else if (t < 60 * 60 * 24 * 365)
      return m + '月' + d + '日 '  + h + ':' + min; //一年内
  else
      return y + '年' + m + '月' + d + '日'; //一年以前
}

function int2date(a){ //多查询用-FromNow
  var img = new Array();
  var count = 0;
  for(var i =0;i<a.length;i++){
    var year = a[i].time.substr(0,2);
    var month = a[i].time.substr(2,2);
    var day = a[i].time.substr(4,2);
    var hour = a[i].time.substr(6,2);
    var min = a[i].time.substr(8,2); 
    a[i].time = formatDateFromNow('20' + year,month,day,hour,min);
    if(a[i].url!='false')
      img.push(app.globalData.static_url + 'static/upload/' + a[i].url);
    if(a[i].upset>=-5)
      count = count + 1;
    a[i].username = a[i].username.substr(-2);
    a[i].disc=decode(a[i].disc);
  }
  return [img, count];
}

function int2date2(a){  //单查询用-FromNow
  var year = a.time.substr(0,2);
  var month = a.time.substr(2,2);
  var day = a.time.substr(4,2);
  var hour = a.time.substr(6,2);
  var min = a.time.substr(8,2); 
  a.time = formatDateFromNow('20' + year,month,day,hour,min);
  var img =new Array();
  img[0] = app.globalData.static_url + 'static/upload/' + a.url;
  a.disc=decode(a.disc);
  return img;
}

function int2date3(a){  //多查询-消息用 无图片有效位收集
  for(var i =0;i<a.length;i++){
    var year = a[i].time.substr(0,2);
    var month = a[i].time.substr(2,2);
    var day = a[i].time.substr(4,2);
    var hour = a[i].time.substr(6,2);
    var min = a[i].time.substr(8,2); 
    var date = new Date();
    a[i].time = (date.getYear() != year) ? '20' + year + '年' + month + '月' + day + '日 ' + hour + ':' + min : month + '月' + day + '日 ' + hour + ':' + min;
  }
}


function int2date4(a){ //多查询-yyyy年mm月dd日 HH:mm
  var img = new Array();
  var count = 0;
  for(var i =0;i<a.length;i++){
    var year = a[i].time.substr(0,2);
    var month = a[i].time.substr(2,2);
    var day = a[i].time.substr(4,2);
    var hour = a[i].time.substr(6,2);
    var min = a[i].time.substr(8,2); 
    var date = new Date();
    a[i].time = (date.getYear() != year) ? '20' + year + '年' + month + '月' + day + '日 ' + hour + ':' + min : month + '月' + day + '日 ' + hour + ':' + min;
    if(a[i].url!='false')
      img[i] = app.globalData.static_url + 'static/upload/' + a[i].url;
    if(a[i].upset>=-5)
      count = count + 1;
    a[i].username = a[i].username.substr(-2);
    a[i].disc=decode(a[i].disc);
  }
  return [img,count];
}

function date2int(a){
  var date = new Date(a);
  var year = date.getYear() + 1900;
  var month = prefixZero(date.getMonth()+1,2);
  var day = prefixZero(date.getDate(),2); 
  var hour = prefixZero(date.getHours(),2);
  var minute = prefixZero(date.getMinutes(),2);
  var datestr = year+'-'+ month +'-'+ day +' '+ hour +':'+ minute;
  return datestr.replace(/-|:| /g,"").substring(2);
} 
function prefixZero(num, n) {
    return(Array(n).join(0) + num).slice(-n);
}


export {
  int2date,
  int2date2,
  int2date3,
  int2date4,
  date2int,
}