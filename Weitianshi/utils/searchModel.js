var app = getApp();
var url_common = app.globalData.url_common;
//searchData
let data = {
  firstTime: true,
   tab: [
    { name: '领域', check: false, arr: false, id: 'industry' },
    { name: '轮次', check: false, arr: false, id: "stage" },
    { name: '金额', check: false, arr: false, id: "scale" },
    { name: '地区', check: false, arr: false, id: "hotCity" }
  ], 
  /* tab: [
    { name: '领域', check: false, arr: false, id: 'industry' },
    { name: '地区', check: false, arr: false, id: "stage" },
    { name: '类型 ', check: false, arr: false, id: "scale" },
    { name: '风格', check: false, arr: false, id: "hotCity" }
  ], */
  currentIndex: 5,
  industryArr: [],
  stageArr: [],
  scaleArr: [],
  hotCityArr: [],
  searchData: {
    industry: [],
    stage: [],
    scale: [],
    hotCity: [],
    search: "",
  },
  industry: wx.getStorageSync('industry'),
  stage: wx.getStorageSync('stage'),
  scale: wx.getStorageSync('scale'),
  hotCity: wx.getStorageSync('hotCity')
}

// 下拉框
function move(e, that) {
  let SearchInit = that.data.SearchInit;
  let index = e.currentTarget.dataset.index;
  let currentIndex = SearchInit.currentIndex;
  this.initData(that);
  //如果无industry之类没缓存获取各分类的信息并存入缓存
  if (currentIndex != index) {
    SearchInit.currentIndex = index;
    that.setData({
      SearchInit: SearchInit
    })
    this.getOffset(that);
  } else {
    SearchInit.currentIndex = 5;
    that.setData({
      SearchInit: SearchInit
    })
  }
}
// 获取dropDown
function getOffset(that) {
  let query = wx.createSelectorQuery();
  query.select('.dropDown').fields({
    dataset: true,
    size: true,
  }, function (res) {
    res.dataset    // 节点的dataset
    res.width      // 节点的宽度
    res.height     // 节点的高度
  }).exec()
}
// 初始化check值(辅助函数)
function initData(that) {
  this.initItem('industry', that);
  this.initItem('stage', that);
  this.initItem('scale', that);
  this.initItem('hotCity', that);
}
function initItem(str, that) {
  let SearchInit = that.data.SearchInit;
  let itemStr = str;
  let itemArrStr = str + 'Arr';
  let item = SearchInit[itemStr];
  let itemArr = SearchInit[itemArrStr]
  let searchData = SearchInit.searchData;
  let itemIdStr = '';
  let tab = SearchInit.tab;
  switch (itemStr) {
    case 'industry':
      itemIdStr = 'industry_id'
      break;
    case 'stage':
      itemIdStr = 'stage_id'
      break;
    case 'scale':
      itemIdStr = 'scale_id'
      break;
    case 'hotCity':
      itemIdStr = 'area_id'
      break;
    default:
      console.log('initItem()出了问题')
  }
  itemArr = [];
  if (item) {
    item.forEach(x => {
      x.check = false;
      if (searchData[itemStr].indexOf(x[itemIdStr]) != -1) {
        x.check = true;
        itemArr.push(x)
      }
    })
  }

  tab.forEach(x => {
    if (x.id == itemStr) {
      if (itemArr.length > 0) {
        x.arr = true;
      } else {
        x.arr = false;
      }
    }
  })
  that.setData({
    SearchInit: SearchInit,
  })
}
// 标签选择
function tagsCheck(e, that) {
  let currentIndex = that.data.SearchInit.currentIndex;
  switch (currentIndex) {
    case 0:
      this.itemCheck(e, 'industry', 'industry_id', that);
      break;
    case 1:
      this.itemCheck(e, 'stage', 'stage_id', that);
      break;
    case 2:
      this.itemCheck(e, 'scale', 'scale_id', that);
      break;
    case 3:
      this.itemCheck(e, 'hotCity', 'area_id', that);
      break;
    default:
      console.log('tagCheck()出错了')
  }
}
function itemCheck(e, str, itemIdStr, that) {
  let SearchInit = that.data.SearchInit;
  let itemStr = str;
  let itemArrStr = str + 'Arr';
  let item = SearchInit[itemStr];
  let itemArr = SearchInit[itemArrStr];
  let target = e.currentTarget.dataset.item;
  let index = e.currentTarget.dataset.index;
  if (target.check == false) {
    if (itemArr.length < 5) {
      item[index].check = true;
      itemArr.push(target)
    } else {
      app.errorHide(that, '不能选择超过5个标签', 3000)
    }
  } else {
    item[index].check = false;
    itemArr.forEach((y, index) => {
      if (target[itemIdStr] == y[itemIdStr]) {
        itemArr.splice(index, 1)
      }
    })
  }
  that.setData({
    SearchInit: SearchInit
  })
}
// 筛选重置
function reset(that) {
  let currentIndex = that.data.SearchInit.currentIndex;
  switch (currentIndex) {
    case 0:
      this.itemReset('industry', that)
      break;
    case 1:
      this.itemReset('stage', that)
      break;
    case 2:
      this.itemReset('scale', that)
      break;
    case 3:
      this.itemReset('hotCity', that)
      break;
    default:
      {
        this.itemReset('industry', that);
        this.itemReset('stage', that);
        this.itemReset('scale', that);
        this.itemReset('hotCity', that)
      }
  }
}
function allReset(that) {
  this.itemReset('industry', that);
  this.itemReset('stage', that);
  this.itemReset('scale', that);
  this.itemReset('hotCity', that);
}
function itemReset(str, that) {
  let SearchInit = that.data.SearchInit;
  let itemStr = str;
  let itemArrStr = str + 'Arr';
  let item = SearchInit[itemStr];
  let itemArr = SearchInit[itemArrStr];
  let searchData = SearchInit.searchData;
  item.forEach(x => {
    x.check = false;
  })
  SearchInit[itemArrStr] = [];
  searchData[itemStr] = [];
  that.setData({
    SearchInit: SearchInit
  })
}
// 筛选确定
function searchCertain(that) {
  let SearchInit = that.data.SearchInit;
  let currentIndex = that.data.SearchInit.currentIndex;
  let searchData = that.data.SearchInit.searchData;
  let newArr = [];
  switch (currentIndex) {
    case 0:
      SearchInit.industryArr.forEach(x => {
        newArr.push(x.industry_id)
      })
      searchData.industry = newArr;
      break;
    case 1:
      SearchInit.stageArr.forEach(x => {
        newArr.push(x.stage_id)
      })
      searchData.stage = newArr;
      break;
    case 2:
      SearchInit.scaleArr.forEach(x => {
        newArr.push(x.scale_id)
      })
      searchData.scale = newArr;
      break;
    case 3:
      SearchInit.hotCityArr.forEach(x => {
        newArr.push(x.area_id)
      })
      searchData.hotCity = newArr;
      break;
    default:
      console.log('searchCertain()出错了')
  }
  that.setData({
    SearchInit: SearchInit,
    requestCheck: true,
    currentPage: 1,
    page_end: false
  })
  console.log(that.data.SearchInit)

  return searchData;

  //发送筛选请求
  wx.request({
    url: url_common + '/api/project/getMyProjectList',
    data: {
      user_id: that.data.user_id,
      filter: searchData
    },
    method: 'POST',
    success: function (res) {
      console.log(res)
      this.initData(that);
      let SerachInit = that.data.SearchInit;
      SearchInit.currentInit = 5;
      if (res.data.data.length == 0) {
        that.setData({
          SearchInit: SearchInit,
          myProject: res.data.data,
          notHave: 0
        })
      } else {
        let SerachInit = that.data.SearchInit;
        SearchInit.currentInit = 5;
        that.setData({
          SearchInit: SearchInit,
          myProject: res.data.data
        })
      }
    }
  });
}
// 点击modal层
function modal(that) {
  let SearchInit = that.data.SearchInit;
  SearchInit.currentIndex = 5;
  that.setData({
    SearchInit: SearchInit
  })
}
//搜索
function searchSth(that, str) {
  let user_id = that.data.user_id;
  wx.navigateTo({
    url: '/pages/search/search3/search3?user_id=' + user_id + '&&entrance=' + str,
  })
}

export {
  data,
  move,
  getOffset,
  initData,
  initItem,
  tagsCheck,
  itemCheck,
  reset,
  allReset,
  itemReset,
  searchCertain,
  modal,
  searchSth
}