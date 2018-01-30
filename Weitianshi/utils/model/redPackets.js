let app = getApp();
let _this = this;
let url_common = app.globalData.url_common
let url_publishHB = url_common + '/api/payment/unifyOrder'
let url_publishedHB = url_common + '/api/payment/getUserRedPacket'
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
  publishHB(user_id, number, money, title, cb1, cb2) {
    return app.httpPost({
      url: url_publishHB,
      data: {
        user_id: user_id,
        number: number,
        money: money,
        title: title
      }
    }, this).then(res => {
      if (cb1 && cb1 != null) {
        cb1()
      } else {
        if (cb2) {
          cb2()
        } else {
          let that = this;
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            complete: function (response) {
              if (response.errMsg == 'requestPayment:ok') {
                app.href('/redPackets/pages/publishedHB/publishedHB');
              } else {
                app.errorHide(that, response.errMsg);
              }
            }
          })
        }
      }
    })
  }

  // 已发布红包的列表
  publishedHBList(user_id) {
    return app.httpPost({
      url: url_publishedHB,
      data: {
        user_id: user_id
      }
    }, this).then(res => {
      wx.hideLoading();
      console.log(res.data.data)
      this.setData({
        HBInfo: res.data.data
      })
    });
  }

  // 更多群红包信息
  otherGroupHB(openGId,cb) {
    let user_id = '8W1ERo3W';
    if (!user_id) {
      app.loginPage(user_id => {
        _this.otherGroupHB(openGId)
      })
      return;
    }
    app.httpPost({
      url: url_common + '/api/payment/getMoreGroup',
      data: {
        user_id,
        openGId
      }
    }, this).then(res => {
      cb()
    })
  }

  // 具体某个群里的红包
  groupInsideHB(openGId,cb) {
    let user_id = wx.getStorageInfoSync('user_id');
    app.httpPost({
      url: url_common + '/api/payment/getMoreGroupPacket',
      data:{
        user_id,openGId
      }
    },this).then(res=>{
      cb()
    })
  }
}