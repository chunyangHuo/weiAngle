var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    bg_hongbao2: app.globalData.picUrl.bg_hongbao2,
  },
  onLoad: function (options) {

  },
  // 跳转到群详情
  redDetail(){
    app.href('/redPackets/pages/crowdDetail/crowdDetail')
  },
  seeMore() { 
    app.href('/redPackets/pages/allCrowdHB/allCrowdHB')
  },
  // 跳转到首页
  toFirst() {
    app.href("/pages/discoverProject/discoverProject")
  },
  //发红包
  sendHB() {
    app.href("/redPackets/pages/publishHB/publishHB")
  },
  //转发到更多群
  sendMoreGroup() {

  },
  //加他为好友
  addPerson() { 
    
  },
  //看看Ta的投资名片
  sendMoreGroup() {

  }

})