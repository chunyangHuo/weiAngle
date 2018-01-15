let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../utils/shareModel';
Page({
  data: {
    nonet: true
  },
  onLoad: function (options) {
    this.setData({
      index: options.index,
      id: options.project_id,
      currentTab: options.currentTab,
      shareType: options.type
    });
    console.log('pro_id', this.data.id);
  },
  onShow: function () {
    //  投资人数据
    let that = this;
    let id = this.data.id;
    that.projectDetailInfo();
  },

  // 
  //项目详情信息
  projectDetailInfo() {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/project/getProjectDetail',
      data: {
        user_id: user_id,
        project_id: this.data.id
      },
      method: 'POST',
      success: function (res) {
        console.log('projectDetail', res)
        let project = res.data.data;
        that.setData({
          project: project,

        });
        // 核心团队
        if (project.core_users != 0) {
          let core_memberArray = project.core_users;//
          core_memberArray.forEach((x, index) => {
            core_memberArray[index] = x;
          })
          that.setData({
            core_memberArray: core_memberArray,
          })
        }

      },
    })
  },



  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  // 重新加载
  refresh() {
    let timer = '';
    wx.showLoading({
      title: 'loading',
      mask: true
    });
    timer = setTimeout(x => {
      wx.hideLoading();
      this.onShow();
    }, 1500)
  }


});