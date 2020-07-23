
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    contactName:"",
    gender:"",
    typeValue: null,
    image: "",
    "imageHidden": true,
    "timeHidden": true,
    imagesUrl: [],
    value: "",
    inttime:"",
    flagvalue:1,
    items: [
      { name: 1, value: '寻物' , checked: true},
      { name: 2, value: '招领', checked: false},
    ],
    send_btn_dis:'none',
    auth_btn_dis:'block',
  },

  handleChange(e) {
    //console.log(e)
    var datestr =  e.detail.dateString
    this.setData({
      value: datestr,
      inttime: datestr.replace(/-|:| /g,"").substring(2)
    })
    //console.log(this.data.inttime)
  },


 currenDate:function(){
  var date = new Date();
    var year = date.getYear()+1900;
    var month = this.prefixZero(date.getMonth()+1,2);
    var day = this.prefixZero(date.getDate(),2); 
    var hour = this.prefixZero(date.getHours(),2);
    var minute = this.prefixZero(date.getMinutes(),2);
    var datestr = year+'-'+ month +'-'+ day +' '+ hour +':'+ minute;
    this.setData({ value : datestr })
    this.setData({ inttime : datestr.replace(/-|:| /g,"").substring(2) })
    //console.log(this.data.inttime)
 }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              //console.log(res.userInfo)
              that.setData({
                send_btn_dis:"block",
                auth_btn_dis:"none",
              })
              wx.setStorageSync('userinfo', res.userInfo);
            }
          })
        }else{
          wx.removeStorage({
            key: 'userinfo',
          })
        }
      }
    })
    //var contactName = userInfo.contactName;
    //var weChatNumber = userInfo.weChatNumber;
    //var phoneNumber = userInfo.phoneNumber;
    //this.setData({ contactName: contactName, weChatNumber: weChatNumber, phoneNumber: phoneNumber });
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
    this.currenDate();
    var that = this;
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              //console.log(res.userInfo)
              wx.setStorageSync('userinfo', res.userInfo);
              that.setData({
                send_btn_dis:"block",
                auth_btn_dis:"none",
              })
            }
          })
        }else{
          wx.removeStorage({
            key: 'userinfo',
          })
        }
      }
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getRadio: function (options) {
    var items = this.data.items;
    var value = "";
    for (var i = 0; i < items.length; i++) {
      var name = items[i].name.toString();
      if (name.indexOf(options.detail.value) != -1) {
        value = items[i].value;
      }
    }
    this.setData({ typeValue: value });
  },
  clickPage: function () {
    this.setData({ timeHidden: true, hidden: true});
  },
  upload: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.setData({ image: res.tempFilePaths[0], "imageHidden": false });

      },
    })
  },

  deleteimg:function(){
    this.setData({image:"","imageHidden":true});
  },

  preview: function () {
    var that = this;
    wx.previewImage({
      urls: [that.data.image],
    })
  },

  prefixZero:function (num, n) {
    return(Array(n).join(0) + num).slice(-n);
  },

  clickTime: function () {
    this.setData({ timeHidden: !this.data.timeHidden, hidden: true});
  },
  send: function (options) {
    //console.log(options.detail.value);
    this.check(options);

  },
  //图片上传
  uploadImage: function (options) {
    var that = this;
    if (that.data.image == null) 
      that.submit(options);
    else{
      wx.uploadFile({
        url: app.globalData.url+'item/upload',
        filePath: that.data.image,          //local picture path
        name: 'image',
        header: { "Content-Type": "multipart/form-data" },
        complete: function (options1) {
          //console.log(options1);
          if(options1.statusCode==200){      //upload successfully
            var images = that.data.imagesUrl;
            var o = JSON.parse(options1.data);
            images.push(o);
            that.setData({ imagesUrl: images });
            that.submit(options);
          }else if (options1.statusCode==501){
              wx.showToast({
                title: '图片大小不能超过2M',
                icon: 'none',
                duration: 2000,
              })
          } else {
            wx.showToast({
              title: '图片上传错误，发布失败',
              icon: 'none',
              duration: 2000,
            })
          }
        },
      })
    }
  },
  check: function (options) {
    var util = require('../../utils/util.js');
    var that = this;
    var phoneNumber = util.reg("\\n[\s| ]*\\r", options.detail.value.phoneNumber);
    var contactName = util.reg("\\n[\s| ]*\\r", options.detail.value.contactName);

    var formType = util.reg("\\n[\s| ]*\\r", options.detail.value.formType);
    var formTime = util.reg("\\n[\s| ]*\\r", options.detail.value.formTime);
    var formSite = util.reg("\\n[\s| ]*\\r", options.detail.value.formSite);
    var formContent = util.reg("\\n[\s| ]*\\r", options.detail.value.formContent);

    formTime = formTime
    
    if (phoneNumber == true || formTime == true || formType == true) {
       wx.showModal({
         title: '必填项不能为空',
         content: '',
         showCancel: false
      })
    }else {
      wx.showModal({
        title: '确定发布寻物启事？',
        content: '（无关或违规内容将被删除）',
        success: function (res) {
          if (res.confirm) {
            //that.submit(options, userInfo);
            if(that.data.imageHidden==false)
              that.uploadImage(options1);
            else
              that.submit(options);
          }
        }
      })
    }
  },

  radioChange : function(e){
    console.log(e.detail.value);
    this.setData({
      flagvalue: e.detail.value
    })
  },
  utf16toEntities:function(str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str = str.replace(patt, function(char){
            var H, L, code;
            if (char.length===2) {
                H = char.charCodeAt(0); // 取出高位
                L = char.charCodeAt(1); // 取出低位
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
                return "&#" + code + ";";
            } else {
                return char;
            }
        });
    return str;
},
getinfo:function(){
  console.log('info调用');
  var that = this;
  return new Promise(function (resolve, reject) {
    try{
      var ui = wx.getStorageSync('userinfo')
      //console.log(ui);
      if(ui){
        that.setData({
          userInfo : ui.nickName,
          gender : ui.gender,
        })
        resolve();
      }else{
        wx.getUserInfo({
          success:function(res){
            wx.setStorageSync('userinfo', res.userInfo);
            that.setData({
              userInfo : res.userInfo.nickName,
              gender : res.userInfo.gender,
            })
            resolve();  
          },
          fail:function(){
            reject();
          },
        });    
      }
    }catch(e){
      reject();
    }
  });
},
  //发布信息上传
  submit: function (options, userInfo) { 
    var that = this;
    this.getinfo().then(()=>{
      wx.request({
        url: app.globalData.url+'item/add',
        data: {
          //"user.id": that.data.userInfo,
          //"orderPrivate.phoneNumber": options.detail.value.phoneNumber,
          //"orderPrivate.contactName": options.detail.value.contactName,
          //"orderPrivate.imageUrl": that.data.imagesUrl.toString(),
          phoneNumber : options.detail.value.phoneNumber,
          //contactName : options.detail.value.contactName,
          contactName: that.data.userInfo,
          gender:that.data.gender,
  
          formType: options.detail.value.formType,
          formFlag:that.data.flagvalue,
          formTime:that.data.inttime,
          formSite: options.detail.value.formSite,
          formContent: that.utf16toEntities(options.detail.value.formContent),
          formUrl: that.data.imagesUrl.toString(),
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          //console.log(res);
          if (res.data == "success") {
            wx.showToast({
              title: '发布成功',
              success: function () {
                setTimeout(function () {
                  // wx.switchTab({
                  //   url: "/pages/index/index",
                  // })
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }, 400);
              }
            })
          }else{
            wx.showToast({
              title: '服务器错误，发布失败',
              icon:'none',
              duration:2000,
            })
          }
        }
      })
    }).catch(()=>{
      wx.showToast({
        title: '发布失败，请在右上方...中设置开启权限',
        icon:'none',
        duration:2000,
      })
    });
    
  },
  jujiao: function () {
    this.setData({ timeHidden: true, hidden: true});
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
})


