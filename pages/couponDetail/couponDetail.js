const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    goodsType: false, // true 是链接  false 二维码
    link: '',
    goodsName: '',
    orderType: '',
    pageImg: '',
    couponInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  previewQrCode: function() {
    // 点击预览图片
    wx.previewImage({
      urls: this.data.imgUrls || '',
      current: this.data.imgUrls[0],
    })
  },
  copyLink: function() {
    // 复制优惠券 link
    wx.setClipboardData({
      data: this.data.link,
      success: res => {
        if (res.errMsg.split(':')[1] == 'ok') {
          wx.showToast({
            title: '复制成功',
          })
        }
      }
    })
  },
  onLoad: function(options) {
    let order_id = options.order_id;
    app.post(app.config.baseApi + 'frontend/order/couponInfo', {
      order_id: order_id
    }, app, res => {
      // <!--type 1 商品 2 优惠券 3 链接-- >
      // 判断是  链接 还是图片 更改页面
      if (res.data.code == 0) {
        this.setData({
          goodsName: res.data.result.goods_name,
          orderType: res.data.result.type,
        })
        // link既是链接  又是二维码
        if (res.data.result.type == 3) {
          // 链接
          this.setData({
            goodsType: true,
            link: res.data.result.link,
            couponInfo: res.data.result
          })
        }
        if (res.data.result.type == 2) {
          //  整张二维码   2
          this.setData({
            goodsType: false
          })
          let imgs = []
          imgs.push(res.data.result.link) //
          this.setData({
            imgUrls: imgs,
            pageImg: res.data.result.link
          })

          wx.previewImage({
            urls: this.data.imgUrls || '',
            current: this.data.imgUrls[0]
          })
        }

      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})