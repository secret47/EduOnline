var fun_base64 = require('../../utils/base64.js') // 用第三方js文件
var obj_base64 = new fun_base64.Base64();//使用base64解码方法
var util = require('../../utils/util.js')

const app = getApp();
var api = app.globalData.API;//全局api

var resDataChs = app.globalData.ResData.resDataChs;
var resDataEng = app.globalData.ResData.resDataEng;
Page({
    data: {
        tiView: 'red',
        scrollTop: 100,
        lesson: [],//显示课程,
        currentLesson: '0',//当前课程
        imgUrl: [
            {
                url: 'https://api.jules.xin/images/term1Pic.png'
            },
            {
                url: 'https://api.jules.xin/images/aqFOA.png'
            },
            {
                url: 'https://api.jules.xin/images/aqPQH.png'
            },
            {
                url: 'https://api.jules.xin/images/aqiyd.png'
            }
        ],
        currentTermsLesson: [],
        winHeight: 0,
    },
    onLoad: function (options) {
        this.getAllSchoolContent(options);
        this.getSysInfo();
        this.getLanguage();
    },

    getLanguage: function (e) {
        var lang = wx.getStorageSync('language');
        if (lang == "chs")
            this.setData({
                resDataVar: resDataChs.chsRes(),
            });

        else
            if (lang == "eng")
                this.setData({
                    resDataVar: resDataEng.engRes(),
                });
    },
    onShow: function () {
        this.getLanguage();
    },
    //得到设备信息
    getSysInfo: function (e) {
        var winWidth;
        var winHeight;
        wx.getSystemInfo({
            success: function (res) {
                winHeight = res.windowHeight;
            }
        })
        this.setData({
            winHeight: winHeight
        })
    },

    //得到课程内容
    getAllSchoolContent: function (e) {
        var imgUrl = this.data.imgUrl;
        var terms = wx.getStorageSync('TERMS_LIST');
        console.log(terms)
        var lang = wx.getStorageSync('language');
        if(terms != null){
            for (var i = 0; i < terms.length; i++) {
                var data = terms[i]
                console.log(data)
                var term = i + 1;
                if (lang == 'chs') {
                    var termName = '第' + term + '学期';//学期名  
                    terms[i].names = termName;
                } else if (lang == 'eng') {
                    var termName = 'Term ' + term //学期名  
                    terms[i].names = termName;
                }
                terms[i].id = term;
                terms[i].index = i;
                terms[i].url = imgUrl[i].url;
            }
            console.log(terms)
            wx.setStorageSync('TERMS_LIST', terms);
            wx.setStorageSync('TERMS_LISTS',terms);
            this.setData({
                lesson: terms
            })
        }else{
            wx.showToast({
                title: '请重新打开一次',
            })
        }
    },

    //打开学期
    opens: function (e) {
        var that = this;
        //点进进入科目详情
        //var $name = e.currentTarget.dataset.name;
        //var $id = e.currentTarget.dataset.id;
        //var $count = e.currentTarget.dataset.count
        //var lesson = that.data.lesson;
        var index =e.currentTarget.dataset.index;
        //lesson = JSON.stringify(lesson)
        wx.navigateTo({
            url: '/pages/lessonsDetail/lessonsDetail?index=' + index
        })
    }
})