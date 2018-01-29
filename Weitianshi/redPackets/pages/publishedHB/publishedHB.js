 let app = getApp();
 let RP = require('../../../utils/model/redPackets.js')
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