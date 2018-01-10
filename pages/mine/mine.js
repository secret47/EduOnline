var fun_base64 = require('../../utils/base64.js');
var obj_base64 = new fun_base64.Base64();
//获取应用实例  
var app = getApp()
var api = app.globalData.API;//全局api

var resDataChs = app.globalData.ResData.resDataChs;
var resDataEng = app.globalData.ResData.resDataEng;


Page({
    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        modalValue: '',
        userInfo: {},
        openid: '',
        hasUserInfo: false,
        schoolName: "",
        className: "",
        username:"",
        showModal:false,
        resDataVar:{},
        language:["中文","English"],
        Index:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        // 载入个人基本信息
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
        var teacherInfo = wx.getStorageSync('teacherInfo');
        that.setData({
            className:teacherInfo.class_name,
            schoolName:teacherInfo.school_name,
            username:teacherInfo.username
        })
        this.getLanguage();
    }, 

    changeLan: function (e) {
        var index = e.detail.value;
        var language = this.data.language;
        var con = language[index];
        if (con == 'English') {
            wx.setStorageSync('language', 'eng')
        }
        if (con == '中文') {
            wx.setStorageSync('language', 'chs')
        }
        this.setData({
            Index: index
        })
        this.getLanguage();
    },
    getLanguage: function (e) {
        var lang = wx.getStorageSync('language');
        if (lang == "chs")
            this.setData({
                resDataVar: resDataChs.chsRes(),
                Index:0
            });
            
        else
            if (lang == "eng")
                this.setData({
                    resDataVar: resDataEng.engRes(),
                    Index:1
                });     
    },
    onShow:function(){
        var teacherInfo = wx.getStorageSync('teacherInfo');
        this.setData({
            className: teacherInfo.class_name,
            schoolName: teacherInfo.school_name,
            username: teacherInfo.username
        })
        this.getLanguage();
    },
    /**
     * 弹窗
     */
    showDialogBtn: function (e) {
        var $data = e.currentTarget.dataset;
        this.setData({
            title: $data.item,
            modalValue: $data.cont,
            showModal: true
        })
    },
    valueChange: function (e) {
        modalValue: e.detail.value
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {
    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
        this.setData({
            showModal: false
        });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
        this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
        this.logoutUser();
        this.hideModal();
    },

    // 得到用户信息
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    logoutUser:function(){
        var openid = wx.getStorageSync('openid')
        var lang = wx.getStorageSync('language');
        var account_id = wx.getStorageSync('AccountId')
        wx.request({
            url: api + '/SOFUnbindingWxAccount.php',
            data: {
                weixin_openid: openid,
                account_id: account_id
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                wx.clearStorageSync();
                wx.setStorageSync('openid', openid)
                wx.setStorageSync('language', lang)
                wx.navigateTo({
                    url: '../index/index',
                })
            }
        })
    },
    logout:function(e){
        this.setData({
            showModal:true
        })
    },
    
})