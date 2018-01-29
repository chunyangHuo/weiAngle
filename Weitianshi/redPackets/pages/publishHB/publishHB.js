let app = getApp();
let RP = require('../../../utils/model/redPackets.js')
let url = app.globalData.url;
let url_common = app.globalData.url_common;
let rp = new RP.redPackets();
Page({
  data: {
    imgUrls: app.globalData.picUrl.bg_hongbao,
    imgUrls2: app.globalData.picUrl.shengcheng,
    nonet: true
  },
  onLoad() {
    let rp = new RP.redPackets();
    console.log(rp)
    app.loginPage(user_id => {

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
  // 发布红包
  formSubmit(e) {
    let user_id = wx.getStorageInfoSync('user_id');
    app.httpPost({
      url: url_common +'/api/wx/saveFormId',
      data:{
        open_session: app.globalData.open_session,
        form_id: e.detail.formId
      }
    },this).then(res =>{
      console.log(res)
    })
    
    rp.publishHB.call(this, user_id, number, money, title)
  },
})