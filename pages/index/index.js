import {int2date} from '../../utils/format'
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
    issearch:false,
    clientHeight:0,
    imgList: [],  
    search_hidden:true,
    scroll_index:'tab0',
    form: {
      start_date: '点击设置起始日期',
      end_date: '点击设置结束日期',
      sdateValue : '',
      edateValue : '',
      typeValue:'',
      siteValue:'',
      contentValue:'',
    },
    items: [
      { name: 'Lost', value: '短文' , checked: true},
      { name: 'Found', value: '长文', checked: false},
    ],
    tabList:['全部','找短文','找长文','失恋博物馆','热恋博物馆','三行情书','你为什么可以发语音','正能量小屋','红红火火恍恍惚惚','经典语录','怎样的一句话'],
    tabType:[0,1,2,3,4,5,6,7,8,9,10],
    pos:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */



  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          theme: res.theme,
          clientHeight: res.windowHeight
        });
      }
    })
    page = 1;
    var type = that.data.currentData;
    let url = app.globalData.url + 'item/index/'+page+'/'+type; 
    let data = {};
    var Mythis = this;
    app.wxRequest('GET',url,data,(res)=>{
      //console.log(res.data)
      var temp = int2date(res.data);
      var img = temp[0];
      var count = temp[1];
      //console.log(img);
      Mythis.setData({
        listItems: res.data,
        imgList: img,
      })
      wx.setStorageSync('listitems'+type, that.data.listItems);
      wx.hideLoading({
        complete: (res) => {},
      })
      //优化，如果数据不满一页，调整加载提示信息
      if(count == 0){
        Mythis.setData({
          refreshText2:'暂无可查询信息',
        })
      }else if(count <=10 || this.data.issearch){
        Mythis.setData({
          refreshText2:'---我是有底线的---',
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
      wx.hideLoading({
        complete: (res) => {},
      })
      wx.showLoading({
        title: '请检查网络设置',
        duration: 5000
      })
    });    
  },
  
  //下拉刷新
  onRefresh() {
    //console.log('shuaxinla');
    this.setData({
      issearch:false,
    })
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
        refreshText:'加载中...',
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
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          offset: "18%",
          selected: 0
        })
      }
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
    if(!this.data.issearch){
      //console.log("scroll to bottom")
      this.setData({
        refreshText2:'加载中...',
      })
      if(temppage==0)
        page = page + 1;
      else
        page = temppage;
      var type = this.data.currentData;
      let url = app.globalData.url + 'item/index/'+page+'/'+type; 
      let data = {};
      var Mythis = this;
      app.wxRequest('GET', url, data, (res) => {
        //console.log(res.data)
        //var data_list = that.data.listItems;
        if(res.data.length!=0){
          var oldData = Mythis.data.listItems;
          var oldImg = Mythis.data.imgList;
          var temp = int2date(res.data);
          var img = temp[0];
          var count = temp[1];
          
          Mythis.setData({
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
            refreshText2: '---我是有底线的---',
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
    }else{
      console.log('scrolltobot in search')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  bindchange: function (e) {
    const that = this;
    const res = wx.getSystemInfoSync();
    that.setData({
      currentData: e.detail.current,
      //scroll_index:e.detail.current/11*res.windowWidth
      scroll_index:'tab'+e.detail.current
    })
    try {
      var value = wx.getStorageSync('listitems'+that.data.currentData)
      if (value!='') {
        if(value.length<10){
          this.setData({
            refreshText2: '---我是有底线的---',
          })
        }else{
          this.setData({
            refreshText2: '下拉加载更多内容',
          })
        }
        that.setData({
          listItems: value
        })
      }else{
        that.onRefresh();
        wx.setStorageSync('listitems'+that.data.currentData, that.data.listItems);
      }
    } catch (e) {
      console.log(e);
    }
    // var listitem = wx.getStorageSync('listitems'+that.data.currentData);
    // if(empty(listitem)){
    //   console.log(listitem);
    //   that.onRefresh();
    //   wx.setStorageSync('listitems'+that.data.currentData, that.data.listItems);
    // }else{
    //   that.setData({
    //     listItems: listitem
    //   })
    // }
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    this.setData({
      issearch:false,
    })
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
      //该动作会触发swiper切换事件，防止重复存取缓存
      // try {
      //   var value = wx.getStorageSync('listitems'+that.data.currentData)
      //   if (value!='') {
      //     that.setData({
      //       listItems: value
      //     })
      //   }else{
      //     that.onRefresh();
      //     wx.setStorageSync('listitems'+that.data.currentData, that.data.listItems);
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
    }
  },
//图片预览
  preview : function(event){
    //console.log(this.data.imgList);
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
    var id = event.currentTarget.id.substr(5);
    var content = event.currentTarget.dataset.content;
    
    wx.showActionSheet({
      itemList: ['复制','举报','留言'], 
      success: function(res) {
        //console.log(res.tapIndex);
        if(res.tapIndex==0){
          wx.setClipboardData({
            data: content,
          })
        }else if(res.tapIndex==1){
          //举报处理，数据库标志位+1，超过一定值标记该信息无效
          let url = app.globalData.url + 'item/tipoff/' + id;
          let data = {};
          wx.showLoading({
            title: '举报中',
          })
          app.wxRequest('GET', url, data, (res) => {
            if(res.data=='success'){
              wx.hideLoading({
                complete: (res) => {},
              })
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
            wx.hideLoading({
              complete: (res) => {},
            })
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
//监听滑动
  scrollscroll:function(e) {
    var oldpos = this.data.pos
    var newpos = e.detail.scrollTop
    this.setData({
      pos:newpos
    })
    if(newpos > oldpos){
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0,
          dis:'none'
        })
      }
    }else{
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0,
          dis:'flex',
        })
      }
    }
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
    var d = new Date()
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    var day = d.getDate()
    //用户发起搜索，根据不同页面，设置默认选项，并确定时间选择器的截止时间
    this.setData({
      search_hidden:false,
      end:[year, month, day].map(this.formatNumber).join('-')
    })
  },

  formatNumber:function(a) {
    var t = a > 9 ? a : '0' + a;
    return t;
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
  inputContent: function (e) {
    this.setData({
      "form.contentValue": e.detail.value
    })
  },

//搜索请求------------------------------------------------
  search_confirm:function(e){
    var Mythis = this;
    //console.log(Mythis.data.form.flagValue)
    wx.showLoading({
      title: '查询中',
    })
    wx.request({
      url: app.globalData.url+'item/search',
      method:'post',
      data:{
        sdateValue:Mythis.data.form.sdateValue,
        edateValue:Mythis.data.form.edateValue,
        typeValue: Mythis.data.form.typeValue,
        siteValue: Mythis.data.form.siteValue,
        contentValue: Mythis.data.form.contentValue,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //console.log(res.data)
        wx.hideLoading({
          complete: (res) => {},
        })
        if(res.data=='fail'){
          wx.showToast({
            title: '没有符合条件的结果',
            icon:'none',
          })
        }else{
          //格式化信息日期，并返回图片列表，提供预览
          var temp = int2date(res.data)
          var img = temp[0];
          var count = temp[1];
          //console.log(img);
          Mythis.setData({
            hofSwiper: count * 390 + 70,
            listItems: res.data,
            imgList: img,
            issearch: true,
          })
          wx.setStorageSync('listitems0', Mythis.data.listItems)
          Mythis.setData({currentData:0})
          wx.showToast({
            title: '查询到'+ count +'条结果',
            icon:'none',
            duration:2000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading({
          complete: (res) => {},
        })
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