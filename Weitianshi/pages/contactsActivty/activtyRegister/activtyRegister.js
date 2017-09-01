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
    headPic: function () {
      let that = this;
      let  user_info = this.data.user_info;
      var user_id = wx.getStorageSync('user_id');
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          let avatar = tempFilePaths[0];
          let size = res.tempFiles[0].size;
          if (size <= 1048576) {
            wx.uploadFile({
              url: url_common + '/api/team/uploadLogo', //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              name: 'avatar',
              formData: {
                user_id: user_id,
              },
              success: function (res) {
                let data = JSON.parse(res.data);
                let image_id = data.data.image_id;
                that.setData({
                  image_id: image_id
                })
              }
            })
            user_info.user_avatar_url = tempFilePaths;
            that.setData({
              user_info: user_info
            })
            console.log(user_info)
          } else {
            rqj.errorHide(that, "上传图片不能超过1M", 1500)
          }
        }
      })
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