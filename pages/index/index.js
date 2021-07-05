// index.js
// 获取应用实例
const app = getApp()

var touchStartX = 0;//触摸时的原点  
var touchStartY = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = "";// 记录/清理时间记录  
var touchMoveX = 0; // x轴方向移动的距离
var touchMoveY = 0; // y轴方向移动的距离


Page({
  data: {
    

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),// 如需尝试获取用户信息可改为false
   
    // 表单数据
    userName: '',
         sex: '',
       phone: '',
      idCard: '',
      carNum: '',

    
    

  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  inputFnCarNum: function(e){
   //英文小写转大写
   let temp= e.detail.value.toUpperCase();

    this.setData({
      //data数据的绑定
      carNum: temp 
    })
     
    return temp;
},
  inputFnIdCard: function(e){
    this.setData({
      //data数据的绑定
      idCard: e.detail.value 
    })
  },
  inputFnPhone: function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  inputFnSex: function(e){
    this.setData({
      sex: e.detail.value
    })
  },
  inputUserName: function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  _Sumbit: function(){
    wx.request({
      url: 'http://localhost:8080/CVMS/LoginServlet',//服务器地址
      data: {

        //表单数据参数
         userName: this.data.userName,
         sex: this.data.sex,
         phone: this.data.phone,
         idCard: this.data.idCard,
         carNum: this.data.carNum,
        
      

      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      success: function (res) {
        console.log(res.data);//回调函数中的携带服务器响应数据
      },
      fail: function (res) {
        console.log("fail to connect");
      }
    })
  },

  touchStart: function (e) {
    touchStartX = e.touches[0].pageX; // 获取触摸时的原点  
    touchStartY = e.touches[0].pageY; // 获取触摸时的原点  
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件  
  touchMove: function (e) {
    touchMoveX = e.touches[0].pageX;
    touchMoveY = e.touches[0].pageY;
  },
  // 触摸结束事件  
  touchEnd: function (e) {
    var moveX = touchMoveX - touchStartX
    var moveY = touchMoveY - touchStartY
    if (Math.sign(moveX) == -1) {
      moveX = moveX * -1
    }
    if (Math.sign(moveY) == -1) {
      moveY = moveY * -1
    }
    if (moveX <= moveY) {// 上下
      // 向上滑动
      if (touchMoveY - touchStartY <= -30 && time < 10) {
        console.log("向上滑动")
      }
      // 向下滑动  
      if (touchMoveY - touchStartY >= 30 && time < 10) {
        console.log('向下滑动 ');
      }
    }else {// 左右
      // 向左滑动
      if (touchMoveX - touchStartX <= -30 && time < 10) {
        console.log("左滑页面")
      }
      // 向右滑动  
      if (touchMoveX - touchStartX >= 30 && time < 10) {
        wx.redirectTo({
          url: '../menu/menu'
        })
        console.log('向右滑动');
      }
    }
    clearInterval(interval); // 清除setInterval  
    time = 0;
  },  

 


})
