var fun_base64 = require('../../utils/base64.js') // 用第三方js文件
var obj_base64 = new fun_base64.Base64();//使用base64解码方法
var util = require('../../utils/util.js')

const app = getApp();

var api = app.globalData.API;//全局api

var resDataChs = app.globalData.ResData.resDataChs;
var resDataEng = app.globalData.ResData.resDataEng;


Page({

    /**
     * 页面的初始数据
     */
    data: {
        AllTopic: [],
        showTheModal: false,
        /** 
       * 页面配置 
       */
        winWidth: 0,
        winHeight: 0,
        // tab切换  
        currentTab: 0,
        childrenList: [],//学生列表
        title: "",
        childList: [],//学生出勤列表
        imgUrl:"",
        selectedLessonName: "",
        showChangeModal: false,
        selectedUserName: "",
        selectedSessionId: 0,
        headUrl: "",
        isScroll:true,
        thisDisabled:true,
        visibility:'hidden',
        terms_ID:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var index = options.index;
        this.getCurrentTopPic(index);
        this.getSysInfo();
        this.getLanguage();
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
            languages: lang
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
        console.log(this.data.AllTopic)
        this.getLanguage();
        this.setData({
            AllTopic: this.data.AllTopic
        })

    },
    //得到sesstionId
    getSessionDataId: function (lesson_name) {
        // var lesson_name = e.currentTarget.dataset.name;
        var that = this;
        var finished_lesson = wx.getStorageSync('FINISHED_LESSON_LIST');
        if (finished_lesson != null)
            for (var i = 0; i < finished_lesson.count; i++) {
                if (finished_lesson[i].content_name == lesson_name) {
                    if (finished_lesson[i].session_id == null)
                        return 0;
                    else
                        return parseInt(finished_lesson[i].session_id);
                }
            }

        //没有数据返回当前session_id
        var sid = wx.getStorageSync('session_id');
        if (sid != null && sid > 0) {
            return sid;
        }
        return 0;
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
    //得到所有的资源
    getCurrentTopPic: function (options) {
        wx.setStorageSync('Term_ID', options);
        var selectedIndex = options;
        //得到当前选中学期的id
        selectedIndex = parseInt(selectedIndex)
        this.setHeadUrl(selectedIndex + 1);
        wx.setStorageSync('SELECTED_TERM_INDEX', selectedIndex);
        var terms = wx.getStorageSync('TERMS_LISTS');
        var thisTerm = terms[selectedIndex];
        this.setData({
            imgUrl:thisTerm.url,
            AllTopic:thisTerm.topics
        })
    },
    setHeadUrl: function (id) {
        var that = this;
        var id = Number(id);
        var lang = wx.getStorageSync('language');
        switch (id) {
            // 图片命名错了   !--  学期一名成了term4
            case 1:
                if (lang == 'chs') {
                    that.setData({
                        headUrl: 'https://api.jules.xin/images/term4.png'
                    })
                } else if (lang == 'eng') {
                    that.setData({
                        headUrl: 'https://api.jules.xin/images/eng/term1.png'
                    })
                }
                
                break;
            case 2:
                if (lang == 'chs') {
                    that.setData({
                        headUrl: 'https://api.jules.xin/images/term1.png'
                    })
                } else if (lang == 'eng') {
                    that.setData({
                        headUrl: 'https://api.jules.xin/images/eng/term2.png'
                    })
                }

                break;
            case 3:
                if (lang == 'chs') {
                    that.setData({
                        headUrl: 'https://api.jules.xin/images/term2.png'
                    })
                } else if (lang == 'eng') {
                    that.setData({
                        headUrl: 'https://api.jules.xin/images/eng/term3.png'
                    })
                }

                break;
            case 4:
                if (lang == 'chs') {
                    that.setData({
                        headUrl: 'https://api.jules.xin/images/term3.png'
                    })
                } else if (lang == 'eng') {
                    that.setData({
                        headUrl: 'https://api.jules.xin/images/eng/term4.png'
                    })
                }

                break;
        }
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

    studentOk:function(e){
        this.hideModal();
    },

    ChangeonConfirm: function (e) {
        //SOFUpdateUsernameAccess.php
        var studentUserName = this.data.selectedUserName;
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
                    if (lang == 'eng') {
                        wx.showToast({
                            title: 'successful'
                        })
                    } else if (lang == 'chs') {
                        wx.showToast({
                            title: '重置成功'
                        })
                    }

                    that.ChangeonCancel();
                }
            }
        })
        // console.log(this.data.selectedUserName);
    },


    //得到当前班级的当前课程的所有学生列表
    getStudentList: function (lesson) {
        var that = this;
        //得到当前课程的session_id，如果是0的话，就没有课程
        var sessionId = that.getSessionDataId(lesson);
        console.log(sessionId)
        //1.得到班级id
        var classID = wx.getStorageSync('classID');
        //2.得到当前课程的名称
        var lesson = lesson;
        //3.得到学生列表
        wx.request({
            url: api + '/SOFGetClassStudentsWithSession.php',
            data: {
                lesson_name: lesson,
                class_id: classID,
                session_id: sessionId
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data;//得到数据
                var arr = data.split(/\t+/g);
                var childData = arr[1];
                var child = obj_base64.decode(childData);
                var jsonObj = JSON.parse(child);
                var attrCon;
                var lang = wx.getStorageSync('language');
                //设置switch状态
                for (var i = 0; i < jsonObj.length; i++) {
                    var status = jsonObj[i].status;
                    if (status == 0) {
                        jsonObj[i].checked = false;
                        if (lang == 'eng') {
                            jsonObj[i].attrCon = 'absence'
                        } else if (lang == 'chs') {
                            jsonObj[i].attrCon = '缺勤'
                        }
                    } else {
                        jsonObj[i].checked = true;
                        if (lang == 'eng') {
                            jsonObj[i].attrCon = 'attendence'
                        } else if (lang == 'chs') {
                            jsonObj[i].attrCon = '出勤'

                        }

                    }
                }
                that.setData({
                    childrenList: jsonObj
                });
            }
        })
    },

    //打开课程
    openLesson: function (e) {
        //判断是不是最新的课程    
        var lesson = e.currentTarget.dataset.lesson;
        var name = e.currentTarget.dataset.name;
        var des = e.currentTarget.dataset.des;
        var description = [];
        for(var i = 0;i<des.length;i++){
            var data = des[i].title;
            description.push(data)
        }
        var descStr = description.toString();
        wx.navigateTo({
            url: '/pages/subjectDetail/subjectDetail?lesson=' + lesson +'&name=' + name + '&des=' + descStr 
        })
    },

    bindChange: function (e) {
        var that = this;
        that.setData({ currentTab: e.detail.current });

    },
    //获取当前班级的课程进度
    //并学生出勤情况
    openAttr: function (e) {
        var lesson = e.currentTarget.dataset.name;
        console.log(lesson)
        this.getStudentList(lesson);
        var session_info_id = this.getSessionDataId(lesson);
        this.setData({
            showTheModal: true,
            selectedLessonName: lesson,
            selectedSessionId: session_info_id,
            isScroll:'hidden',
        })
    },
    isChange:function(){
        var session_id = this.data.selectedSessionId;
        if (session_id <= 0) {
            wx.showToast({
                title: '未开课',
            })
            return;
        }
        this.setData({
            thisDisabled: false            
        })
    },
    // 点击切换学生列表和出勤名单
    swichNav: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
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
            showTheModal: false,
            isScroll: true,
            thisDisabled:true,
            visibility:'hidden'
            
        });
    },
    //隐藏重置密码确定模态框
    hideChangeModal: function () {
        this.setData({
            showChangeModal: false,
        })
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

    changeOk: function (e) {
        var that = this;
        var session_id = this.data.selectedSessionId;
        if (session_id <= 0){
            wx.showToast({
                title: '未开课',
            })
            return;
        }
        var childList = this.data.childrenList;
        var child = '';
        var selectedChildList = [];
        for (var i = 0; i < childList.length; i++) {
            var id = childList[i].id;
            if (childList[i].checked) {
                child = '"child' + id + '":' + '{"id":' + id + '}';
                selectedChildList.push(child);
            }
        }
        var childStr = selectedChildList.toString();
        childStr = '{' + childStr + '}';
        console.log(childStr)
        //得到编码后的所出勤的学生列表
        var base64child = obj_base64.encode(childStr);
        wx.request({
            url: api + '/SOFSubmitAttendanceNew.php',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                session_id: session_id,
                childlist: base64child
            },
            success: function (res) {
                var data = res.data;
                var dataList = data.split(/\t/);
                var dataOk = dataList[0];
                var lang = wx.getStorageSync('language');
                dataOk = dataOk.toUpperCase();
                if (dataOk == 'OK') {
                    if (lang == 'eng') {
                        wx.showToast({
                            title: 'successful'
                        })
                    }
                    if (lang == 'chs') {
                        wx.showToast({
                            title: '更改成功'
                        })
                    }
                    that.onConfirm();
                }
            }
        });
    },


    //修改学生出勤情况
    changeChildSession: function (e) {
        var selectedLessonName = this.data.selectedLessonName;//得到当前选中的那一门课
        var childList = this.data.childrenList;
        var child_id = e.currentTarget.dataset.id;
        var lang = wx.getStorageSync('language')
        for (var i = 0; i < childList.length; i++) {
            var id = childList[i].id;
            if (child_id == id) {
                var checked = childList[i].checked;//得到当前学生的出勤状态 true 出勤，false，缺勤
                if (checked == true) {
                    //当点中已出勤的学生的id时，这个学生就该改为缺勤模式
                    childList[i].checked = false;
                    if (lang == 'eng') {
                        childList[i].attrCon = 'absence'
                    } else if (lang == 'chs') {
                        childList[i].attrCon = '缺勤'
                    }
                } else {
                    childList[i].checked = true;
                    if (lang == 'eng') {
                        childList[i].attrCon = 'attendence'
                    } else if (lang == 'chs') {
                        childList[i].attrCon = '出勤'
                    }
                }
            }
        }

        this.setData({
            childrenList: childList,
            visibility:'visible'
        });
    },


    AddAttr: function (selectedLessonName) {
        // console.log(selectedLessonName)
    },
    //更改为缺勤
    removeAttr: function (selectedLessonName) {
        var that = this;
        // var uid = e.currentTarget.dataset.id;
        var session_info_id = that.getSessionDataId(selectedLessonName);
        if (session_info_id <= 0)
            return;

        // wx.request({
        //     url: api + '/SOFRemoveSessionChildren.php',
        //     data: {
        //         child_info_id: uid,
        //         session_data_id: session_info_id
        //     },
        //     header: { 'content-type': 'application/x-www-form-urlencoded' },
        //     success: function (res) {
        //         var data = res.data;
        //         var resdata = data.split("\t");

        //         that.getStudentList(that.selectedLessonName);
        //     }
        // });
    }
})