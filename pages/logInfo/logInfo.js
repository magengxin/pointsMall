const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfos: "",
    logs: ''
  },
fetchOrderInfo: function (id) {
  app.post(app.config.baseApi + 'frontend/order/orderInfo', {order_id: id},app ,res => {
    if(res.data.code == 0) {
      // res.data.result.logistics_company = '123123'
      // res.data.result.logistics_no = '123123'
      if (res.data.result.logistics_no == '' || res.data.result.logistics_no == null) {
        res.data.result.logistics_no = '暂无'
      }
      if (res.data.result.logistics_company == '' || res.data.result.logistics_company == null) {
        res.data.result.logistics_company = '暂无'
      }
      this.setData({
        orderInfos: res.data.result
      })
      // 获取物流信息
      let lo_no = res.data.result.logistics_no
      // lo_no = '818538106836' //test
      this.fetchLogInfo(lo_no) 
    }else {
      wx.showToast({
        title: '网络差',
      })
    }
  })
},
fetchLogInfo: function (no) {
  wx.showLoading({
    title: 'loading...',
  })
  app.post(app.config.baseApi + 'frontend/order/express', {no: no},app ,res => {
    if(res.data.message == 'ok') {
      this.setData({
        logs: res.data.data
      })
      this.data.logs[0].active = 1
    }else {
      wx.showToast({
        title: '暂无信息',
      })
    }
    wx.hideLoading()
  })
},
copyNo: function () {
  wx.setClipboardData({
    data: this.data.orderInfos.logistics_no,
    success: res => {
      if (res.errMsg.split(':')[1] == 'ok') {
        wx.showToast({
          title: '复制成功',
        })
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(JSON.stringify(options) != '{}') {
      let id = options.id
        this.fetchOrderInfo(id)
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