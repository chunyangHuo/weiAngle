let app = getApp();
let RP = require('../../../utils/model/redPackets.js')
let url = app.globalData.url;
let url_common = app.globalData.url_common;
let rp = new RP.redPackets();
Page({
  data: {
    imgUrls: app.globalData.picUrl.bg_hongbao,
    imgUrls2: app.globalData.picUrl.shengcheng,
    nonet:true
  },
  onLoad() {
    console.log(rp)
    app.loginPage(user_id => {

    })
  },
  formSubmit(e) {     
    this.setData({
      formId: e.detail.formId
    })
  },

  redBagName(e) {
    let bagName = e.detail.value;
    console.log(bagName.length)
    this.setData({
      title : bagName
    })
  },
  redBagMoney(e) {
    let bagMoney = e.detail.value;
    setTimeout(x => {
      this.getAll(bagMoney);
    }, 1000);
    // if(!moneyReg.test(bagMoney)){
    //   // app.errorHide(that, "大于1元", 1500);
    // }else{
    //   this.setData({
    //     money: bagMoney
    //   })
    // }
   
  },
  redBagNum(e) {
    let  that = this;
    let bagNum = e.detail.value;
    let regNum = /^[+]{0,1}(\d+)$/;
    if (!regNum.test(bagNum)){
      app.errorHide(that, "需要是整数哦", 1500);
    }else{
      this.setData({
        number: bagNum
      })
    }
  },
  // 发布红包
  createRedBag() {
    let user_id = wx.getStorageSync('user_id');
    let number = this.data.number;
    let money = this.data.money;
    let title = this.data.title;
   rp.publishHB.call(this,user_id,number,money,title)
  },
  //获取全部文字
  getAll(bagMoney){
    let moneyReg = /^[1-9]+(.[0-9]{1,2})?$/
    console.log(moneyReg.test(bagMoney))
  }
})