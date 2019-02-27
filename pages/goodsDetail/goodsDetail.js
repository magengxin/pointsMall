const app = getApp()
const utils = require('../../utils/util.js')
Page({
  data: {
    isGoods: false,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
    ],
    urls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    goods_indicatorDots: false,
    autoplay: true,
    interval: 2500,
    com_interval: 5000,
    duration: 500,
    bannerImgs: [],
    detailImgs: [],
    goods_name: '',
    sale_num: '',
    goods_value: '',
    orderInfo: {},
    imgMode: "widthFix",
    imgHeight: '',
    avatar: '',
    nickName: '',
    commemtList: [],
    goods_id: '',
    commentsNum: ''
  },
  // 查看全部评价
  viewMoreComs: function () {
    wx.navigateTo({
      url: '/pages/commentsList/commentsList?goods_id=' + this.data.goods_id,
    })
  },
  // 余额
  getBalance: function () {
    app.post(app.config.baseApi + 'frontend/Lottery/getTiming', {}, app, res => {
      if (res.data.code == 0) {
        app.timing = res.data.result.timing
        // app.timing = res.data.result
        app.balance = res.data.result.balance
        if (res.data.result.timing < 0) {

          locktip: '商城已被锁定,您可以玩游戏解锁商城'
        }
        this.setData({
          balance: res.data.result.balance,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  },
  // 创建订单
  createOrder(e) {
    let goods_type = e.currentTarget.dataset.type
    let goods_id = e.currentTarget.dataset.goodsid
    // 优惠券创建订单
    let couponData = {
      deduction_amount: this.data.orderInfo.value,
      goods_id: this.data.orderInfo.gid,
      goods_amount: this.data.orderInfo.value,
      goods_num: 1
    }
    // 创建订单
    if (goods_type == 1) {
      // 是实物就跳到订单页

      wx.showModal({
        title: '温馨提示',
        content: '受春节物流停运影响已暂停发货!\n2月13日之后将及时为您发货！\n江浙沪地区1月29日前可安排发货！',
        showCancel: false,
        success: res => {
          wx.navigateTo({
            url: '/pages/orderDetail/orderDetail?goods_id=' + goods_id,
          })
        }
      })
     
    } else {
      // 优惠券直接跳到使用详情  type = 3,2
      couponData.goods_name = this.data.orderInfo.goods_name
      app.post(app.config.baseApi + 'frontend/order/createCouponOrder', couponData, app, res => {
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          let order_id = res.data.result.order_id
          wx.showModal({
            title: '兑换成功',
            showCancel: false,
            confirmText: '确定',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/couponDetail/couponDetail?goods_id=' + goods_id + '&order_id=' + order_id,
                })
              }
            }
          })
        }
      })
    }
  },
  // 获取评价
  fetchComments(goods_id) {
    app.post(app.config.baseApi + 'frontend/comments/lstByGoods', { goods_id: goods_id }, app, res => {
      if (res.data.code == 401) {
        app.gotoLogin()
        return
      }
      if (res.data.code == 0) {
        this.setData({
          commentsNum: res.data.result.length
        })
        res.data.result.map(v => {
          v.imgs = v.imgs.split(',')
          // v.content = v.content.slice(0,30)
        })
        // 默认展示三个
        if (res.data.result.length > 3) {
          this.setData({
            commemtList: res.data.result.splice(0, 3)
          })
        } else {
          this.setData({
            commemtList: res.data.result
          })
        }
      } else {
        wx.showToast({
          title: 'network error',
        })
      }
    })
  },
  // 点击查价
  copyOtherLink(e) {
    return
    if (e.currentTarget.dataset.link != '') {
      let link = e.currentTarget.dataset.link
      wx.navigateTo({
        url: '/pages/outerLink/outerLink?link=' + encodeURIComponent(link),
      })
    } else {
      return
    }
  },
  onShow: function () {
    this.getBalance()
    // this.fetchComments()
  },
  onLoad: function (options) {
    // 选取收货地址
    let goods_id = options.gid;
    this.setData({
      goods_id: goods_id
    })
    this.fetchComments(goods_id)
    // let goods_id = 1; // 先模拟
    wx.showLoading({
      title: 'loading',
    })
    app.post(app.config.baseApi + 'frontend/goods/goodsInfo', {
      goods_id: goods_id
    }, app, res => {
      if (res.data.code == 0) {
        wx.hideLoading()
        this.setData({
          orderInfo: res.data.result
        })
      }
      let swiperArr, thumbArr;
      if (res.data.result.imgs.toString() == '') {
        swiperArr = []
        thumbArr = []
      } else {
        swiperArr = res.data.result.imgs.filter(v => v.img_type == 1)
        thumbArr = res.data.result.imgs.filter(v => v.img_type == 2)
      }
      this.setData({
        bannerImgs: swiperArr,
        detailImgs: thumbArr,
        goods_name: res.data.result.goods_name,
        sale_num: res.data.result.sale_num,
        goods_value: res.data.result.value
      })
    })
  },
  onShareAppMessage: function () {

  }
})