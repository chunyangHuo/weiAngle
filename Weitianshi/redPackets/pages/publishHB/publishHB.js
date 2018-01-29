let app = getApp();
let RP = require('../../../utils/model/redPackets.js')
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    imgUrls: app.globalData.picUrl.bg_hongbao,
    imgUrls2: app.globalData.picUrl.shengcheng
  },
  onLoad() {
    let rp = new RP.redPackets();
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
  },
  redBagMoney(e) {
    let bagMoney = e.detail.value;
  },
  redBagNum(e) {
    let bagNum = e.detail.value;
  },
  createRedBag() {
    console.log(55)
  },

})