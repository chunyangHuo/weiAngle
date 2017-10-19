let app=getApp();
Page({
  data: {
    activtyPagePic:app.globalData.picUrl.banner_jump1
  },
  onLoad(options){
    let index=options.index;//入口banner
    let str='banner_jump'+index;
    console.log(app.globalData.picUrl[str])
    this.setData({
      activtyPagePic: app.globalData.picUrl[str]
    })
  }
})