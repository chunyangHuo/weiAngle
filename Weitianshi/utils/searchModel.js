var app = getApp();
var url_common = app.globalData.url_common;
import * as request from './httpModel';
//searchData
let data = {
  firstTime: true,
  tab: [
    { type: 1, name: '领域', label: 'industry', itemId: 'industry_id', itemName: 'industry_name', longCheckBox: false },
    { type: 1, name: '轮次', label: "stage", itemId: 'stage_id', itemName: 'stage_name', longCheckBox: false },
    { type: 1, name: '金额', label: "scale", itemId: 'scale_id', itemName: 'scale_money', longCheckBox: true },
    { type: 1, name: '地区', label: "hotCity", itemId: 'area_id', itemName: 'area_title', longCheckBox: false }
  ],
  labelToId: {
    'industry': 'industry_id',
    'stage': 'stage_id',
    'scale': 'scale_id',
    'hotCity': 'area_id',
    'label_industry': 'industry_id',
    'label_area': 'area_id',
    'label_style': 'style_id',
    'label_type': 'type_id',
    'label_time': 'time_id'
  },
  currentIndex: 99,
  searchData: {
    industry: [],
    stage: [],
    scale: [],
    hotCity: [],
    label_industry: [],
    label_area: [],
    label_style: [],
    label_type: [],
    label_time: [],
    search: "",
  },
  industryArr: [],
  stageArr: [],
  scaleArr: [],
  hotCityArr: [],
  // label_industryArr: [],
  label_areaArr: [],
  label_styleArr: [],
  label_typeArr: [],
  label_timeArr: [],
  industry: wx.getStorageSync('industry'),
  stage: wx.getStorageSync('stage'),
  scale: wx.getStorageSync('scale'),
  hotCity: wx.getStorageSync('hotCity'),
  // label_industry: label_industry || wx.getStorageSync('label_industry'),
  label_area: wx.getStorageSync('label_area'),
  label_style: wx.getStorageSync('label_style'),
  label_type: wx.getStorageSync('label_type'),
  label_time: wx.getStorageSync('label_time')
}
let label_industry = []
let linkDataShow = {
  selectData: [],
  firstStair: [],
  secondStair: '',
}
// 将label_industry分组
function initGroup() {
  let originalData = wx.getStorageSync('label_industry');
  originalData.forEach((x, index) => {
    label_industry.push(x)
    linkDataShow.firstStair.push({
      industry_id: x.industry_id,
      industry_name: x.industry_name,
      check: false
    })
  })
  linkDataShow.firstStair[0].check = true;
  linkDataShow.secondStair = label_industry[0].child;
}
initGroup()
console.log(label_industry)
console.log(linkDataShow)
// label=>itemIdStr
function labelToId(label) {
  if (typeof label != 'string') {
    throw Error('labelToId的参数必须为字符串')
  }
  return data.labelToId[label];
}
//更改搜索模块初始化设置
function reInitSearch(that, data) {
  let SearchInit = that.data.SearchInit;
  if (typeof data != 'object') {
    throw Error('reInitSearch的第二个参数类型必须为对象');
    return
  }
  for (let key in data) {
    SearchInit[key] = data[key];
  }
  that.setData({
    SearchInit: SearchInit
  })
}
// 下拉框
function move(e, that) {
  let time1 = new Date().getTime();
  let SearchInit = that.data.SearchInit;
  let index = e.currentTarget.dataset.index;
  let label = e.currentTarget.dataset.label;
  let currentIndex = SearchInit.currentIndex;
  // 清除未保存的选中标签
  // SearchInit=Object.assign({},that.data.SearchInit)
  this.initItem(label, that, SearchInit)
  if (currentIndex != index) {
    SearchInit.currentIndex = index;
    let time1 = new Date().getTime();
    that.setData({
      SearchInit: SearchInit
    })
    // console.log('setData_SearchInit', new Date().getTime() - time1)
  } else {
    SearchInit.currentIndex = 99;
    that.setData({
      SearchInit: SearchInit
    })
  }
  // console.log('下拉框完成', new Date().getTime() - time1)
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
// 初始化所有check值
function initData(that) {
  let SearchInit = that.data.SearchInit;
  let tab = SearchInit.tab;
  tab.forEach(x => {
    this.initItem(x.label, that, SearchInit)
  })
}
// 初始化某项check值(辅助函数)
function initItem(str, that, SearchInit) {
  let itemStr = str;
  let itemArrStr = str + 'Arr';
  let item = SearchInit[itemStr];
  let itemArr = SearchInit[itemArrStr]
  let searchData = SearchInit.searchData;
  let itemIdStr = '';
  let tab = SearchInit.tab;

  itemIdStr = SearchInit.labelToId[itemStr]
  itemArr = [];
  // 有联动关系的下拉表和无联动关系的下拉表
  if (item) {
    if (item[0].child) {
      item.forEach((x, index) => {
        x.child.forEach((y, index2) => {
          y.check = false;
          if (searchData[itemStr].indexOf(y[itemIdStr]) != -1) {
            y.check = true;
            itemArr.push(y)
          }
        })
      })
    } else {
      item.forEach(x => {
        x.check = false;
        if (searchData[itemStr].indexOf(x[itemIdStr]) != -1) {
          x.check = true;
          itemArr.push(x)
        }
      })
    }
  }
  SearchInit[itemStr] = item;
  SearchInit[itemArrStr] = itemArr;

  let time1 = new Date().getTime();
  that.setData({
    SearchInit: SearchInit,
  })
  // console.log('setDate_SearchInit2', new Date().getTime() - time1)
}
// 选择一级标签
function firstLinkCheck(e, that) {
  let SearchInit = that.data.SearchInit;
  let label = e.currentTarget.dataset.label; // 联动标签在tab中的label名
  let tabIndex = e.currentTarget.dataset.tabindex; //联动标签在tab中的index
  let firstIndex = e.currentTarget.dataset.firstindex;  //点击的一级标签的index
  let tab = SearchInit.tab;

  //一级标签背景变色
  SearchInit[label].forEach(x => {
    x.check = false;
  })
  SearchInit[label][firstIndex].check = true;

  tab[tabIndex].page = firstIndex;
  that.setData({
    SearchInit: SearchInit
  })
}
// 联动标签选择全部
function linkCheckAll(e, that) {
  let SearchInit = that.data.SearchInit;
  let label = e.currentTarget.dataset.label;
  let firstLink = e.currentTarget.firstindex;
  let page = e.currentTarget.dataset.page;
  let itemArr = SearchInit[label + 'Arr'];

  SearchInit[label][page].child.forEach(x => {
    x.check = true;
    itemArr.push(x)
  })
  that.setData({
    SearchInit: SearchInit
  })

}
// 标签选择
function tagsCheck(e, that) {
  let time1 = new Date().getTime();
  let str = e.currentTarget.dataset.str;
  let itemIdStr = e.currentTarget.dataset.itemidstr;
  let SearchInit = that.data.SearchInit;
  let itemStr = str;
  let itemArrStr = str + 'Arr';
  let item = SearchInit[itemStr];
  let itemArr = SearchInit[itemArrStr];
  let target = e.currentTarget.dataset.item;
  let index = e.currentTarget.dataset.index;
  let firstIndex = e.currentTarget.dataset.firstindex;
  let secondIndex = e.currentTarget.dataset.secondindex;

  // 有联动关系的下拉表
  if (item[0].child) {
    let linkItem = item[firstIndex].child[secondIndex];
    console.log(linkItem)
    if (linkItem.check == false) {
      linkItem.check = true;
      linkItem.firstIndex = firstIndex;
      linkItem.secondIndex = secondIndex;
      itemArr.push(linkItem)
    } else {
      linkItem.check = false;
      itemArr.forEach((x, index) => {
        if (linkItem[itemIdStr] == x[itemIdStr]) {
          itemArr.splice(index, 1)
        }
      })
    }
  } else {
    // 无联动关系的下拉表  
    if (target.check == false) {
      if (str == "label_time") {
        item.forEach(x => {
          x.check = false;
        })
        item[index].check = true;
        itemArr[0] = target;
      } else {
        if (itemArr.length < 5) {
          item[index].check = true;
          itemArr.push(target)
        } else {
          app.errorHide(that, '不能选择超过5个标签', 3000)
        }
      }
    } else {
      item[index].check = false;
      itemArr.forEach((y, index) => {
        if (target[itemIdStr] == y[itemIdStr]) {
          itemArr.splice(index, 1)
        }
      })
    }
  }
  that.setData({
    SearchInit: SearchInit
  })
  console.log('选择标签', new Date().getTime() - time1)
}
// 筛选重置 
function reset(that) {
  let currentIndex = that.data.SearchInit.currentIndex;
  let SearchInit = that.data.SearchInit;
  let str = SearchInit.tab[currentIndex].label;
  this.itemReset(str, that)
}
function allReset(that) {
  let SearchInit = that.data.SearchInit;
  // let tab = SearchInit.tab;
  // tab.forEach(x => {
  //   this.itemReset(x.label, that)
  // })
  let _newSearchInit = Object.assign({}, data)
  _newSearchInit.tab = SearchInit.tab;
  that.setData({
    SearchInit: _newSearchInit
  })
}
function itemReset(str, that) {
  let time1 = new Date().getTime();
  let SearchInit = that.data.SearchInit;
  let itemStr = str;
  let itemArrStr = str + 'Arr';
  let item = SearchInit[itemStr];
  let itemArr = SearchInit[itemArrStr];
  let searchData = SearchInit.searchData;
  item.forEach(x => {
    x.check = false;
  })
  if (item[0].child) {
    item.forEach(x => {
      x.child.forEach(y => {
        y.check = false;
      })
    })
  }
  SearchInit[itemArrStr] = [];
  searchData[itemStr] = [];
  console.log(1, new Date().getTime() - time1)
  that.setData({
    SearchInit: SearchInit
  })
  console.log(2, new Date().getTime() - time1)
}
// 筛选确定
function searchCertain(that) {
  let SearchInit = that.data.SearchInit;
  let tab = SearchInit.tab;
  let currentIndex = that.data.SearchInit.currentIndex;
  let searchData = that.data.SearchInit.searchData;
  // 区别是不是从展示列表进行删除的
  if (currentIndex == 99) {
    tab.forEach((x, index) => {
      let newArr = [];
      let label = x.label;
      let itemArrStr = x.label + 'Arr';
      let itemId = x.itemId;
      SearchInit[itemArrStr].forEach(y => {
        newArr.push(y[itemId])
      })
      searchData[label] = newArr;
    })
  } else {
    let newArr = [];
    let label = tab[currentIndex].label;
    let itemArrStr = tab[currentIndex].label + 'Arr';
    let itemId = tab[currentIndex].itemId;
    SearchInit[itemArrStr].forEach(x => {
      newArr.push(x[itemId])
    })
    searchData[label] = newArr;
  }
  that.setData({
    SearchInit: SearchInit,
    requestCheck: true,
    currentPage: 1,
    page_end: false
  })

  SearchInit.currentIndex = 99;
  that.setData({
    SearchInit: SearchInit
  })
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
      SearchInit.currentInit = 99;
      if (res.data.data.length == 0) {
        that.setData({
          SearchInit: SearchInit,
          myProject: res.data.data,
          notHave: 0
        })
      } else {
        let SerachInit = that.data.SearchInit;
        SearchInit.currentInit = 99;
        that.setData({
          SearchInit: SearchInit,
          myProject: res.data.data
        })
      }
    }
  });
}
// 展示标签删除
function labelDelete(e, that) {
  let SearchInit = that.data.SearchInit;
  // console.log(SearchInit.label_type,SearchInit.label_typeArr,SearchInit.searchData)
  this.tagsCheck(e, that);
  this.searchCertain(that);
  // console.log(SearchInit.label_type, SearchInit.label_typeArr, SearchInit.searchData)
}
// 页面间跳转传值筛选
function detialItemSearch(label, itemId, that, callBack) {
  let SearchInit = that.data.SearchInit;
  let itemIdStr = labelToId(label);
  let item = SearchInit[label];
  let itemStrArr = label + 'Arr';
  let itemArr = SearchInit[itemStrArr];
  //判断是否是有联动关系 
  if (item[0].child) {
    item.forEach(x => {
      x.child.forEach(y => {
        if (y[itemIdStr] == itemId) {
          y.check = true;
          itemArr.push(y)
        }
      })
    })
  } else {
    item.forEach(x => {
      if (x[itemIdStr] == itemId) {
        x.check = true;
        itemArr.push(x)
      }
    })
  }

  SearchInit.searchData = searchCertain(that);
  that.setData({
    SearchInit: SearchInit
  })
  console.log(SearchInit.searchData)
  callBack(SearchInit.searchData);
}
// 点击modal层
function modal(that) {
  let SearchInit = that.data.SearchInit;
  SearchInit.currentIndex = 99;
  that.setData({
    SearchInit: SearchInit
  })
}
//搜索
function searchSth(that, str, callBack) {
  let user_id = that.data.user_id;
  if (!callBack) {
    wx.navigateTo({
      url: '/pages/search/search3/search3?user_id=' + user_id + '&&entrance=' + str,
    })
  } else {
    callBack()
  }

}

// ---------------------联动操作---------------------------------------------
// 联动一级菜单
function linkFirstStair(e, that) {
  let label_industry = that.data.label_industry;
  let linkDataShow = that.data.linkDataShow;
  let firstStair = linkDataShow.firstStair;
  let secondStair = linkDataShow.secondStair;
  let selectData = that.data.linkDataShow.selectData;
  let index = e.currentTarget.dataset.index;
  // 改变一级菜单样式
  firstStair.forEach(x => {
    x.check = false
  })
  firstStair[index].check = true;
  // 更改二级菜单取值
  that.data.linkDataShow.secondStair = label_industry[index].child
  // 给二级菜单挂上勾号
  that.data.linkDataShow.secondStair.forEach((x, index) => {
    if (selectData.includes(x.industry_id)) {
      x.check = true
    }
  })
  that.setData({
    linkDataShow: linkDataShow
  })
}
// 联动二级菜单 
function linkSecondStair(e, that) {
  let id = e.currentTarget.dataset.id;
  let linkDataShow = that.data.linkDataShow;
  let selectData = linkDataShow.selectData;
  console.log(id)

}
// 联动二级菜单全部
function linkCheckAll(e, that) {

}
// 联动重置
function linkReset() {

}
// 联动确定
function linkSearchCertain() {

}


export {
  data,
  label_industry,
  linkDataShow,
  reInitSearch,
  move,
  getOffset,
  initData,
  initItem,
  tagsCheck,
  reset,
  allReset,
  itemReset,
  searchCertain,
  modal,
  searchSth,
  labelDelete,
  firstLinkCheck,
  linkCheckAll,
  detialItemSearch,
  linkFirstStair,
  linkSecondStair,
} 