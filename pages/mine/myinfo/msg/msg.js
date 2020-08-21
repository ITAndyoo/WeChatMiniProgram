// pages/mine/myinfo/msg/msg.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:'',
    mlurl:app.globalData.static_url,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
          that.int2date(res.data);
          that.setData({
            listItems : res.data,
            tips:'已加载全部内容'
          })
        }else{
          that.setData({
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
  int2date : function(a){
    for(var i =0;i<a.length;i++){
      var year = a[i].time.substr(0,2);
      var month = a[i].time.substr(2,2);
      var day = a[i].time.substr(4,2);
      var hour = a[i].time.substr(6,2);
      var min = a[i].time.substr(8,2); 
      var date = new Date();
      a[i].time = (date.getYear() != year) ? '20' + year + '年' + month + '月' + day + '日 ' + hour + ':' + min : month + '月' + day + '日 ' + hour + ':' + min;
    }
  },

  tap:function(event){//回退怎么办？？已自动解决
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
      content: '确认删除该记录？',
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