let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
let RP = require('../../../utils/model/redPackets.js');
let rp = new RP.redPackets();
import * as ShareModel from '../../../utils/model/shareModel';
Page({
  data: {
    queding: app.globalData.picUrl.queding_1,
    tankuang: app.globalData.picUrl.tankuang,
    show: true,
    user: "",
    followed_user_id: "",
    nonet: true,
    bg_hongbao2: app.globalData.picUrl.bg_hongbao2,
    kai: true,
    open: app.globalData.picUrl.open,
  },
  onLoad: function (options) {
    let that = this;
    console.log(options);
    let followed_user_id = options.user_id;
    let share_id = options.share_id;
    let is_redPackets = options.is_redPackets;
    let unique_id = options.unique_id;
    let shareTicket = options.shareTicket;

    that.setData({
      followed_user_id,
      share_id,
      is_redPackets,
      unique_id,
      shareTicket
    });
    //登录态维护
    app.loginPage(function (user_id) {
      let view_id = user_id;
      app.log("分享者", share_id);
      app.log("数据显示的人", followed_user_id);
      app.log("查看的人", view_id);

      //如果进入的是自己的名片里
      if (user_id == followed_user_id && !is_redPackets) {
        return app.href('/pages/my/my/my');
      }
      // 检查注册信息是否完整
      if (!is_redPackets) {
        that.checkRegisterComplete(user_id);
      }
      // 载入被分享者的个人信息
      that.getShareIdInfo(share_id, followed_user_id, view_id);
      // 发布红包的用户相关信息
      rp.pushHBPerson.call(that, unique_id, res => {
        console.log(res)
        let status = res.data.data.packet.drawed_user.drawed_status;
        if (status != 0) app.redirectTo('/redPackets/pages/openedHB/openedHB?unique_id=' + unique_id + '&&shareTicket=' + shareTicket);
      });
      // 向后台传群信息和红包信息
      app.clickLog(options);
    });
    app.netWorkChange(that);
  },
  // 载入被分享者的个人信息
  getShareIdInfo(share_id, followed_user_id, view_id) {
    let that = this;
    app.httpPost({
      url: url_common + '/api/user/getUserAllInfo',
      data: {
        share_id: share_id,
        user_id: followed_user_id,
        view_id: view_id,
      }
    }, this).then(res => {
      let user = res.data.user_info;
      let count = res.data.count;
      app.log("count", count);
      let invest = res.data.invest_info;
      let resource = res.data.resource_info;
      let project_info = res.data.project_info;
      let invest_case = res.data.invest_case;
      let button_type = res.data.button_type;
      that.setData({
        user: user,
        invest: invest,
        resource: resource,
        project_info: project_info,
        invest_case: invest_case,
        button_type: button_type,
        count: count,
        view_id: view_id,
        user_id: view_id
      });
      wx.setNavigationBarTitle({
        title: res.data.user_info.user_real_name + "的投资名片",
      });
    })
  },
  // 检查注册信息是否完整
  checkRegisterComplete(user_id) {
    let that = this
    app.httpPost({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id
      }
    }, this).then(res => {
      that.setData({
        complete: res.data.is_complete
      });
    })
  },
  // 开红包
  kai: function () {
    let that = this;
    let unique_id = this.data.unique_id;
    let added_user_id = this.data.personInfo.user.user_id;
    let user_id = wx.getStorageSync('user_id');
    app.checkUserInfo(res => {
      // 开红包动效
      that.setData({
        kai: false,
      })
      setTimeout(() => {
        that.setData({
          kai: true, 
        });
      }, 1000)
    
    })
  },
  // 打开红包后,点击确定跳转
  makeSure(e) {
    let is_card = e.currentTarget.dataset.cardid;
    let unique_id = this.data.unique_id;
    let added_user_id = this.data.personInfo.user.user_id;
    rp.openHB.call(this, unique_id, added_user_id,is_card)
    rp.openedHB.call(this)
  },
  // 回到首页
  moreProject: function () {
    app.href('/pages/discoverProject/discoverProject');
  },
  // 一键拨号
  telephone: function (e) {
    let telephone = e.currentTarget.dataset.telephone;
    wx.makePhoneCall({
      phoneNumber: telephone,
    });
  },
  // 添加人脉
  addNetwork: function () {
    let that = this;
    let user_id = this.data.user_id;//我的id,查看者的id
    let followed_user_id = this.data.followed_user_id;//当前被查看的用户id;
    let button_type = this.data.button_type;
    app.log("button_type", button_type);
    let view_id = this.data.view_id;
    // button_type==0  0.申请加人脉按钮 1.不显示任何按钮  2.待验证   3.同意加为人脉  4.加为单方人脉
    //直接可添加好友的情况
    if (button_type == 0) {
      //走正常申请流程
      wx.request({
        url: url_common + '/api/user/checkUserInfo',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status_code == 2000000) {
            let complete = res.data.is_complete;
            if (complete == 1) {
              //如果信息完整就正常申请添加人脉
              wx.request({
                url: url + '/api/user/UserApplyFollowUser',
                data: {
                  user_id: user_id,
                  applied_user_id: followed_user_id
                },
                method: 'POST',
                success: function (res) {
                  that.setData({
                    button_type: 2
                  });
                }
              });
            } else if (complete == 0) {
              wx.setStorageSync('followed_user_id', followed_user_id);
              app.href('/pages/register/companyInfo/companyInfo');
            }
          } else {
            wx.setStorageSync('followed_user_id', followed_user_id);
            app.href('/pages/register/personInfo/personInfo');
          }
        },
      });
    } else if (button_type == 1) {
      app.log("互為好友或單方人脈");
    } else if (button_type == 2) {
      app.log("待驗證");
    } else if (button_type == 3) {
      wx.request({
        url: url + '/api/user/handleApplyFollowUser',
        data: {
          // 当前登录者的
          user_id: user_id,
          // 当前申请的用户
          apply_user_id: followed_user_id
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            button_type: 1
          });
          wx.showModal({
            title: '提示',
            content: '去小程序查看我的人脉库',
            confirmText: '去看看',
            success: function (res) {
              if (res.confirm) {
                app.href('/pages/discover/myFriend/myFriend');
              } else if (res.cancel) {
              }
            }
          });
        }
      });
    } else if (button_type == 4) {
      wx.setStorageSync('followed_user_id', followed_user_id);
      wx.setStorageSync("driectAdd", 1);
      //判断用户信息是否完整
      wx.request({
        url: url_common + '/api/user/checkUserInfo',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status_code == 2000000) {
            let complete = res.data.is_complete;
            if (complete == 1) {
              //如果信息完整就直接添加人脉
              wx.request({
                url: url + '/api/user/followUser',
                data: {
                  user_id: user_id,
                  followed_user_id: followed_user_id
                },
                method: 'POST',
                success: function (res) {
                  that.setData({
                    button_type: 1
                  });
                  wx.showModal({
                    title: '提示',
                    content: '去小程序查看我的人脉库',
                    confirmText: '去看看',
                    success: function (res) {
                      if (res.confirm) {
                        app.href('/pages/discoverInvest/discoverInvest');
                      } else if (res.cancel) {
                        app.log('用户点击取消');
                      }
                    }
                  });
                }
              });
            } else if (complete == 0) {
              //如果有user_id但信息不全则跳companyInfo页面
              app.href('/pages/register/companyInfo/companyInfo');
            }
          } else {
            //如果没有user_id则跳personInfo
            app.href('/pages/register/personInfo/personInfo');
          }
        },
      });
    } else {
      showModal({
        title: "错误提示",
        content: "button_type为" + button_type
      });
    }
  },
  // 二维码分享按钮
  shareSth: function (e) {
    let QR_id = e.currentTarget.dataset.clickid;
    wx.setStorageSync('QR_id', QR_id);
    app.href('/pages/my/qrCode/qrCode');
  },
  // 项目融资
  projectFinance: function () {
    let followed_user_id = this.data.followed_user_id;
    app.href('/pages/my/projectShop/projectShop/projectShop?currentTab=1' + '&&followed_user_id=' + followed_user_id);
  },
  // 融资项目详情
  financingDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/projectDetail/projectDetail?id=' + id);
  },
  // 跳转到我的人脉
  toContactsMy: function () {
    a00.href('/pages/my/my/my')
  },
  // 跳转注册
  toContacts: function () {
    //走正常申请流程
    let user_id = this.data.user_id;//我的id,查看者的id
    let followed_user_id = this.data.followed_user_id;
    wx.request({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == 2000000) {
          let complete = res.data.is_complete;
          if (complete == 1) {

          } else if (complete == 0) {
            wx.setStorageSync('followed_user_id', followed_user_id);
            app.href('/pages/register/companyInfo/companyInfo');
          }
        } else {
          wx.setStorageSync('followed_user_id', followed_user_id);
          app.href('/pages/register/personInfo/personInfo');
        }
      },
    });
  },
  // 跳转到推送项目页面
  pushProject: function () {
    // 推送给数据显示的人 push_id = followed_user_id
    //查看的人 view_id = user_id

    let share_id = this.data.share_id;
    let view_id = this.data.view_id;
    let push_id = this.data.followed_user_id;
    wx.request({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id: view_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == 2000000) {
          let complete = res.data.is_complete;
          if (complete == 1) {
            //如果信息完整就正常申请添加人脉
            app.href('/pages/myProject/pushTo/pushTo?user_id=' + view_id + '&&pushId=' + push_id);
          } else if (complete == 0) {
            app.href('/pages/register/companyInfo/companyInfo');
          }
        } else {
          app.href('/pages/register/personInfo/personInfo');
        }
      },
    });
  },
  // 分享引导跳转
  shareJump(e) {
    let index = e.currentTarget.dataset.index;
    app.shareJump(index);
  },
  //个人信息编辑
  avatarEdit() {
    app.href('/pages/my/cardEdit/cardEdit');
  },
  // 分享页面部分
  onShareAppMessage: function () {
    let that = this;
    if (this.data.unique_id) {
      let unique_id = this.data.unique_id;
      let personInfo = this.data.personInfo;
      return ShareModel.redPacketsShare(personInfo.user.user_real_name, personInfo.packet.money, unique_id)
    } else {
      return ShareModel.sharePageShare(that);
    }
  },
});  