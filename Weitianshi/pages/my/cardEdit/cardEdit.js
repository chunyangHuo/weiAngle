var rqj = require('../../Template/Template.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {},
    onLoad: function (options) {
        var that = this;
        var user_id = wx.getStorageSync('user_id');
        that.setData({
            user_id: user_id,
        })

        //获取用户信息
        wx.request({
            url: url_common + '/api/user/getUserAllInfo',
            data: {
                share_id: 0,
                user_id: user_id,
                view_id: user_id
            },
            method: 'POST',
            success: function (res) {
                that.setData({
                    user_info: res.data.user_info,
                    name: res.data.user_info.user_real_name,
                    mobile: res.data.user_info.user_real_mobile,
                    career: res.data.user_info.user_company_career,
                    company: res.data.user_info.user_company_name,
                    describe: res.data.user_info.user_intro,
                    companybrand: res.data.user_info.user_brand,
                })
            },
            fail: function (res) {
                console.log(res)
            },
        })
    },
    //姓名
    nameEdit: function (e) {
        var that = this;
        var name = e.detail.value;
        that.setData({
            name: name
        })
    },
    //手机号码
    mobileEdit: function (e) {
        var that = this;
        var mobile = e.detail.value;
        that.setData({
            mobile: mobile
        })
    },
    //公司
    companyEdit: function (e) {
        var that = this;
        var company = e.detail.value;
        wx.request({
            url: url_common + '/api/dataTeam/checkCompany',
            data: {
                com_name: company
            },
            method: 'POST',
            success: function (res) {
            }
        })
        that.setData({
            company: company
        })
    },
    //职位
    careerEdit: function (e) {
        var that = this;
        var career = e.detail.value;
        that.setData({
            career: career
        })
    },
    //邮箱
    eMailEdit: function (e) {
        var that = this;
        var eMail = e.detail.value;
        that.setData({
            eMail: eMail
        })
    },
    //描述
    describeEdit: function (e) {
        var that = this;
        var describe = e.detail.value;
        that.setData({
            describe: describe
        })
    },
    //品牌
    brandEdit: function (e) {
        var that = this;
        var companybrand = e.detail.value;
        that.setData({
            companybrand: companybrand
        })
    },
    //头像
    headPic() {
        let that = this;
        let user_id = this.data.user_id;
        let user_info = this.data.user_info;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                let avatar = tempFilePaths[0];
                let size = res.tempFiles[0].size;
                if (size <= 1048576) {
                    wx.uploadFile({
                        url: url_common + '/api/team/uploadLogo', //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'avatar',
                        formData: {
                            user_id: user_id,
                        },
                        success: function (res) {
                            let data = JSON.parse(res.data);
                            let image_id = data.data.image_id;
                            that.setData({
                                image_id: image_id
                            })
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
    //确定
    save: function () {
        var that = this;
        var name = this.data.name.trim();
        var company = this.data.company.trim();
        var career = this.data.career.trim();
        var eMail = this.data.eMail;
        var describe = this.data.describe;
        var companybrand = this.data.companybrand;
        var user_id = wx.getStorageSync('user_id');
        var image_id = this.data.image_id;
        console.log(image_id)
        // 修复bug临时使用(公司,职位,姓名改为非必填)
        if (name == '') {
            app.errorHide(that, "姓名不能为空", 1500)
        } else if (company == '') {
            app.errorHide(that, "公司不能为空", 1500)
        } else if (career == '') {
            app.errorHide(that, "职位不能为空", 1500)
        } else {
            wx.request({
                url: url_common + '/api/user/updateUser',
                data: {
                    user_id: user_id,
                    user_real_name: name,
                    user_company_name: company,
                    user_company_career: career,
                    user_email: eMail,
                    user_intro: describe,
                    user_brand: companybrand,
                    user_avatar:image_id
                },
                method: 'POST',
                success: function (res) {
                    if (res.data.status_code == 2000000) {
                        wx.switchTab({
                            url: '/pages/my/my/my',
                        })
                    } else {
                        wx.showModal({
                            title: "错误提示",
                            content: res.data.error_msg,
                            showCancel: false
                        })
                    }
                },
                fail: function (res) {
                    console.log(res)
                },
            })
        }
    }
})