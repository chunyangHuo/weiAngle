// pages/contactsActivty/createInfo/createInfo.js
Page({
  data: {
  
  },

  onLoad: function (options) {
    let type = options.type;
    let that = this;
    that.setData({
      type :type
    })
  },

  onShow: function () {
  
  },
  warNameEdit:function(e){
    let warName = e.detail.value;
    let warNameLength = e.detail.value.length;
    let that = this;
    if (warNameLength <= 20) {
      this.setData({
        warName: warName
      })
    } else {
      rqj.errorHide(that, "不能超过20个字", 100)
    }
  },
  createPersonEdit:function(e){
    let createPerson = e.detail.value;
    let createPersonLength = e.detail.value.length;
    let that = this;
    if (createPersonLength <= 20) {
      this.setData({
        createPerson: createPerson
      })
    } else {
      rqj.errorHide(that, "不能超过20个字", 100)
    }
  },
  save:function(){
    let type = this.data.type;
    let createPerson = this.data.createPerson;
    let warName = this.data.warName;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let prevPage = pages[pages.length - 2];
    let user_info = prevPage.data.user_info;
    if (type == 2) {
      if (warName != '') {
        prevPage.setData({
          team_name: warName
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        rqj.errorHide(that, "战队名不能为空", 1500)
      }
    } else if (type == 3) {
        if (warName != '') {
          prevPage.setData({
            team_founder: createPerson
          })
          wx.navigateBack({
            delta: 1
          })
        } 
    } 
  }
})