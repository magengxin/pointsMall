// pages/couponPurchase/couponPurchase.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    couponList: [],
    type: '',
    tip: '',
    title:''
  },
  exchangeFor: function (e) {
     let gid = e.currentTarget.dataset.goodsid
       wx.navigateTo({
         url: '/pages/goodsDetail/goodsDetail?gid='+gid,
       })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  filterValue: function (obj) { // 小数点后第一位等于0的不显示, > 0 的显示
      let tmp = obj
      tmp.map(v => {
        if (v.value.split('.')[1] <= 0) {
          v.value = v.value.split('.')[0]
        }
      })
    
  },
  fetchList: function (type) {
    app.post(app.config.baseApi + 'frontend/goods/categoryList', {cat_id:type}, app, res => {
      if (res.data.code == 0) {
        wx.hideLoading()
        this.filterValue(res.data.result)
        if(type == 1) {
          this.setData({
            couponList: res.data.result,
            title: '商品'
          })
        }else if(type == 2){
          this.setData({
            couponList: res.data.result,
            title: '优惠券'
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      type: options.goodsType
    })
    //  type = options.goodsType // 1 商品 2 优惠券
    if(this.data.type == 1) {
      wx.setNavigationBarTitle({
        title: '道音 • 商品列表',
      })
      this.setData({
        tip: '没有更多商品了...'
      })
    } else if(this.data.type == 2){
      wx.setNavigationBarTitle({
        title: '道音 • 优惠券列表',
      })
      this.setData({
        tip: '没有更多优惠券了...'
      })
    }
   this.fetchList(this.data.type)
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