let app = getApp();
let url_common = app.globalData.url_common;
Page({
  data: {
    demo: [
      {
        name: '名称',
        value: '第一届中国微天使节和第二十届中国BD岁末嘉年华（杭州场）开始报名！'
      },
      {
        name: '主办方',
        value: '浙江省杭州市西湖区文一西路588号中节能西溪首座B3-51信用卡-1楼'
      }
    ]
  },
  onLoad(options){
    app.loginPage(user_id=>{
      console.log(user_id);
    })
  },
  // 检测报名信息
  checkIndentity(){
    app.httpPost({
      url: url_common + '/api/activity/attendActivity',
      data: {
        activity_id : 1
      }
    },this).then(res=>{
      console.log(res);
    })
  },
})