
var fun_base64 = require('../../utils/base64.js') // 用第三方js文件
var obj_base64 = new fun_base64.Base64();//使用base64解码方法
var util = require('../../utils/util.js')

const app = getApp()
var api = app.globalData.API;//全局api

var resDataChs = app.globalData.ResData.resDataChs;
var resDataEng = app.globalData.ResData.resDataEng;
Page({
    data: {
        scrollTop: 100,
        arr: [],
        dots: false,
        autoplay: false,
        total_parts: 0,
        showTheModal: false,
        /** 
       * 页面配置 
       */
        winWidth: 0,
        winHeight: 0,
        // tab切换  
        currentTab: 0,
        childrenList: [],
        childList: [],
        title: "",
        currentLesson: "",//当前所点的课程名,
        lessonPer: "",
        lessonPage: 1,
        showStartModal: false,//开始课程的对话框,
        showEndModal: false,
        vbkg: '#dedede',
        vcolor: '#000',
        isStarting: false,
        childchecked: false,
        showVideo: false,
        startTime: 0,
        languages: "",
        storybookAll: 0,
        storybookCur: 1,
        isCurLesson:false,
        topicJson:[],
        cont:"",
        allTopic:[]
    },
    onLoad: function (e) {
        // var topicJson = JSON.parse(topic);
        // this.setData({
        //     topicJson: topicJson
        // })

        this.getCurrentLesson();
        this.getContentData(e);
        this.setTitleName(e);
        this.isCurrent();
        this.getSysInfo();
        this.getStudent();
        this.getLanguage();
    },
    shuaxin:function(e){
        var e = this.data.cont;
        this.getContentData(e);
    },
    setTitleName: function (e) {
        var name = e.name;
        var lesson = e.lesson;
        var des = e.des;
        if (name == 'undefined' && des !='undefined') {
            this.setData({
                title: des
            })
        }
        if(name =='undefined' && des == 'undefined'){
            this.setData({
                title:lesson
            })
        }
        if (name != 'undefined') {
            this.setData({
                title: name,
                name: name
            })
        }
    },
    //得到设备信息
    getSysInfo: function (e) {
        var winWidth;
        var winHeight;
        wx.getSystemInfo({
            success: function (res) {
                // 得到设备宽度和高度
                winWidth = res.windowWidth;
                winHeight = res.windowHeight;
            }
        })
        this.setData({
            winWidth: winWidth,
            winHeight: winHeight
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
    //得到语言
    getLanguage: function (e) {
        var lang = wx.getStorageSync('language');
        if (lang == "chs")
            this.setData({
                resDataVar: resDataChs.chsRes(),
                languages: lang
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
    //得到课程内容
    getContentData(e) {
        this.setData({
            cont:e
        })
        var lesson = e.lesson
        var name = e.name;
        var that = this;
        var arr = [];//总的数据
        that.setData({
            currentLesson: lesson
        })
        wx.request({
            url: api + '/SOFGetLessonByName.php?name=' + lesson,
            data: {
                lesson: lesson
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data;
                data = data.split(/\t/);
                var lessonData = data[1];
                lessonData = obj_base64.decode(lessonData)
                var lessonObj = JSON.parse(lessonData);
                var parts = lessonObj.parts
                var total_parts = lessonObj['total_parts'];
                var partIdx = 0;
                for (var i = 0; i < parts.length; i++) {
                    var data = parts[i];
                    console.log(data)
                    var part = 'part_' + (i + 1);
                    var part_name = data[part];
                    // 只要part为manual，image，video和storybook的part
                    if (part_name == 'manual' || part_name == 'image' || part_name == 'video' || part_name == 'storybook' || part_name == 'music') {
                        data.part = part_name;
                        // 将这些数据push到arr数组里
                        if (part_name == 'video') {
                            // 如果分类是视频
                            var partProperty = JSON.stringify(parts[i]);
                            var reg = new RegExp(part + "_", "g");
                            partProperty = partProperty.replace(reg, "");
                            var jsonVideoData = JSON.parse(partProperty);
                            arr.push(jsonVideoData);
                            partIdx++;
                        }
                        if (part_name == 'image') {
                            // 如果分类是图片
                            var partProperty = JSON.stringify(parts[i]);
                            var reg = new RegExp(part + "_", "g");
                            partProperty = partProperty.replace(reg, "");
                            var jsonImageData = JSON.parse(partProperty);
                            var img_urls = jsonImageData.image_urls;
                            for (var k = 0; k < img_urls.length; k++) {
                                var data = img_urls[k];
                                var obj = { "url": data, "autoWidth": 0, "autoHeight": 0, "id": k, "part_index": partIdx }//构造Json
                                img_urls[k] = obj;
                            }
                            arr.push(jsonImageData)
                            partIdx++;
                        }
                        if (part_name == 'music') {
                            //如果分类是音乐
                            var partProperty = JSON.stringify(parts[i]);
                            var reg = new RegExp(part + "_", "g");
                            partProperty = partProperty.replace(reg, "");
                            var jsonMusicData = JSON.parse(partProperty);
                            arr.push(jsonMusicData)
                            partIdx++;
                        }
                        if (part_name == 'manual') {
                            arr.push(data);
                            partIdx++;
                        }
                        if (part_name == 'storybook') {
                            var partProperty = JSON.stringify(parts[i]);
                            var reg = new RegExp(part + "_", "g");
                            partProperty = partProperty.replace(reg, "");
                            var jsonStoryData = JSON.parse(partProperty);
                            var story_type = jsonStoryData.storybook_type;//得到storybook的type
                            var start = jsonStoryData.storybook_start;//得到开始
                            var end = jsonStoryData.storybook_end;//得到结束
                            jsonStoryData.selectedImgIndex = -1;//当前选中的图
                            var storyJson = wx.getStorageSync('STORYBOOK_DATA');//读到所有的storybook
                            if (story_type == "chapter") {
                                // 如果故事书等于chapter
                                var picIndex = 0;
                                jsonStoryData.chapter = [];
                                for (var s = 0; s < storyJson.length; s++) {
                                    var data = storyJson[s];
                                    var index = data.index;//得到每个chapter的index
                                    if (index >= start && index <= end) {
                                        var chap_datas = data.data;
                                        for (var k = 0; k < chap_datas.length; k++) {
                                            chap_datas[k].partInx = partIdx;
                                            chap_datas[k].picIndex = picIndex;
                                            var des = chap_datas[k].description;
                                            des = des.replace(/\“/g, "");
                                            des = des.replace(/\”/g, "")
                                            des = des.replace(/\|/, "")
                                            var desArr = des.split("|");
                                            chap_datas[k].description = desArr;
                                            picIndex++;
                                            chap_datas[k].newWidth = that.data.winWidth - 40;
                                            chap_datas[k].newHeight = parseInt(chap_datas[k].newWidth * chap_datas[k].height / chap_datas[k].width);

                                            jsonStoryData.chapter.push(chap_datas[k]);
                                            jsonStoryData.selectedImgIndex = 0;
                                            var storybookAll = k + 1
                                            that.setData({
                                                storybookAll: storybookAll
                                            })
                                        }
                                    }
                                }
                            }
                            if (story_type == "page") {
                                // 如果故事书等于page
                                var picIndex = 0;
                                jsonStoryData.chapter = [];
                                var storybookStart = parseInt(jsonStoryData.storybook_start);
                                var storybookEnd = parseInt(jsonStoryData.storybook_end);

                                var storybookAll = storybookEnd - storybookStart + 1;
                                that.setData({
                                    storybookAll: storybookAll
                                })
                                for (var s = 0; s < storyJson.length; s++) {
                                    var chapter = storyJson[s];
                                    // var index = chapter.index;//得到每个chapter的index
                                    var chap_datas = chapter.data;
                                    for (var k = 0; k < chap_datas.length; k++) {
                                        if (chap_datas[k].id >= start && chap_datas[k].id <= end) {
                                            chap_datas[k].partInx = partIdx;
                                            var des = chap_datas[k].description;
                                            chap_datas[k].picIndex = picIndex;
                                            des = des.replace(/\“/g, "");
                                            des = des.replace(/\”/g, "")
                                            des = des.replace(/\|/, "")
                                            var desArr = des.split("|");
                                            chap_datas[k].description = desArr;
                                            picIndex++;
                                            chap_datas[k].newWidth = that.data.winWidth - 40;
                                            chap_datas[k].newHeight = parseInt(chap_datas[k].newWidth * chap_datas[k].height / chap_datas[k].width);
                                            jsonStoryData.chapter.push(chap_datas[k]);
                                            jsonStoryData.selectedImgIndex = 0;

                                        }
                                    }
                                }
                            }
                            arr.push(jsonStoryData)
                            partIdx++;
                        }
                    }
                    else {
                        // 
                        // console.log(data,'+++++++++++++++++++++')
                    }
                }
                var lessonLength = arr.length;
                for (var i = 0; i < arr.length; i++) {
                    // //判断是否有课程不含description。
                    var data = arr[i];
                    var id = (i + 1);
                    data.id = id;
                    if (data.descriptions) {
                        var desArr = data.descriptions;
                        for (var j = 0; j < desArr.length; j++) {
                            var data = desArr[j];
                            var description = data.description;
                        }
                    } else {
                        //如果不存在description...
                        // console.log(data)
                    }
                    var curPer = 100 / lessonLength;
                    that.setData({
                        arr: arr,
                        total_parts: lessonLength,
                        lessonPer: curPer
                    })
                    
                }

            }

        })


    },
    //得到当前班级的学生列表
    getStudent: function () {
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
                var childList = JSON.parse(child);
                var child_count = childList.count;//得到学生总数
                wx.setStorageSync('child_count', child_count)// 设置学生的总数
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
                    var lang = wx.getStorageSync('language');
                    username = '"username":' + username,
                        id = '"id":' + id;
                    if (lang == 'chs') {
                        str = '{' + username + ',' + id + ',"checked":' + 'false' + ',"attrCon":' + '"缺勤"' + '}'
                    } else if (lang == 'eng') {
                        str = '{' + username + ',' + id + ',"checked":' + 'false' + ',"attrCon":' + '"absence"' + '}'
                    }
                    var strJson = JSON.parse(str);
                    child.push(strJson);
                }

                that.setData({
                    childrenList: child
                })
            }
        })
    },

    //滑动切换
    bindChange: function (e) {
        var that = this;
        that.setData({ currentTab: e.detail.current });

    },
    //课程part轮播的切换事件  点击切换
    swiperChange: function (e) {
        var that = this;
        var currentPage = e.detail.current + 1;//得到当前的页面
        var parts = that.data.total_parts;//得到总的页数

        var everyPer = 100 / parts;//得到每一页需要多少百分比
        everyPer = everyPer * currentPage;//算出第几页百分比多少
        that.setData({
            lessonPer: everyPer,
            lessonPage: currentPage
        })
    },
    pre: function (e) {
        var partIndex = e.currentTarget.dataset.partid;
        var dataPart = this.data.arr[partIndex];
        if (dataPart.selectedImgIndex >= 1) {
            dataPart.selectedImgIndex--;
        }
        if (dataPart.selectedImgIndex < -1) {
            // break;
        }
        var num = dataPart.selectedImgIndex + 1;
        this.setData({
            arr: this.data.arr,
            storybookCur: num
        })
    },
    next: function (e) {
        // 下一页
        var partIndex = e.currentTarget.dataset.partid;
        var dataPart = this.data.arr[partIndex];
        if (dataPart.selectedImgIndex < dataPart.chapter.length - 1) {
            dataPart.selectedImgIndex++;
        }
        if (dataPart.selectedImgIndex > 1) {
            // break;
        }
        var num = dataPart.selectedImgIndex + 1;
        this.setData({
            arr: this.data.arr,
            storybookCur: num
        })
    },
    valueChange: function (e) {
        modalValue: e.detail.value
    },
    isCurrent:function(e){
        var finishedLesson = wx.getStorageSync('FINISHED_LESSON_LIST');
        console.log(finishedLesson)
        var count;
        if (finishedLesson == null) {
            count = 0;//表示以前没上过课
        } else {
            count = finishedLesson.count;//当前已完成了多少课。
        }
        var currentLesson = this.data.currentLesson
        var lessons = wx.getStorageSync('LESSONS_NAME');
        var curId;
        for(var i = 0;i<lessons.length;i++){
            var data = lessons[i];
            if(data == currentLesson){
                curId = i + 1;
            }
        }
        if(count +1 == curId){
            // 如果结束的课+1 等于现在的课
            this.setData({
                isCurLesson:true
            })
        }else{
            this.setData({
                isCurLesson: false
            })
        }

    },
    //点击弹出开始课程的对话框
    startPrepare: function (e) {
        var title = this.data.title;
        var lesson = this.data.currentLesson;
        var lastName = wx.getStorageSync('lastName');//得到上一堂课的名称
        var finishedLesson = wx.getStorageSync('FINISHED_LESSON_LIST');
        var count;
        if (finishedLesson == null) {
            count = 0;//表示以前没上过课
        } else {
            count = finishedLesson.count;//当前已完成了多少课。
        }
        var lastNum;
        if (lastName == 0) {
            lastNum = 0;
        } else {
            lastNum = lastName.replace(/[^0-9]+/g, '')//得到上一堂课的下标
            lastNum = Number(lastNum);
        }
        var currentNum = lesson.replace(/[^0-9]+/g, '')//得到当前课程的下标
        currentNum = Number(currentNum)
        // 得到上一堂课的下标后，能上课的课程下标应该是上一堂课的下标+1，不是的话就不能上课
        var thisNum = lastNum + 1;
        var lang = wx.getStorageSync('language');
        if (thisNum == currentNum) {
            this.setData({
                showStartModal: true,
                lessonName: title
            })
        } else {
            if (lang == 'chs') {
                wx.showToast({
                    title: '请按照顺序上课',
                })
            } else if (lang == 'eng') {
                wx.showToast({
                    title: 'Please follow the order',
                })
            }

        }
    },
    updateDisplay: function (that) {
        var pageList = getCurrentPages();
        var lastName = wx.getStorageSync('lastName');
        console.log(pageList,lastName)
        if (pageList != null && pageList.length > 2) {
            var currentPage = pageList[pageList.length - 1];
            var detailPage = pageList[pageList.length - 2];
            var terms = wx.getStorageSync('TERMS_LIST');
            var lessonNameC = that.data.currentLesson;
            var found = false;
            var finishedLessonCount = 0;
            var nextLessonName = "";

            for (var k = 0; k < terms.length; k++) {
                var termFinishedLessonCount = 0;
                if (terms[k].topics == null)
                    continue;

                for (var i = 0; i < terms[k].topics.length; i++) {
                    var topics = terms[k].topics;

                    var lessonItem = topics[i].lessons;
                    for (var j = 0; j < lessonItem.length; j++) {

                        if (!found)
                            finishedLessonCount++;
                        var lessonName = lessonItem[j].lesson;//得到课程的lessonName；
                        if (lessonNameC == lessonName && !found) {
                            lessonItem[j].completed = true;
                            lessonItem[j].css = "true";
                            found = true;
                            termFinishedLessonCount++;
                            terms[k].termFinishedLessonCount = termFinishedLessonCount;

                        }
                        else {
                            if (!found) {
                                lessonItem[j].completed = true;
                                termFinishedLessonCount++;
                            }
                            else {
                                if (nextLessonName == "")
                                    nextLessonName = lessonName;
                            }
                        }
                    }
                }
            }

            wx.setStorageSync('CURRENT_LESSON', "");
            wx.setStorageSync('CURRENT_NEXT_LESSON', nextLessonName);
            this.setData({
                allTopic:terms
            })
            var selectedTermIndex = wx.getStorageSync('SELECTED_TERM_INDEX');
            wx.setStorageSync('TERMS_LIST', terms);
            detailPage.setData({
                AllTopic: terms[selectedTermIndex].topics
            });

            pageList[0].setData({
                AllTopic: terms,
                curLess: finishedLessonCount
            });

            pageList[1].setData({
                lesson: terms
            })
        }

    },
    //设置图片宽高比例
    autoSize: function (e) {
        //得到图片的宽高和比例
        var width = e.detail.width;
        var height = e.detail.height;
        var imageRate = width / height
        var winWidth = this.data.winWidth;
        var autoWidth = winWidth - 50;
        var autoHeight = autoWidth / imageRate

        var part_index = parseInt(e.currentTarget.dataset.partid);
        var img_index = parseInt(e.currentTarget.dataset.id);
        this.data.arr[part_index].image_urls[img_index].width = autoWidth;
        this.data.arr[part_index].image_urls[img_index].height = autoHeight;
        this.setData({
            arr: this.data.arr
        })
    },
    //点击弹出是否确定结束课程的按钮
    showEndToast: function (e) {
        var title = this.data.title;
        this.setData({
            showEndModal: true,
            lessonName: title
        })
    },
    //确定结束按钮后，弹出学生出勤
    EndonConfirm: function (e) {
        this.hideModal();//关闭对话框
        this.clickShowChild();
    },

    //点击出现学生出勤情况 
    clickShowChild: function () {
        var session_id = wx.getStorageSync('session_id');
        this.setData({
            session_id: session_id
        })
        if (this.data.isStarting) {
            //点击才出现学生名单
            this.getStudent();
            var that = this;
            //设置课程状态，setClassStatus
            var lessonName = that.data.currentLesson;//点击获得当前课程的name
            var classID = wx.getStorageSync('classID');//得到当前班级
            var endtime = Date.parse(new Date());
            endtime = endtime / 1000; //得到当前时间戳
            // 得到刚刚结束的课程的id
            var index = wx.getStorageSync('classStatusId');
            wx.request({
                url: api + '/SOFUpdateClassStatus.php',
                method: 'POST',
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                data: {
                    index: index,
                    endtime: endtime,
                },
                success: function (res) {
                    var data = res.data;
                    //提交成功后关闭当前对话框
                    var dataArr = data.split(/\t/);
                    var curData = dataArr[0];
                    curData = curData.toUpperCase();
                    if (curData == 'OK') {
                        //如果提交成功
                        wx.setStorageSync('lastName', lessonName);
                        that.updateDisplay(that);
                        // setTimeout(function () {
                        //     that.getFinishedLessonList();
                        // }, 2500);

                        var session_id = parseInt(wx.getStorageSync('session_id'));
                        var finished_lesson = wx.getStorageSync('FINISHED_LESSON_LIST');

                        var obj = { "content_name": lessonName, "session_id": session_id, "starttime": that.data.startTime, "endtime": endtime };
                        if (finished_lesson != null) {
                            finished_lesson[finished_lesson.count] = obj;
                            finished_lesson.count = parseInt(finished_lesson.count) + 1;
                        }
                        else {
                            finished_lesson = { 0: obj, count: 1 };
                        }

                        wx.setStorageSync('FINISHED_LESSON_LIST', finished_lesson);
                        wx.removeStorageSync('session_id');
                    }

                },
                error: function (err) {
                    console.log(err)
                }

            })

            //打开学生出勤页面
            that.setData({
                showTheModal: true
            });
        } else {
            wx.showToast({
                title: '请先开始上课'
            })
        }

    },

    workOk: function (e) {
        // if(isStarting){
        var that = this;
        //得到当前所出勤的学生的列表
        var childList = that.data.childList;
        childList = childList.toString();
        var session_id = that.data.session_id;
        if(childList.length == 0){
            wx.showToast({
                title: '请先出勤',
            })
        }
        var childStr = '{' + childList + '}';
        //将所出勤的学生的列表json化
        var childJson = JSON.parse(childStr);
        //得到编码后的所出勤的学生列表
        var base64child = obj_base64.encode(childStr);
        console.log(childJson,session_id)
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
                //提交成功后关闭当前对话框
                var dataArr = data.split(/\t/);
                var curData = dataArr[0];
                that.setData({
                    isStarting: false
                })
                curData.toUpperCase();
                if (curData === 'OK') {
                    that.onCancel();
                    var allTopic = that.data.allTopic;
                    console.log(allTopic)
                    var pages = getCurrentPages()
                    var currPage = pages[pages.length -1];
                    var prevPage = pages[pages.length -2];
                    prevPage.setData({
                        AllTopic:allTopic[0].topics
                    })
                    wx.navigateBack()
                }
            }
       
       
       
         })
        // }else{
        //     wx.showToast({
        //         title:'还没开课'
        //     })
        // }
    },
    setTopic:function(e){
        var allTopic = this.data.AllTopic;
        console.log(allTopic);

    },
    //点击取消
    EndonCancel: function (e) {
        this.onCancel();
    },
    //添加学生出勤状态
    addChildSession: function (e) {
        //当前学生的id
        var child_id = e.currentTarget.dataset.id;
        var lang = wx.getStorageSync('language');
        if (lang == 'chs') {
            var child = '"child' + child_id + '":' + '{"id":' + child_id + ',"checked":' + 'true' + ',"attrCon":' + '"出勤"' + '}'
        } else if (lang == 'eng') {
            var child = '"child' + child_id + '":' + '{"id":' + child_id + ',"checked":' + 'true' + ',"attrCon":' + '"attendence"' + '}'
        }

        //把所点击的学生添加进数组
        this.data.childList.push(child);
        var childrenList = this.data.childrenList;
        for (var i = 0; i < childrenList.length; i++) {
            var id = childrenList[i].id;
            if (child_id == id) {
                var checked = childrenList[i].checked;//得到当前学生的出勤状态 true 出勤，false，缺勤
                if (checked == true) {
                    //当点中已出勤的学生的id时，这个学生就该改为缺勤模式
                    childrenList[i].checked = false;
                    if (lang == 'chs') {
                        childrenList[i].attrCon = "缺勤";
                    } else if (lang == 'eng') {
                        childrenList[i].attrCon = "absence";
                    }
                } else {
                    childrenList[i].checked = true;
                    if (lang == 'chs') {
                        childrenList[i].attrCon = "出勤";
                    } else if (lang == 'eng') {
                        childrenList[i].attrCon = "attendence";
                    }
                }
            }
        }
        this.setData({
            childList: this.data.childList,
            childrenList: childrenList
        });
    },

    //得到当前的课程
    getCurrentLesson: function (e) {
        var that = this;
        var class_id = wx.getStorageSync('classID');
        var account_id = wx.getStorageSync('AccountId');
        wx.request({
            //得到上一堂课的课程
            url: api + '/SOFGetClassStatusLatest.php',
            data: {
                class_id: class_id,
                account_id: account_id
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data;
                data = data.split(/\t/);
                var dataArr = data[1];
                var curLess;
                if (dataArr == "") {
                    curLess = 0;
                } else {
                    var classProgress = obj_base64.decode(dataArr);
                    var classJson = JSON.parse(classProgress);
                    var lastLesson = classJson[0];
                    var timeNow = Date.parse(new Date());
                    timeNow = timeNow / 1000;
                    if (lastLesson.endtime > timeNow) {
                        //正在上课
                        that.data.isStarting = true;
                    }
                    else {
                        //课程已经结束
                        //得到最后上课的班级上一堂课的名称.
                        var lastName = lastLesson.content_name;
                        wx.setStorageSync('lastName', lastName);
                    }

                }
                that.setData({
                    isStarting: that.data.isStarting
                })
            }
        })
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
            showStartModal: false,
            showEndModal: false
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
     * 课程开始对话框取消按钮点击事件
     */
    StartonCancel: function () {
        this.hideModal();
    },
    // 按了全勤按钮
    quanqin: function (e) {
        // var childrenList = this.data.childrenList;
        // var childList = [];
        // for(var i = 0;i<childrenList.length;i++){
        //     var data = childrenList[i];
        //     data.attrCon = "出勤"
        //     data.checked = true
        //     childList.push(data)
        // }
        // console.log(childList)
        // // this.setData({
        // //     childrenList: childrenList,
        // //     childList:childrenList
        // // })
    },


    //开局设置sessionData
    setSessionData: function (that) {
        var lessonName = that.data.currentLesson;//点击获得当前课程的name
        var classID = wx.getStorageSync('classID');//得到当前班级
        var date = new Date();
        var year = date.getFullYear();//得到年
        var month = date.getMonth();//得到月
        month = month + 1;
        var day = date.getDate();//得到日
        var time = year + '-' + month + '-' + day;
        wx.request({
            url: api + '/SOFUploadSessionData.php',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                session_name: lessonName,
                class_data_id: classID,
                date: time,
            },
            success: function (res) {
                var data = res.data;//得到返回的数据
                var datas = data.split(/\t+/g);
                var session_id = datas[1];
                wx.setStorageSync('session_id', session_id)
                that.setSessionTeacher();
            },
            error: function (err) {
                console.log(err)
            }

        })

    },

    //设置老师的sessionData
    setSessionTeacher: function (e) {
        var session_id = wx.getStorageSync('session_id');
        var teacher_id = wx.getStorageSync('teacher_id');
        wx.request({
            url: api + '/SOFAddSessionTeacher.php',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                session_data_id: session_id,
                teacher_info_id: teacher_id,
            },
            success: function (res) {
                console.log('老师的session', res);
            },
            error: function (err) {
                console.log(err)
            }

        })
    },

    /**
     * 课程开始对话框确认按钮点击事件
       应该存一个表明开始上课的变量
       */
    StartonConfirm: function () {
        var that = this;
        //对话框隐藏
        that.hideModal();
        that.setData({
            isStarting: true
        });
        // 课程开始时，向服务器发送指令开始课程。
        var lessonName = this.data.currentLesson;//点击获得当前课程的name
        var classID = wx.getStorageSync('classID');//得到当前班级
        var date = new Date();
        var starttime = Date.parse(date);//得到当前点击事件
        starttime = starttime / 1000; //转化成时间戳
        wx.request({
            url: api + '/SOFAddClassStatus.php',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                content_name: lessonName,
                class_id: classID,
                starttime: starttime,
            },
            success: function (res) {
                that.setData({
                    startTime: starttime
                })
                var data = res.data;//得到返回的数据
                var datas = data.split(/\t/);
                var classStatusId = datas[1];
                wx.setStorageSync('classStatusId', classStatusId);
                wx.setStorageSync('CURRENT_LESSON', lessonName);
                wx.setStorageSync('CURRENT_NEXT_LESSON', "");
                that.setSessionData(that);
                that.data.isStarting = true;
            },
            error: function (err) {
                console.log(err)
            }

        })

    },
    //得到已完成的课程的列表
    getFinishedLessonList: function () {
        var that = this;
        var content_name = wx.getStorageSync('content_name');
        var class_id = wx.getStorageSync('classID');
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
                if (decData == "") {
                    wx.setStorageSync('FINISHED_LESSON_LIST', null);
                } else {
                    var finishedData = obj_base64.decode(decData);
                    var jsonObj = JSON.parse(finishedData);
                    wx.setStorageSync('FINISHED_LESSON_LIST', jsonObj);
                }

            }
        });
    },
    //点击弹出视频
    playVideo: function () {
        this.setData({
            showVideo: true
        })
    },
    //点击关闭视频弹出窗
    VideoonCancel: function () {
        this.setData({
            showVideo: false
        })
    },
    upper: function (e) {
        console.log(e)
    },
    lower: function (e) {
        console.log(e)
    },
    scroll: function (e) {
        console.log(e)
    },
    tap: function (e) {
        for (var i = 0; i < order.length; ++i) {
            if (order[i] === this.data.toView) {
                this.setData({
                    toView: order[i + 1]
                })
                break
            }
        }
    },
    tapMove: function (e) {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    }
})