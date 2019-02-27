// pages/addAddress/addAddress.js
//获取应用实例
const app = getApp()
const URL = app.config.baseApi;

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userName: '',
    phoneNumber: '',
    addressInfo: '',
    region: ['省份', '城市', '区县'],
    customItem: '全部',
    moaddress: false,
    options: ''
  },
  //事件处理函数
  onLoad: function (options) {
    if (options.wxaddress == 1){
      wx.chooseAddress({
        success: res => {
          console.log('wx-address')
          console.log(res)
          this.setData({
            userName: res.userName,
            phoneNumber: res.telNumber,
            region: [res.provinceName, res.cityName, res.countyName],
            addressInfo: res.detailInfo
          })
        }
      })
    }
    // //记录用户行为
    // app.recordData(9997)

    this.data.options = options
    if (options.key == "editor") {
      wx.setNavigationBarTitle({ title: '道音 • 编辑地址' })
      var obj = { id: options.id }
      // 获取单条地址信息
      app.post(app.config.baseApi + 'frontend/address/info', obj, app, res => {
        if(res.data.code == 0) {
          var reginstr = res.data.result.province + ',' + res.data.result.city + ',' + res.data.result.area
          this.setData({
            userName: res.data.result.recipient,
            phoneNumber: res.data.result.tel,
            region: reginstr.split(","),
            addressInfo: res.data.result.address

          })
        }
      })
      // return
      // app.post(URL + "applet/user/one-address?accessToken=" + app.access_token, obj).then(res => {
      //   console.log(res)
      //   this.setData({
      //     userName: res.data.recipient,
      //     phoneNumber: res.data.tel,
      //     region: res.data.area.split(","),
      //     addressInfo: res.data.address

      //   })
      // })
      // 修改上一页内容
      // var pages = getCurrentPages();
      // if (pages.length > 1) {
      //   var prePage = pages[pages.length - 3];
      //   prePage.changeData()
      // }
    } else if (options.key != "editor") {
      wx.setNavigationBarTitle({ title: '道音 • 新增地址' })
    }


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
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  listenerInput: function (e) {
    let key = e.target.id
    this.data[key] = e.detail.value;
    // console.log(key, this.data[key])
  },
  // 提交
  formSubmit: function (e) {
    // console.log(this.data.userName, this.data.phoneNumber, this.data.addressInfo)
    // console.log(app.access_token)
    var re = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    // console.log(this.data.phoneNumber);
    if (this.data.phoneNumber){
      this.data.phoneNumber = this.data.phoneNumber.replace(/\s/g, "");
    }
    // console.log(this.data.phoneNumber);
    if (this.data.userName == "") {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none',
      })
      return
    } else if (this.data.phoneNumber == "" || !re.test(this.data.phoneNumber)) {
      wx.showToast({
        title: '请输入正确的收货人手机号码',
        icon: 'none',
      })
      return
    } else if (this.data.addressInfo == "") {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
      })
      return
    } else if (this.data.region[2] == "区县" || this.data.region[2] == "全部") {
      wx.showToast({
        title: '请选择所属区域',
        icon: 'none',
      })
      return
    }
    var obj = {
      // accessToken: app.access_token,
      recipient: this.data.userName,
      // area: this.data.region.join(","),
      province: this.data.region[0],
      city: this.data.region[1],
      area: this.data.region[2],
      tel: this.data.phoneNumber,
      address: this.data.addressInfo,
      
      status: (this.data.moaddress ? 1 : 0)

    }


    //编辑
    if (this.data.options.id) {
      obj.id = this.data.options.id
      console.log(obj)
      app.post(app.config.baseApi + 'frontend/address/update',obj, app ,res => {
        if(res.data.code == 0) {
          wx.showToast({
            title: '编辑成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              // 修改上一页内容
              var pages = getCurrentPages();
              if (pages.length > 1) {
                var prePage = pages[pages.length - 2];
                prePage.changeData()
              }
              setTimeout(function () {
                wx.navigateBack();
              }, 2000)
            }
          })
        } else {
          wx.showToast({
            title: '编辑失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              // 修改上一页内容
              var pages = getCurrentPages();
              if (pages.length > 1) {
                var prePage = pages[pages.length - 2];
                prePage.changeData()
              }
              setTimeout(function () {
                wx.navigateBack();
              }, 2000)
            }
          })
        }
      })
      // return
      // app.post(URL + "applet/user/update-address?accessToken=" + app.access_token, obj).then(res => {
      //   if (res.data.code == "0") {
      //     wx.showToast({
      //       title: '添加成功',
      //       icon: 'success',
      //       duration: 2000,
      //       success: function () {
      //         // 修改上一页内容
      //         var pages = getCurrentPages();
      //         if (pages.length > 1) {
      //           var prePage = pages[pages.length - 2];
      //           prePage.changeData()
      //         }  
      //         setTimeout(function () {
      //           wx.navigateBack();
      //         }, 2000)
      //       }
      //     })
      //   } else {
      //     wx.showToast({
      //       title: '添加失败',
      //       icon: 'none',
      //       duration: 2000,
      //       success: function () {
      //         // 修改上一页内容
      //         var pages = getCurrentPages();
      //         if (pages.length > 1) {
      //           var prePage = pages[pages.length - 2];
      //           prePage.changeData()
      //         }  
      //         setTimeout(function () {
      //           wx.navigateBack();                
      //         }, 2000)
      //       }
      //     })
      //   }


      // })

    } else {
      // 添加收货地址
      app.post(URL + 'frontend/address/add', obj, app, res => {
        if (res.data.code == "0") {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              // 修改上一页内容
              var pages = getCurrentPages();
              if (pages.length > 1) {
                var prePage = pages[pages.length - 2];
                prePage.changeData() // changgedata是addressManage的获取地址列表的方法
              }
              setTimeout(function () {
                wx.navigateBack();
              }, 2000)
            }
          })
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/orderDetail/orderDetail'
                })
              }, 2000)
            }
          })
        }
      })
      // app.post(URL + 'frontend/address/add', obj, app, res => {
      //   if (res.code == "0") {
      //     wx.showToast({
      //       title: '添加成功',
      //       icon: 'success',
      //       duration: 2000,
      //       success: function () {
      //         // 修改上一页内容
      //         var pages = getCurrentPages();
      //         if (pages.length > 1) {
      //           var prePage = pages[pages.length - 2];
      //           prePage.changeData()
      //         }
      //         setTimeout(function () {
      //           wx.navigateBack();
      //         }, 2000)
      //       }
      //     })
      //   } else {
      //     wx.showToast({
      //       title: '添加失败',
      //       icon: 'none',
      //       duration: 2000,
      //       success: function () {
      //         setTimeout(function () {
      //           wx.redirectTo({
      //             url: '/pages/orderDetail/orderDetail'
      //           })
      //         }, 2000)
      //       }
      //     })
      //   }
      // })
      // app.post(URL + "frontend/address/add" , obj).then(res => {
      //   if (res.code == "0") {
      //     wx.showToast({
      //       title: '添加成功',
      //       icon: 'success',
      //       duration: 2000,
      //       success: function () {
      //         // 修改上一页内容
      //         var pages = getCurrentPages();
      //         if (pages.length > 1) {
      //           var prePage = pages[pages.length - 2];
      //           prePage.changeData()
      //         }  
      //         setTimeout(function () {
      //           wx.navigateBack();                
      //         }, 2000)
      //       }
      //     })
      //   } else {
      //     wx.showToast({
      //       title: '添加失败',
      //       icon: 'none',
      //       duration: 2000,
      //       success: function () {
      //         setTimeout(function () {
      //           wx.redirectTo({
      //             url: '/pages/buy/buy'
      //           })
      //         }, 2000)
      //       }
      //     })
      //   }


      // })

    }


  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  changeMo: function () {
    this.data.moaddress = !this.data.moaddress;
    console.log(this.data.moaddress)
  }

})
