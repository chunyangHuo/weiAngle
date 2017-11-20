// pages/projectScale/projectEvaluation.js
var rqj = require('../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as ShareModel from '../../utils/shareModel';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sliderValue: 6,
    leaveMessage: '',
    title: '智慧赛事',
    totalNum1: '0',
    score: {
     
    },
    score_list: [{
      title: '核心竞争力：20分',
      introduce: "这里是一文案，具体的是他们写的，写了些啥我"
    }, {
      title: '团队素质：20分',
      introduce: "这里是一文案，具体的是这里是一文案，具体的是他们写的他们写的，写了些啥我"
    }, {
      title: '商业前景：30分',
      introduce: "这里是一文案"
    }, {
      title: '财务管理：15分',
      introduce: "这里是一文案，具具体的是他们写的，写了写了些啥我"
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取内容
  content() {
    wx.request({
      url: url_common + '/api/project/scoreView',
      method: "POST",
      data: {
        user_id: "bpjqNzDW",
        project_id: "7r7gOvry",
        competition_id: 1,
      },
      success: function (res) {
        console.log(res);
      }
    })
  },
  // 滑块滑动
  sliderchange(e) {
    let that = this;
    that.setData({
      sliderValue: e.detail.value
    })
    console.log(this.data.sliderValue);
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
    for(let i=0;i<5;i++){
     score[i]=0;
    }
    that.setData({
      score: score
    })

    let id = e.currentTarget.dataset.id;
    // score[id]=e.currentTarget.dataset.id;
    let totalNum1 = that.data.totalNum1;
  
    for (var index in score){
      totalNum1 += score[index];
    }
    that.setData({
      totalNum1: totalNum1
    })
    console.log(that.data.totalNum1);

    // this.data.totalNum1 = parseFloat(this.data.score_list[0].value) + parseFloat(this.data.score_list[1].value) + parseFloat(this.data.score_list[2].value) +parseFloat(this.data.score_list[3].value);



  },
  submit: function () {
    let that = this;
    wx.request({
      url: url_common + '/api/project/saveScore',
      method: "POST",
      data: {
        user_id: "bpjqNzDW",
        project_id: "7r7gOvry",
        competition_id: 1,
        invest_score: this.data.sliderValue,
        remark: this.data.leaveMessage,
        score_list: []
      },
      success: function (res) {

      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.content();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})