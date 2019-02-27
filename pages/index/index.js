const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [

    ],
    indicatorDots: false,
    head_autoplay: true,
    balance: '0.00',
    head_interval: 2000,
    head_duration: 500,
    recommendList: [],
    couponList: [],
    goodsList: [],
    comments: [1, 2, 3],
    imgUrl: '',
    coms: [1, 2, 3],
    vertical: true,
    countDownTime: 600,
    showLock: false,
    points: '',
    ifWin: true,
    urls: false,
    showName: true, // 是否展示商城名
    showMask: false,
    showNewUserMask: false,
    maskAnimationData: {},
    records: [],
    showRulerMask: false,
  },
  // 关闭规则弹窗
  closeRulerMask() {
    this.setData({
      showRulerMask: false
    })
  },
  // 查看规则
  viewRulers(){
    this.setData({
      showRulerMask: true
    })
  },
  // 关闭中奖弹框
  closeMask: function () {
    this.setData({
      showMask: false
    })
  },
  // 关闭新用户弹窗
  closeNewMask() {
    this.setData({
      showNewUserMask: false
    })
  },
  // 签到
  gotoSign: function () { // 签到
    wx.navigateTo({
      url: '/pages/signin/signin',
    })
  },
  goCoupons: function () {
    wx.navigateTo({
      url: '/pages/couponList/couponList',
    })
  },
  // 更多
  viewMore: function (e) {
    let goodsType = e.currentTarget.dataset.goodstype // 1 商品 , 2 优惠券
    wx.navigateTo({
      url: '/pages/couponPurchase/couponPurchase?goodsType=' + goodsType,
    })
  },
  // 跳转优惠券详情
  gocoupon: function () {
    wx.navigateTo({
      url: '/pages/couponDetail/couponDetail',
    })
  },
  // 商品详情
  viewGoodsDetail: function (e) {
    let gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?gid=' + gid
    })
  },
  // 过滤value
  filterValue: function (obj) { // 小数点后第一位等于0的不显示, > 0 的显示
    for (let k in obj) {
      let tmp = obj[k]
      if (Array.isArray(tmp)) {
        // obj的形式为 {a:[],b:[]}
        if (tmp.length > 0) {
          tmp.map(v => {
            if (v.value.split('.')[1] <= 0) {
              v.value = v.value.split('.')[0]
            }
          })
        }
      } else {
        // {a:1,b:2}
        if (typeof tmp == 'string') {
          if (tmp.indexOf('.') > -1) { // 判断有没有点
            if (tmp.split('.') <= 0) {
              tmp = tmp.split('.')[0]
            }
          }
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 商品列表
  fetchList: function (options) {
    let self = this;

    wx.showLoading({
      title: 'loading',
    })
    app.post(app.config.baseApi + 'frontend/goods/goodsList', {}, app, res => {
      if (res.data.code == 0) {
        this.filterValue(res.data.result)
        this.setData({
          recommendList: res.data.result.recommend,
          couponList: res.data.result.coupon,
          goodsList: res.data.result.matter,
          imgUrls: res.data.result.banner_recommend
        })
      } else if (res.data.code == 401) { 
        app.gotoLogin(options)
      }
      wx.hideLoading()
    })
  },
  // 余额
  getBalance: function () {
    app.post(app.config.baseApi + 'frontend/Lottery/getTiming', {}, app, res => {
      if (res.data.code == 0) {
        let bal = res.data.result.balance + ''
        if (String(res.data.result.balance).indexOf('.') > -1) {
          if (res.data.result.balance.split('.')[1] <= 0) {
            res.data.result.balance = res.data.result.balance.split('.')[0]
          }
        }
        this.setData({
          balance: res.data.result.balance
        })
      } else {
        wx.showToast({
          title: '网络不佳',
        })
      }
      // this.getBalance() // 抽完奖获取最新
    })
  },
  // 抽奖
  getLottery: function (data) {
    app.post(app.config.baseApi + 'frontend/lottery/index', data, app, res => {
      // 判断是否中奖
      if (res.data.code == 0) {
        console.log('-----')
        // res.data.result.isNewUser = 0
        if (res.data.result.isNewUser == 1) {
          this.setData({
            showMask: false,
            showNewUserMask: true
          })
          
        } else {
          this.setData({
            showMask: true,
            showNewUserMask: false
          })
        }
        // 中奖
        this.setData({
          points: res.data.result.points,
          ifWin: true,
          wintip: res.data.result.tips,
        })
      } else {
        this.setData({
          showMask:true,
          showNewUserMask: false,
          ifWin: false,
          wintip: res.data.result.tips,
        })
      }
      this.getBalance() // 抽完奖回去最新余额
    })
  },
  // 充点
  getChargeData: function (data) {
    app.post(app.config.baseApi + 'api/charging/do', { port: data }, app, res => {
      if (res.data.code == 0) {
        wx.showToast({
          duration: 2000,
          title: res.data.msg,
        })
      } else {
        wx.showToast({
          duration: 2000,
          title: res.data.msg,
        })
      }
    })
  },
  // 获取兑换记录
  fetchConvertRecord() {
    app.post(app.config.baseApi + 'api/adPool/ten', {}, app, res => {
      if (res.data.code == 0) {
        let tmp = []
        res.data.data.map(v => {
          tmp.push(v.split(']')[1])
        })
        this.setData({
          records: tmp
        })
      } else {
        wx, wx.showToast({
          title: 'network error',
        })
      }
    })
  },
  // 推荐评论
  fetchRecommentComments() {
    app.post(app.config.baseApi + 'frontend/comments/lstByRecommend', {}, app, res => {
      if (res.data.code == 0) {
        res.data.result.map(v => {
          let tmpImgArr = []
          v.imgs = v.imgs.split(',')
          // v.content =v.content.slice(0,30)
        })
        this.setData({
          recommendComments: res.data.result
        })
      } else {
        wx.showToast({
          title: 'network error',
        })
      }
    })
  },
  onLoad: function (options) {

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      // 如果之前没有获取到，重新获取
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    app.config.session_id = wx.getStorageSync('session_id') // 全局的session_id会被relaunch刷新 失效  暂时这么做
    if (!app.config.session_id) {
      if (JSON.stringify(options) != '{}') {
        wx.reLaunch({
          url: '/pages/login/login?q=' + options.q, // 分享参数为a,b,但是暂时不走index
        })
      } else {
        wx.reLaunch({
          url: '/pages/login/login',
        })
      }
      return;
    }
    this.fetchRecommentComments() // 获取评价轮播图
    let kArr = Object.keys(options)
    if (kArr.indexOf('q') > -1) { // 有q 为扫描普通二维码进入
      let queryStr = decodeURIComponent(options.q) // 解码url
      let sear = queryStr.split('?')[1] // a=1&b=2
      let sears = sear.split('&')// [a=1, b=2]
      let obj = {}
      sears.map(v => {
        let a = v.split('=')[0]
        let b = v.split('=')[1]
        obj[a] = b
      })
      let newKArr = Object.keys(obj)
      if (newKArr.indexOf('port') > -1) { // 扫码充电进入
        let chargeObj = util.urlFormat(queryStr)
        let chargeData = chargeObj.port
        this.setData({
          showName: true // 充电码
        })
        this.getChargeData(chargeData)
      } else { // 扫普通二维码
        let serachObj = util.urlFormat(queryStr) //line test
        let scanData = {
          ad_id: serachObj.ad_id,
          pool_id: serachObj.pool_id,
          score: serachObj.score,
          points: serachObj.points,
          timestamp: serachObj.timestamp,
          mac_address: serachObj.mac_address,
          sign: serachObj.sign,
        }
        this.setData({
          showName: false
        })
        this.getLottery(scanData)
      }
    } else if (kArr.indexOf('a') > -1 && kArr.indexOf('b') > -1) { // 分享

    } else { // 没有q参数  没有a,b 正常点击进来
      // 显示商城名字 
      this.setData({
        showName: true
      })
    }
    this.fetchList(options)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // 放大
  onShow: function (options) {
    this.fetchList(options)
    this.getBalance()
    this.fetchConvertRecord()
    // util.visitLogs(app) // 统计访问次数
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
})