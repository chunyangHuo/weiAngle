var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        user_info:{
            user_avatar_url:'',
            user_mobile:'',
            user_real_name:'',
            user_company_name:'',
            user_brand:'',
            user_company_career:'',
        },
    },
    onLoad: function (options) {
        var that = this;
        var user_id = wx.getStorageSync('user_id');

        //获取用户信息
        wx.request({
            url: url_common + '/api/user/getUserAllInfo',
            data: {
                share_id: 0,
                user_id: user_id,
                view_id: user_id
            },
            method: 'POST',
            success: function (res) {
                let user_info = res.data.user_info
                that.setData({
                    user_id:user_id,
                    user_info: user_info,
                })
            },
        })
    },
    onShow: function () {

    },
    //头像
    headPic() {

    },
    //信息填写或更改
    writeNewThing: function (e) {
      let that = this;
      let type = e.currentTarget.dataset.type;
      let user_real_name = this.data.user_info.user_real_name;
      let user_company_name = this.data.user_info.user_company_name;
      let user_brand = this.data.user_info.user_brand;
      let user_company_career = this.data.user_info.user_company_career;
      if (type == 4) {
        wx.navigateTo({
          url: '/pages/contactsActivty/createInfo/createInfo?type=' + type + '&user_real_name=' + user_real_name,
        })
      }
      else if (type == 5) {
        wx.navigateTo({
          url: '/pages/contactsActivty/createInfo/createInfo?type=' + type + '&user_company_name=' + user_company_name,
        })
      }
      else if (type == 6) {
        wx.navigateTo({
          url: '/pages/contactsActivty/createInfo/createInfo?type=' + type + '&user_brand=' + user_brand,
        })
      }
      else if (type == 7) {
        wx.navigateTo({
          url: '/pages/contactsActivty/createInfo/createInfo?type=' + type + '&user_company_career=' + user_company_career,
        })
      }
    },
    //提交
    save() {

    },
   
})