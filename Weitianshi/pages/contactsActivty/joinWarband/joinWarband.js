var rqj = require('../../Template/Template.js')
var app = getApp()
var url = app.globalData.url;
var url_common = app.globalData.url_common;
Page({
    data: {
        joinedWarband: [],
        warband: [],
        page_end: false,
    },
    onLoad(options) {
        let that = this;
        app.initPage(that)
        that.getInfo('', 1)
    },
    onShow() { },
    //选中noChecked
    noChecked(e) {
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
    //选中checked
    checked(e) {
        console.log(e)
    },
    //获取战队信息
    getInfo(search, page) {
        let that = this;
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
                    console.log('teams',thisData.teams)
                    thisData.teams.forEach(x=>{
                        x.check=false;
                    })
                    that.setData({
                        warband: thisData.teams,
                        page_end: thisData.page_end
                    })
                } else {
                    app.errorHide(that, res, 3000)
                }
            }
        })
    }
})