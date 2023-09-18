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
    userInfo:'',
    send_btn_dis:'none',
    auth_btn_dis:'block',
    hiddenModal:'true',
    hiddenModal2:'true',
    user_defined_item:'',
    iosDialog1:false,
    userid:'',
    long:'',
    lat:'',
    offset:500,
    avatar:'',
    like_icon:'data:image/png;base64,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',
    unlike_icon:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yMS44MjYgOWgtMi4wODZjLjE3MS0uNDg3LjI2Mi0uOTU3LjI2Mi0xLjQxIDAtMi4zMjYtMS44MTgtMy43NzYtNC4wMjQtMy41NzMtMi42ODEuMjQ3LTQuNTE4IDMuNzEtNC45NzggNC40ODQtLjUyNy0uODYzLTIuMjYxLTQuMjM4LTQuOTgxLTQuNDk0LTIuMTEtLjE5OS00LjAxOSAxLjE4MS00LjAxOSAzLjU4MiAwIDMuMTA5IDQuMzQ3IDcuMDg0IDkuMDAxIDExLjYxNSAxLjE2LTEuMTI3IDIuMjg1LTIuMjA4IDMuMzI0LTMuMjQzbC45NyAxLjg1N2MtMS4zMTggMS4zMDItMi43NjkgMi42ODYtNC4yOTQgNC4xODEtNi4xNjQtNi4wMzctMTEuMDAxLTEwLjIwMi0xMS4wMDEtMTQuNDAzIDAtMy4yOTQgMi40NjItNS41MjYgNS42NzQtNS41OTYgMi4xNjMtLjAwOSA0LjEyNS45NTcgNS4zMjcgMi45NTIgMS4xNzctMS45NTYgMy4xNDYtMi45NDIgNS4yNTMtMi45NDIgMy4wNjQgMCA1Ljc0NiAyLjExNSA1Ljc0NiA1LjU5NSAwIC40NjQtLjA2LjkyOC0uMTc0IDEuMzk1em0tMTEuMDk0IDRjLS4zNDYuNTk4LS45OTIgMS0xLjczMiAxLTEuMTA0IDAtMi0uODk2LTItMnMuODk2LTIgMi0yYy43NCAwIDEuMzg2LjQwMiAxLjczMiAxaDEuMjIybDEuODgtMi43MWMuMTQtLjIwMi4zNzYtLjMxNS42MjItLjI5OS4yNDUuMDE2LjQ2NC4xNjEuNTc2LjM4bDIuMjcgNC40MzcuODEzLTEuNDVjLjEyNC0uMjIxLjM1Ny0uMzU4LjYxMS0uMzU4aDUuMjc0djJoLTQuNTEzbC0xLjc1OSAyLjkwOGMtLjEzMi4yMTktLjM3My4zNDgtLjYyOS4zMzctLjI1NS0uMDEtLjQ4NC0uMTYtLjU5OC0uMzg5bC0yLjI1Ni00LjU1OS0uOTg5IDEuNDA2Yy0uMTMxLjE4Ni0uMzQ1LjI5Ny0uNTczLjI5N2gtMS45NTF6Ii8+PC9zdmc+',
    like:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const res = wx.getSystemInfoSync();
    this.setData({
      offset:res.windowHeight*0.75,
    })
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
  cancel2:function(e){
    this.setData({
      hiddenModal2: true
    })
  },
  input2:function(e){
    //console.log(e);
    this.setData({
      user_replace_content : e.detail.value
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

  confirm_item2:function(e){
    if(this.data.user_replace_content!=''){
      this.cancel2();
      this.submit(e,1);
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

   selectitem3:function(){
    this.setData({
      hiddenModal2:false,
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
                    wx.setStorage({
                      data: res.longitude,
                      key: 'long',
                    })
                    wx.setStorage({
                      data: res.latitude,
                      key: 'lat',
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
                wx.setStorage({
                  data: res.longitude,
                  key: 'long',
                })
                wx.setStorage({
                  data: res.latitude,
                  key: 'lat',
                })
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
          user_id:that.data.userid,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success(res) {
          wx.hideLoading({
            complete: (res) => {},
          })
          console.log(res.data);
          if(app.checkRes(res.data)=='1000'){
            if(res.data.length != 0){
              that.int2date(res.data);
              that.setData({
                comment: res.data,
                hidden1: 'none',
                hidden2: 'block',
              })
            }else{
              that.setData({
                hidden1: 'none',
                hidden2: 'none',
              })
              wx.showToast({
                title: '暂无留言，赶快做第一个发言的人吧！',
                icon:'none',
                duration:3000
              })
            }
          }else{
            that.setData({
              iosDialog1:true,
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
            avatar : ui.avatarUrl,
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

  //type决定替代方案
  submit:function(e,type=0){
    console.log('submit调用');
    var that = this;
    this.getinfo().then(()=>{
      that.upload(e,type);
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

  upload : function(e,type){  
    console.log('upload调用');
    wx.showLoading({
      title: '发布中...',
    })
    //console.log(this.data.userInfo);
    var that = this;
    that.setData({
      disabled:true,
    })
    const long = wx.getStorageSync('long');
    const lat = wx.getStorageSync('lat');
    if(long==''||lat==''){
      //没缓存地址，获取地址再发送，否则直接读缓存发送
    this.getloc().then((res) => {
    //发布
      var data = new Date();
      var time = data.getYear()-100 + that.prefixZero(data.getMonth()+1, 2) + that.prefixZero(data.getDate(), 2) + that.prefixZero(data.getHours(), 2) + that.prefixZero(data.getMinutes(), 2);
      //console.log(that.utf16toEntities(e.detail.value.content));
      //console.log(that.data.avatar);
      if(type==1)
          var send_content = that.utf16toEntities(that.data.user_replace_content);
      else
          var send_content = that.utf16toEntities(e.detail.value.content);
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
          content: send_content,
          time : time,
          avatar : that.data.avatar,
        },
        //微信小程序通过POST的不是字符串,而是JSON信息,所以在后台是无法直接用$_POST进行解析的,必须加以下header
        header:{
          'content-type': 'application/x-www-form-urlencoded',
        },
        success(res){
          //console.log(res.data);
          if(app.checkRes(res.data)=='1000'){
            if(res.data=="success"){
              //发布成功
              wx.hideLoading({
                complete: (res) => {},
              })
              that.setData({
                content:'',
                disabled:true,
                user_replace_content:'',
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
              that.setData({
                disabled:false,
              })
            }
          }else{
            that.setData({
              iosDialog1: true,
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
    }else{
      var data = new Date();
      var time = data.getYear()-100 + that.prefixZero(data.getMonth()+1, 2) + that.prefixZero(data.getDate(), 2) + that.prefixZero(data.getHours(), 2) + that.prefixZero(data.getMinutes(), 2);
      //console.log(that.utf16toEntities(e.detail.value.content));
      //console.log(that.data.avatar);
      if(type==1)
          var send_content = that.utf16toEntities(that.data.user_replace_content);
      else
          var send_content = that.utf16toEntities(e.detail.value.content);
      wx.request({
        url: app.globalData.url + 'lw/upload', 
        method:'POST',
        data:{
          user_name: that.data.userInfo,
          user_id: that.data.userid,
          item:that.data.item,
          longitude:long,
          latitude:lat,
          accuracy:0,
          content:send_content,
          time : time,
          avatar : that.data.avatar,
        },
        //微信小程序通过POST的不是字符串,而是JSON信息,所以在后台是无法直接用$_POST进行解析的,必须加以下header
        header:{
          'content-type': 'application/x-www-form-urlencoded',
        },
        success(res){
          //console.log(res.data);
          if(app.checkRes(res.data)=='1000'){
            if(res.data=="success"){
              //发布成功
              wx.hideLoading({
                complete: (res) => {},
              })
              that.setData({
                content:'',
                disabled:true,
                user_replace_content:'',
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
              that.setData({
                disabled:false,
              })
            }
          }else{
            that.setData({
              iosDialog1:true,
            })
          }
        }
      })
    }
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

  like:function(event){
    const id = event.currentTarget.id;
    const list_id = event.currentTarget.dataset.index;
    const like = event.currentTarget.dataset.like;
    var userid = wx.getStorageSync('userid');
    if(!userid||userid=='')
      this.setData({
        iosDialog1: true,
      })
    else{
      //点赞取消赞这个个人觉得没必要提示成功或失败或网络中断，影响用户体验
      if(like){
        let url = app.globalData.url + 'lw/like/' + userid +'/'+ id +'/2';
        let data = {};
        var msg = this.data.comment;
        msg[list_id].islike = null;
        msg[list_id].isvalid -=1;  
        this.setData({
          comment:msg,
        });
        app.wxRequest('GET', url, data, (res) => {
          //console.log(res);
          if(res.data=='success'){
            //取消赞成功 
          }else{
            // wx.showToast({
            //   title: '取消失败，请稍后重试！',
            //   icon: 'none',
            //   duration: 2000
            // })
          }
        }, err => {
          // wx.showLoading({
          //   title: '请检查网络设置',
          // })
        });
      }else{
        wx.vibrateShort({
          complete: (res) => {},
        })
        let url = app.globalData.url + 'lw/like/' + userid +'/'+ id+'/1';
        let data = {};
        var Mythis = this;
        // wx.showLoading({
        //   title: '加载中',
        // })
        var msg = this.data.comment;
        msg[list_id].islike = 1;
        msg[list_id].isvalid =Number(msg[list_id].isvalid)+Number(1);  
        this.setData({
          comment:msg,
        });
        app.wxRequest('GET', url, data, (res) => {
          //console.log(res);
          if(res.data=='success'){
            // wx.showToast({
            //   title: '点赞成功！',
            //   icon: 'none',
            //   duration: 2000
            // })
          }else{
            // wx.showToast({
            //   title: '点赞失败，请稍后重试！',
            //   icon: 'none',
            //   duration: 2000
            // })
          }
        }, err => {
          // wx.showLoading({
          //   title: '请检查网络设置',
          // })
        });
      }
    }
  },
})