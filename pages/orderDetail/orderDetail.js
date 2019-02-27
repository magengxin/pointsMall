const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comefrom: '', // my 来自我的
    postage_pro: '',
    actual_amount: '',
    goods_infos: { // 接受实物的商品信息
    },
    order_infos: { // 接受my传过来的数据

    },
    flag: true,
    isPay: 0, // 支付时间为0 显示支付和取消订单
    goods_id: '',
    hasAddress: false,
    pro_name: '', // 查询邮费条件
    address: { // 地址信息
      recipient: '',
      tel: '',
      province: '',
      city: '',
      area: '',
      address: '',
    },
    addressList: {},
    totalFee: 0,
    postage_info:'',
    hasDefaultAddress: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 确认收货
  confirmGet: function(e) {
    let order_id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      success: res => {
        if (res.confirm) {
          app.post(app.config.baseApi + 'frontend/order/finish', {
            order_id: order_id
          }, app, res => {
            if (res.data.code == 0) {
              this.fetchOrderInfo(order_id, 'my')
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          })
        }
      }
    })

    
  },
  // 跳转到添加地址
  addAddress() {
    if (this.data.comefrom != 'my') {
      wx.navigateTo({
        url: '/pages/addressManage/addressManage?goods_id=' + this.data.goods_id,
      })
    }

  },
  // 获取邮费
  getPostage: function() {
    app.post(app.config.baseApi + 'Frontend/Order/getPostageFee', {
      province_name: this.data.pro_name
    }, app, res => {
      if (res.data.code == 0) {
        let total = (this.data.postage_info) / 1 + (res.data.result.fee.fee) / 1; 
          this.setData({
          postage_pro: res.data.result.fee,
          totalFee: total
        })
      } else {
        this.setData({
          totalFee: this.data.postage_info,
          hasAddress:false,
          address: {}
        })
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.data.msg,
        })
      }
    })
  },
  // 支付成功
  paySuccess: function() {
    wx.navigateTo({
      url: '/pages/mine/mine',
    })
  },
  // 取消订单
  cancelOrder: function(e) { // 取消订单
    console.log(e)
    let order_id = e.currentTarget.dataset.orderid
    wx.showModal({
      title: '提示',
      content: '确认取消订单',
      success: res => {
        if (res.confirm) {
          // 点击确认按钮
          app.post(app.config.baseApi + 'frontend/order/cancelOrder', {
            order_id: order_id
          }, app, res => {
            if (res.data.code == 0) {
              wx.showToast({
                title: '已取消',
              })
              wx.switchTab({
                url: '/pages/mine/mine',
              })
              // this.fetchList()
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
  // 查看物流
  viewLogistic: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/logInfo/logInfo?id=' + id,
    })
  },
  // 确认订单
  confirmOrder: function() {
    if (!this.data.flag) {
      wx.showModal({
        title: '支付提示',
        showCancel: false,
        content: '订单已创建,请前往我的订单查看',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }
        }
      })
      return
    }
    // 判断有没有地址
    if (!this.data.address.province) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请正确填写收货地址',
      })
      return;
    }
    let orderData = {
      recipient: this.data.address.recipient,
      tel: this.data.address.tel,
      province: this.data.address.province,
      city: this.data.address.city,
      area: this.data.address.area,
      address: this.data.address.address,
      goods_num: '1',
      goods_id: this.data.goods_infos.gid,
      actual_amount: this.data.totalFee, // 实付就是邮费
      postal_amount: this.data.totalFee,
      deduction_amount: this.data.goods_infos.value,
      goods_amount: this.data.goods_infos.value,
      goods_name: this.data.goods_infos.goods_name
    }
    if (this.data.flag) {
      app.post(app.config.baseApi + 'frontend/order/createOrder', orderData, app, res => {
        if (res.data.code == 0) {
          this.setData({
            flag: false
          })
          // 创建订单成功
          let order_id = res.data.result.order_id;
          app.post(app.config.baseApi + 'frontend/wxPay/pay', {
            order_id: order_id
          }, app, res => {
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
                  wx.switchTab({
                    url: '/pages/mine/mine',
                  })
                  // 暂时不要成功的提示
                  // wx.showModal({
                  //   title: '支付结果',
                  //   content: '成功',
                  //   showCancel: false,
                  //   success: res => {
                  //     if (res.confirm) {
                  //       console.log('88888888')
                  //       wx.switchTab({
                  //         url: '/pages/mine/mine',
                  //       })
                  //     }
                  //   },
                  // })
                },
                fail: res => {
                  wx.switchTab({
                    url: '/pages/mine/mine',
                  })
                }
              })
            } else {
              wx.showModal({
                title: '支付提示',
                content: res.data.msg
              })
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
    }

  },
  // 详情页内支付
  payInDetail(e) {
    // 详情页内的支付事件
    let detail_order_id = e.currentTarget.dataset.orderid
    // console.log(detail_order_id)
    // return
    app.post(app.config.baseApi + 'frontend/wxPay/pay', {
      order_id: detail_order_id
    }, app, res => {
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
            wx.showModal({
              title: '支付结果',
              content: '成功',
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/mine/mine',
                  })
                }
              },
            })
          },
          fail: res => {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }
    })
  },
  fetchList: function() {
    app.post(app.config.baseApi + 'frontend/address/lst', {}, app, res => {
      if (res.data.code == 0) {
        wx.hideLoading()
        // 有默认地址的情况下直接去请求邮费 status =1
        let defaultAddress = res.data.result.filter(v => {return v.status == 1})
        if(defaultAddress.length != 0) {
          this.setData({
            pro_name: defaultAddress[0].province // 默认地址只有一个
          })
        }else {
          this.setData({
            pro_name: '' // 默认地址只有一个
          })
        }
        console.log('proname')
        console.log(this.data.pro_name)
        if (this.data.pro_name != '') { // 有默认值,取邮费 地区邮费
          this.getPostage()
        }else { // 没有默认地址

        }
        res.data.result.map(v => {
          // 如果有默认地址
          if (v.status == 1) {
            let tmpAddress = {
              recipient: v.recipient,
              tel: v.tel,
              province: v.province,
              city: v.city,
              area: v.area,
              address: v.address
            }
            this.setData({
              pro_name: v.province,
              address: tmpAddress,
              hasAddress: true,
            })
          }
        })
      }else {
        wx.showToast({
          title: 'network error',
        })
      }
    })
  },
  fetchOrderInfo: function(order_id, comefrom) {
    app.post(app.config.baseApi + 'frontend/order/orderInfo', {
      order_id: order_id
    }, app, res => {
      if (res.data.code == 0) {
        // order_status == 0 未支付
        let tmpObj = {
          recipient: res.data.result.recipient,
          tel: res.data.result.tel,
          province: res.data.result.province,
          city: res.data.result.city,
          area: res.data.result.area,
          address: res.data.result.address,
        }
        this.setData({
          comefrom: comefrom,
          order_infos: res.data.result, // 订单信息渲染页面
          address: tmpObj,
          hasAddress: true // 需要根据订单状态判断  如果有地址 就展示  从my过来的页面 有地址不能在修改
        })
      } else {
      }
    })
  },
  goToComment: function(e) {
    wx.navigateTo({
      url: '/pages/addComment/addComment?order_id=' + e.currentTarget.dataset.id,
    })
  },
  onLoad: function(options) {
    // 先过去默认地址
    
    // 来自我的时  也需要判断是否有地址
    // options.giids_id 说明从详情页过来
    if (options.goods_id) {
      this.setData({
        goods_id: options.goods_id
      })
      // 请求商品信息
      app.post(app.config.baseApi + 'frontend/goods/goodsInfo', {
        goods_id: this.data.goods_id
      }, app, res => {
        if (res.data.code == 0) {
          this.setData({
            goods_infos: res.data.result,
            postage_info: res.data.result.postage, // 订单中的邮费
          })
          this.fetchList() // 判断默认地址
        } else {
          wx.showToast({
            title: '网络不佳',
          })
        }
      })
    }
    // 来自实物商品详情 创建订单需要此信息
    if (options.goods_info) {
      let goods_infos = JSON.parse(options.goods_info)
      this.setData({
        goods_infos: goods_infos
      })
      // console.log(this.data.goods_infos)
    }
    // 来自我的订单
    if (options.comefrom) {
      // comefome等于my时,   , 不能在修改地址
      //comefrom=my时,有order_id去请订单信息,不用再讲order_info传过来
      let order_id = options.orderid;
      this.fetchOrderInfo(order_id, options.comefrom)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 查询默认收货地址
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})