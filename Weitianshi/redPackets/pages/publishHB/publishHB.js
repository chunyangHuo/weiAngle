let app = getApp();
let RP = require('../../../utils/model/redPackets.js')
let url = app.globalData.url;
let url_common = app.globalData.url_common;
let rp = new RP.redPackets();
Page({
  data: {
    imgUrls: app.globalData.picUrl.bg_hongbao,
    imgUrls2: app.globalData.picUrl.shengcheng,
    nonet: true,
    number: 0,
    money: 0,
    title : ""
  },
  onLoad() {
    app.loginPage(user_id => {
      rp.recordHB.call(this)
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  redBagName(e) {
    let bagName = e.detail.value;
    this.setData({
      title: bagName
    })
  },
  redBagMoney(e) {
    let bagMoney = e.detail.value;
    this.setData({
      money: bagMoney
    })
    // clearTimeout(A)
    // let A = setTimeout(x => {
    //   this.getAll(bagMoney);
    // }, 1000);
  },
  redBagNum(e) {
    let that = this;
    let bagNum = e.detail.value;
    let regNum = /^[+]{0,1}(\d+)$/;
    if (!regNum.test(bagNum)) {
      app.errorHide(that, "需要是整数哦", 1500);
    } else {
      this.setData({
        number: bagNum
      })
    }
  },
  // 发布红包
  createRedBag(e) {
    let  that = this;
    let user_id = wx.getStorageSync('user_id');
    let number = this.data.number;
    let money = this.data.money;
    let title = this.data.title;
    app.formIdSubmit(e);
    if (title == ''){
      app.errorHide(that, "请填写标题", 1500);
    } else if (money == 0){
      app.errorHide(that, "请输入金额", 1500);
    }else if(number == 0){
      app.errorHide(that, "请输入红包个数", 1500);
    }else if(money/number >= 1){
      rp.publishHB.call(this, user_id, number, money, title)
    }
  },
  //获取全部文字
  getAll(bagMoney) {
    let  that = this;
    let moneyReg = /^[1-9]+(.[0-9]{0,2})?$/
    if (!moneyReg.test(bagMoney)) {
      app.errorHide(that, "需要大于1元", 1500);
    } else {
      this.setData({
        money: bagMoney
      })
    }
  }
})