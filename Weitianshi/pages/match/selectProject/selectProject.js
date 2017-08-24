var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    slectProject: '',
  },
  onShow: function () {
    var that = this;
    //初始化数据
    app.initPage(that)
    var user_id = this.data.user_id;
    //消除人脉筛选缓存(非contacts都需要)
    app.contactsCacheClear();
    //请求精选项目数据
    app.loginPage(function (user_id) {
      wx.request({
        url: url_common + '/api/project/getSelectedProjectList',
        data: {
          user_id: user_id
        },
        method: 'POST',
        success: function (res) {
          var slectProject = res.data.data;
          that.setData({
            slectProject: slectProject,
          })
        }
      })
    })
  },
  //上拉加载
  loadMore: function () {
    //请求上拉加载接口所需要的参数
    var that = this;
    var user_id = this.data.user_id;
    var currentPage = this.data.currentPage;
    var request = {
      url: url_common + '/api/project/getSelectedProjectList',
      data: {
        user_id: user_id,
        page: this.data.currentPage,
      }
    }
    //调用通用加载函数
    app.loadMore(that, request, "slectProject", that.data.slectProject)
  },
  //项目详情
  projectDetail: function (e) {
    var project_id = e.currentTarget.dataset.project;
    // 判斷項目是不是自己的
    wx.request({
      url: url + '/api/project/projectIsMine',
      data: {
        project_id: project_id
      },
      method: 'POST',
      success: function (res) {
        var that = this;
        var userId = res.data.user_id;
        var user = wx.getStorageSync('user_id');
        if (userId == user) {
          wx.navigateTo({
            url: '/pages/myProject/projectDetail/projectDetail?id=' + project_id + '&&index=' + 0
          })
        } else {
          wx.navigateTo({
            url: '/pages/projectDetail/projectDetail?id=' + project_id,
          })
        }
      }
    })
  },
  //分享当前页面
  onShareAppMessage: function () {
    return {
      title: '来微天使找优质项目',
      path: '/pages/match/selectProject/selectProject'
    }
  },
  // 跳转创建项目页面
  toCreateProject: function () {
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    wx.request({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == 2000000) {
          var complete = res.data.is_complete;
          if (complete == 1) {
            wx.navigateTo({
              url: '/pages/myProject/publishProject/publishProject'
            })
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
  matchApply: function (e) {
    var user_id = wx.getStorageSync('user_id');//获取我的user_id
    let that = this;
    // content: 0(申请查看) 1: (重新申请)
    let content = e.currentTarget.dataset.content;
    let project_id = e.currentTarget.dataset.project;
    let slectProject = this.data.slectProject;
    // button-type: 0=申请中 1.申请已通过 2.申请被拒绝(重新申请) 3.推送给我的 4.未申请也未推送(申请按钮)
    // app.applyProjectTo(that, project_id, content, getMatchList)
    //项目申请
    var user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == 2000000) {
          var complete = res.data.is_complete;
          if (complete == 1) {
            //如果信息完整就可以显示去认证
            wx.request({
              url: url_common + '/api/user/getUserGroupByStatus',
              data: {
                user_id: user_id
              },
              method: 'POST',
              success: function (res) {
                // 0:未认证1:待审核 2 审核通过 3审核未通过
                let status = res.data.status;
                if (status != 0) {
                  var group_id = res.data.group.group_id;
                }
                if (status == 0) {
                  wx.showModal({
                    title: '友情提示',
                    content: '认证的投资人,买方FA才可申请查看项目',
                    confirmText: "去认证",
                    confirmColor: "#333333",
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/my/identity/indentity/indentity'
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                } else if (status == 1) {
                  wx.showModal({
                    title: '友情提示',
                    content: '您的身份正在审核中,只有投资人和买方FA才可申请查看项目',
                    confirmColor: "#333333;",
                    showCancel: false,
                    success: function (res) {
                    }
                  })
                } else if (status == 2) {
                  if (group_id) {
                    if (group_id == 18 || group_id == 6) {
                      // 发送申请
                      wx.request({
                        url: url_common + '/api/project/applyProject',
                        data: {
                          user_id: user_id,
                          project_id: project_id
                        },
                        method: 'POST',
                        success: function (res) {
                          let statusCode = res.data.status_code;
                          if (statusCode == 2000000) {
                            wx.showToast({
                              title: '已提交申请',
                              icon: 'success',
                              duration: 2000
                            })
                            if (content == 0) {
                              slectProject.forEach((x) => {
                                if (x.project_id == project_id) {
                                  x.relationship_button = 0
                                }
                              })
                              that.setData({
                                slectProject: slectProject
                              })
                            } else if (content == 1) {
                              slectProject.forEach((x) => {
                                if (x.project_id == project_id) {
                                  x.relationship_button = 0
                                }
                              })
                              that.setData({
                                slectProject: slectProject
                              })
                            } else {
                              that.setData({
                                button_type: 0
                              })
                            }
                          } else if (statusCode == 5005005) {
                            wx.showToast({
                              title: '请勿重复申请',
                              icon: 'success',
                              duration: 2000
                            })
                          }
                        }
                      })
                    } else if (group_id == 19) {
                      wx.showModal({
                        title: '友情提示',
                        content: '您的身份是卖方FA,只有投资人和买方FA才可申请查看项目',
                        confirmColor: "#333333;",
                        showCancel: false,
                        success: function (res) {
                        }
                      })
                    } else if (group_id == 3) {
                      wx.showModal({
                        title: '友情提示',
                        content: '您的身份是创业者,只有投资人和买方FA才可申请查看项目',
                        confirmColor: "#333333;",
                        showCancel: false,
                        success: function (res) {
                        }
                      })

                    } else if (group_id == 4) {
                      wx.showModal({
                        title: '友情提示',
                        content: '您的身份是投资机构,只有投资人和买方FA才可申请查看项目',
                        confirmColor: "#333333;",
                        showCancel: false,
                        success: function (res) {
                        }
                      })
                    } else if (group_id == 5) {
                      wx.showModal({
                        title: '友情提示',
                        content: '您的身份是卖方FA,只有投资人和买方FA才可申请查看项目',
                        confirmColor: "#333333;",
                        showCancel: false,
                        success: function (res) {
                        }
                      })
                    } else if (group_id == 7) {
                      wx.showModal({
                        title: '友情提示',
                        content: '您的身份是政府、事业单位、公益组织,只有投资人和买方FA才可申请查看项目',
                        confirmColor: "#333333;",
                        showCancel: false,
                        success: function (res) {
                        }
                      })
                    } else if (group_id == 8) {
                      wx.showModal({
                        title: '友情提示',
                        content: '您的身份是其他,只有投资人和买方FA才可申请查看项目',
                        confirmColor: "#333333;",
                        showCancel: false,
                        success: function (res) {
                        }
                      })
                    }

                  }
                } else if (status == 3) {
                  wx.showModal({
                    title: '友情提示',
                    content: '您的身份未通过审核,只有投资人和买方FA才可申请查看项目',
                    confirmColor: "#333333;",
                    confirmText: "重新认证",
                    showCancel: false,
                    success: function (res) {
                      wx.navigateTo({
                        url: '/pages/my/identity/indentity/indentity?group_id=' + group_id
                      })
                    }
                  })
                }
              }
            })
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
})