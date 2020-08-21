// pages/mine/myinfo/mark/mark.js
var app = getApp();
import decode from '../../../../utils/emoji';
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
      that.look(userid);
    }
  },

look:function(userid){
  var that = this;
  that.setData({
    userid:userid,
  })
  //console.log(userid);
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.url + 'login/mark/' +userid+'/2/4',
    method: 'GET',
    success: function (res) {
    //console.log(res);
    if(app.checkRes(res.data)=='1000'){
      if(res.data!='fail'){
        var img = that.int2date(res.data);
        //console.log(img);
        that.setData({
          listItems : res.data,
          imgList: img,
          tips:'已加载全部内容(已不存在的消息不会再展示)'
        })
      }else{
        that.setData({
          tips:'你还没有收藏过信息哦~',
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

preview : function(event){
  //console.log(this.data.imgList);
  //console.log(event.currentTarget.dataset.src)
  let currentUrl = event.currentTarget.dataset.src
  wx.previewImage({
    current: currentUrl, // 当前显示图片的http链接
    urls: this.data.imgList // 需要预览的图片http链接列表
  })
},

//日期显示转换，int到用户time
int2date : function(a){
  var img = new Array();
  for(var i =0;i<a.length;i++){
    var year = a[i].time.substr(0,2);
    var month = a[i].time.substr(2,2);
    var day = a[i].time.substr(4,2);
    var hour = a[i].time.substr(6,2);
    var min = a[i].time.substr(8,2); 
    var date = new Date();
    a[i].time = (date.getYear() != year) ? '20' + year + '年' + month + '月' + day + '日 ' + hour + ':' + min : month + '月' + day + '日 ' + hour + ':' + min;
    if(a[i].url!='false')
      img[i] = app.globalData.static_url + 'static/upload/' + a[i].url;
    a[i].username = a[i].username.substr(-2);
    a[i].disc=decode(a[i].disc);
  }
  return img;
},


tap:function(event){//回退怎么办？？已自动解决
  var id = event.currentTarget.id.substr(5)
    wx.navigateTo({
      url: '../../../index/detail/detail?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
},
//长按删除
longpress:function(event){
  var id = event.currentTarget.id.substr(5)
  var that=this;
  wx.showModal({
    title: '提示',
    content: '确认删除该记录？',
    success (res) {
    if (res.confirm) {
      wx.request({
        url: app.globalData.url + 'login/mark/' +that.data.userid+'/'+id+'/2',
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
              that.look(that.data.userid);
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