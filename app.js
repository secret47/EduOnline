//app.js
// const APP_ID = 'wx89bf31b7b0eb830c';//输入小程序appid
// const APP_SECRET = '37235e0223dd559114c58d0dad8121eb';//输入小程序app_secret

var resDataChs = require('utils/res_chs.js');
var resDataEng = require('utils/res_eng.js');


App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs);
        this.globalData.ResData = {
            resDataChs : resDataChs,
            resDataEng : resDataEng
        }
        //得到默认的语言
        var lang = wx.getStorageSync("language");
        if (lang == null || lang == "") {
            lang = "chs";
            wx.setStorageSync("language", lang);
        }
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                var code = res.code
                wx.request({
                    url: 'https://api.jules.xin/SOFGetWxOpenId.php',
                    data: {
                        js_code: res.code
                    },
                    method:'GET',
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function (res) {
                        var OPEN_ID = res.data.openid;
                        wx.setStorageSync('openid', OPEN_ID);  
                    }
                })
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    onShow:function(){
    },
    globalData: {
        userInfo: null,
        AllLessons:null,
        API:'https://api.jules.xin',
        ResData:{}

    }
})