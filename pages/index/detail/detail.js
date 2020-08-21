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
    iosDialog1: false,
    currid:'',
    dis:false,
    dis_text:'',
    hiddenModal:'true',
    user_defined_item:'',
    msg:'',
    user_msg:'',
    userid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    var id = options.id;
    var Mythis = this;
    Mythis.setData({
      currid:id
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url+'item/detail/'+id,
      method: 'GET',
      success: function (res) {
        wx.hideLoading({
          complete: (res) => {},
        })
        //console.log(res.data)
        var img = Mythis.int2date(res.data)
        //console.log(img);
        Mythis.setData({
          item: res.data,
          imgList: img,
          real_phone: res.data.phone,
        })
      },
      fail: function (res) { wx.hideLoading({
        complete: (res) => {},
      })},
      complete: function (res) { },
    })

    var that = this;
    wx.getSystemInfo({  //获取系统信息 设置预设值
      success: function (res) {
        //console.log(res.windowWidth);
        var n = Math.floor(res.windowWidth * that.data.area_width * 80 / 10000 - that.data.box_width)
        //console.log(n)
        that.setData({
          maxNum: n,
        })
      }
    })

    var userid = wx.getStorageSync('userid');
    if(userid)
    wx.request({
      url: app.globalData.url + 'login/mark/' +userid+'/'+that.data.currid+'/3',
      method: 'GET',
      success: function (res) {
          if(res.data=='fail'){
              Mythis.setData({
              dis : true,
              dis_text:'已',
            })
          }

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  drag(e) {
    var that = this;
    coord = e.detail.x;  //根据bindchange 事件获取detail的x轴
    //console.log(coord)
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


  //自定义modal输入框取消
  cancel:function(e){
    this.setData({
      hiddenModal: true
    })
  },
  input_msg:function(e){
    //console.log(e);
    this.setData({
      user_msg: e.detail.value
    })
  },

  
  currenDate:function(){
    var date = new Date();
      var year = date.getYear()+1900;
      var month = this.prefixZero(date.getMonth()+1,2);
      var day = this.prefixZero(date.getDate(),2); 
      var hour = this.prefixZero(date.getHours(),2);
      var minute = this.prefixZero(date.getMinutes(),2);
      var datestr = year+'-'+ month +'-'+ day +' '+ hour +':'+ minute;
      return datestr.replace(/-|:| /g,"").substring(2);
   }, 
   prefixZero:function (num, n) {
    return(Array(n).join(0) + num).slice(-n);
  },
//自定义modal输入框确定
  confirm_send:function(e){
    var that= this;
    if(this.data.user_msg!=''){
      //！！！！！！！！！-----长度未过滤，包括lw功能中也是------！！！！！！！！！！
      this.setData({
        msg : this.data.user_msg,
      })
      //操作
      wx.showLoading({
        title: '留言中...',
      })
      //console.log(that.data.currid);
      wx.request({
        url: app.globalData.url + 'login/call',
        method:'POST',
        data:{
          userid:that.data.userid,
          msg:that.data.msg,
          date:that.currenDate(),
          msgid:that.data.currid,
        },  
        header:{
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          //console.log(res);
          if(app.checkRes(res.data)=='1000')
            if(res.data=='success'){
              wx.showToast({
                title: '留言成功',
                icon:"success",
                duration:2000,
              })
              that.cancel();
            }else{
              wx.showToast({
                title: '留言失败，请重试',
                icon:"none",
                duration:2000,
              })
            }
          else
            that.setData({
              iosDialog1: true,
            })
        },
        fail:function(){
          wx.showToast({
            title: '服务器出错',
            icon:"none",
            duration:2000,
          })
        },
        complete:function(){
          wx.hideLoading({
            complete: (res) => {},
          })
        }
      })
    }else{
      wx.showToast({
        title: '留言不能为空',
        icon:'none',
        duration:2000,
      })
    }
  },


  call:function(){
    var that = this;
    var userid = wx.getStorageSync('userid');
    if(!userid){
      that.setData({
        iosDialog1: true,
      })
    }else{
      this.setData({
        userid:userid,
        hiddenModal: false
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
    img[0] = app.globalData.static_url + 'static/upload/' + a.url;
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
    this.close();
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

  close:function(){
    this.setData({
      iosDialog1: false,
    })
  },

  confirm:function(){//回退怎么办？？？
    var that = this;
    wx.navigateTo({
      url: "../../mine/mine?from=detail&id=" + this.data.currid,
    })
  },

  mark:function(){
    var that = this;
    var userid = wx.getStorageSync('userid');
    if(!userid)
      that.setData({
        iosDialog1: true,
      })
    else{
      wx.showLoading({
        title: '标志中',
      })
      wx.request({
        url: app.globalData.url + 'login/mark/' +userid+'/'+that.data.currid+'/1',
        method: 'GET',
        success: function (res) {
          //console.log(res.data)
          if(app.checkRes(res.data)=='1000'){
            if(res.data=='success'){
            wx.showToast({
              title: '标记成功',
              icon:'success',
              duration:3000,
            })
            that.setData({
              dis : true,
              dis_text:'已',
            })
          }else{
            that.setData({
              iosDialog1:true,
            })
          }
        }
        },
        fail: function (res) { 
          wx.showToast({
            title: '服务器出错，稍后再试',
            icon:"none",
            duration:5000,
          })
        },
        complete: function (res) { wx.hideLoading({
          complete: (res) => {},
        })},
      })
    }
  }

})