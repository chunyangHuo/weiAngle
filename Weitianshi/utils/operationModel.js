
//项目查看申请
function projectApply(e, that, str) {
  let user_id = wx.getStorageSync('user_id');//获取我的user_id
  let content = e.currentTarget.dataset.content;
  let project_id = e.currentTarget.dataset.project;
  let dataList = that.data[str];
  let app = getApp();
  let url_common = app.globalData.url_common;
  // content: 0(申请查看) 1: (重新申请)
  // button-type: 0=申请中 1.申请已通过 2.申请被拒绝(重新申请) 3.推送给我的 4.未申请也未推送(申请按钮)
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
                            dataList.forEach((x) => {
                              if (x.project_id == project_id) {
                                x.relationship_button = 0
                              }
                            })
                            that.setData({
                              [str]: dataList
                            })
                          } else if (content == 1) {
                            dataList.forEach((x) => {
                              if (x.project_id == project_id) {
                                x.relationship_button = 0
                              }
                            })
                            that.setData({
                              [str]: dataList
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
                  } else if (group_id == 21) {
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
}

//推送项目 (user_id:谁推送的; pushTo_user_id:推送给谁的; pushed_project_id:推送的项目)
function projectOneKeyPush(that, pushTo_user_id, pushed_project_id,callback) {
  let app = getApp();
  let url_common = app.globalData.url_common;
  wx.showLoading({
    title: 'loading',
    mask:true,
  })
  let user_id = wx.getStorageSync('user_id');
  // 获取可用推送次数
  wx.request({
    url: url_common + '/api/user/getPushProjectTimes',
    data:{
      user_id: user_id
    },
    method:"POST",
    success(res){
      console.log('getPushProjectTimes',res);
      let remain_time=res.data.data.remain_times;
      if(remain_time<1){
        app.errorHide(that,"您今日的推送次数已经用光了",3000)
      }else{
        pushRequest();
      }
    },
    complete(){
      wx.hideLoading();
    }
  })
  // 实现推送
  function pushRequest(){
    wx.request({
      url: url_common + '/api/project/pushProjectToUser',
      data: {
        user_id: user_id,
        pushed_user_id: pushTo_user_id,
        pushed_project: pushed_project_id
      },
      method: 'POST',
      success: function (res) {
        let statusCode = res.data.status_code;
        if (statusCode == 2000000) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        } else if (statusCode == 490001) {
          app.errorHide(that, "没有选择任何项目", 1000)
        }
        callback(res);
      },
      complete(){
        wx.hideLoading();
      }
    })
  }
}
export {
  projectApply,
  projectOneKeyPush
}