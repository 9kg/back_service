$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "name",
            title: "姓名",
            sort: true,
            filter: true
        }, {
            key: "phone",
            title: "电话",
            sort: true,
            filter: true
        }, {
            key: "username",
            title: "账户",
            sort: true,
            filter: true,
            cls: "hidden_xs"
        }, {
            key: "price_all",
            title: "销售额",
            sort: true,
            cls: "hidden_xs",
            filter: true
        }, {
            key: "taskNum",
            title: "任务数",
            sort: true,
            filter: true
        }, {
            key: "id",
            title: "操作",
            width: 60,
            cls: "t_center",
            render: function(a, b) {
                var btn_query = $('<button type="button" class="btn btn_info btn_query_detail" data-id="' + b + '">查看</button>');
                a.append(btn_query);
            }
        }],
        isLocal: true,
        url: "http://192.168.1.114:9211/business/query"
    };
    new Table(opt);
    $('body').on('click','table .btn_query_detail',function(){
        window.open('http://192.168.1.114:9211/page/business_detail?id='+$(this).data('id'));
    }).on('click','.btn_business_add',function(){
        // 添加任务时 初始化弹窗标题及内容
        oper_business.box.initHeader('添加商务');

        oper_business.box.initContent('http://192.168.1.114:9211/page/business_add .add_business_form', function() {
            oper_business.box.show();
        });
        var $tip_ct = $(this).closest("td");
        oper_business.box.afterfnSure = function(tip){
            $tip_ct.operTip(tip || "操作成功！",{theme: "warning"});
        }
    });
});
