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
            title: "推广费用",
            sort: true
        }, {
            key: "today",
            title: "产生的消费",
            sort: true,
            cls: "hidden_xs"
        }, {
            key: "today",
            title: "完成任务数",
            sort: true,
            cls: "hidden_xs"
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
        url: "http://192.168.1.211:5211/js/json/user.json"
        // url: "http://localhost:9211/query/bd"
    };
    new Table(opt);
    $('body').on('click','table .btn_query_detail',function(){
        window.open('http://192.168.1.211:5211/promoter/promoter_detail/'+$(this).data('id'));
    }).on('click','.btn_promoter_add',function(){
        // 添加任务时 初始化弹窗标题及内容
        oper_promoter.box.initHeader('添加推广人员');

        oper_promoter.box.initContent('http://192.168.1.211:5211/page/promoter_add .add_promoter_form', function() {
            oper_promoter.box.show();
        });
        var $tip_ct = $(this).closest("td");
        oper_promoter.box.afterfnSure = function(tip){
            $tip_ct.operTip(tip || "操作成功！",{theme: "warning"});
        }
    });
});
