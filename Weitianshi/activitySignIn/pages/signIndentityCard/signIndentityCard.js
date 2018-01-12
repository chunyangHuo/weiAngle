// pages/activity_detailPreview/activity_detailPreview.js
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    userInfo: {
      userName: "这里是姓名",
      userCompany: '杭州投着乐网络科技有限公司',
      userMobile: '18756323698',
      userChat: 'weitianshiFA',
      userMail: '18563698569@qq.com',
      userCareer: '职位',
      userUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKRgaiadoTaI5qBu0qlmpdqkiaEc6YVVdziaJUib2iaIfCVkcSTWUeFSCvib4DQBEbJvPH4azWM1zpSEhXg/0'

    },
    activity: {
      name: "第一届中国微天使节和第二十届中国B…",
      time: '2017-12-12 14:00 ~ 2017 12-13 16:00',
      content: '浙江省杭州市西湖区文一西路588号中节能西溪首座2微天使乐投平台、智云社微天使乐投平台、智云社微...'
    }
  },
  onLoad(){
    app.loginPage(user_id => {
      this.getActivityDetail();
    })
  },
  getActivityDetail(){
    app.httpPost({
      url: url_common +'/api/activity/getActivityEntrance',
      data: {
        activity_id: 1,
        apply_id: "",
        open_session: app.globalData.open_session
      }
    },this).then(res => {
      console.log(res)
    })
  }
})