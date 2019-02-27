const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 判断登录
const doLogin = key => {
  const uid = wx.getStorageSync(key)
  if(uid == '' ||uid == null ||uid == undefined) {
      // 未登录
      return false
  } else {
    return true
  }
}
const urlFormat = sear => {
  if(sear == undefined) return ;
  var str = sear.split('?')[1]
  var str1 = str.split('&') // [a=1, n=2]
  let jsonList = {}
  str1.map(v => {
    jsonList[v.split('=')[0]] = v.split('=')[1]
  })
  return jsonList
}
const visitLogs = app => {
  app.post(app.config.baseApi + 'frontend/visitLog/addVisitLog', {}, app, res => {
    return false
  })
}
module.exports = {
  formatTime: formatTime,
  urlFormat: urlFormat,
  doLogin: doLogin,
  visitLogs: visitLogs
}
