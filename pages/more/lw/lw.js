// pages/more/lw/lw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera']) {
          console.log("请求获取权限");
          wx.authorize({
            scope: "scope.camera",
            success(res) {
              console.log("获取权限成功");
            },
            fail: function () {
              
              that.reback();
              wx.showToast({
                title: '为了获取更好体验，请在右上角...开启摄像头权限',
                icon: "none",
                duration : 5000,
              })
            }
          })
        }
      }
    })
  },

  takePhoto : function(){
    this._camera.takePhoto({
      quality : 'high',
        success: (res) => {
          this.setData({
            src: res.tempImagePath
          })
          //console.log(res.tempImagePath);

          wx.redirectTo({
            url: './index/index?src='+ this.data.src,
          })
        }
    })
  },

  reback:function(){
    wx.switchTab({
      url: '../../more/more',
    })
  },

  error(e) {
    console.log(e.detail)
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
    this._camera = wx.createCameraContext();
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