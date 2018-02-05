let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
Page({
  data: {
    name:'',
    brand:'',
    company: "",
    position: "",
    email: "",
    nonet: true
  },
  //onLoad
  onLoad(options) {
    let that = this;
    let type = options.type;
    let company = options.user_company;
    let position = options.user_career;
    let email = options.user_email;
    let user_id = wx.getStorageSync('user_id');
    this.getUserInfo(user_id);
    that.setData({
      type: type
    });
    app.netWorkChange(that);
  },
  //请求用户信息
  getUserInfo(user_id) {
    let that = this;
    app.httpPost({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id
      },
    }, this).then(res => {
      let company = res.data.user_company_name;
      let position = res.data.user_company_career;
      let email = res.data.user_email;
      let brand = res.data.user_brand;
      [company, position, email, brand].map(res => {
        if (res == 'null') return res = ''
      })
      that.setData({
        company: res.data.user_company_name,
        position: res.data.user_company_career,
        email: res.data.user_email,
        brand: res.data.user_brand
      });
    })
  },
  //姓名
  name(e) {
    this.setData({
      name
    })
  },
  //品牌验证
  checkBrand(e) {
    let brand = e.detail.value;
    brand = app.globalData.verify.deleteSymbol(brand)
    this.setData({
      brand
    });
  },
  //公司项的特殊符号过滤和值的双向绑定
  company(e) {
    let company = e.detail.value;
    company = app.globalData.verify.deleteSymbol(company);
    this.setData({
      company
    });
    // 传公司名称到后台以用于数据爬取
    app.httpPost({
      url: url_common + '/api/dataTeam/checkCompany',
      data: {
        com_name: company
      },
    }, this).then(res => { })
  },
  //职位项的特殊符号过滤和值的双向绑定
  position(e) {
    let position = e.detail.value;
    position = app.globalData.verify.deleteSymbol(position);
    this.setData({
      position
    });
  },
  //邮箱验证
  checkEmail(e) {
    let that = this;
    let email = e.detail.value;
    app.globalData.verify.email(this, email, res => {
      that.setData({
        email
      });
    })
  },
  //点击跳转
  backHome() {
    let that = this;
    let company = this.data.company;
    let position = this.data.position;
    let brand = this.data.brand;
    let error = this.data.error;
    let error_text = this.data.error_text;
    let email = this.data.email;
    let user_id = wx.getStorageSync('user_id');
    let type = this.data.type;
    if (company !== "" && position !== "") {
      //向后台发送公司信息
      wx.request({
        url: url_common + '/api/user/updateUser',
        data: {
          user_id: user_id,
          user_company_name: company,
          user_company_career: position,
          user_email: email,
          user_brand: brand
        },
        method: 'POST',
        success: function (res) {
          let pages = getCurrentPages();
          let num = pages.length - 1;
          if (res.data.status_code == 2000000) {
            let followed_user_id = wx.getStorageSync('followed_user_id');
            if (followed_user_id) {
              let driectAdd = wx.getStorageSync("driectAdd");
              if (driectAdd) {
                //直接添加为好友
                wx.request({
                  url: url + '/api/user/followUser',
                  data: {
                    user_id: user_id,
                    followed_user_id: followed_user_id
                  },
                  method: 'POST',
                  success: function (res) {
                    if (res.data.status_code == 2000000) {
                      wx.showModal({
                        title: "提示",
                        content: "添加成功,请到人脉列表查看",
                        showCancel: false,
                        confirmText: "到人脉库",
                        success: function () {
                          app.href('/pages/discoverInvest/discoverInvest')
                        }
                      });
                      wx.removeStorageSync("driectAdd");
                      wx.removeStorageSync('followed_user_id');
                    } else {
                      app.errorHide(that, res.data.error_msg, 1500);
                    }
                  },
                });
              } else {
                //正常申请添加为好友
                wx.request({
                  url: url + '/api/user/UserApplyFollowUser',
                  data: {
                    user_id: user_id,
                    applied_user_id: followed_user_id
                  },
                  method: 'POST',
                  success: function (res) {
                    if (res.data.status_code == 2000000) {
                      wx.showModal({
                        title: "提示",
                        content: "添加成功,等待对方同意",
                        showCancel: false,
                        confirmText: "到人脉库",
                        success: function () {
                          wx.removeStorageSync('followed_user_id');
                          app.href('/pages/discoverInvest/discoverInvest')
                        }
                      });
                    }
                  },
                });
              }
            } else {
              if (type) {
                app.href('/pages/register/bindSuccess/bindSuccess?type=' + type);
              } else {
                app.href('/pages/register/bindSuccess/bindSuccess?type=' + 0);
              }
            }
          } else {
            let error_msg = res.data.error_msg;
            wx.showModal({
              title: "错误提示",
              content: error_msg
            });
          }
        },
      });
      //取消错误提示
      that.setData({
        error: '0'
      });
    } else {
      that.setData({
        error: '1'
      });
      if (company == '') {
        app.errorHide(that, "公司不能为空", 1500);
      } else if (position == '') {
        app.errorHide(that, "职位不能为空", 1500);
      } else {
        app.errorHide(that, "请正确填写邮箱", 1500);
      }
    }
  },
  // 重新加载
  refresh() {
    let timer = '';
    wx.showLoading({
      title: 'loading',
      mask: true
    });
    timer = setTimeout(x => {
      wx.hideLoading();
      this.onShow();
    }, 1500);
  }
});