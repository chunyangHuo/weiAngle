// pages/organization/org_detail/org_detail.js
let rqj = require('../../Template/Template.js');
let wxCharts = require('../../../utils/importServer/wxcharts.js');
let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../utils/shareModel';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let that = this;
    app.allPoint(that, 0);
    this.orgDetail();
  },
  //展开收起
  allPoint1(){
    var that=this;
    app.allPoint(that,1);
  },
  orgDetail(){
    var that=this;
   
    wx.request({
      url: url_common + '/api/investment/info',
      data: {
        
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        let orgDetail=res.data.data;
        let info = res.data.data.info;
        let investment_events = res.data.data.investment_events;
        that.setData({
          info:info,
          investment_events: investment_events
        })
        wx.setNavigationBarTitle({
          title: info.investment_name
        })
        if (info.investment_introduce.length>88){
          that.setData({
            longMore: true
          })
        }else{
          that.setData({
            longMore: false
          })
        }
  
      }
    })
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