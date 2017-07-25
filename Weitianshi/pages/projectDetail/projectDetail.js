var rqj = require('../Template/Template.js')
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    firstName: "代",
    id: "",
    page: 0,
    aa: [],
    bpName: "",
    projectName: "",
    companyName: "",
    stock: 0,
    load: 0,
    isChecked: true,
    textBeyond1: false,//项目亮点的全部和收起是否显示标志
  },
  onLoad: function (options) {
    var that = this;
    var id = options.id;//当前被查看用户的项目id
    var index = options.index;
    var user_id = wx.getStorageSync('user_id');//获取我的user_id==view_id
    var page = this.data.page;
    var avatarUrl = wx.getStorageSync('avatarUrl');
    app.console(user_id, id)
    that.setData({
      index: index,
      id: id,
      user_id: user_id,
      avatarUrl: avatarUrl,
    });
    //项目详情(不包括投资人)
    wx.request({
      url: url_common + '/api/project/getProjectDetail',
      data: {
        user_id: user_id,
        project_id: this.data.id
      },
      method: 'POST',
      success: function (res) {
        app.console(res)
        var project = res.data.data;
        var user = res.data.user;
        app.console(user)
        var firstName = user.user_name.substr(0, 1) || '';
        var pro_industry = project.pro_industry;
        let industy_sort = [];
        let pro_goodness = project.pro_goodness;
        // 项目介绍的标签
        for (var i = 0; i < pro_industry.length; i++) {
          industy_sort.push(pro_industry[i].industry_name)
        }
        that.setData({
          industy_sort: industy_sort,

        })
        if (pro_goodness.length > 50) {
          that.setData({
            textBeyond1: true
          })
        }
        var followed_user_id = res.data.user.user_id
        // // 加載個人信息
        // wx.request({
        //   url: url + '/api/user/getUserAllInfo',
        //   data: {
        //     share_id: 0,
        //     user_id: followed_user_id,
        //     view_id: user_id,
        //   },
        //   method: 'POST',
        //   success: function (res) {
        //     app.console(res)
        //     var button_type = res.data.button_type;
        //     let userInfo = res.data.user_info;
        //     app.console(user_id)
        //     app.console(button_type)
        //     that.setData({
        //       button_type: button_type,
        //       userInfo: userInfo
        //     })
        //   }
        // })
        that.setData({
          project: project,
          user: user,
          firstName: firstName,
          pro_industry: pro_industry,
          followed_user_id: followed_user_id
        });

        var is_mine = res.data.data.is_mine;
        //app.console(is_mine)
        if (is_mine == true) {
          //请求投资人详情
          wx.request({
            url: url_common + '/api/project/getProjectMatchInvestors',
            data: {
              user_id: user_id,
              project_id: that.data.id,
              page: page
            },
            method: 'POST',
            success: function (res) {
              app.console(res)
              var investor2 = res.data.data;
              app.console(investor2)
              that.setData({
                investor2: investor2
              });
              setTimeout(function () {
                that.setData({
                  load: 0
                })
              }, 1500)
            },
            fail: function () {
            },
          })
        }
      },
    });

  },
  // 用户详情
  userDetail: function (e) {
    app.console(e);
    var id = e.currentTarget.dataset.id
    app.console(id)
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    // app.console("开启了下拉刷新")
    wx.stopPullDownRefresh()
  },
  //分享当前页面
  onShareAppMessage: function () {
    var pro_intro = this.data.project.pro_intro;
    app.console(pro_intro)
    return {
      title: pro_intro,
      path: '/pages/projectDetail/projectDetail?id=' + this.data.id
    }
    app.console(data.project.pro_intro);
  },
  // 项目详情中的显示全部
  allBrightPoint: function () {
    this.setData({
      isChecked: false
    })
  },
  noBrightPoint: function () {
    this.setData({
      isChecked: true
    })
  },
  // 去认证
  toAccreditation: function () {
    wx.navigateTo({
      url: '/pages/my/identity/indentity/indentity'
    })
  },
  // 申请查看
  applyProject: function () {
    let user_id = wx.getStorageSync('user_id');
    app.infoJump("/pages/projectDetail/projectDetail");
    wx.request({
      url: url_common + '/api/user/getUserGroupByStatus',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        // 0:未认证1:待审核 2 审核通过 3审核未通过
        let status = res.data.status;
        if (status == 0) {
          console.log(status)
          wx.showModal({
            title: '友情提示',
            content: '认证的投资人,买房FA才可申请查看项目',
            confirmText:"去认证",
            confirmColor:"#333333;",
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '/pages/my/identity/indentity/indentity'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (status == 1) {
          console.log(status)
          wx.showModal({
            title: '友情提示',
            content: '您的身份正在审核中,只有投资人和卖方FA才可申请查看项目',
            confirmColor: "#333333;",
            showCancel: false,
            success: function (res) {
              console.log('用户点击确定')
            }
          })
        } else if (status == 2) {
          console.log(status)
          wx.showToast({
            title: '已提交申请',
            icon: 'success',
            duration: 2000
          })
        } else if (status == 3) {
          console.log(status)
          wx.showModal({
            title: '友情提示',
            content: '您的身份未通过审核,只有投资人和卖方FA才可申请查看项目',
            confirmColor: "#333333;",
            confirmText: "重新认证",
            showCancel: false,
            success: function (res) {
              console.log('用户点击确定')
            }
          })
        }
      }
    })















    // wx.showModal({
    //   title: '友情提示',
    //   content: '您的身份是卖方FA,只有投资人和卖方FA才可申请查看项目',
    //   confirmColor: "#333333;",
    //   showCancel: false,
    //   success: function (res) {
    //     console.log('用户点击确定')
    //   }
    // })

  }
})