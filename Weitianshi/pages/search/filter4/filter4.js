var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
var rqj = require('../../Template/Template.js');
Page({
    data: {
        industryData: [],
        industryId: [],
        industryName: [],
        stageData: [],
        stageId: [],
        stageName: [],
        industryTags: {
            tagsData: "",
            bindEvent: "industryChoose"
        },
        stageTags: {
            tagsData: "",
            bindEvent: "stageChoose"
        },
    },

    onLoad: function (options) {
        var that = this;
        var options = options;

        //设置模版数据
        var industryTags = this.data.industryTags;
        var stageTags = this.data.stageTags;
        industryTags.tagsData = wx.getStorageSync("contactsIndustry") || wx.getStorageSync('industry');
        stageTags.tagsData = wx.getStorageSync("contactsStage") || wx.getStorageSync('stage');

        that.setData({
            industryTags: industryTags,
            stageTags: stageTags,
        })

    },

    //领域选择
    industryChoose(e) {
        let tags = this.data.industryTags;
        let that = this;
        let checkObject = app.tagsCheck(that, e, tags, 'industryTags')
        this.setData({
            contactsFilter1:checkObject
        })
    },

    //轮次选择
    stageChoose(e) {
        let tags = this.data.stageTags;
        let that = this;
        let checkObject = app.tagsCheck(that, e, tags, 'stageTags')
        this.setData({
            contactsFilter2: checkObject
        })
    },

    //重置
    reset() {
        let industryTags = this.data.industryTags;
        let stageTags = this.data.stageTags;
        let industryData = industryTags.tagsData;
        let stageData = stageTags.tagsData;
        industryData.forEach((x) => {
            x.check = false
        });
        stageData.forEach((x) => {
            x.check = false
        })
        this.setData({
            industryTags: industryTags,
            stageTags: stageTags
        })
        wx.setStorageSync("industryFilter",'');
        wx.setStorageSync("stageFilter",'');
    },

    //确定
    certain(){
      var that = this;
      var user_id = this.data.user_id;
        //将有标记的领域和轮次对象存入缓存
        wx.setStorageSync("contactsIndustry", this.data.industryTags.tagsData);
        wx.setStorageSync("contactsStage", this.data.stageTags.tagsData);
        var industryFilter = [];
        var stageFilter =[];
        this.data.industryTags.tagsData.forEach((x) => {
          if (x.check == true) {
            industryFilter.push(x.industry_id)
          }
        })
        this.data.stageTags.tagsData.forEach((x) => {
          if (x.check == true) {
            stageFilter.push(x.stage_id)
          }
        })
        //将选中的领域和轮次的id存入缓存
        wx.setStorageSync('industryFilter', industryFilter);
        wx.setStorageSync('stageFilter', stageFilter);
        wx.switchTab({
          url: '/pages/discoverInvest/discoverInvest',
        })
    },

    // 开启了下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },
})