const WXAPI = require('../../wxapi/main')
const app = getApp()
Page({
  data: {
    addressList: []
  },

  selectTap: function(e) {
    var id = e.currentTarget.dataset.id;
    WXAPI.setDefaultAddress({
      //token: wx.getStorageSync('token'),
      id: id
    }).then(function(res) {
      wx.navigateBack({})
    })
  },

  addAddess: function() {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },

  editAddess: function(e) {
    var ad
    console.log(JSON.stringify(this.data.addressList))
    this.data.addressList.forEach(element => {
      if (element.id ==  e.currentTarget.dataset.id){
        ad = element
      } 
    });
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + ad.id + "&name=" + ad.name + "&phone=" + ad.phone + "&province=" + ad.province + "&city=" + ad.city + "&region=" + ad.region + "&address=" + ad.address
    })
  },

  onLoad: function() {
    console.log('onLoad')


  },
  onShow: function() {
    this.initShippingAddress();
  },
  initShippingAddress: function() {
    var that = this;
    WXAPI.queryAddress(wx.getStorageSync('token')).then(function(res) {
      console.log(' --- >>> ' + JSON.stringify(res.data.objList))

      if (res.data.objList.length != 0) {
        that.setData({
          addressList: res.data.objList
        });
      } else if (res.data.code == 700) {
        that.setData({
          addressList: null
        });
      }
    })
  }

})