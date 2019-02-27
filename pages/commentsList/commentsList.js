const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: []
  },
  // 获取评论列表
  fetchAllComments(goods_id) {
    app.post(app.config.baseApi + 'frontend/comments/lstByGoods', { goods_id: goods_id }, app, res => {
      if (res.data.code == 0) {
        res.data.result.map(v => {
          v.newImgs = v.imgs.split(',')
        })
        this.setData({
          commentList: res.data.result
        })
      } else {
        wx.showToast({
          title: 'network error',
        })
      }
    })
  },
  // 预览评价图片
  previewCommentImage (e) {
    if(e.currentTarget.dataset.imgurl) {
      let url = e.currentTarget.dataset.imgurl
      wx.previewImage({
        urls: [url],
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.goods_id) {
      this.fetchAllComments(options.goods_id)
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
