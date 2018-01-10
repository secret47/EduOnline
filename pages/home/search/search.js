var app = getApp()

Page({
    data:{
        inputValue:'',//搜索的内容
        searchLogList:[],//存储搜索历史记录信息
        searchLogShowed:false,//是否显示搜索历史记录

    },
    onLoad:function(){
        // 页面初始化
    },
    // 点击搜索按钮后，加载数据
    bindInput:function(e){
        this.setData({
            inputValue: e.detail.value
        })
        console.log('bindInput' + this.data.inputValue)  
    },
    searchBtn:function(){
        let data;
        let localStorageValue = [];
        if(this.data.inputValue != ''){
            //调用API从本地缓存中获取数据  
            var searchData = wx.getStorageSync('searchData') || []
            searchData.push(this.data.inputValue)
            wx.setStorageSync('searchData', searchData)
            wx.navigateTo({
                url: '../result/result'
            })   
        }else{
            console.log('???');
        }
    }
})  