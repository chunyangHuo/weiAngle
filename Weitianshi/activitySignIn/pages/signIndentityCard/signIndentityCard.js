// pages/activity_detailPreview/activity_detailPreview.js
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    apply_id: '',
    activity_id: '',
    activity: '',
    userInfo: ''
  },
  onLoad(options) {
    let apply_id = options.apply_id;
    let activity_id = options.activity_id;
    this.setData({
      apply_id: apply_id,
      activity_id: activity_id
    })
    app.loginPage(user_id => {
      this.getActivityDetail(apply_id, activity_id,user_id);
    })
  },
  // 获取项目详情和用户信息
  getActivityDetail(apply_id, activity_id,user_id) {
    app.httpPost({
      url: url_common + '/api/activity/getActivityEntrance',
      data: {
        activity_id: activity_id,
        apply_id: apply_id,
        open_session: app.globalData.open_session
      }
    }, this).then(res => {
      console.log(res.data.data.activity);
      console.log(res.data.data.user);
      this.setData({
        activity: res.data.data.activity,
        userInfo: res.data.data.user
      })
      this.getSignForm(activity_id,user_id)
    }).catch(res => {
      app.errorHide(this, res.data.error_msg);
    })
  },
  // 获取签到名单
  getSignForm(activity_id, user_id) {
    app.httpPost({
      url: url_common + '/api/activity/getSignApply',
      data: {
        activity_id: activity_id,
        user_id: user_id || 0
      }
    }, this).then(res => {
      console.log(res);
    })
  },
  //跳转到活动议程页面
  goToActivityAgenda(){
    app.href('/activitySignIn/pages/activityAgenda/activityAgenda');
  },
  //跳转微天使首页
  goToIndex(){
    app.href('/pages/discoverProject/discoverProject');
  }
})