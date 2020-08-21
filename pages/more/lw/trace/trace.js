// pages/more/lw/trace/trace.js
import decode from '../../../../utils/emoji';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lon:'',
    lat:'',
    res:[],
    markers:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      lon : options.long,
      lat : options.lat, 
    })
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: app.globalData.url + 'lw/getAllmarker',
      success(res){
        that.setData({
          markers:that.buildMarker(res.data)
        })
        wx.hideLoading({
          complete: (res) => {},
        })
      },
      fail(res){
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.showLoading({
          title: '请检查网络设置',
        })
      }
    })
  },

  buildMarker:function(data){
    var marker=[]
    data.forEach(element => {
      var year = element.time.substr(0,2);
      var month = element.time.substr(2,2);
      var day = element.time.substr(4,2);
      var hour = element.time.substr(6,2);
      var min = element.time.substr(8,2); 
      var date = new Date();
      element.time = (date.getYear() != year) ? '20' + year + '年' + month + '月' + day + '日 ' + hour + ':' + min : month + '月' + day + '日 ' + hour + ':' + min;
      element.content=decode(element.content);
      const customCallout = {
        id: element.id,
        latitude: element.lat,
        longitude: element.lon,
        iconPath: "../images/location.png",
        callout: {
          content: element.content+' On '+element.item+' By '+element.user+' At '+element.time,
          color: '#000000',
          fontSize: 14,
          borderRadius: 10,
          bgColor: '#fff',
          padding: 5,
          display: 'BYCLICK',
          textAlign: 'center'
        },
      }
      marker.push(customCallout)
    });
    //console.log(marker)
    return marker
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