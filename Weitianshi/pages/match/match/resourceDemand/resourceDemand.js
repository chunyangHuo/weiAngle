var rqj = require('../../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        enchange: [],//接口给的标签
        checked: [],//已经选中的标签的值
        checkedId: [],//已经选中标签的id
        target: [],//接口给的标签
        t_checked: [],//已经选中的标签的值
        t_checkedId: [],//已经选中标签的id
        error: "0",
        error_text: "",
    },
    onLoad: function (options) {
        var that = this;
        var current = options.current;//current=1:从my页面跳转过来的
        this.setData({
            current: current
        })
        //获取资源分类名称和id
        wx.request({
            url: app.globalData.url_common + '/api/category/getResourceCategory',
            data: {},
            method: 'POST',
            success: function (res) {
                //判断用户是否填写过资源需求
                console.log(res);
                var res_find = wx.getStorageSync("resource_find");//寻求的资源
                var res_give = wx.getStorageSync("resource_give"); //可提供的资源
                var describe = wx.getStorageSync("resource_desc");//具体描述
                var enchange = res.data.data;//当前可提供资源的object
                console.log(describe);
                var target = res.data.data;//当前在寻求资源的object
                var res_find_name = [];//寻求的资源名称和id
                var res_find_id = []; //提供的名称和id
                var res_give_name = [];//可提供的资源添加名称和id
                var res_give_id = [];
                if (res_find) { // 可寻求的资源
                    // 遍历 可寻求资源的长度,遍历取出可提供的名字和id
                    for (var i = 0; i < res_find.length; i++) {
                        // 将取出的名字和id添加到对应的数组中
                        res_find_name.push(res_find[i].resource_name);
                        res_find_id.push(res_find[i].resource_id);
                    }
                }
                //可提供的资源添加名称和id
                if (res_give) {
                    for (var i = 0; i < res_give.length; i++) {
                        res_give_name.push(res_give[i].resource_name);
                        res_give_id.push(res_give[i].resource_id)
                    }
                }
                var targetValue = res_find_name    //选中寻求资源的标签值的数组
                var targetId = res_find_id   //选中寻求资源的标签id的数组
                var targetCheck = []    //选中寻求资源的标签checked的数组
                var enchangeValue = res_give_name    //选中可提供资源的标签值的数组
                var enchangeId = res_give_id   //选中可提供资源的标签id的数组
                var enchangeCheck = []    //选中可提供资源的标签checked的数组
                for (var i = 0; i < enchange.length; i++) {
                    if (res_give_name.indexOf(enchange[i].resource_name) != -1) {//如果enchange里面的资源名称,么米有在give里面,那么 给checked  一个布尔值
                        enchange[i].checked = true;
                    } else {
                        enchange[i].checked = false;
                    }
                    enchangeCheck.push(enchange[i].checked)
                }
                for (var i = 0; i < target.length; i++) {
                    if (res_find_name.indexOf(target[i].resource_name) != -1) {
                        target[i].checked = true;
                    } else {
                        target[i].checked = false;
                    }
                    targetCheck.push(target[i].checked)
                }
                that.setData({
                    enchange: enchange,
                    enchangeValue: enchangeValue,
                    enchangeId: enchangeId,
                    enchangeCheck: enchangeCheck,
                    target: target,
                    targetValue: targetValue,
                    targetId: targetId,
                    targetCheck: targetCheck,
                    describe: describe
                });
            },
            fail: function (res) {
                console.log(res)
            },
        })

    },

    //下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },

    //传值部份可提供资源
    checkboxChange: function (e) {
        // console.log(e);
        var that = this;
        // console.log(that)
        var thisData = e.currentTarget.dataset;
        // console.log(thisData)
        var e_index = thisData.index;//数组下标
        var e_value = thisData.value;
        var e_check = thisData.check;
        var enchange = this.data.enchange//返回的所有数据
        var enchangeValue = this.data.enchangeValue;
        var enchangeId = this.data.enchangeId;//已添加的数字
        var enchangeCheck = this.data.enchangeCheck;
        //console.log(enchangeCheck);
        if (enchangeCheck[e_index] == false) {//当确认按钮时
            if (enchangeValue.length < 5) {
                enchangeCheck[e_index] = true;
                enchange[e_index].checked = true;
                enchangeValue.push(enchange[e_index].resource_name)
                // console.log(enchange[e_index].resource_id);//数据的排序ID(0,1,2)
                enchangeId.push(enchange[e_index].resource_id)//点击时把数据的ID添加起来
            } else {
                rqj.errorHide(that, "最多可选择五项", 1000)
            }
        } else {//当取消按钮时
            enchangeCheck[e_index] = false;
            enchange[e_index].checked = false;
            // console.log(enchangeValue);
            enchangeValue.splice(enchangeValue.indexOf(e_value), 1)
            // console.log(enchangeValue.indexOf(e_value))
            // console.log(enchangeId.indexOf(e_index))
            enchangeId.splice(enchangeId.indexOf(e_index + 1), 1)
        }
        this.setData({
            enchange: enchange,
            enchangeValue: enchangeValue,
            enchangeId: enchangeId,
            enchangeCheck: enchangeCheck,
        });
        console.log(enchangeValue, enchangeId)
    },
    //传值部份2寻求资源
    checkboxChange2: function (e) {
        // console.log(e)
        var that = this;
        var thisData = e.currentTarget.dataset;
        // console.log(thisData)
        var e_index = thisData.index;
        var e_value = thisData.value;
        var e_check = thisData.check;
        var target = this.data.target
        var targetValue = this.data.targetValue;
        var targetId = this.data.targetId;
        var targetCheck = this.data.targetCheck;

        if (target[e_index].checked == false) {
            if (targetValue.length < 5) {
                targetCheck[e_index] = true;
                target[e_index].checked = true;
                targetValue.push(target[e_index].resource_name)
                targetId.push(target[e_index].resource_id)
            } else {
                rqj.errorHide(that, "最多可选择五项", 1000)
            }
        } else {
            targetCheck[e_index] = false;
            target[e_index].checked = false;
            targetValue.splice(targetValue.indexOf(e_value), 1)
            targetId.splice(targetId.indexOf(e_index + 1), 1)
        }
        this.setData({
            target: target,
            targetValue: targetValue,
            targetId: targetId,
            targetCheck: targetCheck
        });
        console.log(targetValue, targetId)
    },
    //具体描述
    bindTextAreaBlur: function (e) {
        var describe = e.detail.value;
        this.setData({
            describe: describe
        })
        console.log(describe)
    },

    //可提供资源自定义添加
    offerAdd: function () {
        wx.showModal({
            title: "自定义标签",
            content: "<input type='text' placehold='helloWorld'/>"
        })
    },

    //点击确定
    publish: function () {
        var that = this;
        var enchange = this.data.enchange;
        var enchangeValue = this.data.enchangeValue;
        var enchangeId = this.data.enchangeId;
        var target = this.data.target
        var targetValue = this.data.targetValue;
        var targetId = this.data.targetId;
        var user_id = wx.getStorageSync('user_id');
        var describe = this.data.describe;
        var current = this.data.current;
        console.log(targetValue, enchangeValue);
        if (targetValue != '' || enchangeValue != '') {
            wx.request({
                url: url + '/api/resource/insertResource',
                data: {
                    user_id: user_id,
                    res_give: enchangeId,
                    res_find: targetId,
                    res_desc: describe
                },
                method: 'POST',
                success: function (res) {
                    console.log(enchangeId, targetId, describe)
                },
                fail: function (res) {
                    console.log(res)
                }
            })
            if (current == 1) {
                wx.switchTab({
                    url: '/pages/my/my/my',
                })
            } else {
                wx.navigateBack({//页面返回
                    delta: 1 // 回退前 delta(默认为1) 页面
                })
            }
        } else if (targetValue == '' || enchangeValue != '') {
            rqj.errorHide(that, "不能都为空", 1500)
        }


    }
});
