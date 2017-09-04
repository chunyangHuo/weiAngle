var rqj = require('../../Template/Template.js');
var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        winWidth: 0,//选项卡
        winHeight: 0,//选项卡
        currentTab: 0,//选项卡
        firstName: "代",
        id: "",
        page: 1,
        user_id: 0,
        industy_sort: [],
        bp_title: "",//bp名称
        ipo_release: "",
        // pro_company_name: "",//公司的名称
        pro_company_start_name: "",
        pro_goodness: "",//项目亮点
        projectName: "",
        companyName: "",
        pro_company_start_time: "",//项目创建时间
        pro_name: "",//项目名称
        pro_source: "",//项目来源
        pro_intro: "",//项目介绍
        stock: 0,
        page_end: false,
        pro_status: {},//运营状态
        loadMorecheck: true,//下拉加载更多判断,
        isChecked: true,
        checkEmail: false,
        textBeyond1: false,//项目亮点的全部和收起是否显示标志
        textBeyond2: false,//创始人的全部和收起是否显示标志
        textBeyond3: false,//资金用途的全部和收起是否显示标志
    },
    onLoad: function (options) {
        this.setData({
            index: options.index,
            id: options.id,
            currentTab: options.currentTab,
            shareType:options.type
        })
    },
    onShow: function () {
        //  投资人数据
        var that = this;
        var id = this.data.id;
        var index = this.data.index;
        var currentPage = this.data.currentPage;
        var avatarUrl = wx.getStorageSync('avatarUrl');
        var new_company_name = this.data.newCompanyName;
        var investor = this.data.investor;
        var industry_tag = [];
        var scale_tag = [];
        var stage_tag = [];
        var pro_goodness = "";
        // 为上拉加载准备
        app.initPage(that);
        // 判斷項目是不是自己的
        wx.request({
            url: url + '/api/project/projectIsMine',
            data: {
                project_id: id
            },
            method: 'POST',
            success: function (res) {
                var ownerId = res.data.user_id;
                //获取user_id
                app.loginPage(function (user_id) {
                    that.setData({
                        user_id: user_id,
                        avatarUrl: avatarUrl,
                    })
                    if (ownerId === user_id) {
                        // 载入买家图谱数据
                        wx.request({
                            url: url_common + '/api/project/getProjectMatchInvestors',
                            data: {
                                user_id: user_id,
                                project_id: id,
                                page: currentPage
                            },
                            method: 'POST',
                            success: function (res) {
                                var investor2 = res.data.data;
                                that.setData({
                                    investor2: investor2,
                                    page_end: res.data.page_end
                                });
                                wx.hideToast({
                                    title: 'loading...',
                                    icon: 'loading'
                                })
                            }
                        })
                        // 载入项目详情数据
                        wx.request({
                            url: url_common + '/api/project/getProjectDetail',
                            data: {
                                user_id: user_id,
                                project_id: that.data.id,
                            },
                            method: 'POST',
                            success: function (res) {
                                var project = res.data.data;
                                var user = res.data.user;
                                var count = project.count;
                                var pro_company_name = project.pro_company_name;
                                var pro_goodness = res.data.data.pro_goodness;
                                var industy_sort = [];
                                var firstName = user.user_name.substr(0, 1);
                                // 如果项目亮点字数超出字,刚显示全部按钮
                                if (pro_goodness.length > 50) {
                                    that.setData({
                                        textBeyond1: true
                                    })
                                }
                                that.setData({
                                    project: project,
                                    user: user,
                                    firstName: firstName,
                                    pro_company_name: pro_company_name,
                                    count: count
                                });
                                // 项目介绍的标签
                                var pro_industry = project.pro_industry;
                                for (var i = 0; i < pro_industry.length; i++) {
                                    industy_sort.push(pro_industry[i].industry_name)
                                }
                                that.setData({
                                    industy_sort: industy_sort,
                                    pro_industry: pro_industry
                                })
                                // 核心团队
                                if (project.core_users != 0) {
                                    let core_memberArray = project.core_users;
                                    core_memberArray.forEach((x, index) => {
                                        core_memberArray[index] = x;
                                    })
                                    that.setData({
                                        core_memberArray: core_memberArray
                                    })
                                }
                                // 标签 type:0; 项目标签 type:1 团队标签
                                let infoTagArray = project.tag;
                                let tagOfPro = [];//项目资料的标签
                                let teamOfPro = [];//核心团队的标签
                                for (var i = 0; i < infoTagArray.length; i++) {
                                    if (infoTagArray[i].type == 0) {
                                        tagOfPro.push(infoTagArray[i])
                                    } else if (infoTagArray[i].type == 1) {
                                        teamOfPro.push(infoTagArray[i])
                                    }
                                }
                                tagOfPro.forEach((x, index) => {
                                    tagOfPro[index].tag_name = x.tag_name;
                                })
                                teamOfPro.forEach((x, index) => {
                                    teamOfPro[index].tag_name = x.tag_name;
                                })
                                that.setData({
                                    tagOfPro: tagOfPro,
                                    teamOfPro: teamOfPro
                                })
                                // 融资信息
                                let pro_history_financeList = project.pro_history_finance;
                                pro_history_financeList.forEach((x, index) => {
                                    pro_history_financeList[index].finance_time = app.changeTime(x.finance_time);
                                    pro_history_financeList[index].pro_finance_scale = x.pro_finance_scale;
                                    pro_history_financeList[index].pro_finance_investor = x.pro_finance_investor;
                                    pro_history_financeList[index].belongs_to_stage.stage_name = x.belongs_to_stage.stage_name;

                                })
                                that.setData({
                                    pro_history_financeList: pro_history_financeList
                                })
                                // 里程碑
                                let mileStoneArray = project.pro_develop;
                                mileStoneArray.forEach((x, index) => {
                                    mileStoneArray[index].dh_start_time = app.changeTime(x.dh_start_time);
                                    mileStoneArray[index].dh_event = x.dh_event;
                                })

                                that.setData({
                                    mileStoneArray: mileStoneArray,
                                    industy_sort: industy_sort,
                                    pro_goodness: pro_goodness
                                });
                                //一键尽调
                                //公司信息
                                let company_name = that.data.pro_company_name;
                                if (company_name == '') {
                                    that.setData({
                                        nothing: 0
                                    })
                                }
                                wx.request({
                                    url: url_common + '/api/dataTeam/getCrawlerCompany',
                                    data: {
                                        user_id: user_id,
                                        company_name: company_name
                                    },
                                    method: 'POST',
                                    success: function (res) {
                                        let nothing = res.data.data
                                        if (nothing == 0) {
                                            that.setData({
                                                nothing: nothing
                                            })
                                        } else {
                                            let projectInfoList = res.data.data.project_product;
                                            let company = res.data.data.company;
                                            let com_id = company.com_id;
                                            let com_time = company.company_register_date;
                                            var time = app.changeTime(com_time);
                                            if (projectInfoList.length != 0) {
                                                projectInfoList.forEach((x, index) => {
                                                    projectInfoList[index] = x;
                                                })
                                            }
                                            that.setData({
                                                company: company,
                                                time: time,
                                                projectInfoList: projectInfoList,
                                                company_name: company_name
                                            })
                                            // 项目信息
                                            wx.request({
                                                url: url_common + '/api/dataTeam/getCrawlerProject',
                                                data: {
                                                    com_id: com_id
                                                },
                                                method: 'POST',
                                                success: function (res) {
                                                    let projectDetailsList = res.data.data;
                                                    if (projectDetailsList.length != 0) {
                                                        let projectDetailsOne = projectDetailsList[0];
                                                        let project_labelList = projectDetailsList[0].project_label;
                                                        let project_labelArray = project_labelList.split(","); //字符分割 
                                                        project_labelArray.forEach((x, index) => {
                                                            project_labelArray[index] = x;
                                                        })
                                                        that.setData({
                                                            projectDetailsOne: projectDetailsOne,
                                                            project_labelArray: project_labelArray
                                                        })
                                                    }
                                                    that.setData({
                                                        projectDetailsList: projectDetailsList
                                                    })
                                                }
                                            })
                                            //工商变更
                                            wx.request({
                                                url: url_common + '/api/dataTeam/getCrawlerBrand',
                                                data: {
                                                    com_id: com_id
                                                },
                                                method: 'POST',
                                                success: function (res) {
                                                    // 变更信息
                                                    let brandInfoList = res.data.data.brand;
                                                    let companyChangeList = res.data.data.company_change;
                                                    brandInfoList.forEach((x, index) => {
                                                        brandInfoList[index].company_brand_name = x.company_brand_name;
                                                        brandInfoList[index].company_brand_registration_number = x.company_brand_registration_number;
                                                        brandInfoList[index].company_brand_status = x.company_brand_status;
                                                        brandInfoList[index].company_brand_time = app.changeTime(x.company_brand_time);
                                                        brandInfoList[index].company_brand_type = x.company_brand_type;
                                                    })
                                                    companyChangeList.forEach((x, index) => {
                                                        companyChangeList[index].company_change_after = x.company_change_after;
                                                        companyChangeList[index].company_change_before = x.company_change_before;
                                                        companyChangeList[index].company_change_matter = x.company_change_matter;
                                                        companyChangeList[index].company_change_time = app.changeTime(x.company_change_time);
                                                    })
                                                    that.setData({
                                                        brandInfoList: brandInfoList,
                                                        companyChangeList: companyChangeList
                                                    })
                                                }
                                            })
                                            // 核心成员
                                            wx.request({
                                                url: url_common + '/api/dataTeam/getCrawlerTeam',
                                                data: {
                                                    com_id: com_id
                                                },
                                                method: 'POST',
                                                success: function (res) {
                                                    let teamList = res.data.data;
                                                    teamList.forEach((x, index) => {
                                                        teamList[index].team_member_name = x.team_member_name;
                                                    })
                                                    that.setData({
                                                        teamList: teamList
                                                    })
                                                }
                                            })
                                            // 历史融资
                                            wx.request({
                                                url: url_common + '/api/dataTeam/getCrawlerHistoryFinance',
                                                data: {
                                                    com_id: com_id
                                                },
                                                method: 'POST',
                                                success: function (res) {
                                                    let historyFinance = res.data.data;
                                                    historyFinance.forEach((x, index) => {
                                                        historyFinance[index].history_financing_money = x.history_financing_money;
                                                        historyFinance[index].history_financing_rounds = x.history_financing_rounds;
                                                        historyFinance[index].history_financing_who = x.history_financing_who;
                                                        historyFinance[index].history_financing_time = app.changeTimeStyle(x.history_financing_time);
                                                    })
                                                    that.setData({
                                                        historyFinance: historyFinance
                                                    })
                                                }
                                            })
                                            // 里程碑
                                            wx.request({
                                                url: url_common + '/api/dataTeam/getCrawlerMilestone',
                                                data: {
                                                    com_id: com_id
                                                },
                                                method: 'POST',
                                                success: function (res) {
                                                    let mileStone = res.data.data;
                                                    mileStone.forEach((x, index) => {
                                                        mileStone[index].milestone_event = x.milestone_event;
                                                        mileStone[index].milestone_time = app.changeTimeStyle(x.milestone_time);
                                                    })
                                                    that.setData({
                                                        mileStone: mileStone
                                                    })
                                                }
                                            })
                                            //新闻
                                            wx.request({
                                                url: url_common + '/api/dataTeam/getCrawlerNews',
                                                data: {
                                                    com_id: com_id
                                                },
                                                method: 'POST',
                                                success: function (res) {
                                                    let newsList = res.data.data;
                                                    newsList.forEach((x, index) => {
                                                        newsList[index].project_news_label = x.project_news_label;
                                                        newsList[index].source = x.source;
                                                        newsList[index].project_news_time = app.changeTimeStyle(x.project_news_time);
                                                        newsList[index].project_news_title = x.project_news_title;
                                                    })
                                                    that.setData({
                                                        newsList: newsList
                                                    })
                                                }
                                            })
                                            // 竞品
                                            wx.request({
                                                url: url_common + '/api/dataTeam/getCrawlerCompeting',
                                                data: {
                                                    com_id: com_id
                                                },
                                                method: 'POST',
                                                success: function (res) {
                                                    let competeList = res.data.data;
                                                    competeList.forEach((x, index) => {
                                                        competeList[index].source = x.source;
                                                        competeList[index].competing_goods_name = x.competing_goods_name;
                                                        competeList[index].competing_goods_label = x.competing_goods_label;
                                                        competeList[index].competing_goods_logo = x.competing_goods_logo;
                                                        competeList[index].competing_goods_Financing_rounds = x.competing_goods_Financing_rounds;
                                                        competeList[index].competing_goods_Financing_time = app.changeTimeStyle(x.competing_goods_Financing_time);
                                                        competeList[index].competing_goods_Set_up = app.changeTimeStyle(x.competing_goods_Set_up);
                                                        competeList[index].competing_goods_industry = x.competing_goods_industry;
                                                    })
                                                    that.setData({
                                                        competeList: competeList
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
                            },
                        })
                    } else {
                        wx.redirectTo({
                            url: '/pages/projectDetail/projectDetail?id=' + id + '&&share_id=0',
                        })
                    }
                });
            }
        })
    },
    //下拉刷新
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },
    /*滑动切换tab*/
    bindChange: function (e) {
        var that = this;
        var current = e.detail.current;
        that.setData({ currentTab: e.detail.current });
    },
    /*点击tab切换*/
    swichNav: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    //进入投资人用户详情
    detail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
        })
    },
    // 买家图谱上拉加载
    loadMore: function () {
        var that = this;
        var user_id = this.data.user_id;
        var id = this.data.id;
        var currentPage = this.data.currentPage;
        var request = {
            url: url_common + '/api/project/getProjectMatchInvestors',
            data: {
                user_id: user_id,
                project_id: id,
                page: currentPage
            },
        }
        //调用通用加载函数
        app.loadMore(that, request, "investor2", that.data.investor2)
    },
    //维护项目
    maintainProject() {
        var id = this.data.id;
        var user_id = this.data.user_id;
        wx.navigateTo({
            url: '/pages/myProject/editProject/editProject?pro_id=' + id + "&&user_id=" + user_id,
        })
    },
    //分享当前页面
    onShareAppMessage: function () {
        var pro_intro = this.data.project.pro_intro;
        let id = this.data.id;
        let share_id = this.data.view_id;
        let title = pro_intro;
        return {
            title: title,
            path: '/pages/myProject/projectDetail/projectDetail?id=' + id + "&&share_id=" + share_id,
            success: function (res) {
            },
            fail: function (res) {
                console.log(res)
            }
        }
    },
    //跳转到我的页面
    toMy: function () {
        wx.switchTab({
            url: '/pages/my/my/my',
        })
    },
    //更新数据
    updateData: function () {
        var simulationData = this.createSimulationData();
        var series = [{
            name: '成交量1',
            data: simulationData.data,
            format: function (val, name) {
                return val.toFixed(2) + '万';
            }
        }];
        lineChart.updateData({
            categories: simulationData.categories,
            series: series
        });
    },
    //查看全部
    checkMore: function (e) {
        let id = e.target.dataset.id;
        if (id == 1) {
            this.setData({
                companyMileStoneMore: 1
            })
        } else if (id == 2) {
            // 新闻接口
            this.setData({
                companyNews: 2
            })
        } else if (id == 3) {
            // 竞品
            this.setData({
                competitorMore: 3
            })
        } else if (id == 4) {
            this.setData({
                historyMore: 4
            })
        } else if (id == 5) {
            this.setData({
                industrialChangeMore: 5
            })
        }
    }, 
    // 折叠
    noCheckMore: function (e) {
        let id = e.target.dataset.id;
        if (id == 1) {
            this.setData({
                companyMileStoneMore: 0
            })
        } else if (id == 2) {
            this.setData({
                companyNews: 0
            })
        } else if (id == 3) {
            this.setData({
                competitorMore: 0
            })
        } else if (id == 4) {
            this.setData({
                historyMore: 0
            })
        } else if (id == 5) {
            this.setData({
                industrialChangeMore: 0
            })
        }
    },
    // 浏览
    viewProject: function (e) {
        let projectId = e.currentTarget.dataset.proid;
        wx.setStorageSync("projectId", projectId)
        wx.navigateTo({
            url: '/pages/message/viewProjectUser/viewProjectUser',
        })
    },
    // 完善公司信息
    writeCompanyName: function () {
        let that = this;
        let user_id = wx.getStorageSync('user_id');
        let companyName = that.data.pro_company_name;
        wx.navigateTo({
            url: '/pages/search/search1/search1?company=' + companyName + '&&type=8' + '&&user_id=' + user_id,
        })
        that.setData({
            nothing: 1
        })
    },
    // 查看bp
    sendBp: function () {
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
        let user_id = wx.getStorageSync('user_id');
        // index 0:发送BP; 
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
                        that.setData({
                            userEmail: userEmail
                        })
                        if (res.data.status_code == 2000000) {
                            wx.request({
                                url: url_common + '/api/mail/sendBp',
                                data: {
                                    user_id: user_id,
                                    project_id: project_id
                                },
                                method: 'POST',
                                success: function (res) {
                                }
                            })
                            that.setData({
                                sendPc: 0
                            })
                        } else {
                            console.log(res)
                        }
                    }
                })
                that.setData({
                    sendPc: 0,
                    userEmail: userEmail
                })
            } else {
              app.errorHide(that, '请正确填写邮箱', 1000)
            }
        }
    },
    // 取消
    bpModalCancel: function (options) {
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
    // 项目详情-里程碑 查看全部
    moreInfo: function (e) {
        let id = e.target.dataset.id;
        let that = this;
        if (id == 3) {
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
    //项目详情页面,申请查看跳转列表
    applyPerson: function (e) {
        let proid = e.target.dataset.proid;
        wx.navigateTo({
            url: '/pages/message/applyPerson/applyPerson?id=' + proid,
        })
    }
});