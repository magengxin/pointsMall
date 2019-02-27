const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cate: '',
    cateList: [],
    goodsList: [],
    keyword: ''
  },
  // tab栏切换事件
  switchCate: function (e) {
    if (e.currentTarget.dataset.cate) {
      this.setData({
        cate: e.currentTarget.dataset.cate
      })
      this.fetchGoodsByCate(this.data.cate)
    }

  },
  searchStation: function () {
    wx.navigateTo({
      url: '/pages/findSites/findSites?keyword=' + this.data.keyword,
    })
  },
  // 输入框的值输入事件
  bindKeyInput(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  // 查看商品详情
  viewGoodsDetail(e) {
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '/pages/goodsDetail/goodsDetail?gid=' + e.currentTarget.dataset.id,
      })
    }
    console.log(e)
  },
  // 获取分类标题
  fetchCateList: function () {
    app.post(app.config.baseApi + 'frontend/goods/categoryLst', {}, app, res => {
      if (res.data.code == 0) {
        let data = res.data.result
        let activeCate = data[0].id
        this.setData({
          cateList: data,
          cate: data[0].id
        })
        console.log(this.data.cate)
        wx.setStorageSync('cateList', data)
        wx.setStorageSync('cateListTime', new Date().getTime() / 1000)
        // 后台未排序时需排序后再取第一个
        let param = data[0].id
        this.fetchGoodsByCate(param)
      } else {
        wx.showToast({
          title: 'error',
        })
      }
    })
  },
  // 根据分类匹配商品列表
  fetchGoodsByCate(param) {
    let id = param
    app.post(app.config.baseApi + 'frontend/goods/lstByCategory', {}, app, res => {
      if (res.data.code == 0) {
        let resData = res.data.result
        console.log(resData)
        console.log(resData[id])
        for (let k in resData) {
          resData[k].map(v => {
            if (v.value.indexOf('.') != -1) { // 说明有小数点
              console.log('.....')
              if (v.value.split('.')[1] <= 0) {
                v.value = v.value.split('.')[0]
              }
            }
          })
        }
        // 默认展示第一个分类的数据
        if (resData.length != 0) { // 有数据时
          this.setData({
            goodsList: resData[id]
          })
        }
      } else {
        wx.showToast({
          title: 'network error'
        })
      }
    })
  },
  // 查看全部站点
  viewAllStations() {
    wx.navigateTo({
      url: '/pages/allSites/allSites',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let time = new Date().getTime() / 1000 - wx.getStorageSync('cateListTime')
    if (time > 24 * 36000) {
      wx.removeStorageSync('cateList')
    }
    let cateList = wx.getStorageSync('cateList')
    if (cateList.length > 0) {
      let accate = cateList[0].id
      this.setData({
        cateList: cateList,
        cate: accate
      })
      // 拿到缓存中的第一个进行渲染数据
      this.fetchGoodsByCate(this.data.cateList[0].id)
    } else {
      this.fetchCateList()
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