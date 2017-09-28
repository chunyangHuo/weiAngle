import * as request from './utils/http';
import {applyProject as ApplyProject} from './utils/applyProject';
//app.js
App({
  // onLaunch 用于监听小程序初始化,当完成时会触发onLaunch(全局只会触发一次)
  onLaunch(options) {
    var options = options;
    let url = this.globalData.url;
    let url_common = this.globalData.url_common;
    var that = this;

    //如果是在是点击群里名片打开的小程序,则向后台发送一些信息
    if (options.shareTicket) {
      //获取code
      wx.login({
        success: function (login) {
          let code = login.code;
          if (code) {
            let path = options.path;
            let shareTicket = options.shareTicket;
            //获取群ID
            wx.getShareInfo({
              shareTicket: shareTicket,
              success(res) {
                let encryptedData = res.encryptedData;
                let iv = res.iv;
                //向后台发送信息
                wx.request({
                  url: url_common + '/api/log/clickLogRecord',
                  data: {
                    code: code,
                    path: path,
                    encryptedData: encryptedData,
                    iv: iv
                  },
                  method: "POST",
                  success(res) {
                  }
                })
              }
            })
          }
        }
      })
    }

    //获取各分类的信息并存入缓存
    wx.request({
      url: url_common + '/api/category/getProjectCategory',
      method: 'POST',
      success: function (res) {
        var thisData = res.data.data;
        thisData.area.forEach((x) => { x.check = false })
        thisData.industry.forEach((x) => { x.check = false })
        thisData.scale.forEach((x) => { x.check = false })
        thisData.stage.forEach((x) => { x.check = false })
        wx.setStorageSync("industry", thisData.industry)
        wx.setStorageSync("scale", thisData.scale)
        wx.setStorageSync("stage", thisData.stage)
      },
    })

    //获取热门城市并存入缓存
    wx.request({
      url: url_common + '/api/category/getHotCity',
      data: {},
      method: 'POST',
      success: function (res) {
        var hotCity = res.data.data;
        hotCity.forEach((x) => {
          x.checked = false;
        })
        wx.setStorageSync('hotCity', hotCity)
      }
    });

  },
  onError(msg) {
    console.log(msg)
  },

  //进入页面判断是否有open_session
  loginPage(cb) {
    var that = this;
    //群分享打点准备
    /* wx.showShareMenu({
         withShareTicket: true
     })*/
    if (this.globalData.open_session) {
      var timeNow = Date.now();
      var session_time = this.globalData.session_time;
      var differenceTime = timeNow - session_time;
      if (differenceTime > 432000000) {//432000000代表2个小时
        console.log("已超时")
        this.getSession(cb)
      } else {
        typeof cb == "function" && cb(this.globalData.user_id)
      }
    } else {
      this.getSession(cb)//赋值 在这里
    }
  },

  //获取open_session  
  getSession(cb) {
    var that = this;
    //获取code
    wx.login({
      success: function (login) {
        var code = login.code;
        that.globalData.code = code;
        //获取encryptedData和iv
        wx.getUserInfo({
          //用户授权
          success: function (res) {
            that.globalData.userInfo = res.userInfo;//这里,赋完值函数就结束了
            that.globalData.encryptedData = res.encryptedData;
            that.globalData.iv = res.iv;
            wx.request({
              url: that.globalData.url + '/api/wx/returnOauth',
              data: {
                code: code,
                encryptedData: res.encryptedData,
                iv: res.iv,
                app_key: that.globalData.app_key
              },
              method: 'POST',
              success: function (res) {
                console.log("这里是用户授权后调用returnOauth,获取并设置了open_session,session_time,user_id")
                //在globalData里存入open_session,session_time,user_id;
                that.globalData.open_session = res.data.open_session;
                wx.setStorageSync('open_session', res.data.open_session)
                that.globalData.session_time = Date.now();
                that.globalData.user_id = res.data.user_id;
                wx.setStorageSync("user_id", res.data.user_id)
                typeof cb == "function" && cb(wx.getStorageSync("user_id"))
              },
              fail: function () {
                console.log("调用returnOauth失败")
              }
            })
          },
          //用户不授权
          fail: function (res) {
            wx.request({
              url: that.globalData.url + '/api/wx/returnOauth',
              data: {
                code: code,
                app_key: that.globalData.app_key
              },
              method: 'POST',
              success: function (res) {
                console.log("这里是用户没授权后调用returnOauth,获取并设置了open_session,session_time,user_id")
                //在globalData里存入open_session,session_time,user_id;
                that.globalData.open_session = res.data.open_session;
                wx.setStorageSync('open_session', res.data.open_session)
                that.globalData.session_time = Date.now();
                that.globalData.user_id = res.data.user_id;
                wx.setStorageSync("user_id", res.data.user_id)
                typeof cb == "function" && cb(wx.getStorageSync("user_id"))
              },
              fail: function () {
                console.log("调用returnOauth失败")
              },
            })
          },
        })
      }
    })
  },

  //进行授权验证
  getUserInfo(cb) {
    var that = this;
    //如果全局变量里有userInfo就去执行cb函数,如果全局变量里没有userInfo就去调用授权接口
    if (this.globalData.userInfo) {
      console.log("全局变量userInfo存在")
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      console.log("全局变量userInfo不存在")
      //调用登录接口
      wx.login({
        success: function (login) {
          var code = login.code;
          that.globalData.code = code;
          //获取用户信息
          wx.getUserInfo({
            success: function (res) {
              console.log("这里是wx.getUserInfo")
              console.log(res)
              that.globalData.userInfo = res.userInfo;
              that.globalData.encryptedData = res.encryptedData;
              that.globalData.iv = res.iv;
              typeof cb == "function" && cb(that.globalData.userInfo);
            },
            fail: function (res) {
              console.log(res)
            },
            complete: function () {
              //如果已经存在session_time就进行比较,如果不没有就建一个session_time;
              if (that.globalData.session_time) {
                var timeNow = new (Date.now())
              } else {
                that.checkLogin(that);
              }
            }
          })
        }
      })
    }
  },

  //查看缓存
  cacheCheck() {
    var res = wx.getStorageInfoSync();
    console.log(res)
  },

  // user_id为空时,返回首页或者完善信息
  noUserId() {
    wx.showModal({
      title: "提示",
      content: "请先绑定个人信息",
      success: function (res) {
        if (res.confirm == true) {
          wx.navigateTo({
            url: '/pages/register/personInfo/personInfo',
          })
        } else {
          wx.switchTab({
            url: '/pages/match/match/match/match',
          })
        }
      }
    })
  },

  //分享页面函数(user_id为数据所有人ID,share_Id为分享人的ID)
  shareProjectPage(id, title, share_id) {
    let url = this.globalData.url;
    let url_common = this.globalData.url_common;
    let path = '/pages/projectDetail/projectDetail?id=' + id + "&&share_id=" + share_id;
    let json = {
      title: title,
      path: path,
      //分享成功后的回调
      success: function (res) {
        console.log("shareProjectPage分享成功")
        let shareTicket = res.shareTickets[0];
        //获取code
        wx.login({
          success(res) {
            let code = res.code;
            if (code) {
              //如果是分享到群里
              if (shareTicket) {
                wx.getShareInfo({
                  shareTicket: shareTicket,
                  success: function (res) {
                    let encryptedData = res.encryptedData;
                    let iv = res.iv;
                    console.log(code, path)
                    //发送请求到后台
                    wx.request({
                      url: url_common + '/api/log/shareLogRecord',
                      method: "POST",
                      data: {
                        code: code,
                        path: path,
                        encryptedData: encryptedData,
                        iv: iv
                      },
                      success(res) {
                        console.log('分享页面后台记录成功', res)
                      }
                    })
                  },
                })
              } else {//如果不是分享到群里
                console.log(code, path)
                //发送请求到后台
                wx.request({
                  url: url_common + '/api/log/shareLogRecord',
                  method: "POST",
                  data: {
                    code: code,
                    path: path,
                  },
                  success(res) {
                    console.log('分享页面后台记录成功', res)
                  }
                })
              }
            }
          }
        })
      },
    }
    return json
  },

  //分享项目(user_id为数据所有人ID,share_Id为分享人的ID)
  sharePage(user_id, share_id) {
    let path = "/pages/my/sharePage/sharePage?user_id=" + user_id + "&&share_id=" + share_id;
    let url = this.globalData.url;
    let url_common = this.globalData.url_common;
    let json = {
      title: '投资名片—智能精准匹配投融资双方的神器',
      path: path,
      //分享成功后的回调
      success: function (res) {
        console.log("sharePage分享成功")
        let shareTicket = res.shareTickets[0];
        //获取code
        wx.login({
          success(res) {
            let code = res.code;
            if (code) {
              //如果是分享到群里
              if (shareTicket) {
                wx.getShareInfo({
                  shareTicket: shareTicket,
                  success: function (res) {
                    let encryptedData = res.encryptedData;
                    let iv = res.iv;
                    console.log(code, path)
                    //发送请求到后台
                    wx.request({
                      url: url_common + '/api/log/shareLogRecord',
                      method: "POST",
                      data: {
                        code: code,
                        path: path,
                        encryptedData: encryptedData,
                        iv: iv
                      },
                      success(res) {
                        console.log('分享页面后台记录成功', res)
                      }
                    })
                  },
                })
              } else {//如果不是分享到群里
                console.log(code, path)
                //发送请求到后台
                wx.request({
                  url: url_common + '/api/log/shareLogRecord',
                  method: "POST",
                  data: {
                    code: code,
                    path: path,
                  },
                  success(res) {
                    console.log('分享页面后台记录成功', res)
                  }
                })
              }
            }
          }
        })
      },
    }
    return json
  },

  //根据用户信息完整度跳转不同的页面
  infoJump(targetUrl) {
    var user_id = this.globalData.user_id;
    // 核对用户信息是否完整
    wx.request({
      url: this.globalData.url_common + '/api/user/checkUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code == 2000000) {
          var complete = res.data.is_complete;
          if (complete == 1) {
            if (targetUrl) {
              wx.navigateTo({
                url: targetUrl
              })
            }
          } else if (complete == 0) {
            wx.navigateTo({
              url: '/pages/register/companyInfo/companyInfo'
            })
          }
        } else {//后台返回500状态码,可能原因为参数的user_id传了0过去
          wx.navigateTo({
            url: '/pages/register/personInfo/personInfo'
          })
        }
      },
    });
  },

  //industry多选标签数据预处理
  industryDeal(data) {
    if (data.length > 0) {
      let industry = wx.getStorageSync('industry');
      let newIndustry = industry;
      newIndustry.forEach(x => {
        data.forEach(y => {
          if (x.industry_name == y.industry_name) {
            x.check = true
          }
        })
      })
      return newIndustry
    } else {
      return data
    }
  },

  // 多选标签页面间传值显示
  dealTagsData(that, data, dataCard, itemValue, itemId) {
    if (data) {
      dataCard.value = [];
      dataCard.id = [];
      data.forEach((x) => {
        if (x.check == true) {
          dataCard.id.push(x[itemId])
          dataCard.value.push(x[itemValue])
        }
      })
    }
    if (dataCard.value != "选择领域") {
      dataCard.css = "checkOn"
    } else {
      dataCard.css = ""
    }
    console.log(dataCard.value, dataCard.id)
  },

  //多选标签事件封装(tags需要要data里设置相关,str为标签数所字段)
  tagsCheck(that, e, tags, str) {
    let target = e.currentTarget.dataset;
    let tagsData = tags.tagsData;
    let checkObject = [];
    tagsData[target.index].check = !tagsData[target.index].check;
    let checkedNum = 0
    tagsData.forEach((x) => {
      if (x.check == true) {
        checkedNum++
      }
    })
    if (checkedNum >= 6) {
      tagsData[target.index].check = !tagsData[target.index].check;
      this.errorHide(that, "最多可选择五项", 1000)
    } else {
      that.setData({
        [str]: tags
      })
    }
    tagsData.forEach((x) => {
      if (x.check == true) {
        checkObject.push(x)
      }
    })
    return checkObject
  },

  //下拉加载事件封装(request需要设置,包括url和请求request所需要的data,str为展示数据字段,dataSum为展示数据)
  //初始必须在onShow()里初始化requestCheck:true(防多次请求),currentPage:1(当前页数),page_end:false(是否为最后一页)
  loadMore(that, request, str, dataSum) {
    var user_id = wx.getStorageSync("user_id");
    if (that.data.requestCheck) {
      if (that.data.page_end == false) {
        wx.showToast({
          title: 'loading...',
          icon: 'loading'
        })
        request.data.page++;
        that.setData({
          currentPage: request.data.page,
          requestCheck: false
        });
        //请求加载数据
        wx.request({
          url: request.url,
          data: request.data,
          method: 'POST',
          success: function (res) {
            var newPage = res.data.data;
            console.log(newPage)
            var page_end = res.data.page_end;
            for (var i = 0; i < newPage.length; i++) {
              dataSum.push(newPage[i])
            }
            that.setData({
              [str]: dataSum,
              page_end: page_end,
              requestCheck: true
            })

          },
          complete(){
            wx.hideLoading();
          }
        })
      } else {
        this.errorHide(that, "没有更多了", 3000);
        wx.hideLoading();
        that.setData({
          requestCheck: true
        });
      }
    }
  },
  loadMore2(that, request, callback) {
    var user_id = wx.getStorageSync("user_id");
    if (that.data.requestCheck) {
      if (that.data.page_end == false) {
        wx.showToast({
          title: 'loading...',
          icon: 'loading'
        })
        request.data.page++;
        that.setData({
          currentPage: request.data.page,
          requestCheck: false
        });
        //请求加载数据
        wx.request({
          url: request.url,
          data: request.data,
          method: 'POST',
          success: callback
        })
      } else {
        this.errorHide(that, "没有更多了", 3000)
        that.setData({
          requestCheck: true
        });
      }
    }
  },

  //初始化页面(others为其他要初始化的数据,格式为键值对.如{key:value},常用于上拉加载功能)
  initPage(that, others) {
    var user_id = wx.getStorageSync('user_id');
    that.setData({
      user_id: user_id,
      requestCheck: true,
      currentPage: 1,
      page_end: false
    })
    if (others) {
      that.setData(others)
    }
  },

  //添加人脉
  addContacts(that, addType, user_id, followed_id, callBack1, callBack2) {
    if (addType == 1) {
      wx.request({
        url: url + '/api/user/followUser',
        data: {
          user_id: user_id,
          followed_user_id: followed_id
        },
        method: 'POST',
        success: function (res) {
          callBack1(res)
        }
      })
    } else if (addType == 2) {
      wx.request({
        url: url + '/api/user/UserApplyFollowUser',
        data: {
          user_id: user_id,
          applied_user_id: followed_id
        },
        method: 'POST',
        success: function (res) {
          callBack2(res)
        }
      })
    } else {
      console.log("addType写错了")
    }
  },

  //消除人脉筛选的四个缓存(以实现人脉切到其他tab页再切回来数据初始化)
  contactsCacheClear() {
    wx.removeStorageSync('contactsIndustry');
    wx.removeStorageSync('contactsStage');
    wx.setStorageSync("industryFilter", '');
    wx.setStorageSync("stageFilter", '');
  },

  //重新封装console.log
  console(x) {
    if (this.globalData.url == 'https://wx.weitianshi.cn') {

    } else {
      console.log(x)
    }
  },

  // 时间戳转换
  changeTime(x) {
    var n;
    if (x.length === 13) {
      n = x * 1
    } else {
      n = x * 1000
    }
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
  changeTimeStyle(x) {
    var n;
    if (x.length === 13) {
      n = x * 1
    } else {
      n = x * 1000
    }
    var date = new Date(n);
    var Y = date.getFullYear() + '.';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },

  // 邮箱检验
  checkEmail(data) {
    var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (myreg.test(data)) {
      return true
    } else {
      return false
    }
  },

  //项目申请
  /* applyProjectTo(that, project_id, content, list) {
    var user_id = wx.getStorageSync('user_id');
    let url_common = this.globalData.url_common;
    wx.request({
      url: this.globalData.url_common + '/api/user/checkUserInfo',
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
                        console.log('用户点击确定')
                        wx.navigateTo({
                          url: '/pages/my/identity/indentity/indentity'
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
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
                      console.log('用户点击确定')
                    }
                  })
                } else if (status == 2) {
                  let getMatchList = list;
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
                              console.log("申请查看")
                              getMatchList.forEach((x) => {
                                if (x.project_id == project_id) {
                                  x.relationship_button = 0
                                  x.handle_status = 0
                                }
                              })
                              that.setData({
                                getMatchList: getMatchList
                              })
                              console.log(getMatchList)
                            } else if (content == 1) {
                              console.log("重新查看")
                              getMatchList.forEach((x) => {
                                if (x.project_id == project_id) {
                                  x.relationship_button = 0
                                  x.handle_status = 0
                                }
                              })
                              that.setData({
                                getMatchList: getMatchList
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
                          console.log('用户点击确定')
                        }
                      })
                    } else if (group_id == 3) {
                      wx.showModal({
                        title: '友情提示',
                        content: '您的身份是创业者,只有投资人和买方FA才可申请查看项目',
                        confirmColor: "#333333;",
                        showCancel: false,
                        success: function (res) {
                          console.log('用户点击确定')
                        }
                      })

                    } else if (group_id == 4) {
                      wx.showModal({
                        title: '友情提示',
                        content: '您的身份是投资机构,只有投资人和买方FA才可申请查看项目',
                        confirmColor: "#333333;",
                        showCancel: false,
                        success: function (res) {
                          console.log('用户点击确定')
                        }
                      })
                    }
                    // else if (group_id == 5) {
                    //     wx.showModal({
                    //         title: '友情提示',
                    //         content: '您的身份是卖方FA,只有投资人和买方FA才可申请查看项目',
                    //         confirmColor: "#333333;",
                    //         showCancel: false,
                    //         success: function (res) {
                    //             console.log('用户点击确定')
                    //         }
                    //     })
                    // }
                    else if (group_id == 7) {
                      wx.showModal({
                        title: '友情提示',
                        content: '您的身份是政府、事业单位、公益组织,只有投资人和买方FA才可申请查看项目',
                        confirmColor: "#333333;",
                        showCancel: false,
                        success: function (res) {
                          console.log('用户点击确定')
                        }
                      })
                    } else if (group_id == 8) {
                      wx.showModal({
                        title: '友情提示',
                        content: '您的身份是其他,只有投资人和买方FA才可申请查看项目',
                        confirmColor: "#333333;",
                        showCancel: false,
                        success: function (res) {
                          console.log('用户点击确定')
                        }
                      })
                    }
                  }
                } else if (status == 3) {
                  console.log(status)
                  wx.showModal({
                    title: '友情提示',
                    content: '您的身份未通过审核,只有投资人和买方FA才可申请查看项目',
                    confirmColor: "#333333;",
                    confirmText: "重新认证",
                    showCancel: false,
                    success: function (res) {
                      console.log('用户点击确定')
                      wx.navigateTo({
                        url: '/pages/my/identity/indentity/indentity?group_id=' + group_id
                      })
                    }
                  })
                }
              }
            })
          } else if (complete == 0) {
            //如果有user_id但信息不全则跳companyInfo页面
            //  wx.setStorageSync('followed_user_id', followed_user_id)
            wx.navigateTo({
              url: '/pages/register/companyInfo/companyInfo?type=1'
            })
          }
        } else {
          //如果没有user_id则跳personInfo
          //  wx.setStorageSync('followed_user_id', followed_user_id)
          wx.navigateTo({
            url: '/pages/register/personInfo/personInfo?type=2'
          })
        }
      },
    });
  }, */
  applyProject(that,e,str){
    ApplyProject(that,e,str)
  },

  //错误提示
  errorHide(target, errorText, time) {
    var that = target;
    that.setData({
      error: "1",
      error_text: errorText
    })
    var errorTime = setTimeout(function () {
      that.setData({
        error: "0"
      });
    }, time)
  },

  //头像上传
  headPic(that) {
      let user_id = that.data.user_id;
      let user_info = that.data.user_info;
      let url_common = this.globalData.url_common;
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              var tempFilePaths = res.tempFilePaths;
              let avatar = tempFilePaths[0];
              let size = res.tempFiles[0].size;
              if (size <= 1048576) {
                  wx.showLoading({
                      title: '头像上传中',
                      mask:true,
                  })
                  wx.uploadFile({
                      url: url_common + '/api/team/uploadLogo', //仅为示例，非真实的接口地址
                      filePath: tempFilePaths[0],
                      name: 'avatar',
                      formData: {
                          user_id: user_id,
                      },
                      success: function (res) {
                          let data = JSON.parse(res.data);
                          if (data.status_code === 2000000) {
                              wx.hideLoading();
                              let image_id = data.data.image_id;
                              that.setData({
                                  image_id: image_id
                              })
                          }
                      }
                  })
                  if (user_info.user_avatar_url) {
                      user_info.user_avatar_url = tempFilePaths;
                  } else if (user_info.user_avatar_text) {
                      delete user_info.user_avatar_text;
                      user_info.user_avatar_url = tempFilePaths;
                  }
                  that.setData({
                      user_info: user_info
                  })
              } else {
                  app.errorHide(that, "上传图片不能超过1M", 1500)
              }
          }
      })
  },

  //请求封装
  httpPost(data){
    return request.httpPost(data)
  },

  //初始本地缓存
  globalData: {
    error: 0,
    app_key:'wxos_lt',
    // url: "https://lbs.weitianshi.cn",
    // url_common: "https://lbs.weitianshi.cn"
    // url: "https://wx.debug.weitianshi.cn",
    // url_common: "https://wx.debug.weitianshi.cn"
    url: "https://wx.dev.weitianshi.cn",
    url_common: "https://wx.dev.weitianshi.cn"
  },
});