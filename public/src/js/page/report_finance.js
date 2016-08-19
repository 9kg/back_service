$(function(){
    // 操作提示的容器
    var $tip_ct = $('.filter_ct');
    // 数据获取地址
    var data_url = "_HOST_/finance/report";
    // 数据
    var finance_data;
    // 格式化后的数据(适应图表的数据格式需求)
    var data_obj = {};
    // 图表类型对应关系
    var chart_type_obj = {
        fee: "销售额",
        cost: "成本",
        countall: "完成量"
    };
    // 日期控件初始化及赋值
    var start_date = base.calDate('d',-7,new Date);
    var date_start = $(".date_start").val(base.date("y-m-d",start_date)).datepicker({timepicker:false,max: "today",min: "2016-07-20",datetime: start_date});
    var date_end = $(".date_end").val(base.now("y-m-d")).datepicker({timepicker:false,min: start_date,max: "today"});
    // 表格
    var finance_table;
    // 图表
    var finance_chart;
    // 表格参数
    var table_opt = {
        $ct: $(".table_ct"),
        isLocal: true,
        footerFix: true,
        sendData: {
            page_size: 20,
            filter_key: 'company',
            sort: 'report_date',
            sort_dir: 'asc',
            cur_page: 1
        },
        fnAfterLocalFilter: function(data){
            renderTotal(data);
        },
        col: [{
            key: "report_date",
            title: "日期",
            sort: true,
            filter: true
        }, {
            key: "company",
            title: "公司",
            sort: true,
            filter: true
        }, {
            key: "fee",
            title: "销售额",
            sort: true,
            filter: true
        }, {
            key: "cost",
            title: "成本",
            sort: true,
            filter: true
        }, {
            key: "countall",
            title: "完成量",
            sort: true,
            filter: true
        }, {
            key: "pay_type",
            title: "支付类型",
            sort: true,
            cls: "hidden_xs",
            render: function(a,b){
                if(+b){
                    a.html("后付");
                }else{
                    a.html("预付").addClass("warning_color");
                }
            }
        }]
    };
    // 图表参数
    var chart_opt = {
        title : {text: '财务图表',x: '500',align: 'right'},
        grid: {left: 440,bottom: 80},
        toolbox: {feature: {magicType: {type: ['stack', 'tiled']},restore: {},saveAsImage: {}}},
        tooltip : {trigger: 'axis',axisPointer: {animation: false}},
        legend: {x: 'left', y: 50, orient: 'vertical'},
        xAxis : [{type : 'category',boundaryGap : false,axisLine: {onZero: false}}],
        yAxis: [{type: 'value'}]
    };

    getData();


    // 事件
    $('body').on("click", ".btn_toggle_table_chart", function(){
        $(".chart_ct,.table_ct").toggleClass("hidden");
        if(!$(".chart_ct").is(".hidden")){
            renderChart();
        }
    }).on("change", ".date_start", function(){
        date_end.cgOpt({min: $(this).val()});
        getData();
    }).on("change", ".date_end", function(){
        date_start.cgOpt({max: $(this).val()});
        getData();
    }).on("click", '[name="chart_name"]', function(){
        renderChart();
    });

    // 图表渲染
    function renderChart(){
        var chart_type = $('[name="chart_name"]:checked').val();
        var chart_type_desc = chart_type_obj[chart_type];
        chart_opt.yAxis[0].name = chart_type_desc;
        var date_arr = chart_opt.xAxis[0].data;
        chart_opt.title.subtext = chart_type_desc+'('+date_arr[0]+"——"+date_arr[date_arr.length-1]+')';
        var stack_desc = chart_type === "countall" ? "总量" : "总额";
        chart_opt.series = $.map(data_obj,function(val,key){
            return {
                name: key,
                type: 'line',
                stack: stack_desc,
                areaStyle: {normal: {}},
                data: val[chart_type]
            }
        });
        finance_chart = chart.renderChart($(".chart_container")[0],chart_opt);
    }
    // 数据转换
    function formatData(){
        data_obj = {};
        // 日期数组
        var date_arr = [];
        // 公司数组
        var company_arr = [];
        $.each(finance_data,function(i,item){
            var date = item.report_date;
            var company = item.company;
            !~$.inArray(date, date_arr) && date_arr.push(date);
            !~$.inArray(company, company_arr) && company_arr.push(company);
            
            if(!data_obj[company]){
                data_obj[company] = {
                    fee: [],
                    cost: [],
                    countall: []
                };
            }
            var idx = date_arr.length -1;
            data_obj[company]['fee'][idx] = +item.fee;
            data_obj[company]['cost'][idx] = +item.cost;
            data_obj[company]['countall'][idx] = +item.countall;
        });
        $.each(date_arr,function(i,item){
            $.each(company_arr,function(ii,iitem){
                if(data_obj[iitem].fee[i] === undefined){
                    data_obj[iitem].fee[i] = 0;
                    data_obj[iitem].cost[i] = 0;
                    data_obj[iitem].countall[i] = 0;
                }
            });
        });

        chart_opt.xAxis[0].data = date_arr;
        chart_opt.legend.data = company_arr;
        renderChart();
    }

    // 获取数据
    function getData(){
        var mask = new Mask({
            $ct: $('.content'),
            content: '数据加载中'
        }); 
        $.ajax({
            url: data_url,
            dataType: "json",
            data: {
                sdate: $(".date_start").val(),
                edate: $(".date_end").val()
            }
        }).done(function(data){
            if(data.status === 1){
                mask.hide();
                finance_data = data.data;
                renderTable();
                formatData();
            }else{
                $tip_ct.operTip(data.msg || "获取数据失败！",{dir: 'bottom',theme: "danger", css:{"white-space": "nowrap"}});
            }
        }).fail(function(){
            $tip_ct.operTip("获取数据失败！",{dir: 'bottom',theme: "danger", css:{"white-space": "nowrap"}});
        });
    }
    // 表格渲染
    function renderTable(){
        if(finance_table){
            finance_table.data = finance_data;
            finance_table.render();
        }else{
            table_opt.data = finance_data;
            finance_table = new Table(table_opt);
        }
    };
    // 计算并渲染总值
    function renderTotal(data){
        var fee_arr = [];
        var cost_arr = [];
        var countall_arr = [];
        $.each(data || finance_data,function(i,item){
            fee_arr.push(+item.fee);
            cost_arr.push(+item.cost);
            countall_arr.push(+item.countall);
        });
        $(".total_fee").text(eval(fee_arr.join('+')) || 0);
        $(".total_cost").text(eval(cost_arr.join('+')) || 0);
        $(".total_countall").text(eval(countall_arr.join('+')) || 0);
    }
});