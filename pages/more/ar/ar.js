// pages/more/ar/ar.js
import * as THREE from '../../../utils/three.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth:0,
    canvasHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取视频context
    // var cameraContext = wx.createCameraContext();
    // //注册帧回调函数
    // var listener = cameraContext.onCameraFrame((frame) => {
    //   //打印返回数据是否是一个ArrayBuffer，并且返回每一帧的大小
    //   console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height);
    //   var data = new Uint8Array(frame.data);
    //   console.log(data.length);
    // });
    // //启动监听
    // listener.start();


    //初始化Canvas对象
    this.initWebGLCanvas();
  },

/**
 * 初始化WebGLCanvas画布
 */
  initWebGLCanvas:function(){
    const query=wx.createSelectorQuery();
    query.select('#webgl').node().exec((res)=>{
      //通过selector拿到canvas对象
      var canvas = res[0].node;
      this._webGLCanvas = canvas;
      //获取系统信息
      var info = wx.getSystemInfoSync();
      this._sysInfo = info;
      //设置canvas大小
      this._webGLCanvas.width = this._sysInfo.windowWidth * this._sysInfo.pixelRatio;
      this._webGLCanvas.height = this._sysInfo.windowHeight * this._sysInfo.pixelRatio;
      //设置cnavas的样式
      this._webGLCanvas.style = {};
      this._webGLCanvas.style.width = this._webGLCanvas.width;
      this._webGLCanvas.style.height = this._webGLCanvas.height;

      this.setData({
        canvasWidth:this._sysInfo.windowWidth,
        canvasHeight:this._sysInfo.windowHeight,
      });

      this.initWebGLScene();
    })
  },

  /**
   * WebGL场景初始化
   */
  initWebGLScene:function(){
    //Camera
    var camera = new THREE.PerspectiveCamera(60,this._webGLCanvas.width/this._webGLCanvas.height,1,1000);
    this._camera = camera;
    //Scene
    var scene = new THREE.Scene();
    this._scene = scene;

    //Cube
    var cubeg = new THREE.CubeGeometry(30,30,30);
    //Material
    var mat = new THREE.MeshBasicMaterial({color:0x000fff})
    //Build the mesh of Cube
    var cube = new THREE.Mesh(cubeg,mat);
    //Set position of Cube Mesh
    cube.position.set(0,0,-100);
    //Add Cube to Scene
    this._scene.add(cube);

    //Build A Renderer
    var renderer = new THREE.WebGLRenderer({
      canvas:this._webGLCanvas,
      alpha:true,
    })
    this._renderer = renderer;
    //Set size of renderer
    this._renderer.setSize(this._webGLCanvas.width,this._webGLCanvas.height);
    //记录当前时间
    var lasttime = Date.now();
    this._lasttime = lasttime;
    //Start render
    this.renderWebGL(cube);
  },

  /**
   * 渲染函数
   */
  renderWebGL:function(cube){
    //获取当前一帧的时间
    var now = Date.now();
    //计算时间间隔,由于Date对象返回的时间是毫秒，所以除以1000得到单位为秒的时间间隔
    var duration = (now - this._lasttime) / 1000;
    //打印帧率
    //console.log(1 / duration + 'FPS');
    //重新赋值上一帧时间
    this._lasttime = now;
    //旋转Cube对象，这里希望每秒钟Cube对象沿着Y轴旋转180度（Three.js中用弧度表示，所以是Math.PI）
    cube.rotation.y += duration * Math.PI/2;
    //Render the scene looked from the camera
    this._renderer.render(this._scene,this._camera);
    //设置帧回调函数，并且每一帧调用自定义的渲染函数
    this._webGLCanvas.requestAnimationFrame(() => {
      this.renderWebGL(cube);
    });
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