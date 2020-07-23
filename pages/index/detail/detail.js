// pages/index/detail/detail.js
import decode from "../../../utils/emoji"
const app = getApp();
var coord;  //声明 全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    imgList: [], 
    hidden:false,
    imgCode:"",
    phone:"**********",
    real_phone:"",
    connect:"connect",
    url:app.globalData.static_url,
    x: 0,
    area_width: 85,   //可滑动区域的宽，单位是百分比，设置好后自动居中
    box_width: 60,   //滑块的宽,单位是 px
    maxNum: 0, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var Mythis = this;
    wx.request({
      url: app.globalData.url+'item/detail/'+id,
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        var img = Mythis.int2date(res.data)
        //console.log(img);
        Mythis.setData({
          item: res.data,
          imgList: img,
          real_phone: res.data.phone,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    var that = this;
    wx.getSystemInfo({  //获取系统信息 设置预设值
      success: function (res) {
        console.log(res.windowWidth);
        var n = Math.floor(res.windowWidth * that.data.area_width * 80 / 10000 - that.data.box_width)
        console.log(n)
        that.setData({
          maxNum: n,
        })
      }
    })
  },

  drag(e) {
    var that = this;
    coord = e.detail.x;  //根据bindchange 事件获取detail的x轴
    console.log(coord)
  },
  dragOver(e) {     //根据触摸 手指触摸动作结束    判断 当前的x轴 是否大于预设值的值 
    var that = this;
    if (coord >= that.data.maxNum) {
      wx.showToast({
        title: '验证成功',
        icon: 'success',
        duration: 1500
      })
      that.setData({
        x: 0,
        hidden: true,
        phone : that.data.real_phone,
        connect : "",
      })
      //验证成功之后的代码
    } else {      // 如果不大于 则设置 x周的距离为0
      that.setData({
        x: 0,
      })
    }
  },

  int2date: function (a) {
    var year = a.time.substr(0, 2);
    var month = a.time.substr(2, 2);
    var day = a.time.substr(4, 2);
    var hour = a.time.substr(6, 2);
    var min = a.time.substr(8, 2);
    var date = new Date();
    a.time = (date.getYear() != year) ? '20' + year + '年' + month + '月' + day + '日 ' + hour + ':' + min : month + '月' + day + '日 ' + hour + ':' + min;
    var img =new Array();
    img[0] = this.data.static_url + 'MyPhp/static/upload/' + a.url;
    a.disc=decode(a.disc);
    return img;
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

  },

  preview: function (event) {
    //console.log(event);
    //console.log(event.currentTarget.dataset.src)
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.imgList // 需要预览的图片http链接列表
    })
  },

  longpress: function (event) {
    var id = event.currentTarget.id.substr(5)
    //console.log(id)

    wx.showActionSheet({
      itemList: ['举报TA'],
      success: function (res) {
        //console.log(res.tapIndex);
        if (res.tapIndex == 0) {
          //举报处理，数据库标志位+1，超过一定值标记该信息无效
          wx.showToast({
            title: '举报成功',
            icon: 'success',
            duration: 2000
          })
        } 
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  input:function(e){
    //console.log(e);
    this.setData({
      imgCode:e.detail.value
    })
  },

  onTap() {
    this.mcaptcha.refresh();
  },

})