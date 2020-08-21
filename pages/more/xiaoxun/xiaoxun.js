// pages/more/xiaoxun/xioaxun.js
var app = getApp()
var plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
var interval;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:'',
    dialogList:[
      
    ],
    send_btn_dis:'none',
    auth_btn_dis:'block',
    disabled:false,
    chat:'',
    repo:'...',
    text_color:'rgb(135,135,135)',
    iosDialog1:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Speech2text();
    //this.Text2Speech();
    var that = this;
    this.setData({
      chat:"长按按钮与小寻对话",
      text_color:'rgb(135,135,135)'
    })
    var that = this;
    var userid = wx.getStorageSync('userid')
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo'] && userid) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              //console.log(res.userInfo)
              that.setData({
                nickName:res.userInfo.nickName,
                avatarUrl:res.userInfo.avatarUrl,
                userid : userid,
                send_btn_dis:"block",
                auth_btn_dis:"none",
              })
              that.setData({
                iosDialog1: false,
              })
              wx.setStorageSync('userinfo', res.userInfo);
            }
          })
        }else{
          wx.removeStorage({
            key: 'userinfo',
            key: 'userid',
          })
          //console.log('remove')
          that.setData({
            iosDialog1: true,
          })
        }
      }
    })
  },

  GetUserInfo:function(e){
    if(e.detail.userInfo){
      this.setData({
        send_btn_dis:"block",
        auth_btn_dis:"none",
      })
    }else{
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  },


  startrecord:function(){
    manager.start({
      lang: "zh_CN"
    })
    this.setData({
      chat:"正在聆听...",
      text_color:'rgb(135,135,135)'
    })
    interval = Date.parse(new Date());
  },

  endrecord:function(){
    //if(Date.parse(new Date())-interval<350){
      
    //   manager.stop();
    //   this.setData({
    //     chat:"长按按钮与小寻对话"
    //   })
    // }else{
      manager.stop();
    //}
  },

  showRecordEmptyTip: function() {
    this.setData({
      disabled: false,
    })
    wx.showToast({
      title: '没有识别到任何内容',
      icon: 'none',
      duration: 3000,
    });
  },

  Speech2text:function(){
    var that = this;
    manager.onRecognize = function(res) {
        that.setData({
          chat: res.result,
          text_color:'black',
        })
        //console.log("current result", res.result)
    }
    manager.onStop = function(res) {
        //console.log("record file path", res.tempFilePath)
        let text = res.result
        console.log(res.result)
        if(text == '') {
          that.showRecordEmptyTip()
          that.setData({
            chat:"长按按钮与小寻对话",
            text_color:'rgb(135,135,135)'
          })
          return
        }else{
          //console.log(that.data.chat);
          //console.log(that.data.userid);
          //要提交用户说的话了
          wx.showLoading({
            title: '分析中',
          })
          wx.request({
            url: app.globalData.url+'Xiaoxun/hear',
            method:'post',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data:{
              event : that.data.chat,
              userid : that.data.userid, //有为空的风险
              time : that.currenDate(),
            },
            
            success:function(res){
              //console.log(res.data)
              if(app.checkRes(res.data)=='1000'){
                if(res.data.result==1){
                //获得回复成功，调用合成函数，发声！！！ 
                  that.Text2Speech(res.data.content)
                }else
                  that.setData({
                    chat : '小寻刚刚溜走啦，没有听清' ,
                    text_color:'rgb(135,135,135)'
                })
              }else{
                that.setData({
                  iosDialog1: true,
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
            complete:function(){
              wx.hideLoading({
                complete: (res) => {},
              })
            }
          })
        }
        

    }
    manager.onStart = function(res) {
        console.log("开始录音识别", res)
    }
    manager.onError = function(res) {
        wx.showToast({
          title: '识别出问题啦，可能语速太快',
          icon:'none',
          duration:3000,
        })
        that.setData({
          chat:"长按按钮与小寻对话",
          text_color:'rgb(135,135,135)'
        })
    }
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

  Text2Speech:function(content){
    var that = this;
    var plugin = requirePlugin("WechatSI")
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: content,
      success: function(res) {
          //console.log("succ tts", res.filename)   
          const innerAudioContext = wx.createInnerAudioContext()
          innerAudioContext.autoplay = true
          innerAudioContext.src = res.filename
          innerAudioContext.onPlay(() => {
          console.log('开始播放')
          that.setData({
            repo : content
          })
      })
      innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
      },
      fail: function(res) {
          console.log("fail tts", res)
      }
    })
  },

  close:function(){
    this.setData({
      iosDialog1: false,
    })
  },

  confirm:function(){
    wx.navigateTo({
      url: '../../../mine/mine?from=release',
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