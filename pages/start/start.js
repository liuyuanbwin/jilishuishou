const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    banners:[],
    swiperMaxNumber: 0,
    swiperCurrent: 0,
    height: wx.getSystemInfoSync().windowHeight
  },
  onLoad:function(){
    const _this = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    const app_show_pic_version = wx.getStorageSync('app_show_pic_version')
    if (app_show_pic_version && app_show_pic_version == CONFIG.version) {
      wx.switchTab({
        url: '/pages/index/index',
      });
    } else {
      wx.switchTab({
            url: '/pages/index/index',
           // url: '/pages/category/category',
          });
      // 展示启动页
      // WXAPI.banners({
      //   type: 'app'
      // }).then(function (res) {
      //   if (res.code == 700) {
      //     wx.switchTab({
      //       url: '/pages/index/index',
      //     });
      //   } else {
      //     _this.setData({
      //       banners: res.data,
      //       swiperMaxNumber: res.data.length
      //     });
      //   }
      // }).catch(function (e) {
      //   console.log(' 启动页出错了  ')
      //   wx.switchTab({
      //     //url: '/pages/index/index',
      //     url: '/pages/category/category',
      //   });
      // })
    }
  },
  onShow:function(){
    
  },
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  goToIndex: function (e) {
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    if (app.globalData.isConnected) {
      wx.setStorage({
        key: 'app_show_pic_version',
        data: CONFIG.version
      })
      wx.switchTab({
        url: '/pages/index/index',
      });
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  }
});