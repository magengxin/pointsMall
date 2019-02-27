// pages/sharingPoints/sharingPoints.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '11',
    num: '11',
    type: '',
    // base: 2,
    //  path: '/pages/sharingPoints?' + 'a=' + Date.parse(new Date()) + '&b=' + app.config.session_id
  },
  goMall: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  onShareAppMessage: function (res) {
    var a,b;
    b = wx.getStorageSync('session_id')
    if(!b) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
    const c = 987654321; 
    a = (Date.parse(new Date())/1000) * 3 - c
      return {
        title: '道音福利派',
        path: 'pages/sharingPoints/sharingPoints?a=' + a + '&b=' +b,
        success: res => {
          wx.showToast({
            title: '分享成功',
          })
        },
        fail: res => {
          wx.showToast({
            title: '分享失败',
          })
        }
      } 
   },
   getGoodNum: function () {

   },
  /**
   * 生命周期函数--监听页面加载
   */
  goMallIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  fetchGood: function (data) { // 通过分享进入
    app.post(app.config.baseApi + 'frontend/Approve/do', data, app, res => {
      if (res.data.result.num >= 20) {
        res.data.result.num = 20
      }
      let val = res.data.result.num * res.data.result.value
      if (res.data.code == 0) {
        this.setData({
          value: val,
          num: res.data.result.num
        })
      } else {
      
        this.setData({
          num: val,
          value: res.data.result.value
        })
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.data.result.msg || '网络不佳',
        })
      }
    })
  },
  // 点击点赞图标
  fetchMyGood: function () {
    app.post(app.config.baseApi + 'frontend/Approve/detail', {}, app, res => {
      if(res.data.result.num >= 20) {
        res.data.result.num =20
      }
      let val = res.data.result.num * res.data.result.value
      if(res.data.code == 0) {
         this.setData({
           value: val,
           num: res.data.result.num
         })
      
      }else {
        wx.showModal({
          title: '提示',
          showCancel:false,
          content: res.data.result.msg || '网络不佳',
        })
      }
    })
  },
  onLoad: function (options) {
    console.log(options)
    app.config.session_id = wx.getStorageSync('session_id')
    if (!app.config.session_id) {
      wx.reLaunch({
        url: '/pages/login/login?a=' + options.a + '&b=' + options.b,
      })
      return;
    }
    let keys = Object.keys(options)
    if(keys.indexOf('type') > -1 && options.type == 1) {
      let type = options.type
      this.setData({
        type: '1'
      })
      // type 1 说明是自己点击按钮进入页面
      this.fetchMyGood()
    }else if(keys.indexOf('a' > -1 && keys.indexOf('b') > -1)) {
      let data = {
        a: options.a,
        b: options.b
      }
      this.fetchGood(data)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (opt) {
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
})