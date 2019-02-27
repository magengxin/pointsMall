// pages/addressManage/addressManage.js
//获取应用实例
const app = getApp()
const URL = app.config.host;


Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    flag: true,
    addressList: [{
      "id": "",                                  //
      "user_id": "",                             //用户id
      "recipient": "",                   //收件人
      "tel": "",                       //tel   
      "area": "",                    //区域
      "address": "",
      "status": "",                                //地址类型 默认1，普通 0
      "status": "",
      "created_at": "",
      "updated_at": "",
      "deleted_at": ""
    }],
    personInfo: '',  //用户信息
    orderIds: ''
  },
  //事件处理函数
  onLoad: function (options) {
    console.log(options)
    if(options.goods_id) {
      wx.setStorage({
        key: 'goods_id',
        data: options.goods_id,
      })
    }
    let that = this;
    var orderId = options.orderId
    that.orderIds = orderId
    wx.showLoading({
      title: 'loading',
    })
    app.post(app.config.baseApi + 'frontend/address/lst', {}, app, res => {
      if(res.data.code == 0) {
        wx.hideLoading()
        that.setData({
          // wxml中遍历addressList
          addressList: res.data.result
        })
      }else {
        wx.showToast({
          title: '获取地址失败',
        })
      }
      
    })
    // 判断有没有用户信息
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
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goBackOrder: function (e) {
    // 点击使用地址按钮
    let address = e.currentTarget.dataset.address
    let pages = getCurrentPages();
    let prePage = pages[pages.length -2] // -2 上一个 -3 上上个 类推
    prePage.setData({
      address: address,
      pro_name: address.province,
      hasAddress: true // 有地址
    })
    prePage.getPostage() // 调用详情页的查邮费接口
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: '/pages/orderDetail/orderDetail',
    // })
  },
  selectList: function (e) {

    var that = this;
    // 默认地址状态清空
    for (var i = 0; i < that.data.addressList.length; i++) {
      that.data.addressList[i].selsecType = "1"
    }
    // 当前地址选中
    this.data.addressList[e.target.dataset.index].selsecType = "0";
    this.setData({
      addressList: that.data.addressList
    })
    //发送index确认修改默认地址

    var obj = this.data.addressList[e.target.dataset.index];
    this.personInfo = obj

  },
  delAdress: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确认删除',
      success: res => {
        wx.showLoading({
          title: 'loading',
        })
        if(res.confirm) {
          app.post(app.config.baseApi + 'frontend/address/del',{id: id}, app, res => {
            if(res.data.code == 0) {
              wx.showToast({
                title: '删除成功',
              })
              wx.hideLoading()
              this.fetchList()
            }else {
              wx.showToast({
                title: '删除失败',
              })
            }
          })
        } else {
          wx.showToast({
            title: '取消操作',
          })
        }
      }
    })

  },
  editorAdress: function (e) {
    var e = '/pages/addAddress/addAddress?key=editor&id=' + e.target.dataset.index
    wx.navigateTo({
      url: e
    })
  },
  fetchList: function () {// 获取地址列表
    app.post(app.config.baseApi + 'frontend/address/lst', {}, app, res => {
      if (res.data.code == 0) {
        this.setData({
          addressList: res.data.result
        })
      } else {
        this.showToast({
          title: '获取地址列表失败'
        })
      }
    })
  },
  // 添加成功返回  修改
  changeData: function () {
    let that = this;
    app.post(app.config.baseApi + 'frontend/address/lst',{},app, res => {
      if(res.data.code == 0) {
        that.setData({
          addressList: res.data.result
        })
      }else {
          this.showToast({
            title: '获取地址列表失败'
          })
      }
    } )
  },
  saveInfo() {
    let that = this;
    let personInfos = that.personInfo;
    var obj = personInfos
    if (obj == undefined) {
      wx.showToast({
        title: '请选择收货地址',
        duration: 2000
      })
      return
    }
    obj.order_id = that.orderIds
    // console.log('rrrrrr', that.orderIds)
    wx.request({
      url: URL + "frontend/lottery/adduserprizeorder?access_token=" + app.access_token,
      data: obj,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.redirectTo({
                url: '../pages/my-award/my-award'
              })
            }
          })

          setTimeout(function () {
            wx.navigateBack();
          }, 1000)

        } else {
          wx.showToast({
            title: '设置失败',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })

  },
  onShow() {
    let that = this;
    that.changeData()

  }
})
