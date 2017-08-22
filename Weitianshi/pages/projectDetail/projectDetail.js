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
    console.log(options)
    var that = this;
    var id = options.id;//当前被查看用户的项目id
    var page = this.data.page;
    var user_id = '';
    var share_id = '';
    var view_id = '';
    that.setData({
      id: id,
    });
    //判断页面进入场景    option.share_id存在是分享页面,share_id不存在则不是分享页面
    if (!options.share_id) {
      user_id = wx.getStorageSync('user_id');//获取我的user_id==view_id
      console.log(2, user_id)
      that.setData({
        user_id: user_id,
      })
      that.getInfo(that, user_id, that.data.id)
    } else {
      app.loginPage(function (user_id) {
        console.log("这里是cb函数")
        console.log(3, user_id)
        that.setData({
          user_id: user_id,
        })
        that.getInfo(that, user_id, that.data.id)
      })
    }
  },
  onShow: function () { },
  // 用户详情
  userDetail: function (e) {
    console.log(e);
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
    console.log("分享页面内容")
    var pro_intro = this.data.project.pro_intro;
    //id :当前页面的项目id
    let id = this.data.id;
    let share_id = this.data.currentUser;
    let path = '/pages/projectDetail/projectDetail?id=' + id + "&&share_id=" + share_id;
    let title = pro_intro;
    console.log(path)
    return app.shareProjectPage(id, title, share_id)
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
    let status = this.data.status;
    var user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.status_code == 2000000) {
          var complete = res.data.is_complete;
          if (complete == 1) {
            //如果信息完整就可以显示去认证
            if (status == 0) {
              wx.navigateTo({
                url: '/pages/my/identity/indentity/indentity'
              })
            } else if (status == 3) {
              console.log(status)
              wx.showModal({
                title: '友情提示',
                content: '您的身份未通过审核,只有投资人和买方FA才可申请查看项目',
                confirmColor: "#333333;",
                confirmText: "重新认证",
                showCancel: false,
                success: function (res) {
                  wx.request({
                    url: url_common + '/api/user/getUserGroupByStatus',
                    data: {
                      user_id: user_id
                    },
                    method: 'POST',
                    success: function (res) {
                      let group_id = res.data.group.group_id;
                      wx.navigateTo({
                        url: '/pages/my/identity/indentity/indentity?group_id=' + group_id
                      })
                    }
                  })
                }
              })
            }
          } else if (complete == 0) {
            wx.navigateTo({
              url: '/pages/register/companyInfo/companyInfo?type=1'
            })
          }
        } else {
          wx.navigateTo({
            url: '/pages/register/personInfo/personInfo?type=2'
          })
        }
      },
    });
  },
  // 申请查看
  applyProject: function (options) {
    console.log("申请查看")
    let id = options.currentTarget.dataset.id;
    let that = this;
    let user_id = this.data.user_id;
    // app.applyProjectTo(id);
    app.applyProjectTo(that, id)
  },
  //获取是否认证过和项目详情
  getInfo(that, user_id, id) {
    //是否认证过的状态获取 
    if (user_id) {
      wx.request({
        url: url_common + '/api/user/getUserGroupByStatus',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          // 0:未认证1:待审核 2 审核通过 3审核未通过
          let status = res.data.status;
          console.log(res)
          that.setData({
            status: status
          })
          console.log('buttonType', status)
        }
      })
    } else {
      that.setData({
        status: 5
      })
    }
    //项目详情
    wx.request({
      url: url_common + '/api/project/getProjectDetail',
      data: {
        user_id: user_id,
        project_id: id
      },
      method: 'POST',
      success: function (res) {
        console.log(1, res)
        // button_type:0->待处理 1->不显示任何内容(1.自己看自己2.推送的3.已经申请通过的) 2->申请被拒绝 3->申请按钮
        var project = res.data.data;
        var user = res.data.user;
        var firstName = user.user_name.substr(0, 1) || '';
        var pro_industry = project.pro_industry;
        var pro_company_name = project.pro_company_name;
        let industy_sort = [];
        let pro_goodness = project.pro_goodness;
        let button_type = res.data.button_type;
        let currentUser = user.user_id;
        //判断是不是自己的项目
        if (currentUser === user_id) {
          wx.navigateTo({
            url: 'pages/myProject/projectDetail/projectDetail?id=' + that.data.id,
          })
          return
        }
        // 项目介绍的标签
        if (button_type == 2 || button_type == 3) {
          for (var i = 0; i < pro_industry.length; i++) {
            industy_sort.push(pro_industry[i].industry_name)
          }
          that.setData({
            industy_sort: industy_sort,
            button_type: button_type,
            currentUser: currentUser
          })
          if (pro_goodness.length > 50) {
            that.setData({
                moreInfoList: 3
            })
        } else if (id == 4) {
            that.setData({
                moreInfo: 4
            })
        }
    },
    noMoreInfo: function (e) {
        let id = e.target.dataset.id;
        let that = this;
        if (id == 3) {
            that.setData({
                moreInfoList: 0
            })
        } else if (id == 4) {
            that.setData({
                moreInfo: 0
            })
        }
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
    // 查看bp
    sendBp: function () {
        app.console(this.data.checkEmail)
        let that = this;
        let user_id = wx.getStorageSync("user_id");
        wx.request({
            url: url_common + '/api/user/checkUserInfo',
            data: {
                user_id: user_id
            },
            method: 'POST',
            success: function (res) {
                let userEmail = res.data.user_email;
                if (userEmail) {
                    that.setData({
                        userEmail: userEmail,
                        sendPc: 1,
                        checkEmail: true,
                    })
                } else {
                    that.setData({
                        sendPc: 1,
                        checkEmail: false
                    })
                }
            }
        })
    },
    // 更改邮箱
    writeBpEmail: function (e) {
        let userEmail = e.detail.value;
        app.console(userEmail)
        if (userEmail) {
            this.setData({
                checkEmail: true,
                userEmail: userEmail
            })
        } else {
            this.setData({
                checkEmail: false,
                userEmail: userEmail
            })
        }
    },
    // 发送
    bpModalSure: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let sendPc = that.data.sendPc;
        let project_id = that.data.id;
        let userEmail = that.data.userEmail;
        let companyName = that.data.company_name;
        console.log(companyName)
        let user_id = wx.getStorageSync('user_id');
        // index 0:发送BP;  1:完善公司信息
        if (index == 0) {
            if (app.checkEmail(userEmail)) {
                // 保存新邮箱
                wx.request({
                    url: url_common + '/api/user/updateUser',
                    data: {
                        user_id: user_id,
                        user_email: userEmail
                    },
                    method: 'POST',
                    success: function (res) {
                        app.console(res)
                        that.setData({
                            userEmail: userEmail
                        })
                        app.console(userEmail)
                        if (res.data.status_code == 2000000) {
                            wx.request({
                                url: url_common + '/api/mail/sendBp',
                                data: {
                                    user_id: user_id,
                                    project_id: project_id
                                },
                                method: 'POST',
                                success: function (res) {
                                    app.console(res)
                                }
                            })
                            that.setData({
                                sendPc: 0
                            })
                        } else {
                            app.console("fail")
                        }
                    }
                })
                that.setData({
                    sendPc: 0,
                    userEmail: userEmail
                })
            } else {
                rqj.errorHide(that, '请正确填写邮箱', 1000)
            }
        }

    },
    // 取消
    bpModalCancel: function (options) {
        app.console(options)
        let index = options.currentTarget.dataset.index;
        let that = this;
        let sendPc = that.data.sendPc;
        if (index == 0) {
            that.setData({
                sendPc: 0
            })
        } else if (index == 1) {
            that.setData({
                sendCompany: 0
            })
        }
    },
})