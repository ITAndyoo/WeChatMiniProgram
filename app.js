//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    url: 'http://127.0.0.1:8080/',
    //url: 'https://api.changle.xyz/index.php/',
    static_url : 'https://api.changle.xyz/',
    server_url : 'https://www.changle.xyz/',
  },

  wxRequest(method,url,data,callback,errFun,token){
    wx.request({
      url: url,
      method: method,
      data:data,
      header:{
        // application/x-www-form-urlencoded
        'content-type': 'application/json;charset=UTF-8',
        'Accept': 'application/json',
        'token': token
      },
      dataType:'json',
      success:function(res){
        callback(res);
      },
      fail:function(err){
        errFun(err);
      }
    })
  },
  checkRes:function(res){
    if(res=='session_invalid'){
      return '1370'
    }else if(res =='session_expr'){
      return '1080'
    }else{
      return '1000'
    }
  }

})