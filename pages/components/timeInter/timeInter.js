// components/component-tag-name.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    countDownTime:{
      type: Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    minutes: '00',
    seconds: '00',
    animationData: {},
    rotateIndex:0,
    // timer: ''
  },
  pageLifetimes: {
    show: function () {
      this.timer = setInterval(_ => {
        this.countDown(app.timing)
      }, 1000)
      // 旋转动画
      var animation = wx.createAnimation({
        duration: 16,
        timingFunction: 'step-start',
        delay: 0
      })
      this.animation = animation
      this.myRotate()
    },
    hide: function() {
      app.lock = true
      clearInterval(this.timer)
      clearInterval(this.timer_animation)
    }
  },
  attached: function() {
  },
  ready: function () {
    console.log('ready')
  },
  moves: function () {
    console.log('moved')
  },
  detached: function () {
    clearInterval(this.timer)
    clearInterval(this.timer_animation)
    this.setData({
      minutes: '00',
      seconds: '00'
    })
    app.lock = true
  },
  ready: function() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    myRotate: function () {
      this.timer_animation = setInterval(function () {
        this.animation.rotateZ(6 * (++this.data.rotateIndex)).step()
        this.setData({
          animationData: this.animation.export()
        })
      }.bind(this), 1000)
    },
    lockMall: function() {
      var lockDetail = {}
      var lockOption = {}
      // 触发父组件的 锁定商城事件 
      this.triggerEvent('lockMall', lockDetail, lockOption)
    },
    countDown (alltime) {
     
      if(alltime >= 0) {
        var minutes = Math.floor(alltime /60)
        var seconds = Math.floor(alltime % 60)
        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds
        this.setData({
          minutes: minutes,
          seconds: seconds
        })
        --alltime;
        app.timing = alltime
      } else {
        this.lockMall()
        clearInterval(this.timer)
        clearInterval(this.timer_animation)
      }
    }
  }
})
