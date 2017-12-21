var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    imgUrls: app.globalData.picUrl.band_identity
  },

  onLoad: function (options) {
    let group_id = options.group_id;
    let user_id = wx.getStorageSync('user_id');
    let type = options.type;
    let recertification = options.recertification;
    let that = this;
    let authenticate_id = options.authenticate_id;
    wx.request({
      url: url_common + '/api/user/getUserGroupByStatus',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        // 0:未认证1:待审核 2 审核通过 3审核未通过
        let status = res.data.status;
        let group_title = res.data.group.group_title;
        let group_id = res.data.group.group_id;
        let authenticate_id = res.data.authenticate_id;
        that.setData({
          status: status,
          group_title: group_title,
          group_id: group_id,
          type: type,
          authenticate_id: authenticate_id
        })
      }
    })
    // }
  },

  onShow: function () {

  },
  // 留言
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
  // 点击确定返回原页面
  btnYes: function (options) {
    let leaveMessage = this.data.leaveMessage;
    let type = this.data.type;
    let user_id = wx.getStorageSync('user_id');
    let authenticate_id = this.data.authenticate_id;
    let recertification = this.data.recertification;
    wx.request({
      url: url_common + '/api/user/saveOtherAuthenticateFeed',
      data: {
        user_id: user_id,
        authenticate_id: authenticate_id,
        message_board: leaveMessage
      },
      method: 'POST',
      success: function (res) {
        let statusCode = res.data.status_code;
        if (statusCode == 2000000) {
          var pages = getCurrentPages()
          console.log(pages);
          var num = pages.length - 1;
          wx.navigateBack({
            delta: 3
          })
          
        } else {
        }
      }
    })
  },
  //重新认证页面点击返回
  reaccreditationYes: function () {
    let leaveMessage = this.data.leaveMessage;
    let type = this.data.type;
    let user_id = wx.getStorageSync('user_id');
    let authenticate_id = this.data.authenticate_id;
    var pages = getCurrentPages();
    var num = pages.length - 1;
    wx.request({
      url: url_common + '/api/user/saveOtherAuthenticateFeed',
      data: {
        user_id: user_id,
        authenticate_id: authenticate_id,
        message_board: leaveMessage
      },
      method: 'POST',
      success: function (res) {
        let statusCode = res.data.status_code;
        if (statusCode == 2000000) {
          wx.navigateBack({
            delta: 3
          })
        }
      }
    })
  },
  // 重新认证的
  reaccreditation: function () {
    let user_id = wx.getStorageSync('user_id');
    let authenticate_id = this.data.authenticate_id;
    let group_id = this.data.group_id;
    app.href('/pages/my/identity/indentity/indentity?authenticate_id=' + authenticate_id + '&&group_id=' + group_id)
  }
})