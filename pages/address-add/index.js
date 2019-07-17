const WXAPI = require('../../wxapi/main')
const regeneratorRuntime = require('../../utils/runtime')
const appInstance = getApp();
const { globalData: { defaultCity, defaultCounty } } = appInstance
//获取应用实例
var app = getApp()
Page({
  data: {
    location: defaultCity,
    county:defaultCounty,
    showRegionStr: '请选择'
  },
  onShow: function(){
    const { globalData: { defaultCity, defaultCounty } } = appInstance
    this.setData({
      location: defaultCity,
      county: defaultCounty
    })
  },
  //选择城市
  bindSelectCity:function(){
     wx.navigateTo({
       url: '../switchcity/switchcity',
       success: (result) => {
         
       },
       fail: () => {},
       complete: () => {}
     });
       
  },
  bindSave: function(e) {
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;

    if (linkMan == ""){
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel:false
      })
      return
    }
    if (mobile == ""){
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel:false
      })
      return
    }
    if (!this.data.location || !this.data.county){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
    if (address == ""){
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel:false
      })
      return
    }
    
    let apiResult

    //如果有值是修改
    if (that.data.id) {
      apiResult = WXAPI.updateAddress({
        token: wx.getStorageSync('token'),
        id: that.data.id,
        provinceId: this.data.pObject.id,
        cityId: this.data.cObject.id,
        districtId: this.data.dObject ? this.data.dObject.id : '',
        linkMan: linkMan,
        address: address,
        mobile: mobile,

        isDefault: 'true'
      })

      //否则是新建
    } else {
      apiResult = WXAPI.addAddress({
        token: wx.getStorageSync('token'),
        provinceId: this.data.pObject.id,
        cityId: this.data.cObject.id,
        districtId: this.data.dObject ? this.data.dObject.id : '',
        linkMan: linkMan,
        address: address,
        mobile: mobile,
        isDefault: 'true'
      })
    }
    apiResult.then(function (res) {
      if (res.code != 0) {
        // 登录错误 
        wx.hideLoading();
        wx.showModal({
          title: '失败',
          content: res.msg,
          showCancel: false
        })
        return;
      }
      // 跳转到结算页面
      wx.navigateBack({})
    })
  },
  onLoad: function (e) {
   
  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          WXAPI.deleteAddress(id, wx.getStorageSync('token')).then(function () {
            wx.navigateBack({})
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  readFromWx : function () {
    const _this = this
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        _this.initRegionDB(res.provinceName, res.cityName, res.countyName)
        _this.setData({
          wxaddress: res
        });
      }
    })
  }
})
