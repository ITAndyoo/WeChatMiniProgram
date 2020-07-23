var util = require('../../utils/util.js');
import decode from '../../utils/emoji';
const app = getApp();
var page = 1;
var temppage = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mlurl:app.globalData.static_url,
    currentData: 0,  
    hofSwiper:0,
    scrollTop:0,
    triggered_1: false,
    refreshText:'下拉刷新',
    refreshText2:'',
    clientHeight:0,
    imgList: [],  
    search_hidden:true,
    form: {
      start_date: '',
      end_date: '',
      sdateValue : '',
      edateValue : '',
      typeValue:'',
      siteValue:'',
      contentValue:'',
    },
    items: [
      { name: 'Lost', value: '寻物' , checked: true},
      { name: 'Found', value: '招领', checked: false},
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */



  onLoad: function (options) {

    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    })
    page = 1;
    let url = app.globalData.url + 'item/index/'+page; 
    let data = {};
    var Mythis = this;
    app.wxRequest('GET',url,data,(res)=>{
      //console.log(res.data)
      var img = Mythis.int2date(res.data);
      //console.log(img);
      Mythis.setData({
        listItems: res.data,
        imgList: img
      })
      //优化，如果数据不满一页，调整加载提示信息
      if(res.data.length == 0){
        Mythis.setData({
          refreshText2:'暂无可查询信息',
        })
      }else if(res.data.length <=10){
        Mythis.setData({
          refreshText2:'已加载全部内容',
        })
      }else{
        Mythis.setData({
          refreshText2:'下拉加载更多内容',
        })
      }
      //console.log(Mythis.data.listItems)
      //Mythis.autoHeight();
      wx.stopPullDownRefresh(); 
    },err=>{
      wx.showLoading({
        title: '请检查网络设置',
        duration: 3000
      })
    });
      
  },
  
  // autoHeight:function(){
  //   var that = this;
  //   wx.createSelectorQuery()
  //     .select('#end' + that.data.currentData).boundingClientRect()
  //     .select('#start' + that.data.currentData).boundingClientRect().exec(rect => {
  //       let hei = rect[0].top - rect[1].top;
  //       console.log(hei);
  //       that.setData({
  //         hofSwiper: hei
  //       });
        
  //     });
  //   console.log(that.data.hofSwiper);
  // },

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
      img[i] = app.globalData.url + 'static/upload/' + a[i].url;
      a[i].username = a[i].username.substr(-2);
      a[i].disc=decode(a[i].disc);
    }
    return img;
  },
  //下拉刷新
  onRefresh() {
    this.reTextchange(2);//开始刷新
    if (this._freshing) return
    this._freshing = true

    this.onLoad();
      
    this.reTextchange(3)//刷新成功
    setTimeout(()=>{
    this.setData({
      triggered_1: false,
    })
    this._freshing = false
    this.reTextchange(0)//刷新结束，回到下拉刷新
    },1000)
    
  },

  reTextchange:function(flag){
    if(flag==0)
      this.setData({
        refreshText:'下拉刷新',
      })
    else if(flag==1)
      this.setData({
        refreshText:'松开刷新',
      })
    else if(flag==2)
      this.setData({
        refreshText:'玩命加载中...',
      })
    else if (flag == 3)
      this.setData({
        refreshText: '刷新成功',
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
  onShow: function (e) {
    //可能存在二次调用，例如从发布页面switchTab到该页面，onLoad和onShow是否会都触发 应该不会
    //console.log(e);
    //this.onLoad();
    wx.hideLoading({
      complete: (res) => {},
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
    console.log("pulldown");
    var that = this;
    that.setData({
      currentTab: 0 //当前页的一些初始数据，视业务需求而定
    })
    this.onLoad(); //重新加载onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  //onReachBottom
  scrollbot: function () {
    this.setData({
      refreshText2:'玩命加载中...',
    })
    if(temppage==0)
      page = page + 1;
    else
      page = temppage;
    let url = app.globalData.url + 'item/index/' + page;
    let data = {};
    var Mythis = this;
    app.wxRequest('GET', url, data, (res) => {
      //console.log(res.data)
      //var data_list = that.data.listItems;
      if(res.data.length!=0){
        const oldData = Mythis.data.listItems;
        const oldImg = Mythis.data.imgList;
        var img = Mythis.int2date(res.data);

        
        Mythis.setData({
          mlurl: app.globalData.url,
          listItems: oldData.concat(res.data),
          imgList: oldImg.concat(img),
        })
        //console.log(Mythis.data.listItems);
        //console.log(Mythis.data.imgList);
        this.setData({
          refreshText2: '下拉加载更多内容',
        })
      }else{
        this.setData({
          refreshText2: '已加载全部内容',
        })
      }
      wx.hideLoading();
      temppage = 0;
    }, err => {
      wx.showLoading({
        title: '请检查网络设置',
        duration: 3000,
      })
      temppage = page;
    });


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
//图片预览
  preview : function(event){
    //console.log(event);
    //console.log(event.currentTarget.dataset.src)
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.imgList // 需要预览的图片http链接列表
    })
  },
//轻触看详情
  tap : function(event){  
    var id = event.currentTarget.id.substr(5)
    wx.navigateTo({
      url: './detail/detail?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
 //长按举报或查看详情
  longpress : function(event){   
    var id = event.currentTarget.id.substr(5)
    //console.log(id)
    
    wx.showActionSheet({
      itemList: ['举报TA','联系TA'], 
      success: function(res) {
        //console.log(res.tapIndex);
        if(res.tapIndex==0){
          //举报处理，数据库标志位+1，超过一定值标记该信息无效
          let url = app.globalData.url + 'item/tipoff/' + id;
          let data = {};
          var Mythis = this;
          app.wxRequest('GET', url, data, (res) => {
            if(res.data=='success'){
              wx.showToast({
                title: '感谢您的反馈！',
                icon: 'success',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: '反馈失败，请稍后重试！',
                icon: 'none',
                duration: 2000
              })
            }
          }, err => {
            wx.showLoading({
              title: '请检查网络设置',
            })
          });
          
        }else{
          wx.navigateTo({
            url: './detail/detail?id='+id,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }  
    })
  },
//回到顶部
  goTop:function(e){
    this.setData({
      scrollTop:0,
    }),
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  },

  search:function(e){
    //console.log("search");
    var mythis = this;
    if (mythis.data.currentData==1){
      mythis.setData({
        "items[0].checked":false,
        "items[1].checked":true,
        "form.flagValue":'Found'
      })
    }else{
      mythis.setData({
        "items[0].checked": true,
        "items[1].checked": false,
        "form.flagValue":'Lost'
      })
    }
    //用户发起搜索，根据不同页面，设置默认选项，并确定时间选择器的截止时间
    mythis.setData({
      search_hidden:false,
      end:util.formatTime2(new Date())
    })
  },
//用户点击搜索框的取消
  search_cancel:function(){
    var mythis = this;
    mythis.setData({
      search_hidden: true
    })
  },
//获取用户表单值---------------------------------------
  bindDateChange1: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    var mythis = this;
    mythis.setData({
      "form.start_date": e.detail.value,
      "form.sdateValue": e.detail.value.substring(2, 4) + e.detail.value.substring(5, 7) + e.detail.value.substring(8,10) +'0000'
    })
    //console.log(mythis.data.form.sdateValue);
  },
  bindDateChange2: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    var mythis = this;
    mythis.setData({
      'form.end_date': e.detail.value,
      'form.edateValue': e.detail.value.substring(2, 4) + e.detail.value.substring(5, 7) + e.detail.value.substring(8, 10) +'2359'
    })
    //console.log(mythis.data.form.edateValue);
  },
  inputType:function(e){
    this.setData({
      "form.typeValue":e.detail.value
    })
  },
  inputSite: function (e) {
    this.setData({
      "form.siteValue": e.detail.value
    })
  },
  inputContent: function (e) {
    this.setData({
      "form.contentValue": e.detail.value
    })
  },
  radioChange : function(e){
    this.setData({
      "form.flagValue": e.detail.value
    })
  },


//------------------------------------------------
  search_confirm:function(e){
    var Mythis = this;
    //console.log(e);
    //console.log(Mythis.data.form.sdateValue)
    //console.log( Mythis.data.form.edateValue)
    //console.log(Mythis.data.form.flagValue)
    wx.request({
      url: app.globalData.url+'item/search',
      method:'post',
      data:{
        sdateValue:Mythis.data.form.sdateValue,
        edateValue:Mythis.data.form.edateValue,
        typeValue: Mythis.data.form.typeValue,
        siteValue: Mythis.data.form.siteValue,
        contentValue: Mythis.data.form.contentValue,
        flagValue: Mythis.data.form.flagValue,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res.data)
        if(res.data=='fail'){
          wx.showToast({
            title: '没有符合条件的结果',
            icon:'none',
          })
        }else{
          //格式化信息日期，并返回图片列表，提供预览
          var img = Mythis.int2date(res.data)
          //console.log(img);
          Mythis.setData({
            hofSwiper: res.data.length * 390 + 70,
            listItems: res.data,
            imgList: img,
          })
          
          if(Mythis.data.form.flagValue=='Lost'){
            Mythis.setData({currentData:0})
          }else{
            Mythis.setData({currentData:1})
          }
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
      complete: function (res) { 
        Mythis.search_cancel()
      },
    })
  },

})