// pages/rider-orderlist/rider-orderlist.js


  const wxpay = require('../../utils/pay.js')
const app = getApp()
const WXAPI = require('../../wxapi/main')
Page({
  data: {
    statusType: ["待接订单", "待取水", "待送达", "待回桶", "已完成"],
    hasRefund: false,
    currentType: 0,
    tabClass: [1, 0, 0,0,0],
    current:'order',
    isOrder:true
  },
  handleChange({detail}){
    console.log('skskks ' + JSON.stringify(detail))
    var show 
    if(detail.key == 'order'){
      show = true
    }else{
      show = false
    }
    this.setData({
      current:detail.key,
      isOrder:show
    })
  },
  statusTap: function(e) {
    const curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  cancelOrderTap: function(e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          WXAPI.orderClose(orderId, wx.getStorageSync('token')).then(function(res) {
            if (res.code == 0) {
              that.onShow();
            }
          })
        }
      }
    })
  },
  refundApply (e) {
    // 申请售后
    const orderId = e.currentTarget.dataset.id;
    const amount = e.currentTarget.dataset.amount;
    wx.navigateTo({
      url: "/pages/order/refundApply?id=" + orderId + "&amount=" + amount
    })
  },
  toPayTap: function(e) {

    const that = this;
    const orderId = e.currentTarget.dataset.id;
    let money = e.currentTarget.dataset.money;
    wx.navigateTo({
      url: '/pages/order-list/index',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  toCatchOrder: function(e){
    const that = this
    const orderId = e.currentTarget.dataset.id
    WXAPI.catchOrder(orderId).then(function(res) {
    if(res.code == 0){
      wx.showModal({
        title:'提示',
        content:'抢单成功',
        showCancel:false
      })
    } else {
      wx.showModal({
        title:'提示',
        content:'抢单失败',
        showCancel:false
      })
    }

    that.getOrderList()

  })
  
  },
  _toPayTap: function (orderId, money){
    const _this = this
    if (money <= 0) {
      // 直接使用余额支付
      WXAPI.orderPay(orderId, wx.getStorageSync('token')).then(function (res) {
        _this.onShow();
      })
    } else {
      wxpay.wxpay('order', money, orderId, "/pages/order-list/index");
    }
  },
  onLoad: function(options) {
    if (options && options.type) {
      if (options.type == 99) {
        this.setData({
          hasRefund: true,
          currentType: options.type
        });
      } else {
        this.setData({
          hasRefund: false,
          currentType: options.type
        });
      }      
    }
  },
  onReady: function() {
    // 生命周期函数--监听页面初次渲染完成

  },
  getOrderStatistics: function() {
    var that = this;
    WXAPI.orderStatistics(wx.getStorageSync('token')).then(function(res) {
      if (res.code == 0) {
        var tabClass = that.data.tabClass;
        if (res.data.count_id_no_pay > 0) {
          tabClass[0] = "red-dot"
        } else {
          tabClass[0] = ""
        }
        if (res.data.count_id_no_transfer > 0) {
          tabClass[1] = "red-dot"
        } else {
          tabClass[1] = ""
        }
        if (res.data.count_id_no_confirm > 0) {
          tabClass[2] = "red-dot"
        } else {
          tabClass[2] = ""
        }
        if (res.data.count_id_no_reputation > 0) {
          tabClass[3] = "red-dot"
        } else {
          tabClass[3] = ""
        }
        if (res.data.count_id_success > 0) {
          //tabClass[4] = "red-dot"
        } else {
          //tabClass[4] = ""
        }

        that.setData({
          tabClass: tabClass,
        });
      }
    })
  },
  onShow: function() {
    // 获取订单列表
   // postData.hasRefund = that.data.hasRefund;
    // if (!postData.hasRefund) {
    //   postData.status = that.data.currentType;
    // }
    //this.getOrderStatistics();
    this.getOrderList()
  },
  getOrderList: function(){

    var that = this;
    var postData = {
      token: wx.getStorageSync('token'),
      page:1
    };
    WXAPI.riderOrderlist(postData).then(function(res) {
      if(res){


      var objs = []
      objs = res.data.objList
      objs.forEach(element => {
        element.goods = JSON.parse(element.goodsInfo)[0]
      });

      console.log('objs -> ' + objs + 'objs -> ' + JSON.stringify(objs))
      that.setData({
        orderList: objs
      });
    } else {
      that.setData({
        orderList: null,
        logisticsMap: {},
        goodsMap: {}
      });
    }
  })
  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数

  }
})