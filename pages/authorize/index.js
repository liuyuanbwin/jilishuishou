const WXAPI = require('../../wxapi/main')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
  //  * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.navigateTo({
      url: '/pages/category/category'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindGetUserInfo: function(e) {
    if (!e.detail.userInfo) {
      return;
    }
    if (app.globalData.isConnected) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.login();
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  addgood:function(){
    WXAPI.addgoods({
      price:99,
name:"100L 大桶水",
detail:"康师傅",
numberSells:88,
originalPrice:199,
pic:'https://wx3.sinaimg.cn/mw690/a203cadely1g5362nra82j20us0u00yu.jpg',
shopId:1,
shopName:'西站',
state:1,
weight:88

    }).then((res) => {
      console.log('添加商品 -> ' + JSON.stringify(res));
    })
  },
  products:function(){
    WXAPI.goods().then((res) => {
      console.log('商品列表返回 -> ' + JSON.stringify(res));
    })
  },
  addresses:()=>{
    WXAPI.queryAddress().then((res) => {
      console.log('地址列表返回 -> ' + JSON.stringify(res))
    })
  },
  orderlist:()=>{
    WXAPI.orderList().then((res) => {
      console.log('订单列表 -> ' + JSON.stringify(res))
    })
  },
  toAddAddresslist:() => {
    wx.navigateTo({
      url: '/pages/select-address/index'
    })
  },
  toAddAddress:() => {
    wx.navigateTo({
      url: '/pages/address-add/index'
    })
  },
  toEditAddress:() => {
    wx.navigateTo({
      url: '/pages/address-add/index?id=1'
    })
  },
  toGoodList:() => {
    wx.navigateTo({
      url: '/pages/category/category',
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  login: function() {
    const that = this;
    const token = wx.getStorageSync('token');
    if (token) {
      WXAPI.checkToken(token).then(function(res) {
        if (res.code != 0) {
          wx.removeStorageSync('token')
          that.login();
        } else {
          // 回到原来的地方放
          app.navigateToLogin = false
          wx.navigateBack();
        }
      })
      return;
    }
    wx.login({
      success: function(res) {
        WXAPI.login(res.code).then(function(res) {
          console.log('login ->>>' + JSON.stringify(res))
          if (res.code == 10000) {
            // 去注册
            that.registerUser();
            return;
          }
          if (res.code != 0) {
            // 登录错误
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '无法登录，请重试',
              showCancel: false
            })
            return;
          }
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('uid', res.data.uid)
          // 回到原来的地方放
          app.navigateToLogin = false
          wx.navigateBack();
        })
      }
    })
  },
  registerUser: function() {
    let that = this;
    wx.login({
      success: function(res) {
        let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function(res) {
            let iv = res.iv;
            let encryptedData = res.encryptedData;
            let referrer = '' // 推荐人
            let referrer_storge = wx.getStorageSync('referrer');
            if (referrer_storge) {
              referrer = referrer_storge;
            }
            // 下面开始调用注册接口
            WXAPI.register( {
              code: code,
              encryptedData: encryptedData,
              iv: iv,
              referrer: referrer
            }).then(function(res) {
              wx.hideLoading();
              that.login();
            })
          }
        })
      }
    })
  }
})