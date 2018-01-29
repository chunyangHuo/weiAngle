 let app = getApp();
 let RP = require('../../../utils/model/redPackets.js')
 let rp = new RP.redPackets();
 var url = app.globalData.url;
 var url_common = app.globalData.url_common;
Page({
  data: {
    nonet:true
  },
  onLoad(){
    app.loginPage(user_id => {
      this.publishHB(user_id,1,0.01,'hello class')
    })
  },
  // 发布红包
  publishHB(user_id, number, money, title){
    rp.publishHB.call(this,user_id,number,money,title)
  }
})