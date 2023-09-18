// pages/mine/myinfo/msg/msg.js
import {int2date3} from '../../../../utils/format'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:'',
    mlurl:app.globalData.static_url,
    hasmsg: false,
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
    //接收userid
    if(options.userid==undefined||options.userid==null||options.userid==''){
      wx.showToast({
        title: '信息失效，请重新登录',
        icon:"none",
        duration:3000,
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '/pages/mine/myinfo/myinfo',
        })
      },2000)
    }else{
      var userid = options.userid;
      that.getmsg(userid);
    }
  },

  getmsg:function(userid){
    var that = this;
    that.setData({
      userid:userid,
    })
    //console.log(userid);
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'login/getMsg/' +userid,
      method: 'GET',
      success: function (res) {
      //console.log(app.checkRes(res.data));
      if(app.checkRes(res.data)==1000){
        if(res.data!='fail'){
          int2date3(res.data);
          that.setData({
            listItems : res.data,
            hasmsg: true,
            tips:'已加载全部内容'
          })
        }else{
          that.setData({
            listItems : [],
            hasmsg: false,
            tips:'暂无消息',
          })
        }
      }else{
        wx.showToast({
          title: '信息失效，请重新登录',
          icon:"none",
          duration:3000,
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/mine/myinfo/myinfo',
          })
        },2000)
      }
      },
      fail: function (res) { },
      complete: function (res) {wx.hideLoading({
        complete: (res) => {},
      }) },
    })
  },


  tap:function(event){
    //console.log(event);
    var id = event.currentTarget.id.substr(5)
      wx.navigateTo({
        url: '../../../index/detail/detail?id=' + id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
  },
  longpress:function(e){
    var msg_id = e.currentTarget.dataset.msgid;
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认删除该留言？',
      success (res) {
      if (res.confirm) {
        wx.request({
          url: app.globalData.url + 'login/deleteMsg/' +that.data.userid +'/'+msg_id,
          method: 'GET',
          success: function (res) {
            //console.log(res)
            if(app.checkRes(res.data)=='1000'){
              if(res.data=='success'){
                wx.showToast({
                  title: '已删除',
                  icon:'success',
                  duration:2000,
                })
                that.getmsg(that.data.userid);
              }else{
                wx.showToast({
                  title: '删除失败，请稍后再试',
                  icon:'none',
                  duration:2000,
                })
              }
            }else{
              wx.showToast({
                title: '信息失效，请重新登录',
                icon:"none",
                duration:3000,
              })
              setTimeout(()=>{
                wx.switchTab({
                  url: '/pages/mine/myinfo/myinfo',
                })
              },2000)
            }
          },
          fail: function (res) { 
            wx.showToast({
              title: '服务器出错，稍后再试',
              icon:"none",
              duration:5000,
            })
          },
          complete: function (res) { },
        })
      } else if (res.cancel) {
          //console.log('用户点击取消')
      }
      }
      })
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