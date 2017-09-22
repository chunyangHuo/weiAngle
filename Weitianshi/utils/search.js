// 下拉框
function move(e,that) {
  let index = e.currentTarget.dataset.index;
  let currentIndex = that.data.currentIndex;
  this.initData();
  if (currentIndex != index) {
    that.setData({
      currentIndex: index
    })
    this.getOffset();
  } else {
    that.setData({
      currentIndex: 5
    })
  }
}
// 获取dropDown
function getOffset() {
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
function initData() {
  this.initItem('industry');
  this.initItem('stage');
  this.initItem('scale');
  this.initItem('hotCity');
}
function initItem(str) {
  let itemStr = str;
  let itemArrStr = str + 'Arr';
  let item = that.data[itemStr];
  let itemArr = that.data[itemArrStr]
  let searchData = that.data.searchData;
  let itemIdStr = '';
  let tab = that.data.tab;
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
  item.forEach(x => {
    x.check = false;
    if (searchData[itemStr].indexOf(x[itemIdStr]) != -1) {
      x.check = true;
      itemArr.push(x)
    }
  })
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
    [itemStr]: item,
    [itemArrStr]: itemArr,
    tab: tab
  })
}
// 标签选择
function tagsCheck(e) {
  let currentIndex = that.data.currentIndex;
  switch (currentIndex) {
    case 0:
      this.itemCheck(e, 'industry', 'industry_id');
      break;
    case 1:
      this.itemCheck(e, 'stage', 'stage_id');
      break;
    case 2:
      this.itemCheck(e, 'scale', 'scale_id');
      break;
    case 3:
      this.itemCheck(e, 'hotCity', 'area_id');
      break;
    default:
      console.log('tagCheck()出错了')
  }
}
function itemCheck(e, str, itemIdStr) {
  let that = that;
  let itemStr = str;
  let itemArrStr = str + 'Arr';
  let item = that.data[itemStr];
  let itemArr = that.data[itemArrStr];
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
    [itemStr]: item,
    [itemArrStr]: itemArr
  })
}
// 筛选重置
function reset() {
  let currentIndex = that.data.currentIndex;
  switch (currentIndex) {
    case 0:
      this.itemReset('industry')
      break;
    case 1:
      this.itemReset('stage')
      break;
    case 2:
      this.itemReset('scale')
      break;
    case 3:
      this.itemReset('hotCity')
      break;
    default:
      {
        this.itemReset('industry');
        this.itemReset('stage');
        this.itemReset('scale');
        this.itemReset('hotCity')
      }
  }
}
function itemReset(str) {
  let itemStr = str;
  let itemArrStr = str + 'Arr';
  let item = that.data[itemStr];
  let itemArr = that.data[itemArrStr];
  let searchData = that.data.searchData;
  item.forEach(x => {
    x.check = false;
  })
  itemArr = [];
  searchData[itemStr] = [];
  that.setData({
    [itemStr]: item,
    [itemArrStr]: itemArr,
    searchData: searchData
  })
}
// 筛选确定
function searchCertain() {
  let currentIndex = that.data.currentIndex;
  let searchData = that.data.searchData;
  let that = that;
  let newArr = [];
  switch (currentIndex) {
    case 0:
      that.data.industryArr.forEach(x => {
        newArr.push(x.industry_id)
      })
      searchData.industry = newArr;
      break;
    case 1:
      that.data.stageArr.forEach(x => {
        newArr.push(x.stage_id)
      })
      searchData.stage = newArr;
      break;
    case 2:
      that.data.scaleArr.forEach(x => {
        newArr.push(x.scale_id)
      })
      searchData.scale = newArr;
      break;
    case 3:
      that.data.hotCityArr.forEach(x => {
        newArr.push(x.area_id)
      })
      searchData.hotCity = newArr;
      break;
    default:
      console.log('searchCertain()出错了')
  }
  that.setData({
    searchData: searchData,
    requestCheck: true,
    currentPage: 1,
    page_end: false
  })
  console.log(searchData)
  return
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
      this.initData();
      if (res.data.data.length == 0) {
        that.setData({
          currentIndex: 5,
          myProject: res.data.data,
          notHave: 0
        })
      } else {
        that.setData({
          currentIndex: 5,
          myProject: res.data.data
        })
      }
    }
  });
}
// 点击modal层
function modal() {
  let currentIndex = that.data.currentIndex;
  that.setData({
    currentIndex: 5
  })
}
//搜索
function searchSth() {
  let user_id = that.data.user_id;
  wx.navigateTo({
    url: '/pages/my/projectShop/projectSearch/projectSearch?user_id=' + user_id,
  })
}

export {
  move,
  getOffset,
  initData,
  initItem,
  tagsCheck,
  itemCheck,
  reset,
  itemReset,
  searchCertain,
  modal,
  searchSth
}