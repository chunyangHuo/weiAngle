var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    integrity: 30,
    user: "",
    modal: 0,
    goTop: 0,
    canEdit: 1,
    blue: -1,
    count: "",
    modalBox: 0,
    IdentificationShow: 1
  },
  onLoad: function (options) {
    if (options) {
      this.setData({
        modal: options.modal
      })
    }
  },
  onShow: function () {
    //消除人脉缓存
    app.contactsCacheClear();

    var that = this
    app.loginPage(function (user_id) {
      console.log("这里是cb函数")
      that.setData({
        user_id: user_id,
      })
      //分享至群打点准备
     /* wx.showShareMenu({
        withShareTicket: true,
      })*/
      if (user_id != 0) {
        //载入我的个人信息
        wx.request({
          url: url_common + '/api/user/getUserAllInfo',
          data: {
            share_id: 0,
            user_id: user_id,
            view_id: user_id,
          },
          method: 'POST',
          success: function (res) {
            console.log("我的getUserAllInfo信息")
            console.log(res);
            var user = res.data.user_info;
            var count = res.data.count;
            var invest = res.data.invest_info;
            var resource = res.data.resource_info;
            var project_info = res.data.project_info;
            var invest_case = res.data.invest_case;
            var status_code = res.data.status_code;
            var financingProject = that.data.financingProject;
            var user_name = res.data.user_info.user_real_name;
            //设置缓存==========
            wx.setStorage({
              key: 'resource_data',
              data: res.data.resource_info
            })

            wx.setNavigationBarTitle({
              title: user_name + "的投资名片",
            })
            that.setData({
              user: user,
              invest: invest,
              resource: resource,
              project_info: project_info,
              invest_case: invest_case,
              status_code: status_code,
              financingProject: financingProject,
              count: count
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
      } else {
        app.noUserId()
      }
    })
  },
  //编辑名片
  cardEdit: function () {
    if (!this.data.options) {
      wx.navigateTo({
        url: '/pages/my/cardEdit/cardEdit',
      })
    }
  },
  // 人气
  popularity: function () {
    wx.navigateTo({
      url: '/pages/message/browseMe/browseMe'
    })
  },
  // 加我为人脉
  attention: function () {
    wx.navigateTo({
      url: '/pages/message/beAddedContacts/beAddedContacts'
    })
  },
  pushTo:function(){
    wx.navigateTo({
      url: '/pages/message/potentialProject/potentialProject'
    })
  },
  //寻找案源
  findProjectEdit: function () {
    if (!this.data.options) {
      wx.navigateTo({
        url: '/pages/match/match/investDemand/investDemand?current=' + 1,
      })
    }
  },
  //资源对接
  resourceEnchangeEdit: function () {
    if (!this.data.options) {
      wx.navigateTo({
        url: '/pages/match/match/resourceDemand/resourceDemand?current=' + 1,
      })
    }
  },
  //项目融资
  projectFinance: function () {
    if (!this.data.options) {
      wx.navigateTo({
        url: '/pages/my/projectFinance/projectFinance',
      })
    }
  },
  //融资项目详情
  financingDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/myProject/projectDetail/projectDetail?id=' + id + "&&index=" + index + "&&currentTab=" + 0,
    })
  },
  //投资案例
  investCase: function () {
    if (!this.data.options) {
      wx.navigateTo({
        url: '/pages/my/investCase/investCase'
      })
    }
  },
  //交换名片
  cardChange: function () {
    var that = this;
    var user_id = this.data.user_id;
    var modal = this.data.modal;
    var status_code = this.data.status_code;
    console.log(modal, status_code)
    if (status_code == 2000000) {
      that.setData({
        modal: 1
      })
      setTimeout(function () {
        console.log(3000)
        that.setData({
          modal: 0
        })
      }, 2000)
    } else {
      wx.showModal({
        title: "友情提示",
        content: "交换名片之前,请先完善自己的名片",
        success: function () {
          wx.navigateTo({
            url: '/pages/my/cardEdit/cardEdit',
          })
        }
      })
    }
  },
  //点击modal后消失
  hideModal() {
    let modal = this.data.modal;
    this.setData({
      modal: 0
    })
  },
  // 二维码分享按钮
  shareSth: function (e) {
    console.log(e)
    var QR_id = e.currentTarget.dataset.clickid;
    wx.setStorageSync('QR_id', QR_id)
    console.log(QR_id)
    wx.navigateTo({
      url: '/pages/my/qrCode/qrCode',
    })
  },
  //分享页面
  onShareAppMessage: function () {
    var user_id = wx.getStorageSync('user_id');
    var share_id = wx.getStorageSync("user_id");
    return app.sharePage(user_id, share_id)
  },

  //取消分享
  cancelShare: function () {
    this.setData({
      modal: 0
    })
  },
  // 查税号
  searchIdentification: function (e) {
    var that = this;
    var user_id = this.data.user_id;
    var modal = this.data.modal;
    var com_name = this.data.user.user_company_name;
    var status_code = this.data.status_code;
      wx.request({
        url: url_common + '/api/dataTeam/taxNumber',
        data: {
          user_id: user_id,
          com_name: com_name
        },
        method: 'POST',
        success: function (res) {
          let data = res.data;
          if (data.status_code == 460004) {
            console.log(data)
            that.setData({
              modalStyle: 1,
              modalBox: 1
            })
          } else if (data.status_code == 2000000) {
            console.log(res);
            console.log("税号")
            that.setData({
              modalStyle: 0,
              modalBox: 1
            })
            let data = res.data.data;
            let com_name = data.com_name;
            var tax_member = data.tax_mumber;
            that.setData({
              data: data,
              com_name: com_name,
              tax_member: tax_member,
              modalStyle: 0
            })
          }
        }
      })
  },
  //完善公司信息
  writeInformation: function () {
    wx.navigateTo({
      url: '/pages/my/cardEdit/cardEdit',
    })
    this.setData({
      modalBox: 0
    })
  },
  //确定或稍后再试
  laterOn: function () {
    console.log("laterOn")
    wx.switchTab({
      url: '/pages/my/my/my',
    })
    this.setData({
      modalBox: 0
    })
  },
  //复制税号
  copyNum: function () {
    let num = this.data.tax_member;
    wx.setClipboardData({
      data: num,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        })
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
   }
});
