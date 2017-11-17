var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
  data: {
    payMoney: [],
    checked: [],
    index: [],
    id: [],
    error: "0",
    error_text: "",
    enchangeCheck: [],
    enchangeValue: [],
    enchangeId: []
  },
  onLoad: function () {
    var that = this;
    var payMoney = wx.getStorageSync('y_scale');
    for (var i = 0; i < payMoney.length; i++) {
      payMoney[i].checked = false;
    }
    var enchangeCheck = wx.getStorageSync('paymoneyenchangeCheck') || [];
    var enchangeValue = wx.getStorageSync('paymoneyenchangeValue') || [];
    var enchangeId = wx.getStorageSync('paymoneyenchangeId') || [];
    that.setData({
      payMoney: payMoney,
      enchangeCheck: enchangeCheck,
      enchangeValue: enchangeValue,
      enchangeId: enchangeId,
      index: enchangeId
    });
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  //传值部份可提供资源
  checkboxChange: function (e) {
    var that = this;
    var thisData = e.currentTarget.dataset;//{value: "种子轮 ", index: 0, check: "false"}
    var e_index = thisData.index;//数组下标
    var e_value = thisData.value;//值
    var e_check = thisData.check;//是否被选中
    var enchange = this.data.payMoney//返回的所有数据
    var enchangeValue = this.data.enchangeValue;//已被选中的名字
    var enchangeId = this.data.enchangeId;//已添加的数字
    var enchangeCheck = this.data.enchangeCheck;//是否被选中
    for (var i = 0; i < enchange.length; i++) {
      enchangeCheck.push(enchange[i].checked)//被选中的状态
    }
    if (enchangeCheck[e_index] == false) {//当确认按钮时
      if (enchangeValue.length < 5) {
        enchangeCheck[e_index] = true;
        enchange[e_index].checked = true;
        enchangeValue.push(enchange[e_index].scale_money)
        enchangeId.push(enchange[e_index].scale_id)//点击时把数据的ID添加起来
      } else {
        app.errorHide(that, "最多可选择五项", 1000)
      }
    } else {//当取消按钮时
      enchangeCheck[e_index] = false;
      enchange[e_index].checked = false;
      enchangeValue.splice(enchangeValue.indexOf(e_value), 1)
      enchangeId.splice(enchangeId.indexOf(enchange[e_index].scale_id), 1)
    }
    this.setData({
      enchange: enchange,
      enchangeValue: enchangeValue,
      enchangeId: enchangeId,
      enchangeCheck: enchangeCheck,
      checked: enchangeCheck,
      index: enchangeId
    });
  },


  //点击确定
  certain: function () {
    var that = this;
    var checked = this.data.checked;
    var id = this.data.id;
    var index = this.data.index;
    var payMoney = this.data.payMoney;
    var checked = this.data.enchangeValue;
    var index = this.data.enchangeId;
    var enchangeCheck = this.data.enchangeCheck;
    that.setData({
      error: "0"
    });

    if (checked.length > 5) {
      that.setData({
        error: "1",
        error_text: "至多选择五个标签"
      });
      var time = setTimeout(function () {
        var that = this;
        that.setData({
          error: "0"
        })
      }, 1500)
    } else {
      //传值给myProject
      if (checked == "") {
        wx.setStorageSync('y_payMoney', "选择金额");
        wx.setStorageSync('y_payMoneyId', '');
        wx.setStorageSync('paymoneyenchangeValue', checked)
        wx.setStorageSync('paymoneyenchangeId', index)
        wx.setStorageSync('paymoneyenchangeCheck', enchangeCheck)
      } else {
        wx.setStorageSync('y_payMoney', checked);
        wx.setStorageSync('y_payMoneyId', index);
        wx.setStorageSync('paymoneyenchangeValue', checked)
        wx.setStorageSync('paymoneyenchangeId', index)
        wx.setStorageSync('paymoneyenchangeCheck', enchangeCheck)
      }
      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
      })
    }
  }
});