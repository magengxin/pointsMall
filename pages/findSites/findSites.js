// pages/findSites/findSites.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    valInput:'',
    keyword: '',
    hasSites: false,
    sitesList:[],
  },
  // 输入框值改变
  inputVal:function(e){
    console.log(e)
    this.setData({
        keyword: e.detail.value
      })
  },
  // 查询站点
  sitesSearch:function(keyword){
    app.post(app.config.baseApi + 'Frontend/Goods/stationSearch', { keyword: this.data.keyword}, app, res => {
      if(res.data.code == 0) {
        if(res.data.result.length < 1) { // 未查询到站点
          this.setData({
            hasSites: false
          })
        }else {
        // res.data.result.
        console.log('======')
          let siteLength = 0, siteArr=[];
          res.data.result.map(v => {
            siteLength += v.network.length
            siteArr = siteArr.concat(v.network)
          })
          this.setData({
            sitesList: siteArr,
            siteLength: siteLength,
            hasSites: true
          }) 
        }
      }else {
          wx.showToast({
            title: 'network error',
          })
      }
    })  
  },
  // 关注公众号
  handleContact (e) {
    console.log(e)
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.keyword) {
      this.setData({
        keyword: options.keyword
      })
      this.sitesSearch(this.data.keyword)
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