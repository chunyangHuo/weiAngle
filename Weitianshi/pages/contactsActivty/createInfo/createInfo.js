// pages/contactsActivty/createInfo/createInfo.js
Page({
  data: {
  
  },

  onLoad: function (options) {
    console.log(options)
    let type = options.type;
    let that = this;
    that.setData({
      type :type
    })
    if (options.team_name != "undefined"){
      let team_name = options.team_name;
      that.setData({
        team_name: team_name
      })
    } else if (options.team_founder != "undefined"){
      let team_founder = options.team_founder;
      that.setData({
        team_founder: team_founder
      })
    }
  },

  onShow: function () {
  
  },
  warNameEdit:function(e){
    let team_name = e.detail.value;
    let team_nameLength = e.detail.value.length;
    let that = this;
    if (team_nameLength <= 20) {
      this.setData({
        team_name: team_name
      })
    } else {
      rqj.errorHide(that, "不能超过20个字", 100)
    }
  },
  createPersonEdit:function(e){
    let team_founder = e.detail.value;
    let team_founderLength = e.detail.value.length;
    let that = this;
    if (team_founderLength <= 20) {
      this.setData({
        team_founder: team_founder
      })
    } else {
      rqj.errorHide(that, "不能超过20个字", 100)
    }
  },
  save:function(){
    let type = this.data.type;
    let team_name = this.data.team_name;
    let team_founder = this.data.team_founder;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let prevPage = pages[pages.length - 2];
    let user_info = prevPage.data.user_info;
    if (type == 2) {
      if (team_name != '') {
        prevPage.setData({
          team_name: team_name
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        rqj.errorHide(that, "战队名不能为空", 1500)
      }
    } else if (type == 3) {
      if (team_founder != '') {
          prevPage.setData({
            team_founder: team_founder
          })
          wx.navigateBack({
            delta: 1
          })
        } 
    } 
  }
})