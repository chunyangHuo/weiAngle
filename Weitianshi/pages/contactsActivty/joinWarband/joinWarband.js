var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        joinedWarband: [],
        warband: [],
        page_end: false,
        timer:'',
    },
    onLoad(options) {
        let that = this;
        app.initPage(that)
        that.getInfo('', 1)
    },
    onShow() { },
    //搜索战队
    searchSth(e){
        let that=this;
        let timer=this.data.timer;
        // console.log(str)
        //防止多次请求进行延时处理
        if(timer){
            clearTimeout(timer)
        }
        timer=setTimeout(x=>{
            this.getInfo(str,1)
        },1000)
        this.setData({
            timer:timer
        })
    },
    //所有战队勾选框
    checkbox1(e) {
        let team=e.currentTarget.dataset.team;
        let index=e.currentTarget.dataset.index;
        let joinedWarband=this.data.joinedWarband;
        let warband=this.data.warband;
        if(team.check==false){
            warband[index].check=true;
            joinedWarband.push(team)
        }else{
            warband[index].check=false;
            joinedWarband.forEach((x,index)=>{
                if (x.team_id===team.team_id){
                    joinedWarband.splice(index,1)
                }
            })
        }
        this.setData({
            warband:warband,
            joinedWarband:joinedWarband
        })
    },
    //加入战队勾选框
    checkbox2(e){
        let teams=e.currentTarget.dataset.team;
        let joinedWarband=this.data.joinedWarband;
        joinedWarband.forEach((x,index)=>{
            console.log(x.team_id,teams.team_id)
            if(x.team_id===teams.team_id){
                joinedWarband.splice(index,1)
            }
        })
        this.setData({
            joinedWarband:joinedWarband
        })
    },
    //获取战队信息
    getInfo(search, page) {
        let that = this;
        let joinedWarband=that.data.joinedWarband;
        wx.request({
            url: url + '/api/team/search',
            data: {
                search: search,
                page: page
            },
            method: 'POST',
            success(res) {
                if (res.data.status_code === 2000000) {
                    let thisData = res.data.data;
                    let teams=thisData.teams;
                    console.log('teams',thisData.teams)
                    teams.forEach(x=>{
                        x.check=false;
                    })
                    //给已经加入的战队重新挂上check=true属性
                    if(joinedWarband && teams && joinedWarband.length!=0){
                        teams.forEach(x=>{
                            joinedWarband.forEach(y => {
                                if (x.team_id === y.team_id) {
                                    x.check = true;
                                }
                            })
                        })
                    }
                    that.setData({
                        warband: teams,
                        page_end: thisData.page_end
                    })
                } else {
                    app.errorHide(that, res, 3000)
                }
            }
        })
    }
})