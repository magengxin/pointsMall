// pages/components/comment/comment.js

//用户评论模板
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    recommendComments: [],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 800,
  },

  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.fetchRecommentComments()
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  pageLifetimes: {
    show() {
      // 页面被展示
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 推荐评论
    fetchRecommentComments() {
      app.post(app.config.baseApi + 'frontend/comments/lstByRecommend', {}, app, res => {
        if (res.data.code == 0) {
          res.data.result.map(v => {
            let tmpImgArr = []
            v.imgs = v.imgs.split(',')
            // v.content =v.content.slice(0,30)
          })
          this.setData({
            recommendComments: res.data.result
          })
        } else {
          wx.showToast({
            title: 'network error',
          })
        }
      })
    },

  }
})
