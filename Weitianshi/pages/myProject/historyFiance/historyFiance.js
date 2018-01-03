let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../utils/shareModel';
Page({
  data: {

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
        // 融资信息
        let pro_history_financeList = project.pro_history_finance;
        pro_history_financeList.forEach((x, index) => {
          pro_history_financeList[index].finance_time = app.changeTimeStyle1(x.finance_time);
          pro_history_financeList[index].pro_finance_scale = x.pro_finance_scale;
          pro_history_financeList[index].pro_finance_investor = x.pro_finance_investor;
          pro_history_financeList[index].belongs_to_stage.stage_name = x.belongs_to_stage.stage_name;

        })
        that.setData({
          pro_history_financeList: pro_history_financeList,//显示在详情的数据
        })
    
      },
    })
  },
 

 
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },



});