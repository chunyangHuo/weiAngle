let app = getApp();
let url_common = app.globalData.url_common
let url_publishHB = url_common + '/api/payment/unifyOrder'

export class redPackets {
  constructor() { }
  name() {
    console.log(1)
  }

  // 获取用户信息
  getUserInfo() {
    return app.httpPost({
      url: app.globalData.common_url + ''
    }, this).then(res => {
      console.log(res)
    })
  }

  // 发布红包
  publishHB(user_id, number, money, title,cb1,cb2) {
    return app.httpPost({
      url: url_publishHB,
      data: {
        user_id: user_id,
        number: number,
        money: money,
        title: title
      }
    },this).then(res => {
      if(cb1 && cb1 != null){
        cb1()
      }else{
        if(cb2){
          cb2()
        }else{
          let that = this;
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            complete: function (response) {
              if (response.errMsg =='requestPayment:ok'){
                app.href('/redPackets/pages/publishedHB/publishedHB');
              }else{
                app.errorHide(that,response.errMsg);
              }
            }
          })
        }
      }
    })
  }
}