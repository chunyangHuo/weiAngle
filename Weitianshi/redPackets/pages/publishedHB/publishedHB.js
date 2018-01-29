 let app = getApp();
 let RP = require('../../../utils/model/redPackets.js')
 var url = app.globalData.url;
 var url_common = app.globalData.url_common;
Page({
  data: {
  
  },
  onLoad(){
    let rp = new RP.redPackets();
    console.log(rp)
    app.loginPage(user_id => {
      
    })
  }
})