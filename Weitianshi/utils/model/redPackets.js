export class redPackets {
  constructor() { }

  name(){
    console.log(1)
  }

  getUserInfo(){
    return app.httpPost({
      url: app.globalData.common_url + ''
    },this).then(res=>{
      console.log(res)
    })
  } 
}