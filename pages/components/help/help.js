// components/component-tag-name.js
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
    
  },
  pageLifetimes: {
    show: function () {
    },
    hide: function () {
    }
  },
  attached: function () {
  },
  ready: function () {
    
  },
  moves: function () {
    
  },
  detached: function () {
    
  },
  ready: function () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
   goHelp: function () {
    //  type 1 自己点按钮进入
    wx.navigateTo({
      url: '/pages/sharingPoints/sharingPoints?type=1',
    })
   }
  }
})
