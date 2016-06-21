$(function(){
    // 当选择单个特邀用户时，存取单个特邀用户的id;
    var query_one;
    // 日期控件初始化及赋值
    var start_date = base.calDate('d',-30,new Date);
    var date_start = $(".date_start").val(base.date("y-m-d",start_date)).datepicker({timepicker:false,max: "today",datetime: start_date});
    var date_end = $(".date_end").val(base.now("y-m-d")).datepicker({timepicker:false,min: start_date,max: "today"});
    // 初始化选择特邀用户弹出框
    var sel_guest_user = new Box({
        title:"选择特邀用户",
        html:'<div class="sel_guest_user"></div>',
        css:{
            // 'width': '400px'
        },
        fnSure: function(t){
            var sel_val = $('[name="sel_guest_user"]:checked').val();
            if(sel_val){
                query_one = sel_val;
                getData();
            }else{
                $('.table_filter').operTip("请选择一个特邀用户！",{theme:"danger"});
                return false;
            }
        },
        fnCancel: function(t){
            console.dir(t)
        },
        // html:$(".grid .ct").html()
    });
    
    // 向后台发送请求并根据数据渲染报表
    function getData(){
        var send_obj = {
            date_start: $(".date_start").val(),
            date_end: $(".date_end").val(),
            query_type: $(".query_type").val()
        };
        var tip = "全部特邀用户";
        if($("#chart_type").prop("checked")){
            send_obj.chart_type = "num";
        }else{
            send_obj.chart_type = "money";
        }
        if(send_obj.query_type === "some" && $(".query_some").val()){
            send_obj.query_some = $(".query_some").val();
            tip = "部分特邀用户("+$(".query_some option:selected").text()+")";
        }else if(send_obj.query_type === "one" && query_one){
            send_obj.query_one = query_one;
            tip = "特邀用户("+send_obj.query_one+")";
        }else if(send_obj.query_type !== "all"){
            return false;
        }
        console.dir(send_obj);
        $.ajax({
            url: "_HOST_/js/json/guest_user.json",
            dataType: "json"
        }).always(function(data) {
            renderChart(data,tip);
        });
    }
    
    // 渲染报表
    function renderChart(data,tip){
        var option;
        var list = data.list;
        if($("#chart_type").prop("checked")){
            option = {
                title: {
                    text: '好友数任务数关系图',
                    subtext: tip,
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return params[0].seriesName + ' : ' + params[0].value + ' (个)<br/>'
                            + params[1].seriesName + ' : ' + params[1].value + ' (个)<br/>'
                            + '合计 : ' + (params[0].value + params[1].value) + ' (个)<br/>';
                    }
                },
                legend: {
                    data:['一级好友','二级好友','一级任务','二级任务'],
                    x: 'center',
                    y: '45%'
                },
                dataZoom: [
                    {
                        show: true,
                        xAxisIndex: [0, 1],
                        backgroundColor: 'rgba(0, 0, 0, .1)',
                        showDataShadow: false,
                        fillerColor: 'rgb(38, 52, 75)',
                        bottom: '45%',
                        handleSize: 5
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0, 1]
                    }
                ],
                grid: [{
                    top: 50,
                    left: 50,
                    right: 50,
                    height: '30%'
                }, {
                    left: 50,
                    right: 50,
                    bottom: 50,
                    height: '30%'
                }],
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisLine: {onZero: true},
                        data: $.map(list, function(item) {
                            return item.day;
                        })
                    },
                    {
                        gridIndex: 1,
                        type : 'category',
                        boundaryGap : false,
                        axisLine: {onZero: true},
                        data: $.map(list, function(item) {
                            return item.day;
                        })
                    }
                ],
                yAxis : [
                    {
                        name : '好友数(个)',
                        type : 'value'
                    },
                    {
                        gridIndex: 1,
                        name : '任务数(个)',
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'一级好友',
                        type:'line',
                        areaStyle: {normal: {}},
                        symbolSize: 5,
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.friend_1;
                        }),
                        stack: "总好友"
                    },
                    {
                        name:'二级好友',
                        type:'line',
                        areaStyle: {normal: {}},
                        symbolSize: 5,
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.friend_2;
                        }),
                        stack: "总好友"
                    },
                    {
                        name:'一级任务',
                        type:'line',
                        areaStyle: {normal: {}},
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        symbolSize: 5,
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.task_1;
                        }),
                        stack: "总任务"
                    },
                    {
                        name:'二级任务',
                        type:'line',
                        areaStyle: {normal: {}},
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        symbolSize: 5,
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.task_2;
                        }),
                        stack: "总任务"
                    }
                ]
            };
        }else{
            option = {
                title : {
                    text: '特邀用户支出费用',
                    subtext: tip,
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return params[0].seriesName + ' : ' + params[0].value + ' (元)';
                    }
                },
                grid: {
                    bottom: 100,
                    left: 50,
                    right: 50
                },
                legend: {
                    data:['支出费用'],
                    x: 'left'
                },
                dataZoom: [
                    {
                        show: true,
                        backgroundColor: 'rgba(0, 0, 0, .1)',
                        showDataShadow: false,
                        fillerColor: 'rgb(38, 52, 75)',
                        handleSize: 5
                    }
                ],
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisLine: {onZero: false},
                        data : $.map(list, function(item) {
                            return item.day;
                        })
                    }
                ],
                yAxis: [
                    {
                        name: '支出费用(元)',
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name:'支出费用',
                        type:'line',
                        hoverAnimation: false,
                        data: $.map(list, function(item) {
                            return item.task_1;
                        })
                    }
                ]
            };
        }
        
        chart.renderChart($(".report_ct")[0],option);
    }
    // 事件
    $(".date_start").bind("change",function(){
        // $(".date_end").val(base.date("y-m-d",base.calDate('m',1,new Date($(this).val()))));
        date_end.cgOpt({min: $(this).val()});
        getData();
    });
    $(".date_end").bind("change",function(){
        // $(".date_start").val(base.date("y-m-d",base.calDate('m',-1,new Date($(this).val()))));
        date_start.cgOpt({max: $(this).val()});
        getData();
    });
    $(".query_type,.query_some,#chart_type").bind("change",function(){
        getData();
    });
    // 选择指定特邀用户
    $(".query_one").bind("click",function(){
        sel_guest_user.show();
        var opt = {
            $ct: $(".sel_guest_user"),
            col: [{
                key: "id",
                width: 20,
                render: function(a, b) {
                    var btn_query = $('<label class="radio"><input type="radio" value="'+b+'" name="sel_guest_user"><span class="opt_imitate"></span></label>');
                    a.append(btn_query);
                }
            }, {
                key: "id",
                title: "ID",
                sort: true,
                filter: true
            }, {
                key: "login_times",
                title: "类别",
                sort: false,
                filter: true
            }, {
                key: "phone",
                title: "姓名",
                sort: false,
                filter: true
            }, {
                key: "wechat",
                title: "手机",
                sort: false,
                filter: true,
                cls: "hidden_xs"
            }, {
                key: "ip",
                title: "微信",
                sort: false,
                filter: true,
                cls: "hidden_xs"
            }],
            isLocal: true,
            theme: 'lightblue',
            url: "_HOST_/js/json/user.json"
        };
        !$(".sel_guest_user .table").length && new Table(opt);
    });
    
    // 行点击选中
    $('body').on('click','.sel_guest_user tbody tr',function(){
        $(this).find('[type="radio"]').prop("checked",true);
    })
    
    if(base.getParam('id')){
        $('.query_type').val('one').trigger('change');
        query_one = base.getParam('id');
        $("#chart_type").prop("checked",base.getParam('type') !== 'money');
        getData();
    }else{
        getData();
    }
});