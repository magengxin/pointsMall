// pages/author/author.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '../../images/logo.png',
    loginBtn: '登陆',
    title: '',
    opt: '',
    a: '',
    b:'',
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('----login----')
    console.log(options)
    let karr = Object.keys(options)
    if(karr.indexOf('q') != -1) {
      this.setData({
        opt: options.q,
        type: 'code'
      })
    } else if(karr.indexOf('a') != -1 || karr.indexOf('b') != -1) {
      this.setData({
        a: options.a,
        b: options.b,
        type: 'good'
      })
    }
  },
  getUserInfo: function (e) {
    // console.log(e)
    if (e.detail.userInfo) {
      //通过按钮授权
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo // 先获取用户信息
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              var code = res.code;
              this.setData({
                code: code
              })
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      app.globalData.userInfo = res.userInfo
                      var loginData = {
                        session_key: '',
                        encryptedData: res.encryptedData,
                        iv: res.iv
                      }
                      // 可以将 res 发送给后台解码出 unionId
                      wx.request({
                        url: app.config.baseApi + 'wechat/getToken',
                        data: { code: code },
                        success: res => {
                          if (res.data.code == 0) {
                            // token 接口拿到session_key
                            loginData.session_key = res.data.result.session_key
                            wx.request({
                              url: app.config.baseApi + 'wechat/login',
                              method: 'post',
                              data: loginData,
                              header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                              },
                              success: res => {
                                if (res.data.code == 0) {
                                  wx.setStorageSync('session_id', res.data.result.session_id)
                                  // return
                                  // 登录成功跳回 中奖页
                                  if(this.data.type == 'code') {
                                    wx.reLaunch({
                                      url: '/pages/index/index?q=' + this.data.opt,
                                    })
                                  }else if(this.data.type == 'good'){
                                    wx.reLaunch({
                                      url: '/pages/sharingPoints/sharingPoints?a=' + this.data.a + '&b=' + this.data.b,
                                    })
                                   
                                  }else {
                                    wx.reLaunch({
                                      url: '/pages/index/index',
                                    })
                                  }
                                 
                                }else {
                                  wx.showToast({
                                    title: '登录失败',
                                  })
                                }
                              }
                            })
                          } else {
                            wx.showToast({
                              title: '登录失败',
                            })
                          }
                        }
                      })
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (app.userInfoReadyCallback) {
                        app.userInfoReadyCallback(res)
                      }
                    }
                  })
                }
              })
            }
          })
        },
        fail: res => {
          //未通过登录按钮获取授权
          if (res.errMsg == "getUserInfo:fail scope unauthorized" || res.errMsg == "getUserInfo:fail:scope unauthorized") {
            that.setData({
              isLogin: true
            })
          }
          //用户点击不授权,重复跳转提醒授权
          else {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
    }else {

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