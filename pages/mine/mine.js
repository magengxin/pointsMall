const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType: 1,
    comfrom: 'my', // 1代表从我的 跳转到 订单详情
    allOrders: [],
    balance: '0.00',
    waitPay: [],
    waitReceipt:[],
    renderOrderList:[],
    countDownTime:600,
    showLock: false,
    avatarUrl: '',
    nickName: '',
    // coupon:''
  },
  gotoSign: function () {
    wx.navigateTo({
      url: '/pages/signin/signin',
    })
  }, 
  getBalance: function () {
    app.post(app.config.baseApi + 'frontend/Lottery/getTiming', {}, app, res => {
      if (res.data.code == 0) {
        if(res.data.result.balance == 0 || res.data.result.balance == null || res.data.result.balance == undefined) {
          res.data.result.balance = 0
        }else {
          if (res.data.result.balance.split('.')[1] <= 0) {
            res.data.result.balance = res.data.result.balance.split('.')[0]
          }
        }
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
  goOrderDetail: function (e) {
    if(e.currentTarget.dataset.type == 2) { // 跳到使用详情页面
      let goods_id = e.currentTarget.dataset.goodsid
      let order_id = e.currentTarget.dataset.orderid
      wx.navigateTo({
        url: '/pages/couponDetail/couponDetail?goods_id=' + goods_id + '&order_id=' + order_id,
      })
      return
    }
   
    let order_id = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?comefrom=' + this.data.comfrom + '&orderid=' + order_id
    })
  },
  payOrder: function (e) {
    let order_id = e.currentTarget.dataset.orderid;
    app.post(app.config.baseApi + 'frontend/wxPay/pay', { order_id: order_id }, app, res => {
      // 拿到订单信息 拉起支付
      if (res.data.code == 0) {
        let timeStamp = res.data.result.timestamp + ""
        let nonce_str = res.data.result.nonceStr + ""
        let paySign = res.data.result.paySign + ""
        let appId = res.data.result.appId + ""
        let signType = res.data.result.signType
        let prepay_id = res.data.result.package + ""
        wx.requestPayment({
          appId: appId,
          timeStamp: timeStamp,
          nonceStr: nonce_str,
          package: prepay_id,
          signType: "MD5",
          paySign: paySign,
          success: res => {
            // wx.showModal({
            //   title: '支付结果',
            //   content: res,
            //   showCancel: false,
            //   success: res => {
            //     if (res.confirm) {
            //      this.fetchList()
            //     }
            //   },
            // })
            this.fetchList()
          },
          fail: res => {
            wx.showModal({
              title: '提示',
              content: res,
            })
            // wx.navigateTo({
            //   url: '/pages/mine/mine',
            // })
          }
        })
      } else {
        // wx.showToast({
        //   title: res.data.msg,
        // })
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.data.msg,
        })
      }
    })
  },
  cancelOrder: function (e) { // 取消订单
    let order_id = e.currentTarget.dataset.orderid
    wx.showModal({
      title: '提示',
      content: '确认取消订单',
      success: res => {
        if (res.confirm) {
          // 点击确认按钮
          app.post(app.config.baseApi + 'frontend/order/cancelOrder', { order_id: order_id }, app, res => {
            if (res.data.code == 0) {
              wx.showToast({
                title: '取消订单成功',
              })
              this.fetchList() 
              this.getBalance()
            } else {
              wx.showToast({
                title: res.data.msg,
              })
            }
          })
        }
        if (res.cancel) {
          // 点击取消默认关闭弹框
          wx.showToast({
            title: '放弃取消',
          })
        }
      }
    })
  
  },
  tabSwitch:function (e) {
    wx.showLoading({
      title: 'loading...',
    })
    this.setData({
      orderType: e.currentTarget.dataset.type
    })
    if (this.data.orderType == 1) {
      this.setData({
        renderOrderList: this.data.allOrders
      })
      wx.hideLoading()
    } else if (this.data.orderType == 2) {
      this.setData({
        renderOrderList: this.data.waitPay
      })
      wx.hideLoading()
    } else if (this.data.orderType == 3) {
      this.setData({
        renderOrderList: this.data.waitReceipt
      })
      wx.hideLoading()
    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  fetchList: function () {
    wx.showLoading({
      title: 'loading...',
    })
    app.post(app.config.baseApi + 'frontend/order/orderList', {}, app, res => {
      // res.data.result[2].order_status = 2;
      if(res.data.code == 0) {
        let allOrders = res.data.result
        let waitPay = res.data.result.filter(v => v.order_status == 0) // 待付款
        let waitReceipt = res.data.result.filter(v => v.order_status == 1 || v.order_status == 2) // 待收货
        this.setData({
          renderOrderList: allOrders,
          allOrders: allOrders,
          waitPay: waitPay,
          waitReceipt: waitReceipt,
          orderType:1 // 未提交  取消订单后也跳到所有订单
        })
      } else {
       
      }
      wx.hideLoading()
     
    })
  },
  onLoad: function (options) {
    this.setData({
      balance: app.balance
    })
    this.fetchList()
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
    this.getBalance();
    // 防止进来时数据不刷新
    this.fetchList()
    this.setData({
      orderType: 1
    })
    if(app.timing <= 0) {
      this.setData({
        showLock: true
      })
    }
    this.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    })
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