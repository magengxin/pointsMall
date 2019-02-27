//app.js
App({
  config: {
    baseApi: 'https://daoyin.datuhongan.com/',
    session_id: '',
    appId: 'wx38fc3c61f7724314',
  },

  get: function (url, method, data, callback) {
    wx.request({
      url: url,
      method: 'get',
      data: data,
      header: {
        e2
      },
      success: res => {
        callBack(res)
      },
      fail: res => {
        if (res.data.code === 401) {
          this.setData({
            hasUserInfo: false
          })
        }

      }
    })
  },
  post: function (url, data, app, callBack) {
    wx.request({
      url: url,
      method: 'post',
      data: data,
      header: {
        "Content-Type": 'application/x-www-form-urlencoded',
        'authorization': 'Basic ' + app.config.session_id
      },
      success: res => {
        callBack(res)
      },
    })
  },
  onShow: function (options) {
    if (options.scene === 1011 || options.scene === 1012 || options.scene === 1013) {
      //  扫描二维码进入小程序
      wx.setStorage({
        key: 'source',
        data: '1',
      })
    }
  },
  onLaunch: function (options) {
    this.config.session_id = wx.getStorageSync('session_id')
    const uid = this.config.session_id
    let kArr = Object.keys(options.query)
    if (kArr.indexOf('q') > -1) { // 通过扫描普通二维码进入小程序
      if (!uid) { // 未登录跳转
        wx.reLaunch({
          url: '/pages/login/login?q=' + options.query.q,  // line
          // url: '/pages/login/login?q=' + encodeURIComponent(options.query.q), // test
        })
      }
    } else if (kArr.indexOf('a') > -1 && kArr.indexOf('b') > -1) { // 通过点击分享卡片进入小程序
      if (!uid) { // 未登录跳转
        wx.reLaunch({
          // url: '/pages/login/login?a=' + options.query.a + '&b=' + encodeURIComponent(options.query.b), //test
          url: '/pages/login/login?a=' + options.query.a + '&b=' + options.query.b, // line
        })
      }
    } else { // 非扫码  非点击分享 进入小程序
      if (!uid) { // 未登录跳转
        wx.reLaunch({
          url: '/pages/login/login',
        })
      }
    }
  },
  gotoLogin(options) {
    if (options && options.q) {
      wx.reLaunch({
        url: '/pages/login/login?q=' + options.q,
      })
    } else {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },
  globalData: {
    userInfo: null
  }
})