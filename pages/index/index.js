// pages/index/index.js
var fun_md5 = require('../../utils/md5.js');
var fun_base64 = require('../../utils/base64.js');
var obj_base64 = new fun_base64.Base64();
const app = getApp()
var resDataChs = app.globalData.ResData.resDataChs;
var resDataEng = app.globalData.ResData.resDataEng;
var api = app.globalData.API;//全局api

Page({
    data: {
        username: "",
        password: "",
        user: {},
        language: ['中文', 'English'],
        Index: 0,
        resDataVar: {},
        animation: ""
    },
    onLoad: function () {
        this.setLanguage();
        this.getUserInfo();
        var userInfo = wx.getStorageSync('userInfo')
        var nickName = userInfo.nickName;
        var openid = wx.getStorageSync('openid');
        var uname = wx.getStorageSync('username');
        var psw = wx.getStorageSync('psw');
        if (uname != "" && psw != ""){
            this.loginFunc(uname, psw, openid, nickName);
        }
    },

    setLanguage: function () {
        var lang = wx.getStorageSync("language");
        if (lang == "chs")
            this.setData({
                resDataVar: resDataChs.chsRes(),
                Index: 1
            });
        else
            if (lang == "eng")
                this.setData({
                    resDataVar: resDataEng.engRes(),
                    Index: 0
                });
    },
    getUserInfo: function () {
        if (app.globalData.userInfo) {
            wx.setStorageSync('userInfo', app.globalData.userInfo)
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                wx.setStorageSync('userInfo', this.data.canIUse)
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    wx.setStorageSync('userInfo', res.userInfo)
                }
            })
        }
    },
    onShow: function (e) {
        this.setLanguage();
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
        this.setLanguage();
    },

    getTeacherTestStatus: function (openid) {
        // 假如没有获取openid或者其他的信息时 得到的测试结果
        var isTest = wx.getStorageSync('is_TEST');

        if (isTest == 'ok') {
            wx.setStorageSync('TEST_RESULT', result)
        } else if (isTest == '') {
            //得到教师的测试状态
            wx.request({
                url: api + '/SOFGetTestResult.php',
                method: "POST",
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                data: {
                    openid: openid
                },
                success: function (res) {
                    var data = res.data;
                    console.log(data)
                    var dataArr = data.split(/\t/);
                    var result = dataArr[1];
                    console.log('测试结果', result)
                    //设置测试结果
                    wx.setStorageSync('TEST_RESULT', result)
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }


    },
    usernameInput: function (e) {
        var username = e.detail.value;
        this.setData({
            username:username,
            thisuser:username,
        })
    },  
    passwordInput: function (e) {
        var password = e.detail.value;
        this.setData({
            password: password,
            thispsw:password
        })
    },

    login: function (e) {
        //获取昵称
        var userInfo = wx.getStorageSync('userInfo')
        var nickName = userInfo.nickName;
        // 获取到openid
        let openid = wx.getStorageSync('openid');
        //获取到所输入的用户名和密码
        let username = this.data.username;
        let password = this.data.password;
        password = fun_md5.hex_md5(password)//密码使用md5加密
        this.loginFunc(username, password, openid, nickName);
    },

    loginFunc: function (uname, pwd, u_openid, wxnickname) {
        if (uname === '' && pwd === '') {
            wx.showToast({
                title: '不能为空',
            })
            return
        }
        // 登录参数，用户名，密码，openid，用户昵称
        var that = this;
        wx.request({
            url: api + '/SOFUsernameAccessWxLogin.php',
            method: "POST",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                username: uname,
                password: pwd,
                openid: u_openid,
                wxnickname: wxnickname,
                AllTopic:[]
            },
            success: function (res) {
                var data = res.data;//返回得到的数据
                data = data.split(/\t/);
                var result = data[0];
                result.toUpperCase();
                if (result == 'OK') {//如果返回的数据有ok，则说明与数据库内容匹配，登录成功，跳转到首页
                    var AccountId = data[1];// 取得唯一的AccountID                
                    wx.switchTab({
                        url: '../home/home',
                    })
                    that.loadStoryBookData();
                    if (wx.getStorageSync('AccountId') != AccountId) {
                        console.log(wx.getStorageSync('AccountId'),AccountId);
                        wx.setStorageSync('lastName', '0');
                        wx.setStorageSync('username', '');
                        wx.setStorageSync('teacher_id', '');
                        wx.setStorageSync('classID', '');
                        wx.setStorageSync('content_name', '');
                        wx.setStorageSync('child_count', 0);
                        wx.setStorageSync('FINISHED_LESSON_LIST', null);
                        wx.setStorageSync('classStatusId', '');
                        wx.setStorageSync('session_id', 0);
                        wx.setStorageSync('teacherInfo', null);
                        wx.setStorageSync('TERMS_LIST', null);
                        wx.setStorageSync('SELECTED_TERM_INDEX', 0);
                    }
                    wx.setStorageSync('username', uname);//将密码存到缓存中
                    wx.setStorageSync('psw', pwd)
                    wx.setStorageSync('AccountId', AccountId);
                    that.getTeacherInfoId(AccountId);
                    that.getTeacherTestStatus(u_openid);
                } else if(result == 'error'){
                    if(data[1] == 'missing'){
                        wx.showToast({
                            title: '登录失败',
                        })
                        that.setData({
                            thispsw: "",
                            thisuser:""
                        })
                    } else if (data[1] == 'wrongpass'){
                        wx.showToast({
                            title: '密码错误',
                        })
                        that.setData({
                            thispsw:""
                        })
                    }

                }
            },
            error: function (err) {
                console.log('登录失败')
            }
        });
    },

    getTeacherInfoId: function (AccountId) {
        var that = this;
        // 得到老师的id
        // 通过account_id获取
        // 载入AccountId
        wx.request({
            url: api + '/SOFGetTeacherInfo.php?account_id=' + AccountId,
            data: {
                AccountId: AccountId
            },
            success: function (res) {
                var teacher_id = res.data.substring(3);
                console.log(res.data)
                console.log('获得教师Id：', teacher_id)
                if (res.data.indexOf('OK') != -1) {
                    console.log(teacher_id)
                    //得到教师的id
                    wx.setStorageSync('teacher_id', teacher_id);
                    that.getTeacherInfo(AccountId);
                }
            }
        })
    },
    //得到老师的班级学校信息。
    getTeacherInfo: function (AccountId) {
        var that = this;
        var teacher_id = wx.getStorageSync('teacher_id');
        wx.request({
            url: api + '/SOFGetTeacherInfoById.php?index=' + teacher_id,
            data: {
                teacher_id: teacher_id
            },
            success: function (res) {
                //得到所需要的信息
                var data = res.data;
                data = data.split(/\t+/g);
                var info = data[1];
                //base64解码
                info = obj_base64.decode(info)
                //转成json数组
                var obj = JSON.parse(info);
                //取json数组中的第一个数值
                var teacherInfo = obj[0];
                wx.setStorageSync('teacherInfo', teacherInfo)
                console.log(teacherInfo)
                if (teacherInfo != null) {
                    wx.setStorageSync('content_name', teacherInfo.content_name);
                    that.getClassInfo(AccountId);
                }
            }
        })
    },

    //得到已完成的课程
    getFinishedLessonList: function () {
        var that = this;
        var content_name = wx.getStorageSync('content_name');
        var class_id = wx.getStorageSync('classID');
        if (content_name == null || content_name == "" || class_id == null || class_id <= 0)
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
                if (decData == "") {
                    wx.setStorageSync('FINISHED_LESSON_LIST', null);
                    wx.setStorageSync('lastName', "0");
                    wx.setStorageSync('TERMS_LIST', null);
                    wx.setStorageSync('SELECTED_TERM_INDEX', 0);
                    curLess = 0;
                } else {
                    var finishedData = obj_base64.decode(decData);
                    var jsonObj = JSON.parse(finishedData);
                    //得到已上完的所有课程，count表示已经上完了多课，所以这里的显示应该可以直接利用count
                    var count = jsonObj.count;
                    var lastName = wx.getStorageSync('lastName');
                    curLess = Number(count);
                    wx.setStorageSync('FINISHED_LESSON_LIST', jsonObj);
                }
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
                    var keyT = "term_" + (i + 1) + "_";
                    var termsJson = JSON.stringify(terms[i]);
                    var regT = new RegExp(keyT, "g");
                    var termsJsonString = termsJson.replace(regT, "");
                    terms[i] = JSON.parse(termsJsonString);
                    var data = terms[i];
                    var allLessonName = [];
                    //var lessonData = lesson[i];
                    var topics = data.topics;//得到topics
                    var id = i + 1;
                    var title = 'term_' + id;

                    if (topics) {
                        data.disabled = false;
                        data.css = "";
                    } else {
                        data.disabled = true;
                        data.css = "true";
                    }
                    if (topics) {
                        var num = 0;
                        for (var j = 0; j < topics.length; j++) {
                            var key = "topic_" + (j + 1) + "_";

                            var topicJson = JSON.stringify(topics[j]);
                            var reg = new RegExp(key, "g");
                            var topicJsonString = topicJson.replace(reg, "");

                            topics[j] = JSON.parse(topicJsonString);

                            var lessons = topics[j].lessons;
                            var lang = wx.getStorageSync('language')
                            for (var k = 0; k < lessons.length; k++) {
                                num++;
                                var lessonsCon = lessons[k];//得到所有的lesson
                                if (that.checkIfLessonFinished(lessonsCon.lesson)) {
                                    lessons[k].completed = true;
                                    lessons[k].css = "true";
                                    finishedLesson++;
                                    termFinishedLessonCount++;
                                }
                                else {
                                    lessons[k].completed = false;

                                    lessons[k].css = "";
                                }
                                if (lang == 'chs') {
                                    lessons[k].term_name = "第" + (num) + "课";
                                } else if (lang == 'eng') {
                                    lessons[k].term_name = "Lesson" +" "+ (num);
                                }
                                allLessonCount++;
                                termLessonCount++;
                            }
                        }
                    }
                    terms[i].termFinishedLessonCount = termFinishedLessonCount;
                    terms[i].termLessonCount = parseInt(terms[i].end) - parseInt(terms[i].start) + 1;

                    if (termLessonCount == termFinishedLessonCount)
                        terms[i].finished = true;
                    else
                        terms[i].finished = false;
                }
                wx.setStorageSync('TERMS_LIST', terms);
                that.setData({
                    AllTopic: terms,
                });

                wx.getStorageSync('lessonNames', that.data.lessonNames);
            }
        });
    },

    //得到班级的id
    getClassInfo: function (AccountId) {
        var that = this;
        //1.得到登录老师的account_id
        var AccountId = wx.getStorageSync('AccountId');
        wx.request({
            url: api + '/SOFGetTeacherClass.php?account_id=' + AccountId,
            data: {
                AccountId: AccountId
            },
            success: function (res) {
                var data = res.data;
                var data = data.split(/\t+/g);
                var class_id = data[1]
                console.log('班级ID', class_id)
                if (res.data.indexOf('OK') != -1) {
                    //得到班级的id
                    wx.setStorageSync('classID', class_id);

                    that.getFinishedLessonList();
                }
            }
        })
    },//检查课程是否完成
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
    loadStoryBookData: function () {
        wx.request({
            url: api + '/SOFGetStorybookFileData.php',
            data: {
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data;//得到数据
                var arr = data.split(/\t/);
                var storyBookData = arr[1];
                var storyBookData = obj_base64.decode(storyBookData);
                var storyBookDataJson = JSON.parse(storyBookData)
                wx.setStorageSync('STORYBOOK_DATA', storyBookDataJson)
            }
        });
    }
})