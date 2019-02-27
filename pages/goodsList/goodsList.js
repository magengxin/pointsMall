const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    showLock: false,
    balance: '0.00',
    signArr: [1,2,3,4,5,6,7]
  },
  checkSign: function (e) {
    
    // if(e.currentTarget.dataset.count >= 7 ) {
    //   this.data.signArr.shift()
    //   this.data.signArr.push(e.currentTarget.dataset.count + 1)
    //   this.setData({
    //     signArr: this.data.signArr
    //   })
    // }
  },
  fetchList: function () {
    wx.showLoading({
      title: 'loading',
    })
    app.post(app.config.baseApi + 'frontend/goods/goodsList', {}, app, res => {
      console.log('xiugai')
      console.log(res)
      if (res.data.code == 0) {
        wx.hideLoading()
        console.log(this)
        // 暂时 每一种 截取四个渲染  然后点击更多时 在全部展示
        this.setData({
          goodsList: res.data.result.matter
        })
      }
    })
  },
  getBalance: function () {
    app.post(app.config.baseApi + 'frontend/Lottery/getTiming', {}, app, res => {
      if (res.data.code == 0) {
        app.timing = res.data.result.timing
        // app.timing = res.data.result
        if (res.data.result.timing > 0) {
          this.setData({
            showLock: false
          })
        } else {
          this.setData({
            showLock: true
          })
        }
        app.balance = res.data.result.balance
        this.setData({
          balance: res.data.result.balance
        })
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchList()
    this.setData({
      balance: app.balance
    })
  },
  viewGoodsDetail: function (e) {
    let gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?gid=' + gid
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
    this.getBalance()
    if(app.timing <= 0) {
      this.setData({
        showLock: true
      })
    }
  },
lockMall: function () {
  this.setData({
    showLock: true
  })
  app.showLock = this.data.showLock
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