var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {

  },
  onLoad: function (options) {

  },
  seeMore() { 
    app.href('/redPackets/pages/allCrowdHB/allCrowdHB')
  },
  // 跳转到首页
  toFirst(){
    app.href("/pages/discoverProject/discoverProject")
  },
  //发红包
  sendHB(){
    app.href("/redPackets/pages/publishHB/publishHB")
  },
  //转发到更多群
  sendMoreGroup(){

  },
  //加他为好友
  addPerson(){},
  //看看Ta的投资名片
  sendMoreGroup(){
    
  }

})