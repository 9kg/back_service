$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "login_times",
            title: "姓名",
            filter: true
        }, {
            key: "phone",
            title: "电话",
            filter: true
        }, {
            key: "money",
            title: "账户",
            filter: true,
            cls: "hidden_xs"
        }, {
            key: "money",
            title: "销售额",
            sort: true,
            cls: "hidden_xs"
        }, {
            key: "today",
            title: "任务完成数",
            sort: true
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
        url: "_HOST_/js/json/user.json"
        // url: "http://localhost:9211/query/bd"
    };
    new Table(opt);
    $('body').on('click','table .btn_query_detail',function(){
        window.open('_HOST_/html/detail/business_detail.html?id='+$(this).data('id'));
    }).on('click','.btn_business_add',function(){
        // 添加任务时 初始化弹窗标题及内容
        oper_business.box.initHeader('添加商务');

        oper_business.box.initContent('_HOST_/html/temp/add_business.html .add_business_form', function() {
            oper_business.box.show();
        });
        var $tip_ct = $(this).closest("td");
        oper_business.box.afterfnSure = function(tip){
            $tip_ct.operTip(tip || "操作成功！",{theme: "warning"});
        }
    });
});
