// pages/index/detail/detail.js
import {int2date2,date2int} from '../../../utils/format'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgList: [], 
    x: 0,
    iosDialog1: false,
    currid:'',
    dis:false,
    hiddenModal:'true',
    msg:'',
    user_msg:'',
    userid:'',
    bgc_list:['linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
    'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
    'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
    'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)',
    'linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%)',
    'linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%)',
    'linear-gradient(-225deg, #DFFFCD 0%, #90F9C4 48%, #39F3BB 100%)',
    'linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)',
    'linear-gradient(to top, #df89b5 0%, #bfd9fe 100%)',
    'linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)',
    'linear-gradient(to top, #88d3ce 0%, #6e45e2 100%)',
    'linear-gradient(to top, #0ba360 0%, #3cba92 100%)',
    'linear-gradient(-225deg, #D4FFEC 0%, #57F2CC 48%, #4596FB 100%)',
    'linear-gradient(to right, #fa709a 0%, #fee140 100%)'],
    background_color:'linear-gradient(to right,skyblue,lightblue)',
    copy_icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAADfUlEQVRoQ+1aMWgTURj+/jQqQjso1kUXFV2EIlScHNqhYDEXkssFFUQQipuiiDo42C4OVRd1kSIobs31DF6w4GLc7VCcrAhdWkEdBHEQ0/xyoWnT9O76Xu4l19J3kCn//73ve9/7/3t39wjb7KJtphdasArHz2by/YkuPo8qToIwIIn5C6Ayg2d3ovrMcZxvkvmh4UodHsjnu3uWqo8AuqKGJC0yeKLk2KNq8KBuSQ9nMkeSieQLAKdVkVvFoeeuUxhRgavMYcO0pgGcaSK1AMYXGaJM2A3gKAF7m/Luu459VwbLL1aJ4HQ2P8TE75oGuOY69pNWCRqm9RjA1Yb8P65jd7eKV88TEpzO5saRoCFmnBAZkKsYLBXtskhsWEwql7tFTOMiOAyeI9Bb17FvhMVvKNgwLW+WvdkWvGjRdQoHBINDw2rdPsEfZbAYGC859p2gnFDBw/l8b3KJv8sMCEbZfW0PSuWEBBumxbJYlS7aP10o/JCu4VTGGqAE3tcTGRgLABkGcGr5vwXXsQ/KkvSLT+dyfcw0u9H43v8E3FuJCympUIfXCQ4ASmWtS0R42UA6UsOq4ximNQFg5XbUVa0cKhaL882TI8pzeWKCvRAFymbPHavQ0udGpKiNK5218kyYrGMS4dObKbvPj60oT2WCPaCUaT0k4OZaQrQI5jmp5U3oAeEwGHvW5lUvu47jbWzWXbEI9lgYWesVCBelBAoEM9Ht0lThQVBobIKXnR5tbCACekJCeB7gsSBn64mxCq6JrnV3vgBQPwDvJ3P9BmOGCTPJauWpX5OKvWnJqGlHbOwOt0NUGKYW3O6NR6cd1TXcvAXWDq+uCSV7ab2kOzwDukt3qoZrM02rz6VRjGbCB9HXs7E53DxwJMHAmBYcMIPxOqxuSZdLju37SklvPPTGI/i9uN54NNaHTDOI0pGj5srw1A5rhxu/PCj6SBZ1CW+a21KrOy3vE47orspvsmKrYS1YcO1uaYeRkD61U5uWLbmkBQ1VHhZbDStXIgioBXfqjYegIcrDtMPaYf1e2r+sZGpDeWFKAMrw1I+H+vFQ4GCaxOprW6iSg2mGYezDjl2+R/jaxlwF8L+/va7r/vSD2vBwacq0JgnIq+DRCYxIh0vrBFOmNULAdQDHO0G6tTHoK4Onwk7SergbOtza4Js3SwvevN6oYbbtHP4P09Qsam8WwfIAAAAASUVORK5CYII=',
    connect_icon:'data:image/png;base64,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',
    collect_icon:'data:image/png;base64,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',
    uncollect_icon:'data:image/png;base64,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',
    like_icon:'data:image/png;base64,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',
    unlike_icon:'data:image/png;base64,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',
    like:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    var id = options.id;
    var Mythis = this;
    var index = Math.floor(Math.random()*this.data.bgc_list.length);
    if(wx.getSystemInfoSync().theme=='dark')
      Mythis.setData({
        currid:id,
        background_color:'linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)',
      })
    else     
      Mythis.setData({
        currid:id,
        background_color:this.data.bgc_list[index]
      })
    wx.showLoading({
      title: '加载中',
    })
    wx.loadFontFace({
      family: 'FangzhengKaiti',
      source: 'url("https://api.changle.xyz/static/fonts/fzkaiti.TTF")',
      success: console.log,
      fail: console.log,
    })
    wx.request({
      url: app.globalData.url+'item/detail/'+id,
      method: 'GET',
      success: function (res) {
        wx.hideLoading({
          complete: (res) => {},
        })
        //console.log(res.data)
        var img = int2date2(res.data)
        //console.log(img);
        Mythis.setData({
          item: res.data,
          imgList: img,
        })
      },
      fail: function (res) { wx.hideLoading({
        complete: (res) => {},
      })},
      complete: function (res) { },
    })
    var userid = wx.getStorageSync('userid');
    if(userid)
    wx.request({
      url: app.globalData.url + 'login/mark/' +userid+'/'+Mythis.data.currid+'/3',
      method: 'GET',
      success: function (res) {
        if(app.checkRes(res.data)=='1000'){
          if(res.data=='fail'){
              Mythis.setData({
              dis : true,
            })
          }
        }else{
          Mythis.setData({
            iosDialog1:true,
          })
        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: app.globalData.url + 'login/like/' +userid+'/'+Mythis.data.currid+'/3',
      method: 'GET',
      success: function (res) {
        if(app.checkRes(res.data)=='1000'){
          if(res.data=='fail'){
              Mythis.setData({
              like:true,
            })
          }
        }else{
          Mythis.setData({
            iosDialog1:true,
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
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
          date:date2int(new Date()),
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

  copy:function(){
    wx.setClipboardData({
      data: this.data.item.disc,
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

  close:function(){
    this.setData({
      iosDialog1: false,
    })
  },

  confirm:function(){
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
      this.animation = wx.createAnimation({
        duration: 120, // 动画持续时间，单位 ms
        timingFunction: 'linear', // 动画的效果
        delay: 10, // 动画延迟时间，单位 ms
        transformOrigin: '50% 50%' // 动画的中心点
      })
      let iscollect = this.properties.dis
      if(iscollect){
        wx.request({
          url: app.globalData.url + 'login/mark/' +userid+'/'+that.data.currid+'/2',
          method: 'GET',
          success: function (res) {
            //console.log(res.data)
            if(app.checkRes(res.data)=='1000'){
              if(res.data=='success'){
                wx.showToast({
                  title: '取消收藏',
                  icon:'none',
                  duration:1500,
                })
                that.setData({
                  dis: false
                })
              }else{
                wx.showToast({
                  title: '取消失败，请稍后重试！',
                  icon: 'none',
                  duration: 2000
                })
              }
            }else{
              that.setData({
                iosDialog1:true,
              })
            }
          },
          fail: function (res) { 
            wx.showToast({
              title: '服务器出错，稍后再试',
              icon:"none",
              duration:5000,
            })
          },
          complete: function (res) { 
          },
        })
      }else{
        setTimeout(function () {
          this.animation.scale(1.3).step();
          this.animation.scale(1.0).step();
          this.setData({
            animation_collect: this.animation.export()
          });
        }.bind(this), 50);
        wx.request({
          url: app.globalData.url + 'login/mark/' +userid+'/'+that.data.currid+'/1',
          method: 'GET',
          success: function (res) {
            //console.log(res.data)
            if(app.checkRes(res.data)=='1000'){
              if(res.data=='success'){
                wx.showToast({
                  title: '收藏成功',
                  icon:'none',
                  duration:1500,
                })
                that.setData({
                  dis : true,
                })
              }
            }else{
              that.setData({
                iosDialog1:true,
              })
            }
        },
        fail: function (res) { 
          wx.showToast({
            title: '服务器出错，稍后再试',
            icon:"none",
            duration:5000,
          })
        },
        complete: function (res) {},
      })
    }
  }
  },

  like:function(){
    var userid = wx.getStorageSync('userid');
    if(!userid||userid=='')
      this.setData({
        iosDialog1: true,
      })
    else{
      this.animation = wx.createAnimation({
        duration: 120, // 动画持续时间，单位 ms
        timingFunction: 'linear', // 动画的效果
        delay: 10, // 动画延迟时间，单位 ms
        transformOrigin: '50% 50%' // 动画的中心点
      })
      let like = this.properties.like
      if(like){
        let url = app.globalData.url + 'login/like/' + userid +'/'+ this.data.currid+'/2';
        let data = {};
        this.setData({
          like: !like,
          "item.upset" : this.data.item.upset - 1,
        })
        app.wxRequest('GET', url, data, (res) => {
          //console.log(res);
          if(app.checkRes(res.data)=='1000'){
            if(res.data=='success'){
              console.log("unlike success")
            }else{
              console.log("unlike fail")
            }
          }else{
            this.setData({
              iosDialog1:true
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
        let url = app.globalData.url + 'login/like/' + userid +'/'+ this.data.currid+'/1';
        let data = {};
        if (!like) {
          setTimeout(function () {
            this.animation.scale(1.3).step();
            this.animation.scale(1.0).step();
            this.setData({
              animation_like: this.animation.export()
            });
          }.bind(this), 50);
        }
        wx.vibrateShort({
          type:'medium',
          complete: (res) => {},
        })
        this.setData({
          like: !like,
          "item.upset" : Number(this.data.item.upset) + 1,
        })
        app.wxRequest('GET', url, data, (res) => {
          //console.log(res);
          if(app.checkRes(res.data)=='1000'){
            if(res.data=='success'){
              console.log("like success");
            }else{
              console.log("like fail")
            }
          }else{
            this.setData({
              iosDialog1:true
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
      }
    }
  }
})