
const app = getApp();

var resDataChs = app.globalData.ResData.resDataChs;
var resDataEng = app.globalData.ResData.resDataEng;

var isEnd = false;

// pages/study/study.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        video_url: 'https://api.jules.xin/asset/Training/cn/training_cn_part_1.mp4',
        videos: [

            {
                'id': 0,
                'title': '视频',
                'checked': true,
                'url': 'https://api.jules.xin/asset/Training/cn/training_cn_part_1.mp4',
                'disabled':false,
            }, {
                'id': 1,
                'title': '视频',
                'checked': false,
                'url': 'https://api.jules.xin/asset/Training/cn/training_cn_part_2.mp4',
                'disabled': false,
            }, {
                'id': 2,
                'title': '视频',
                'checked': false,
                'url': 'https://api.jules.xin/asset/Training/cn/training_cn_part_3.mp4',
                'disabled': false,
            }, {
                'id': 3,
                'title': '视频',
                'checked': false,
                'url': 'https://api.jules.xin/asset/Training/cn/training_cn_part_4.mp4',
                'disabled': false,
            },
        ],
        videoCount: 4,
        showTheModal: false,
        /** 
       * 页面配置 
       */
        winWidth: 0,
        winHeight: 0,
        // tab切换  
        currentTab: 0,
        childrenList: [],

        title: "",
        VideoPro: 0,
        vid: 1,
        currentVideo:0,
        language:"",
        btndis:false,
        autoplay:true

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setLanguage();
        var result = wx.getStorageSync('TEST_RESULT');
        var videos = this.data.videos;
        if (result == '1') {
            for (var i = 0; i < videos.length; i++) {
                var data = videos[i];
                data.disabled = true;
            }
            this.setData({
                videos: videos,
                btndis:true,
                autoplay:false
            })
        } else if (result == '0') {
            for (var i = 0; i < videos.length; i++) {
                var data = videos[i];
                data.disabled = false;
            }
            this.setData({
                videos: videos,
                btndis: false,
                autoplay:true
            })
        }
    },
    
    setLanguage: function () {
        var lang = wx.getStorageSync("language");
        if (lang == "chs")
            this.setData({
                resDataVar: resDataChs.chsRes(),
                language:lang
            });
        else
            if (lang == "eng")
                this.setData({
                    resDataVar: resDataEng.engRes(),
                    language:lang
                });
    },
    changeVideo: function (e) {
        var idx = e.currentTarget.dataset.id;
        var currentId = this.data,currentVideo;
        var videoPlayer = wx.createVideoContext("vid_player");
        videoPlayer.pause();
        for(var i = 0;i<this.data.videos.length;i++){
            var data = this.data.videos[i];
            if(data.id == idx){
                data.checked = true;
            }else{
                data.checked = false
            }
        }
        this.setData({
            vide_title: this.data.videos[idx].title,
            video_url: this.data.videos[idx].url,
            videos:this.data.videos
        });
    },
    //轮播的切换事件  点击切换
    swiperChange: function (e) {
        var that = this;
        var currentPage = e.detail.current + 1;//得到当前的页面
        var parts = that.data.videoCount;//得到总的页数
        var everyPer = 100 / parts;//得到每一页需要多少百分比
        everyPer = everyPer * currentPage;//算出第几页百分比多少
        that.setData({
            vid: currentPage,
            VideoPro: everyPer,
        })
    },
    //视频结束
    videoEnds:function(e){
        var thisVideo = this.data.video_url;
        var videos = this.data.videos;
        var num;
        var url;
        for(var i = 0;i<videos.length;i++){
            var data = videos[i];
            url = data.url;
            data.disabled = true;
            if (url == thisVideo) {
                if(i <= videos.length -1){
                    num = parseInt(i + 1);
                    console.log("放完第" + num+"个视频了")
                    if (num == videos.length){
                        data.disabled = true;
                        data.checked = false;
                        isEnd = true;
                        this.setData({
                            videos: videos
                        })
                    }else{
                        var NextVideo = videos[num];
                        this.setData({
                            video_url: NextVideo.url,
                            videos: videos
                        })
                    }
                }else{

                }
                
            }
        }
    },
    videoPlays:function(e){
        var thisVideo = this.data.video_url;
        var videos = this.data.videos;
        var url;
        var id;
        for (var i = 0; i < videos.length; i++) {
            if (i < videos.length) {
                var data = videos[i];
                url = data.url;
                if (url == thisVideo) {
                    id = data.id;
                    data.checked = true; 
                }else{
                    data.checked = false;
                }
            }
        }
        console.log(id)
        this.setData({
            videos: videos,
            currentVideo:id
        })
    },
    // 点击跳转到测试页面
    startTest: function (e) {
        var result = wx.getStorageSync('TEST_RESULT')
        // if(isEnd){
            // if(result == 0){
                wx.navigateTo({
                    url: '/pages/teacherTest/teacherTest',
                })
            // }else if(result == 1){
            //     wx.showToast({
            //         title: '已通过测试',
            //     })
            // }
            
        // }else{
        //     wx.showToast({
        //         title: '请先看完视频',
        //     })
        // }

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
            showTheModal: false
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
        this.hideModal();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var result = wx.getStorageSync('TEST_RESULT');
        var videos = this.data.videos;
        if (result == '1') {
            for (var i = 0; i < videos.length; i++) {
                var data = videos[i];
                data.disabled = true;
            }
            this.setData({
                videos: videos
            })
        } else if (result == '0') {

        }
        this.setLanguage();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})