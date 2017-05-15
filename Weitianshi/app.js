//app.js
App({
  // onLaunch 用于监听小程序初始化,当完成时会触发onLaunch(全局只会触发一次)
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    var options = options;
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    //如果是在是点击群里名片打开的小程序,则向后台发送一些信息
    if (options.shareTicket) {
      wx.login({
        success: function (login) {
          var code = login.code;
          wx.request({
            url: 'https://dev.weitianshi.cn/api/wx/returnOauth',
            data: {
              code: code,
            },
            method: 'POST',
            success: function (res) {
              var user_id = res.data.user_id;
              var path = options.path;
              var scene = options.scene;
              var shareTicket = options.shareTicket;
              var loginTime = Date(Date.now());
              wx.getShareInfo({
                shareTicket: options.shareTicket,
                success: function (res) {
                  var encryptedData = res.encryptedData;
                  var iv = res.iv;
                  //user_id:打开小程序用户的user_id;path:打开小程序的页面路径;scene:场景值;loginTime:打开小程序的时间;
                  var pack = { user_id, path, scene, loginTime, encryptedData, iv }
                  console.log(pack)
                }
              })
            }
          })
        }
      })
    }
  },
  onError: function (msg) {
    console.log(msg)
  },
  //进入页面判断是否有open_session
  loginPage: function (cb) {
    var that = this;
    //群分享打点准备
    wx.showShareMenu({
      withShareTicket: true
    })
    if (this.globalData.open_session) {
      console.log("open_session已经存在")
      var timeNow = Date.now();
      var session_time = this.globalData.session_time;
      var differenceTime = timeNow - session_time;
      // console.log(differenceTime/3600000+"小时")
      if (differenceTime > 432000000) {//432000000
        console.log("已超时")
        this.getSession(cb)
      } else {
        console.log("未超时")
        typeof cb == "function" && cb(this.globalData.user_id)
      }
    } else {
      console.log("open_session不存在")
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
            console.log("调用wx.getUserInfo成功")
            // console.log(res)
            that.globalData.userInfo = res.userInfo;//这里,赋完值函数就结束了
            that.globalData.encryptedData = res.encryptedData;
            that.globalData.iv = res.iv;
            wx.request({
              url: 'https://dev.weitianshi.cn/api/wx/returnOauth',
              data: {
                code: code,
                encryptedData: res.encryptedData,
                iv: res.iv
              },
              method: 'POST',
              success: function (res) {
                console.log("这里是获取到encryptedData,iv后调用returnOauth,获取并设置了open_session,session_time,user_id")
                // console.log(res);
                //在globalData里存入open_session,session_time,user_id;
                that.globalData.open_session = res.data.open_session;
                that.globalData.session_time = Date.now();
                that.globalData.user_id = res.data.user_id;
                console.log(Date(that.globalData.session_time))
                // console.log(that.globalData.user_id)
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
              url: 'https://dev.weitianshi.cn/api/wx/returnOauth',
              data: {
                code: code,
              },
              method: 'POST',
              success: function (res) {
                console.log("这里是没获取到encryptedData,iv后调用returnOauth,获取并设置了open_session,session_time,user_id")
                // console.log(res);
                //在globalData里存入open_session,session_time,user_id;
                that.globalData.open_session = res.data.open_session;
                that.globalData.session_time = Date.now();
                that.globalData.user_id = res.data.user_id;
                console.log(Date(that.globalData.session_time))
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
  getUserInfo: function (cb) {
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
                console.log(that.globalData.session_time, timeNow)
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
  cacheCheck: function () {
    var res = wx.getStorageInfoSync();
    console.log(res)
  },

  //下拉刷新
  onPullDownRefresh: function () {
    // console.log("开启了下拉刷新")
    wx.stopPullDownRefresh()
  },

  // user_id为空时,返回首页或者完善信息
  noUserId: function () {
    wx.showModal({
      title: "提示",
      content: "请先绑定个人信息",
      success: function (res) {
        console.log(res)
        if (res.confirm == true) {
          wx.navigateTo({
            url: '/pages/register/personInfo/personInfo',
          })
        } else {
          wx.switchTab({
            url: '/pages/resource/resource',
          })
        }
      }
    })
  },

  //分布页面函数
  sharePage: function (shareId, id) {
    var json = {
      title: '投资名片—智能精准匹配投融资双方的神器',
      path: "/pages/my/sharePage/sharePage?user_id=" + id,
      success: function (res) {
        var shareTicket = res.shareTickets[0]
        wx.getShareInfo({
          shareTicket: shareTicket,
          success: function (res) {
            let encryptedData = res.encryptedData
            let iv = res.iv
            let shareTime = Date(Date.now())
            let shareMessage = { shareId, id, shareTime, encryptedData, iv }
            console.log(shareMessage)
          },
          fail: function (res) {
            console.log(res)
          },
        })
      },
      fail: function (res) {
        console.log(res)
      }
    }
    return json;
  },

  //根据用户信息完整度跳转不同的页面
  infoJump: function (data) {
    var user_id = wx.getStorageSync("user_id");
    // 核对用户信息是否完整
    wx.request({
      url: this.globalData.url + '/api/user/checkUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        // console.log("检查用户信息是否完整,如果不完整则返回个人信息")
        // console.log(res);
        if (res.data.status_code == 2000000) {
          var complete = res.data.is_complete;
          if (user_id == 0) {
            wx.navigateTo({
              url: '/pages/register/personInfo/personInfo',
            })
          } else if (user_id != 1 && complete == 1) {
            wx.navigateTo({
              url: data
            })
          } else if (user_id != 1 && complete == 0) {
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

  //test
  hello: function () {
    console.log("TEST")
  },

  /*//登录状态维护
  checkLogin: function (that) {
      var code = that.globalData.code;
      var encryptedData = that.globalData.encryptedData;
      var iv = that.globalData.iv;
      //判断用户是否授权了小程序
      if (encryptedData) {
          wx.request({
              url: 'https://dev.weitianshi.cn/api/wx/returnOauth',
              data: {
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv
              },
              method: 'POST',
              success: function (res) {
                  console.log("这里是获取到UserInfo后调用returnOauth")
                  console.log(res);
                  that.globalData.open_session = res.data.open_session;
                  that.globalData.session_time = Date.now();
                  that.globalData.user_id = res.data.user_id;
                  console.log(that.globalData.session_time)
                  wx.setStorageSync("user_id", res.data.user_id)
              },
              fail: function () {
                  console.log("向后台发送信息失败")
              }
          })
      } else {
          wx.request({
              url: 'https://dev.weitianshi.cn/api/wx/returnOauth',
              data: {
                  code: code,
              },
              method: 'POST',
              success: function (res) {
                  console.log("这里是没拿到UserInfo后调用returnOauth")
                  console.log(res);
                  that.globalData.open_session = res.data.open_session;
                  that.globalData.session_time = Date.now();
                  that.globalData.user_id = res.data.user_id;
                  console.log(that.globalData.session_time)
                  wx.setStorageSync("user_id", res.data.user_id)
              },
              fail: function () {
                  console.log("向后台发送信息失败")
              },
          })
      }
  },

  //微信登录状态维护
  checkSession: function () {
      wx.checkSession({
          success: function () {
          },
          fail: function () {
              //登录态过期
              wx.login() //重新登录
          }
      })
  },*/

  //初始本地缓存
  globalData: {
    error: 0,
    url: "https://dev.weitianshi.cn"
  }
});