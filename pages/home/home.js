//index.js
//获取应用实例
const app = getApp()

var resDataChs = app.globalData.ResData.resDataChs;
var resDataEng = app.globalData.ResData.resDataEng;
Page({
    data: {
        indexImgs: [
            { url: 'https://api.jules.xin/images/lRvoF.jpg' },
            { url: 'https://api.jules.xin/images/lRLLV.jpg' }
        ],
        // videoUrl: 'https://api.jules.xin/videos/ct_home.mov',
        videoUrl: 'http://api.jules.xin/asset/Marketing/CT_explain_cn.mp4',
        inputShowed: false,
        searchText: "",
        languages:""

    },
    onLoad:function(e){
        this.getLanguage();
    },
    searchBtn: function (e) {
        console.log('嘻嘻');
    },
    searchFoucs: function (e) {
        wx.navigateTo({
            url: './search/search',
        })
    },
    getLanguage: function (e) {
        var lang = wx.getStorageSync('language');
        console.log(lang)
        if (lang == "chs")
            this.setData({
                resDataVar: resDataChs.chsRes(),
                languages:lang
            });

        else
            if (lang == "eng")
                this.setData({
                    resDataVar: resDataEng.engRes(),
                    languages: lang
                });
    },
    onShow: function () {
        this.getLanguage();
    },

})
