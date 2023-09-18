import WxValidate from '../../../utils/WxValidate.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form :{
      date:'',
      vehicle:'',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.initValidate();
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
  bindDateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  //验证函数
  initValidate() {
    const rules = {
      date: {
        required: true,
      },
      vehicle: {
        required: false,
      }
    }
    const messages = {
      date: {
        required: '请填日期'
      },
      vehicle: {
        required: '请填写班次'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  formSubmit: function (e) {
    var myThis = this;
    this.setData({
      chosen:e.detail.value
    })
    const params = e.detail.value
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.showLoading({
      title: '查询中',
    })
    wx.request({
      url: app.globalData.server_url + 'Epidemic/epidemic_search.php',
      data: {
        date: e.detail.value.date,
        vehicle: e.detail.value.vehicle,
        //destination: e.detail.value.destination,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res.data)
        myThis.setData({
          res_data: res.data.item
        })
      },
      fail: function(res) {},
      complete: function(res) {wx.hideLoading({
        complete: (res) => {},
      })},
    })
  },
  formReset: function (e) {
    this.setData({
      chosen:'',
      date:''
    })
    //console.log('form发生了reset事件')
  },

})