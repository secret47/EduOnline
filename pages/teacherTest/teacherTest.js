// pages/teacherTest/teacherTest.js

const app = getApp()

var api = app.globalData.API;//全局api


Page({

    data: {
        ans: [],
        selectable: "true",
        studies: [
            {
                "id": 0,
                "name": "什么是计算思维",
                "answer": [
                    {
                        "name": "A",
                        "value": "关注批判性和逻辑性思考的技能，重在培养孩子解决问题的能力",
                        disabled: false,
                        checked: false,
                        "tag": "1|A"
                    },
                    {
                        "name": "B",
                        "value": "计算思维就是像机器人一样思考的思维方式",
                        disabled: false,
                        checked: false,
                        "tag": "1|B"
                    },
                    {
                        "name": "C",
                        "value": "计算思维就是像程序员一样思考的思维方式",
                        disabled: false,
                        checked: false,
                        "tag": "1|C"
                    },
                    {
                        "name": "D",
                        "value": "来源于新加坡，重在培养数学的计算能力",
                        disabled: false,
                        checked: false,
                        "tag": "1|D"
                    }
                ]
            },
            {
                "id": 1,
                "name": "计算思维包含哪几个方面？",
                "answer": [
                    {
                        "name": "A",
                        "value": "流程建设，分层思维，模式识别，抽象化",
                        disabled: false,
                        checked: false,
                        "tag": "2|A"
                    },
                    {
                        "name": "B",
                        "value": "流程建设，分层思维，模式识别",
                        disabled: false,
                        checked: false,
                        "tag": "2|B"
                    },
                    {
                        "name": "C",
                        "value": "分层思维，模式识别",
                        disabled: false,
                        checked: false,
                        "tag": "2|C"
                    },
                    {
                        "name": "D",
                        "value": "流程建设，分层思维",
                        disabled: false,
                        checked: false,
                        "tag": "2|D"
                    }
                ]
            },
            {
                "id": 2,
                "name": "提出者是谁？",
                "answer": [
                    {
                        "name": "A",
                        "value": "周以真",
                        "disabled": false,
                        "checked": false,
                        "tag": "3|A"
                    },
                    {
                        "name": "B",
                        "value": "蒙台梭利",
                        "disabled": false,
                        "checked": false,
                        "tag": "3|B"
                    },
                    {
                        "name": "C",
                        "value": "李显龙",
                        "disabled": false,
                        "checked": false,
                        "tag": "3|C"

                    },
                    {
                        "name": "D",
                        "value": "瑞吉欧",
                        "disabled": false,
                        "checked": false,
                        "tag": "3|D"

                    }
                ]
            },
            {
                "id": 3,
                "name": "什么是流程建设？",
                "answer": [
                    {
                        "name": "A",
                        "value": "有步骤地思考，一步一步地实现目标",
                        "disabled": false,
                        "checked": false,
                        "tag": "4|A"

                    },
                    {
                        "name": "B",
                        "value": "从A到B的过程",
                        "disabled": false,
                        "checked": false,
                        "tag": "4|B"

                    },
                    {
                        "name": "C",
                        "value": "有计划的实现目标",
                        "disabled": false,
                        "checked": false,
                        "tag": "4|C"

                    },
                    {
                        "name": "D",
                        "value": "忽略不重要的步骤，只重视重要的步骤",
                        "disabled": false,
                        "checked": false,
                        "tag": "4|D"

                    }
                ]
            },
            {
                "id": 4,
                "name": "什么是抽象化？",
                "answer": [
                    {
                        "name": "A",
                        "value": "在文学创作过程中的一种不良的创作倾向",
                        "disabled": false,
                        "checked": false,
                        "tag": "5|A"

                    },
                    {
                        "name": "B",
                        "value": "简化事物的过程",
                        "disabled": false,
                        "checked": false,
                        "tag": "5|B"
                    },
                    {
                        "name": "C",
                        "value": "仅仅是一种数学概念，就是指的去除了与原来有关联的现实中的对象的依赖关系，并对其进行泛化，使其具有更广泛的应用",
                        "disabled": false,
                        "checked": false,
                        "tag": "5|C"
                    },
                    {
                        "name": "D",
                        "value": "忽略不重要的细节，只关注重要的部分",
                        "disabled": false,
                        "checked": false,
                        "tag": "5|D"
                    }
                ]
            },
            {
                "id": 5,
                "name": "什么是模式识别",
                "answer": [
                    {
                        "name": "A",
                        "value": "是组合学最基本的概念，所谓排列，就是指从给定个数的元素中取出指定个数的元素进行排序",
                        "disabled": false,
                        "checked": false,
                        "tag": "6|A"
                    },
                    {
                        "name": "B",
                        "value": "找出事物的相同点，并进行事物的排序和分组",
                        "disabled": false,
                        "checked": false,
                        "tag": "6|B"
                    },
                    {
                        "name": "C",
                        "value": "是计算机内经常进行的一种操作",
                        "disabled": false,
                        "checked": false,
                        "tag": "6|C"
                    },
                    {
                        "name": "D",
                        "value": "其实就是排列组合",
                        "disabled": false,
                        "checked": false,
                        "tag": "6|D"
                    }
                ]
            },
            {
                "id": 6,
                "name": "什么是分层思维？",
                "answer": [
                    {
                        "name": "A",
                        "value": "把一个一个小的部分组合成大的部分",
                        "disabled": false,
                        "checked": false,
                        "tag": "7|A"
                    },
                    {
                        "name": "B",
                        "value": "先完成简单的，再完成复杂的，一步一步完成任务的思维过程",
                        "disabled": false,
                        "checked": false,
                        "tag": "7|B"
                    },
                    {
                        "name": "C",
                        "value": "把事物分解，化大为小的思维过程",
                        disabled: false,
                        checked: false,
                        "tag": "7|C"
                    },
                    {
                        "name": "D",
                        "value": "是人的理性认识阶段，人运用概念、判断、推理等思维类型反映事物本质与规律的认识过程",
                        "disabled": false,
                        "checked": false,
                        "tag": "7|D"

                    }
                ]
            },
        ],
        corAns: ["A", "A", "A", "A", "D", "B", "C"],//正确答案选项
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
        faultAns: [],
        showTestModal: false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    radioChange: function (e) {
        var id = e.currentTarget.dataset.id;//得到当前选择的radio-group的id
        var selectedValue = e.detail.value;//得到当前选择的内容;
        var questions = this.data.studies;//得到所有的题
        for (var i = 0; i < questions.length; i++) {
            var data = questions[i]
            //判断当前点击的选项
            if (i == id) {
                var answer = data.answer;
                for (var j = 0; j < answer.length; j++) {
                    var ansData = answer[j];
                    if (selectedValue == answer[j].name) {
                        answer[j].checked = true;
                    } else {
                        answer[j].checked = false;
                    }

                }
            }

        }
        this.setData({
            studies: this.data.studies
        })
    },
    submitAnswer: function (e) {
        var studies = this.data.studies;
        for (var i = 0; i < studies.length; i++) {
            var answers = studies[i].answer;
            for (var k = 0; k < answers.length; k++) {
                var result = answers[k];
                var checked = result.checked;
                if (checked) {
                    var curAns = result.tag;
                    this.data.ans.push(curAns)
                } else {

                }
            }
        }
        var openid = wx.getStorageSync('openid');
        var accountId = wx.getStorageSync('AccountId')
        var that = this;
        //得到所有所选项
        var answers = that.data.ans;
        var cor = that.data.corAns;
        var ans = [];
        console.log(answers)
        if (answers.length != studies.length) {
            wx.showToast({
                title: '请完整答题',
            })
        } else {

            //得到选中的答案
            for (var i = 0; i < answers.length; i++) {
                var data = answers[i];
                var dataArr = data.split('|');
                //得到答案和答案所在的下标
                var index = parseInt(dataArr[0]);
                var answer = dataArr[1];
                ans.push(answer);
                //分别将答案string化
                var anss = ans.toString();
                var cors = cor.toString();
                if (cors == anss) {
                    wx.request({
                        url: api+'/SOFSetTestResult.php',
                        data: {
                            openid: openid,
                            result:1
                        },
                        success: function (res) {
                            console.log(res)
                            var data = res.data;
                            var dataArr = data.split(/\t/);
                            var result = dataArr[1];
                            //设置测试结果
                            if(result == ""){
                                wx.setStorageSync('is_TEST', 'ok');
                                wx.setStorageSync('TEST_RESULT', '1')
                            }else{
                                wx.setStorageSync('TEST_RESULT', result)
                            }
                        },
                        error: function (err) {
                            console.log(err)
                        }

                    })
                    that.setData({
                        showTheModal: true
                    })
                } else {
                    if(ans[index -1 ] == cor[index-1]){

                    }else{
                        var falut = parseInt(index);
                        that.data.faultAns.push(falut)
                        console.log(index)
                        that.setData({
                            showTestModal: true,
                            faultAns: that.data.faultAns
                        })
                    }
                }
            }

        }

    },
    nextQues: function (e) {
        console.log('下一题')
    },/**
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
    hideTestModal:function(){
        this.setData({
            showTestModal: false,
        });
        var theAnswers = [];
        var faultAns = [];
        var studies = this.data.studies;//得到当前所有的问题
        for(var i = 0;i<studies.length;i++){
            var answers = studies[i].answer;
            for(var k = 0;k<answers.length;k++){
                var answer  = answers[k];
                answer.checked = false;
            }
        }
        this.setData({
            studies : studies,
            ans: theAnswers,
            faultAns: faultAns
        })
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
        this.hideTestModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
        this.hideTestModal();
    },
    testOK: function () {
        this.hideModal();
        wx.switchTab({
            url: '../lessonCenter/lessonCenter',
            success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null)
                    return;
                page.onShow();
            }
        })
    },
})