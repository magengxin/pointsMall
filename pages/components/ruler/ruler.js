Component({
  methods: {
    preventScroll() {
      return false
    },
    closeRuler() {
      console.log(1)
      var closeMaskDetail = {}
      var closeMaskOption = {
        bubbles: false, // 是否冒泡
        composed: false, // 是都可穿越组件边界，不进入其他组件内部
        capturePhase: false // 是都冒泡
      }
      this.triggerEvent('closeRulerMask', closeMaskDetail, closeMaskOption)
    }
  }
})
