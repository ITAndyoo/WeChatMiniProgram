// pages/myinfo/myinfo.js
var app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iosDialog1: false,
    iosDialog2: false,
    userid:'',
    tips_hid:true,
    bd_hid:'none',
    is_admin:false,
    logo:'',
    flag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(wx.getSystemInfoSync().theme=='dark'){
      this.setData({
        theme:'dark',
      })
    }
    wx.request({
      url: app.globalData.url + 'config/getLogo',
      success:function(res){
        //console.log(res);
        that.setData({
          mlurl:app.globalData.static_url,
          logo:res.data,
          flag:true,
        })
      },
      fail:function(){
        that.setData({
          flag:false,
        })
      }
    })
    // //console.log(123);
    // var that = this;
    // wx.getSetting({
    //   success (res){
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function(res) {
    //           //console.log(res.userInfo)
    //           that.setData({
    //             nickName:res.userInfo.nickName,
    //             avatarUrl:res.userInfo.avatarUrl,
    //           })
    //           wx.setStorageSync('userinfo', res.userInfo);
    //         }
    //       })
    //     }else{
    //       wx.removeStorage({
    //         key: 'userinfo',
    //       })
    //       that.setData({
    //         iosDialog1: true,
    //       })
    //     }
    //   }
    // })
  },

  close:function(){
    this.setData({
      iosDialog1: false,
    })
  },

  confirm:function(){
    wx.navigateTo({
      url: '../mine',
    })
  },

  close2:function(){
    this.setData({
      iosDialog2:false,
    })
  },

  confirm2:function(){
    wx.navigateTo({
      url: '../mine',
    })
  },

   mark: function(){
     wx.navigateTo({
       url: './mark/mark?userid='+ this.data.userid,

     })
   },

  release: function(){
    wx.navigateTo({
      url: '../../release/release?userid='+ this.data.userid
    })
  },

  record: function(){
    wx.navigateTo({
      url: './record/record?userid='+ this.data.userid,
    })
  },

  msg: function(){
    wx.navigateTo({
      url: './msg/msg?userid='+ this.data.userid,

    })
  },

  quit:function(){
    var that =this;
    wx.showLoading({
      title: '退出中...',
    })
    const userid = wx.getStorageSync('userid');
    if(that.data.userid==''|| userid=='')
      wx.showToast({
        title: '你还没有登录呢~',
        icon:'none',
        duration:2000,
      })
    else{
      wx.removeStorageSync('userid');
      wx.removeStorageSync('userinfo');
      wx.removeStorageSync('is_admin');
      wx.request({
      url: app.globalData.url + 'login/logout/'+that.data.userid,
      complete:function(){
        wx.hideLoading({
          complete: (res) => {},
        })
      }
      })
      wx.showToast({
        title: '成功退出',
        icon:'none',
        duration:2000,
      })
      that.setData({
        nickName:'',
        userid:'',
        avatarUrl:'/images/avatar.png',
        is_admin:false,
      })
      that.onShow();
  }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2,
          offset: "85%"
        })
      }
    var isnotexp = true
    var that = this;
    var userid = wx.getStorageSync('userid')
    var user_admin = wx.getStorageSync('is_admin')
    //后面做一次新消息查询
    wx.request({
      url: app.globalData.url+'login/checkRead/'+userid+'/1',
      success:function(res){
        //console.log(res);
        if(app.checkRes(res.data)=='1000'){
          if(res.data!='fail'){
            if(res.data==1)
              that.setData({
                bd_hid:'inline-block',
              })
            else
              that.setData({
                bd_hid:'none',
              })
          }
        }else{
          //console.log('exp')
          isnotexp = false
        }
      },
    })

    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo'] && userid && isnotexp) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              //console.log(res.userInfo)
              that.setData({
                nickName:res.userInfo.nickName,
                avatarUrl:res.userInfo.avatarUrl,
                userid : userid,
                is_admin : user_admin == 1 ? true : false,
              })
              if(user_admin==-1){
                that.setData({
                  iosDialog1: false,
                  iosDialog2: true,
                })
                that.quit();
              }else{
                that.setData({
                  iosDialog1: false,
                })
              }
              wx.setStorageSync('userinfo', res.userInfo);
            }
          })
        }else{
          wx.removeStorage({
            key: 'userinfo',
            key: 'userid',
            key: 'is_admin'
          })
          //console.log('remove')
          that.setData({
            iosDialog1: true,
          })
        }
      }
    })

  },
  //用户设置，暂不开发
  settings:function(){
    if(this.data.userid==null||this.data.userid==''||this.data.userid==undefined){
      wx.navigateTo({
        url: '/pages/mine/mine',
      })
    }else{
      this.setData({
        topTips: true
      });
      setTimeout(()=>{
        this.setData({
          hide: true
        });
        setTimeout(() => {
          this.setData({
              topTips: false,
              hide: false,
          });
        }, 300);
      },1500)
    }
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

  }
})