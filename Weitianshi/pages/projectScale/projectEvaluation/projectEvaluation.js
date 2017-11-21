// pages/projectScale/projectEvaluation.js
var rqj = require('../../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as ShareModel from '../../../utils/shareModel';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slivalue: 6,
    sliderValue: 6,
    leaveMessage: '',
    title: '智慧赛事',
    totalNum1: '--',
    // totalNum2: '',//中间相加值
    score: [],
    investScore: 6,
    score_list: [],
    score_list1: [],
  },

  /**
   * 生命周期函数--监听页面加载user_id=OrwRjRjp&project_id=90knK6r4
   */
  onLoad: function (options) {
    // let that=this;
    this.setData({
      project_id: options.project_id,
      user_id: options.user_id,
      competition_id: options.competition_id
    });
    console.log(options, this.data.user_id, this.data.competition_id);
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    let that = this;
    this.content();
    // let totalNum1 = Number(that.data.totalNum1);
    // totalNum1 = 0 + parseInt(that.data.sliderValue);
    // that.setData({
    //   totalNum1: totalNum1
    // })

  },
  // 获取内容
  content() {
    let that = this;
    wx.request({
      url: url_common + '/api/project/scoreView',
      method: "POST",
      data: {
        user_id: that.data.user_id,
        project_id: that.data.project_id,
        competition_id: that.data.competition_id,
        // user_id: 'bpjqN9DW',
        // project_id: 'mr9R4m09',
        // competition_id: 8,
      },
      success: function (res) {
        console.log(res);
        let score_list1 = res.data.data.list;
        let competition_name = res.data.data.competition_name;
        that.setData({
          score_list1: score_list1,
          competition_name: competition_name
        })
      }
    })
  },
  // 滑块滑动
  sliderchange(e) {
    let that = this;
    // that.data.sliderValue = 0;
    that.setData({
      sliderValue: e.detail.value
    })
    // let totalNum1 = 0;
    // totalNum1 = that.data.totalNum2 + parseInt(that.data.sliderValue);
    // that.setData({
    //   totalNum1: parseFloat(totalNum1)
    // })
  },
  // 描述
  leaveMessage: function (e) {
    let leaveMessage = e.detail.value;
    let leaveMessage_length = e.detail.value.length;
    let that = this;
    if (leaveMessage_length <= 500) {
      this.setData({
        leaveMessage: leaveMessage
      })
    } else {
      app.errorHide(that, "不能超过500个数字", 1000)
    }
  },
  // 相加取值
  totalNum: function (e) {
    let that = this;
    let score = that.data.score;
    let score_list = that.data.score_list;
    // 初始值设置为0
    for (let i = 0; i < that.data.score_list1.length; i++) {
      score[i] = score[i] ? score[i] : '';
    }
    // console.log(that.data.score);
    let id = e.currentTarget.dataset.id;
    score[id] = e.detail.value;
    let totalNum1 = 0;
    for (let i = 0; i < score.length; i++) {
      if (score[i] != '') {
        totalNum1 += parseInt(score[i]);
      } 
      // if(score[i]==''){
      //   score[i]=0;
      //   totalNum1 += parseFloat(score[i])
      // }
  
    }

    if (totalNum1 == 0 ) {
      totalNum1 = '--';
    }
    that.setData({
      // totalNum2: parseFloat(totalNum1),
      score: score,
      // totalNum1: parseFloat(totalNum1) + that.data.sliderValue,
      totalNum1: totalNum1
    })
    // console.log(that.data.score_list);
    console.log(that.data.score, that.data.totalNum1);
  },
  submit: function () {
    let that = this;
    let score = that.data.score;
    let score_list = that.data.score_list;
    let score_list1 = that.data.score_list1;
    let jsonArry = [];
    for (let i = 0; i < score.length; i++) {
     
      if (score[i] == '') {
        score[i] = 0;
      }
      if (score[i]==''){
        app.errorHide(that, "请打分", 1500);
        that.setData({
          score_list: []
        })
        return
      }
      else if (score[i] > score_list1[i].index_score) {
        app.errorHide(that, "请输入的值小于最大值", 1500);
        that.setData({
          score_list: []
        })
        return

      } else if (that.data.leaveMessage.length > 500) {
        app.errorHide(that, "不能超过500个数字", 1000)
        return
      }else{
        jsonArry.push([score[i], score_list1[i].index_id]);
        score_list.push({
          index_score: jsonArry[i][0],
          index_id: jsonArry[i][1]
        })
      }  
    }
    that.setData({
      score_list: score_list
    })
    if (that.data.score_list.length==0){
      app.errorHide(that, "请打分", 1500);
      return
    }
    wx.request({
      url: url_common + '/api/project/saveScore',
      method: "POST",
      data: {
        user_id: that.data.user_id,
        project_id: that.data.project_id,
        competition_id: that.data.competition_id,
        invest_score: that.data.sliderValue,
        remark: that.data.leaveMessage,
        score_list: that.data.score_list
      },
      success: function (res) {
        app.errorHide(that, "提交成功", 3000)
        wx.navigateBack({
          delta: 1 // 回退前 delta(默认为1) 页面
        })
      },
      fail: function () {
        app.errorHide(that, "提交失败", 3000)
      }
    })
  },

})