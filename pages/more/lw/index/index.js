// pages/more/lw/index/index.js
import decode from '../../../../utils/emoji';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:'',
    items : [],
    comment: [],
    content:'',
    disabled:true,
    src : '',
    hidden1 : 'block',
    hidden2 : 'none',
    hidden3 : 'none',
    userInfo:'',
    send_btn_dis:'none',
    auth_btn_dis:'block',
    hiddenModal:'true',
    user_defined_item:'',
    iosDialog1:false,
    userid:'',
    long:'',
    lat:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              //console.log(res.userInfo)
              that.setData({
                send_btn_dis:"block",
                auth_btn_dis:"none",
              })
              wx.setStorageSync('userinfo', res.userInfo);
            }
          })
        }else{
          wx.removeStorage({
            key: 'userinfo',
          })
        }
      }
    })
    const imgPath = options.src;
    this.setData({
      src:imgPath,
    })
    //Debug专用
    //  this.setData({
    //    src: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3404129581,3734062752&fm=26&gp=0.jpg',
    //    items: [
    //     {
    //       "keyword":'花', 
    //     },
    //     {
    //       "keyword":'叶子',
    //     },
    //     {
    //       "keyword":'树枝',
    //     }],
    // })  
    var that = this;
    //Debug屏蔽段点
    this.getBaiduAPItoken().then((res)=>{  
      let img = wx.getFileSystemManager().readFileSync(imgPath, "base64");
      //console.log(img);   
      //console.log('token:' + res);
      wx.request({
        url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + res,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {
          image: img,
        },
        success(res) {
          //console.log(res);
          that.setData({
            items:res.data.result,
            item:res.data.result[0].keyword, 
          });

          //默认概率最大的item，提高用户体验
          that.scan(res.data.result[0].keyword);
        }
      });
    }).catch((res)=>{
      wx.showToast({
        title: 'API Error!',
        icon: 'none',
      });
    })
   //Debug屏蔽段-结束
   //Debug模式,scan接口
  //  this.setData({item:this.data.items[0].keyword}) 
  //  this.scan(this.data.items[0].keyword);
  },

  //识别结果选择
  selectitem1:function(){
    var that = this;
    var item_list = [];
    for(var item in that.data.items){
      item_list.push(that.data.items[item].keyword);
    }
    item_list.push('我自己输入~');
    wx.showActionSheet({
      itemList : item_list,
      success(res){
        if(res.tapIndex != item_list.length-1){
          that.setData({item : item_list[res.tapIndex]});
          that.scan(item_list[res.tapIndex]);
          //存在地址获取二次调用，浪费时间，后续考虑优化
        }else{
          //调出form表单
          that.setData({
            hiddenModal:false,
          })
        }
      }
    })
  },

//自定义modal输入框取消
  cancel:function(e){
    this.setData({
      hiddenModal: true
    })
  },
  input:function(e){
    //console.log(e);
    this.setData({
      user_defined_item : e.detail.value
    })
  },

//自定义modal输入框确定
  confirm_item:function(e){
    if(this.data.user_defined_item!=''){
      this.cancel();
      this.setData({
        item : this.data.user_defined_item,
      })
      this.scan(this.data.item);
    }else{
      wx.showToast({
        title: '输入不能为空',
        icon:'none',
        duration:2000,
      })
    }
  },

   selectitem2:function(){
      wx.navigateTo({
        url: '../trace/trace?long='+this.data.long+'&lat='+this.data.lat,
      })
   },

  getloc: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      //获取地理位置信息
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            console.log("请求获取权限");
            wx.authorize({
              scope: "scope.userLocation",
              success(res) {
                console.log("获取权限成功");
                wx.getLocation({
                  type: "gcj02",
                  isHighAccuracy: true,
                  success(res) {
                    var info = [];
                    that.setData({
                      long:res.longitude,
                      lat:res.latitude,
                    })
                    //console.log(res.longitude);
                    //console.log(res.latitude);
                
                    info[0] = res.longitude;
                    info[1] = res.latitude;
                    resolve(info);
                  },
                })
              },
              fail: function () {
                reject('获取地理位置权限失败！');
              }
            })
          } else {
            wx.getLocation({
              type: "gcj02",
              isHighAccuracy: true,
              success(res) {
                var info = [];
                that.setData({
                  long:res.longitude,
                  lat:res.latitude,
                })
                //console.log(res.longitude);
                //console.log(res.latitude);
            
                info[0] = res.longitude;
                info[1] = res.latitude;
                resolve(info);
              },
            })
            // wx.chooseLocation({
            //   success: function (res) {
            //     var info = [];
            //     //经纬度debug
            //     console.log(res.longitude);
            //     console.log(res.latitude);

            //     info[0] = res.longitude;
            //     info[1] = res.latitude;
            //     resolve(info);
            //   },
            //  fail: function () {
            //    reject('获取位置失败！');
            //  }
            //})
          }
        }
      })
    });
  },

  //扫描函数，传入用户所选的item
  scan:function(options){
    //console.log('scan函数执行');
    wx.showLoading({
      title: '获取定位中...',
    })
    var item = options;
    var that = this;
    this.getloc().then((res)=>{
      wx.hideLoading({
        complete: (res) => {},
      })
      wx.showLoading({
        title: '正在扫描周边...',
      })
      //console.log(item);
      wx.request({
        url: app.globalData.url + 'lw/scan',
        method: 'POST',
        data: {
          item: item,
          longitude: res[0],
          latitude: res[1],
          accuracy: 30,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success(res) {
          wx.hideLoading({
            complete: (res) => {},
          })
          //console.log(res.data);
          if (res.data.length != 0){
            that.int2date(res.data);
            that.setData({
              comment: res.data,
              hidden1: 'none',
              hidden2: 'block',
              hidden3: 'none',
            })
          }else{
            that.setData({
              hidden1: 'none',
              hidden2: 'none',
              hidden3: 'block',
            })
          }
        },
        fail(e){
          wx.hideLoading({
            complete: (res) => {},
          });
          wx.showLoading({
            title: '请检查网络设置',
          })
        },
      });
    }).catch((res)=>{
      wx.hideLoading({
        complete: (res) => {},
      })
      wx.showToast({
        title: res,
        icon:'none',
        duration:2000,
      })
    });
  },

  tap: function (e) {
    var that = this;
    //扫描
    var item = e.currentTarget.id;
    var that = this;
    that.setData({
      item : item,
    })
    this.scan(item);
  },

  checkinput:function(e){
    if(e.detail.value=="")      
      this.setData({
        disabled:true,
      })
    else
      this.setData({
        disabled:false,
      })
  },

  prefixZero:function (num, n) {
    return(Array(n).join(0) + num).slice(-n);
  },
  int2date : function(a){
    for(var i =0;i<a.length;i++){
      var year = a[i].time.substr(0,2);
      var month = a[i].time.substr(2,2);
      var day = a[i].time.substr(4,2);
      var hour = a[i].time.substr(6,2);
      var min = a[i].time.substr(8,2); 
      var date = new Date();
      a[i].time = (date.getYear() != year) ? '20' + year + '年' + month + '月' + day + '日 ' + hour + ':' + min : month + '月' + day + '日 ' + hour + ':' + min;
      //a[i].user= a[i].user.substr(-2);
      a[i].content=decode(a[i].content);
    }
  },

  GetUserInfo:function(e){
    if(e.detail.userInfo){
      this.setData({
        send_btn_dis:"block",
        auth_btn_dis:"none",
      })
    }else{
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  },

  getinfo:function(){
    console.log('info调用');
    var that = this;
    return new Promise(function (resolve, reject) {
      try{
        var ui = wx.getStorageSync('userinfo')
        //console.log(ui);
        var userid = wx.getStorageSync('userid');
        if(userid==undefined||userid==null||userid==''||
        ui==undefined||ui==null||ui==''){
          that.setData({
            iosDialog1: true,
          })
        }else{
          //console.log(123);
          //正常操作
          that.setData({
            userInfo : ui.nickName,
            gender : ui.gender,
          })
          resolve();
        }
        // if(ui){
        //   that.setData({
        //     userInfo : ui.nickName,
        //   })
        //   resolve();
        // }else{
        //   wx.getUserInfo({
        //     success:function(res){
        //       wx.setStorageSync('userinfo', res.userInfo);
        //       that.setData({
        //         userInfo : res.userInfo.nickName,
        //       })
        //       resolve();  
        //     },
        //     fail:function(){
        //       reject();
        //     },
        //   });    
        // }
      }catch(e){
        reject();
      }
    });
  },

  submit:function(e){
    console.log('submit调用');
    var that = this;
    this.getinfo().then(()=>{
      that.upload(e);
    }).catch(()=>{
      wx.showToast({
        title: '发布失败，请在右上方...中设置开启权限',
        icon:'none',
        duration:2000,
      })
    });
  },

  utf16toEntities:function(str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str = str.replace(patt, function(char){
            var H, L, code;
            if (char.length===2) {
                H = char.charCodeAt(0); // 取出高位
                L = char.charCodeAt(1); // 取出低位
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
                return "&#" + code + ";";
            } else {
                return char;
            }
        });
    return str;
},

  upload : function(e){  
    console.log('upload调用');
    wx.showLoading({
      title: '发布中...',
    })
    //console.log(this.data.userInfo);
    var that = this;
    that.setData({
      disabled:true,
    })

    this.getloc().then((res) => {
    //发布
      var data = new Date();
      var time = data.getYear()-100 + that.prefixZero(data.getMonth()+1, 2) + that.prefixZero(data.getDate(), 2) + that.prefixZero(data.getHours(), 2) + that.prefixZero(data.getMinutes(), 2);
      //console.log(that.utf16toEntities(e.detail.value.content));
      wx.request({
        url: app.globalData.url + 'lw/upload', 
        method:'POST',
        data:{
          user_name: that.data.userInfo,
          user_id: that.data.userid,
          item:that.data.item,
          longitude:res[0],
          latitude:res[1],
          accuracy:0,
          content:that.utf16toEntities(e.detail.value.content),
          time : time,
        },
        //微信小程序通过POST的不是字符串,而是JSON信息,所以在后台是无法直接用$_POST进行解析的,必须加以下header
        header:{
          'content-type': 'application/x-www-form-urlencoded',
        },
        success(res){
          console.log(res.data);
          if(res.data=="success"){
            //发布成功
            wx.hideLoading({
              complete: (res) => {},
            })
            that.setData({
              content:'',
              disabled:true,
            })
            wx.showToast({
              title: '发布成功！',
              duration:2000,
            })
            //页面刷新
            that.scan(that.data.item);
            //console.log(that.data.item);
            //wx.navigateTo({
            //  url: '',
            //})
          }else{
            wx.showToast({
              title: '发布失败,服务器出错！',
              icon:"none",
            })
          }
        }
      })
    }).catch((res)=>{
      wx.showToast({
        title: '发布失败，未获取到用户信息',
        icon:"none",
        duration:2000,
      })
      wx.hideLoading({
        complete: (res) => {},
      })
    })
   },

  getBaiduAPItoken:function(){
    return new Promise(function(resolve,reject){

    //Baidu API Grant Type
    const gt = 'client_credentials';
    //Baidu API Key
    const cid = 'xcihZfnGqQ4GBgb1ulGgNMiY';
    //Baidu API Secret Key
    const cs = 'N7Cq9tzxK7n6QySG9OD6rv2SlU03GyXx';
    var that = this;

    // try{
    //   var last_token = wx.getStorageSync('Baidu_token');
    //   var expire = wx.getStorageSync('Token_expire');
    //   console.log(last_token);
    //   console.log(expire);
    //   if (last_token && expire > Date.now()){
    //     return last_token;
    //   }else{
    //     throw('fail');
    //   }
    // }catch(e){
      wx.request({
        url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=' + gt + '&client_id=' + cid + '&client_secret=' + cs,
        method: 'POST',
        success(res) {
          //wx.setStorageSync('Baidu_token', res.data.access_token);
          //wx.setStorageSync('Token_expire', Date.now() + res.data.expire_in);
          //console.log(res.data.access_token);
          resolve(res.data.access_token);
          // that.setData({
          //   expire: res.data.expires_in,
          //   token : res.data.access_token,
          // })      
        },
        fail(e) {
          reject('API Token Error!');
        }
      })
    //}
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var userid = wx.getStorageSync('userid')
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              //console.log(res.userInfo)
              wx.setStorageSync('userinfo', res.userInfo);
              that.setData({
                send_btn_dis:"block",
                auth_btn_dis:"none",
                userid : userid,
              })
              that.setData({
                iosDialog1: false,
              })
            }
          })
        }else{
          wx.removeStorage({
            key: 'userinfo',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  close:function(){
    this.setData({
      iosDialog1: false,
    })
  },

  confirm:function(){
    wx.navigateTo({
      url: '../../../mine/mine?from=release',
    })
  },
})