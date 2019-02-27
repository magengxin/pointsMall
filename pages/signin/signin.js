const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    showLock: false,
    balance: '0.00',
    signArr: [1, 2, 3, 4, 5, 6, 7],
    continueDays: '',
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
        res.data.result.matter.map(v => { // 小数点后小于0的不显示0
          if(v.value.split('.')[1] <= 0) {
            v.value = v.value.split('.')[0]
          }
        })
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
  // 签到
  checkSign: function () {
    app.post(app.config.baseApi + 'frontend/signin/getSignin', {}, app, res => {
      if (res.data.code == 0) {
        let days = res.data.result.days
        // days = 8 // test
        this.setData({
          continueDays: days
          // continueDays: 8
        })
        if (days == 0 || days < 7) { // 说明没有连续签到 ,就显示1-7天
          let dayArr0 = []
          for (let i = 1; i < 8; i++) {
            let dayObj0 = { points: '', day: '' }
            i > 6 ? dayObj0.points = 30 : dayObj0.points = i * 5
            dayObj0.day = i
            dayArr0.push(dayObj0)
          }
          this.setData({
            signArr: dayArr0
          })
        } else if (days >= 7) { // 连续签到显示计算的结果
          days = days + 1 // 加一之后在进行计算
          let dayArr1 = []
          for (let j = 6; j >= 1; j--) {
            let dayArrObj1 = { points: 30, day: '' }
            dayArrObj1.day = days - j
            dayArrObj1.points = dayArrObj1.day >= 6 ? 30 : dayArrObj1.day * 5
            dayArr1.push(dayArrObj1)
          }
          dayArr1.push({ points: 30, day: days })
          this.setData({
            signArr: dayArr1
          })
        }
        // this.reRenderSignArr()
      } else {
        wx.showToast({
          title: '网络不佳',
        })
      }
    })
  },
  reRenderSignArr: function (signData) {
    app.post(app.config.baseApi + 'frontend/signin/add', signData, app, res => {
      if (res.data.code == 0) {
        let lastIdx = this.data.signArr.length - 1 // 数组最后一个的索引
        let lastObj = this.data.signArr[lastIdx]
        let newobj = { points: 30, day: lastObj.day / 1 + 1 }
        this.data.signArr.push(newobj)
        this.data.signArr.shift()
        console.log(this.data.signArr)
        this.setData({
          signArr: this.data.signArr
        })
        // 重新渲染签到数组
        this.checkSign()
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }
    })
  },
  doSign: function () {
    console.log(this.data.continueDays)
    let signData = {}
    if (this.data.continueDays < 6) {
      signData.points = (this.data.continueDays / 1 + 1) * 5
    } else {
      signData.points = 30
    }
    this.reRenderSignArr(signData)
    // if (this.data.continueDays < 7) {
    //     this.reRenderSignArr()
    // } else {
    //   // 调签到接口
     
    // }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkSign()
    // 获取列表
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
    // this.getBalance()
    // this.checkSign()
    if (app.timing <= 0) {
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