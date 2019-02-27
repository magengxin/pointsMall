const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_img: '',
    maxUploadLength: 4,
    hasUploadLength: 0,
    imgUrls: [], // 预览图片数组
    imageType: ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
      order_id: '',
      goods_id: '',
      content: '',
      imgs: ''
  },
  // 上传图片
  uploadImage: function () {
    let session_id = wx.getStorageSync('session_id')
    console.log(session_id)
    if(this.data.hasUploadLength == 4) { //判断已上传长度
      wx.showModal({
        title: '上传提示',
        showCancel: false,
        content: '图片已达到上限',
      })
      return;
    }
    let that = this
    wx.chooseImage({
      sizeType: ['compressed'],
      success: res => {
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.config.baseApi + 'frontend/comments/uploads',
          header:{
            'authorization': 'Basic ' + session_id
          },
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = JSON.parse(res.data)
            if(data.code == 0) {
              // tempPathArr.push(data.result.path)
              that.data.imgUrls.push(data.result.path)
              that.setData({
                imgUrls: that.data.imgUrls,
                hasUploadLength: that.data.imgUrls.length
              })
              if(4 < that.data.hasUploadLength) {
                wx.showModal({
                  title: '上传提示',
                  content: '图片已达到上限',
                })
              }
            }else {
              wx.showToast({
                title: data.msg,
              })
            }
            // const data = res
            // console.log( data)
          }
        })
      },
    })
  },
  // 删除以上传图片
  delUploadImg (e) {
    // this.data.imgUrls.splice()
    console.log(e)
    let idx = e.currentTarget.dataset.idx
    this.data.imgUrls.splice(idx,1)
    this.setData({
      imgUrls: this.data.imgUrls,
      hasUploadLength: this.data.imgUrls.length
    })
  },
  onSubmit: function () {
    this.setData({
      imgs: this.data.imgUrls.join(',')
    })
    let commentData = {
      order_id: this.data.order_id,
      goods_id: this.data.goods_id,
      goods_name: this.data.goods_name,
      imgs: this.data.imgs,
      content: this.data.content
    }
    app.post(app.config.baseApi + 'frontend/comments/add', commentData, app, res => {
      if(res.data.code == 0) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '评论成功',
            success: res => {
              if(res.confirm) {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            }
          })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.data.msg,
        })
      }
    })
  },
  textChange: function (e) { // textarea的值改变事件
    this.setData({
      content: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  fetchOrderInfo: function (order_id) {
    app.post(app.config.baseApi + 'frontend/order/orderInfo', {
      order_id: order_id
    }, app, res => {
      if (res.data.code == 0) {
        this.setData({
          order_id: res.data.result.id,
          goods_id: res.data.result.goods_id,
          goods_name: res.data.result.goods_name,
          goods_img: res.data.result.goods.thumb_img
        })
      } else {

      }
    })
  },
  onLoad: function (options) {
    // 获取商品信息
    this.fetchOrderInfo(options.order_id)
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