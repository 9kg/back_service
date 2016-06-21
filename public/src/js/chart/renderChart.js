//chart
var chart = {
    renderChart: function(dom, option) {
        var chart = echarts.init(dom);
        chart.setOption(option);

        $(window).resize(function() {
            //由于过渡动画的原因 此处延迟chart的resize
            setTimeout(function(){
                chart.resize();
            },500);
        });
    },
    data2opt: function(data, opt) {
        var dataOpt = opt.dataOpt;
        var myOpt = opt.myOpt;
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: $.map(dataOpt, function(item) {
                    return item.name;
                })
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: $.map(data, function(item) {
                    return item.day;
                })
            }],
            yAxis: [{
                type: 'value'
            }],
            series: $.map(dataOpt, function(item) {
                var obj = $.extend(true, {
                    type: 'line',
                    data: $.map(data, function(iitem) {
                        return eval("iitem['" + item.value.split(".").join("']['") + "']");
                    }, item)
                }, item);
                return obj;
            })
        };
        $.extend(true, option, myOpt);
        return option;
    }
};