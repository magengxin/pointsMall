Component({
  properties: {
    // 接受父组件的值
    context: {
      type: Object
    }
  },
  // 初始数据
  data: {
  },
  attached: function () {
  },
  methods: {
    preventScroll: function () {
      return false
    },
    // methods可以触发绑定在子组件上的事件 从而触发父组件的事件，实现子传父的传值需求
    closeMask: function () {
      var closeMaskDetail = {}
      var closeMaskOption = {
        bubbles: false, // 是否冒泡
        composed: false, // 是都可穿越组件边界，不进入其他组件内部
        capturePhase: false // 是都冒泡
      }
      this.triggerEvent('closeMask', closeMaskDetail,closeMaskOption)
    }
  }
})