var app = getApp();
var url_common = app.globalData.url_common;
var user_id=wx.getStorageSync('user_id');

// 创建项目
function toCreateProject() {
  var user_id = wx.getStorageSync('user_id');//获取我的user_id
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
          wx.navigateTo({
            url: '/pages/myProject/publishProject/publishProject'
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

// 在电脑上创建
function createProjectPc(){
  wx.scanCode({
    success: function (res) {
      var user_id = wx.getStorageSync('user_id');
      var credential = res.result;//二维码扫描信息
      //发送扫描结果和项目相关数据到后台
      wx.request({ 
        url: url_common + '/api/auth/writeUserInfo',
        data: {
          type: 'create',
          credential: credential,
          user_id: user_id,
          // pro_data: {
          //   "pro_intro": pro_intro,
          //   "industry": industry,
          //   "pro_finance_stage": pro_finance_stage,
          //   "pro_finance_scale": pro_finance_scale,
          //   "is_exclusive": is_exclusive,
          //   "pro_goodness": pro_goodness
          // }
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.status_code == 2000000) {
            wx.navigateTo({
              url: '/pages/scanCode/bpScanSuccess/bpScanSuccess',
            })
          }
        }
      })
    },
  })
}

function str2int(x){
  if(typeof x =='string'){
    return x*1
  }else{
    console.log(arguments)
    console.log('argument TYPE ERROR')
  }
}

let strArry=['1','2','3','4','5','7']

function map(x,y){
  if(typeof x !='function'){
    console.log()
  }else if(typeof y !='arry'){
    console.log()
  }else{

  }
}

str2int(8)
export {
  toCreateProject,createProjectPc
}