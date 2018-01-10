// pages/lesson/lesson.js
var fun_base64 = require('../../utils/base64.js') // 用第三方js文件
var obj_base64 = new fun_base64.Base64();//使用base64解码方法
var util = require('../../utils/util.js')
const app = getApp()

var api = app.globalData.API;//全局api

var resDataChs = app.globalData.ResData.resDataChs;
var resDataEng = app.globalData.ResData.resDataEng;


Page({
    data: {
        lessonArr: [],
        arr:[],
        headUrl: 'https://api.jules.xin/images/3IVxg.png',
        curLess: 0,//当前学到的课程
        allLess: 0,//总的课程
        studentQuantity: "",//学生数量
        box1:{
            id:1,
            css:'classifyBox box1',
            disabled:false
        },
        box2:{
            id: 2,
            css: 'classifyBox box2',
            disabled: false
        },
        box3:{
            id: 3,
            css: 'classifyBox box3',
            disabled: false
        },
        showTheModal: false,
        winWidth: 0,
        winHeight: 0,
        showChangeModal: false,
        selectedUserName:"",
        languages:"",
        showpassModal:false,
        shownopassModal:false
    },
    //得到设备信息
    getSysInfo: function (e) {
        var winWidth;
        var winHeight;
        wx.getSystemInfo({
            success: function (res) {
                winWidth = res.windowWidth;
                winHeight = res.windowHeight;
            }
        })
        this.setData({
            winWidth: winWidth,
            winHeight: winHeight
        })
    },
    getLanguage: function (e) {
        var lang = wx.getStorageSync('language');
        this.setData({
            languages:lang
        })
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
    //打开进入第二页面详情
    openDetail: function (e) {
        var $id = e.currentTarget.dataset.id;
        var lesson = this.data.lessonArr;
        lesson = JSON.stringify(lesson)
        switch ($id) {
            case 1:
                // 进入课程 得到之前得到的lesson，然后将它提交给下一个页面
                wx.navigateTo({
                    url: '/pages/lessons/lessons?lesson='+lesson,
                })
                break;
            case 2:
                // demo课程
                console.log('demo课程')
                break;
            case 3:
                // 学生管理
                this.openStudentList();
                break;
        }
    },

    studentOk:function(){
        this.setData({
            showTheModal:false
        })
    },
    //打开学生列表
    openStudentList: function (e) {
        this.setData({
            showTheModal: true
        })
        var that = this;
        //1.得到班级id
        var classID = wx.getStorageSync('classID');
        //2.得到学生列表
        wx.request({
            url: api + '/SOFGetClassStudents.php?class_id=' + classID,
            data: {
                classID: classID
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data;//得到数据
                var arr = data.split(/\t/);
                var childData = arr[1];
                var child = obj_base64.decode(childData);
                //得到childList的数据
                var childStr = util.removeBlock(child)
                var childArrs = childStr.split(",");
                var count;
                for (var i = 0; i < childArrs.length; i++) {
                    var data = childArrs[i];
                    if (data.indexOf('count') != -1) {
                        //得到总的数量
                        var counts = data.split(":");
                        count = counts[1];
                        that.setData({
                            studentQuantity: count
                        })
                    }
                }
                var arrs = childArrs.slice(0, (childArrs.length - 1));//得到学生的数组
                arrs = util.sliceArray(arrs, 2);
                var child = [];//所有的学生
                var str;
                for (var i = 0; i < arrs.length; i++) {
                    var data = arrs[i];
                    var childName = data[0];
                    var childId = data[1];
                    childName = childName.split(":");
                    var username = childName[1];
                    childId = childId.split(':');
                    var id = childId[1]
                    username = '"username":' + username,
                        id = '"id":' + id;
                    str = '"child' + i + '":' + '{' + username + ',' + id + '}'
                    child.push(str);
                }

                var childString = child.toString();
                childString = '{' + childString + '}';

                var jsonObj = JSON.parse(childString);
                that.setData({
                    childrenList: jsonObj
                })
            }
        })
    },

    //修改密码
    changePsw: function (e) {
        //得到名称
        var studentUserName = e.currentTarget.dataset.name;
        this.setData({
            showChangeModal: true,
            selectedUserName: studentUserName
        })     
    },

    //关闭重置密码的对话框
    ChangeonCancel: function () {
        this.hideChangeModal()
    },
    //隐藏重置密码确定模态框
    hideChangeModal: function () {
        this.setData({
            showChangeModal: false
        })
    },

    //重置密码
    ChangeonConfirm: function (e) {
        //SOFUpdateUsernameAccess.php
        var studentUserName = this.data.selectedUserName;
        console.log(studentUserName)
        //设置密码     中国版的密码为12345    以下内容为12345的MD5加密版
        var psw = '827ccb0eea8a706c4c34a16891f84e7b';
        var that = this;
        wx.request({
            url: api + '/SOFUpdateUsernameAccess.php',
            data: {
                username: studentUserName,
                password: psw
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data;
                var dataList = data.split(/\t/);
                var changeResult = dataList[0];
                var lang = wx.getStorageSync('language');
                changeResult.toUpperCase();
                if (changeResult == 'OK') {
                    if(lang == 'chs'){
                        wx.showToast({
                            title: '重置成功'
                        })
                    }else if(lang == 'eng'){
                        wx.showToast({
                            title: 'successful',
                        })
                    }
                    that.ChangeonCancel();
                }
            }
        })
    },

    //得到已完成的课程
    getFinishedLessonList: function () {
        var that = this;
        var content_name = wx.getStorageSync('content_name');
        var class_id = wx.getStorageSync('classID');
        if (content_name == null || content_name == "" || class_id == null || class_id<=0)
          return;

        wx.request({
            url: api + '/SOFGetClassStatusFinished.php',
            data: {
                name: content_name,
                class_id: class_id
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data;
                var resdata = data.split(/\t/);
                var decData = resdata[1];
                var curLess;
                that.getTermContent();
                if (decData == ""){
                     wx.setStorageSync('FINISHED_LESSON_LIST', null);
                     wx.setStorageSync('lastName', "0");
                     wx.setStorageSync('TERMS_LIST', null);
                     wx.setStorageSync('SELECTED_TERM_INDEX', 0);
                     curLess = 0;
                }else{
                    var finishedData = obj_base64.decode(decData);
                    var jsonObj = JSON.parse(finishedData);
                    //得到已上完的所有课程，count表示已经上完了多课，所以这里的显示应该可以直接利用count
                    var count = jsonObj.count;
                    var lastName = wx.getStorageSync('lastName');
                    curLess = Number(count);
                    wx.setStorageSync('FINISHED_LESSON_LIST', jsonObj);   
                }
                that.setData({
                    curLess: curLess
                })
            }
        });
    },

    getTermContent: function () {
        var that = this;
        var id = 1; //得到当前学期的id
        var content_name = wx.getStorageSync('content_name');
        wx.request({
            url: api + '/SOFGetTermDataByName.php?name=' + content_name,
            data: {
                content_name: content_name
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function success(res) {
                var finishedLesson = 0;
                var data = res.data;
                data = data.split("\t");
                var termData = obj_base64.decode(data[1]);
                var termObj = JSON.parse(termData)
                var terms = termObj.terms;
                var lessonData = [];
                var allLessonCount = 0;
                for (var i = 0; i < terms.length; i++) {
                    var termLessonCount = 0;
                    var termFinishedLessonCount = 0;
                    var keyT="term_" + (i+1) + "_";
                    var termsJson = JSON.stringify(terms[i]);
                    var regT = new RegExp(keyT, "g");
                    var termsJsonString = termsJson.replace(regT, "");
                    terms[i] = JSON.parse(termsJsonString);
                    var data = terms[i];
                    var topics = data.topics;//得到topics
                    var id = i + 1;
                    var title = 'term_'+id;
                    if (topics){
                        data.disabled = false;
                        data.css = "";
                    }else{
                        data.disabled = true;
                        data.css = "true";
                    }
                    if (topics) {
                        var num = 0;
                        var allLessons = [];
                        for (var j = 0; j < topics.length; j++) {
                            var key="topic_" + (j+1) + "_";
                            
                            var topicJson = JSON.stringify(topics[j]);
                            var reg = new RegExp(key, "g");
                            var topicJsonString = topicJson.replace(reg, "");
                            var lang = wx.getStorageSync('language');
                            topics[j] = JSON.parse(topicJsonString);
                            var lessons = topics[j].lessons;
                            for(var k = 0;k<lessons.length;k++){
                                num++;
                                var lessonsCon = lessons[k];//得到所有的lesson
                                if (that.checkIfLessonFinished(lessonsCon.lesson)){
                                    lessons[k].completed = true;
                                    lessons[k].css = "true";
                                    finishedLesson++;
                                    termFinishedLessonCount++;
                                }
                                else
                                {
                                    lessons[k].completed = false;
                                    lessons[k].css = "";
                                }
                                    lessons[k].id = (num);
                                if(lang == 'chs'){
                                    lessons[k].term_name = "第" + (num) + "课";
                                }else if(lang == 'eng'){
                                    lessons[k].term_name = "Lesson" + (num);
                                }
                                allLessonCount++;
                                termLessonCount++;
                                
                            }
                        }
                    }
                    terms[i].termFinishedLessonCount = termFinishedLessonCount;
                    terms[i].termLessonCount = parseInt(terms[i].end) - parseInt(terms[i].start) + 1;
                    
                    if(termLessonCount == termFinishedLessonCount)
                        terms[i].finished=true;
                    else
                        terms[i].finished=false;
                }
                
                wx.setStorageSync('TERMS_LIST', terms);
                that.setData({
                    AllTopic: terms,
                    allLess:allLessonCount
                });
            }
        });
    },
    //检查课程是否完成
    checkIfLessonFinished: function (lesson_name) {
        //根据课程名称查询课程是否在已结束课程列表里
        var that = this;
        var finished_lesson = wx.getStorageSync('FINISHED_LESSON_LIST');
        if (finished_lesson == null) {
            return false
        }

        for (var i = 0; i < finished_lesson.count; i++) {
            if (finished_lesson[i].content_name == lesson_name) {
                return true;
            }
        }
        return false;
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        this.getSysInfo();// 得到设备信息
        this.getFinishedLessonList();
        this.getTeacherstatus()//得到老师测试
        //this.getContentName(); //得到课程内容
        // this.getCurrentLesson()
        this.getLanguage();

    },
    getTeacherstatus: function (e) {
        //得到老师的测试结果；
        var result = wx.getStorageSync('TEST_RESULT');
        var box1 = this.data.box1;
        var box2 = this.data.box2;
        var box3 = this.data.box3;
        var disabled = true;
        if (result == 1) {
            disabled = false;
        }
        if (result == 0){
            this.setData({
                shownopassModal: true
            })
        }

        box1.disabled = disabled;
        box2.disabled = disabled;
        box3.disabled = disabled;

        this.setData({
            box1: box1,
            box2: box2,
            box3: box3
        })

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
        this.getSysInfo();// 得到设备信息
        this.getFinishedLessonList();
        this.getLanguage();
        this.getTeacherstatus();
        this.getTermContent();
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

    },
    // 模态框取消
    hideModal: function () {
        this.setData({
            showTheModal: false,
            showpassModal:false,
            shownopassModal:false
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
    },
    passonConfirm:function(){
        this.hideModal()
    }
})