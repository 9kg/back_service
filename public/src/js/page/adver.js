$(function() {
    // 配置广告主表格参数并初始化
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "bd_name",
            title: "商务",
            sort: false,
            filter: true,
            cls: "hidden_xs"
        }, {
            key: "company",
            title: "公司",
            sort: true,
            filter: true
        }, {
            key: "name",
            title: "姓名",
            sort: false,
            filter: true
        }, {
            key: "phone",
            title: "电话",
            sort: false,
            filter: true,
            cls: "hidden_xs"
        }, {
            key: "price_all",
            title: "消费",
            sort: false,
            filter: true
        }, {
            key: "money",
            title: "余额",
            sort: true
        }, {
            key: "taskNum",
            title: "任务数",
            sort: true,
            cls: "hidden_xs"
        }, {
            key: "username",
            title: "账号",
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
        url: "_HOST_/adver/query"
    };
    new Table(opt);
    $('body').on('click','table .btn_query_detail',function(){
        window.open('_HOST_/html/detail/adver_detail.html?id='+$(this).data('id'));
    }).on('click','.btn_adver_add',function(){
        // 添加任务时 初始化弹窗标题及内容
        oper_adver.box.initHeader('添加广告主');

        oper_adver.box.initContent('_HOST_/html/temp/add_adver.html .add_adver_form', function() {
            oper_adver.box.show();
        });
        var $tip_ct = $(this).closest("td");
        oper_adver.box.afterfnSure = function(tip){
            $tip_ct.operTip(tip || "操作成功！",{theme: "warning"});
        }
    });
});
