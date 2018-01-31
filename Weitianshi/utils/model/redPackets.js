let app = getApp();
let _this = this;
let url_common = app.globalData.url_common
let url_publishHB = url_common + '/api/payment/unifyOrder'
let url_publishedHB = url_common + '/api/payment/getUserRedPacket'
export class redPackets {
  constructor() { }

  name() {

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
      let unique_id = res.data.data.packet_unique_id;
      let prepay_id = res.data.data.prepay_id;
      if (cb1 && cb1 != null) {
        cb1(unique_id, prepay_id)
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
                app.formIdSubmit(prepay_id);
                app.href('/redPackets/pages/publishedHB/publishedHB?unique_id=' + unique_id);
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
  otherGroupHB(openGId) {
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
      this.setData({
        groupInfo: res.data.data
      })
    })
  }

  // 具体某个群里的红包
  groupInsideHB(openGId) {
    let user_id = '8W1ERo3W';
    app.httpPost({
      url: url_common + '/api/payment/getMoreGroupPacket',
      data: {
        user_id, openGId
      }
    }, this).then(res => {
      console.log(res)
      this.setData({
        insideHB : res.data.data,
        flag: res.data.flag
      })
    })
  }

  // 红包领取记录
  getHBRecord() {
    let user_id = '8W1ERo3W';
    let unique_id = "60942418540858321814246979"
    app.httpPost({
      url: url_common + '/api/payment/getDrawedRecord',
      data: {
        user_id, unique_id
      }
    }, this).then(res => {
      this.setData({
        whoGet: res.data.data
      })
    })
  }

  // 平台红包统计
  recordHB() {
    let user_id = "8W1ERo3W"
    app.httpPost({
      url: url_common + '/api/payment/getPacketStatistic',
      data: {
        user_id
      }
    }, this).then(res => {
      this.setData({
        recordHB: res.data.data
      })
    })
  }

  // 发布红包的用户相关信息
  pushHBPerson(unique_id, cb) {
    let user_id = wx.getStorageSync('user_id');
    app.httpPost({
      url: url_common + '/api/payment/getPacketUser',
      data: {
        user_id, unique_id
      }
    }, this).then(res => {
      app.log('发红包者和红包信息', res)
      this.setData({
        personInfo: res.data.data,
      });
      if (cb) cb(res);
    })
  }

  // 开红包动作
  openHB(unique_id) {
    let user_id = wx.getStorageSync('user_id');
    if (!unique_id) return app.errorHide(this, 'unique_id不存在');
    app.httpPost({
      url: url_common + '/api/payment/toBalance',
      data: {
        user_id,
        packet_unique_id: unique_id
      }
    }, this).then(res => {
      console.log(res);
      let bounce_money = res.data.data.bounce_money;
      this.setData({
        show: false,
        bounce_money
      });
    })

  }
}