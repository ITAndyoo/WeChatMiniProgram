Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#1296db",
    offset: "18%",
    dis:"flex",
    bgcolor:"white",
    list: [
      {
        "selectedIconPath": "/images/home.png",
        "iconPath": "/images/home.png",
        "pagePath": "/pages/index/index",
        "text": "首页"
      },
      {
        "selectedIconPath": "/images/menu.png",
        "iconPath": "/images/menu.png",
        "pagePath": "/pages/more/more",
        "text": "功能"
      },
      {
        "selectedIconPath": "/images/mine.png",
        "iconPath": "/images/mine.png",
        "pagePath": "/pages/mine/myinfo/myinfo",
        "text": "我"
      }
    ]
  },
  attached() {
    if (wx.getSystemInfoSync().theme=='dark')
      this.setData({
        bgcolor: '#191919'
      })
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})