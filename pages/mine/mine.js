const app = getApp()
Page({
  data: {		//此处定义本页面中的全局变量
    result: '',
    username: '',
    passwd: '',
    agree:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wherefrom:'',
    params:'',
  },

  onLoad:function(options){
    //console.log(options);
    if(options.from == 'release')
      this.setData({
        wherefrom:"release",
      })
    else if(options.from =='detail')
      this.setData({
        wherefrom:"detail",
        params:options.id,
      })
    else
      this.setData({
        wherefrom:'',
      })
  },

  onShow:function(){
  },

  GetUserInfo:function(e){
    var that = this;
    if(that.data.agree){
      if(e.detail.userInfo){
        //登录，获取用户openid
        wx.login({
          success:function(res){
            wx.request({
              url: app.globalData.url+'user/login',
              data:{
                code:res.code
              },
              success:function(res){
                  console.log(res);
                  if(res.data!='fail'){
                    
                    that.setData({
                      userid : res.data.data.sessionId,
                      is_admin: res.data.data.isAdmin
                    })
                    wx.setStorageSync('userid',res.data.data.sessionId)
                    wx.setStorageSync('is_admin',res.data.data.isAdmin)
                    if(that.data.wherefrom=='release')
                    wx.navigateBack({
                      delta:1,
                    })
                    // wx.switchTab({
                    //   url: '../release/release',
                    // })   
                    else if(that.data.wherefrom=='detail')
                    wx.navigateBack({
                      delta:1,
                    })
                    // wx.navigateTo({
                    //   url: '../index/detail/detail?id=' + that.data.params,
                    // }) 
                    else 
                    wx.switchTab({
                      url: '../mine/myinfo/myinfo',
                    })   
                  }else{
                    wx.showToast({
                      title: '获取session失败，请稍后再试',
                      icon:'none',
                      duration:2000,
                    })
                  }
              },
              fail: function (res) {
                wx.showLoading({
                  title: '请检查网络设置',
                })
                setTimeout(function () {
                  wx.hideLoading()
                }, 3000)
              },
            })
          }
        })
      }else{
        wx.showToast({
          title: "为了您更好的体验,请先同意授权",
          icon: 'none',
          duration: 2000
        });
      }
    }else{
      wx.showToast({
        title: '未同意服务条款将无法登录',
        icon:'none',
        duration:3000,
      })
    }
  },



  uesrnameInput: function (e) {	// 用于获取输入的账号
    this.setData({
      username: e.detail.value	//将获取到的账号赋值给username变量
    })
  },
  passwordInput: function (e) {		// 用于获取输入的密码
    this.setData({
      passwd: e.detail.value	//将获取到的账号赋值给passwd变量
    })
  },

  change: function(e){
    if(e.detail.value[0]=='agree')
      this.setData({
        agree:true
      })
    else{
      this.setData({
        agree:false
      })
    }
  },

  loginBtnClick: function (e) {		//与服务器进行交互
    if(this.data.agree){
    wx.request({
      url: 'https://www.changle.xyz/Lost_Found/alogin_process.php',	//获取服务器地址，此处为本地地址
      header: {
        "content-type": "application/x-www-form-urlencoded"		//使用POST方法要带上这个header
      },
      method: "POST",
      data: {		//向服务器发送的信息
        username: this.data.username,
        password: this.data.passwd
      },
      success: res => {
        if (res.statusCode == 200) {
          if (res.data== "<script>window.location.href='admin.php';</script>"){
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              //duration: 2000
            })
            var user_token='zanshimeiyou';
            wx.setStorageSync('user_my_token', user_token)
            wx.switchTab({
              url: './myinfo/myinfo',
            })
            
          }else{
            wx.showToast({
              title: '用户名或密码错误！',
              icon: 'none',
              //duration: 2000
            })
          }
        }else{
          wx.showToast({
            title: '用户名和密码不能为空',
            icon:'none',
            duration:3000,
          })
        }
      }
    })
  }else{
      wx.showToast({
        title: '未同意服务条款将无法登录',
        icon:'none',
        duration:5000,
      })
  }
  }
})