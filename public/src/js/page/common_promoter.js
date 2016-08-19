$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "id",
            title: "ID",
            filter: true
        }, {
            key: "name",
            title: "姓名",
            filter: true
        }, {
            key: "username",
            title: "账号",
            filter: true
        }, {
            key: "phone",
            title: "电话",
            filter: true,
            cls: "hidden_xs"
        }, {
            key: "createdAt",
            title: "创建时间",
            sort: true,
            cls: "hidden_xs"
        }, {
            key: "updatedAt",
            title: "最近操作时间",
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
        url: "_HOST_/promoter/query"
    };
    var promoter_table = new Table(opt);

    window.renderTable = function(){
        promoter_table.data = null;    //将本地数据清空，table控件在render时才会重新发起请求拿数据
                                //此处更好的做法应该是后台返回我成功添加的这条数据 我塞进本地数据。留作后期优化吧
        promoter_table.render();
    };
    $('body').on('click','table .btn_query_detail',function(){
        window.open('_HOST_/page/promoter_detail/'+$(this).data('id'));
    }).on('click','.btn_promoter_add',function(){
        // 添加任务时 初始化弹窗标题及内容
        oper_promoter.box.initHeader('添加推广人员');

        oper_promoter.box.initContent('_HOST_/page/promoter_add .add_promoter_form', function() {
            oper_promoter.box.show();
        });
        var $tip_ct = $(this).closest("td");
        oper_promoter.box.afterfnSure = function(tip){
            $tip_ct.operTip(tip || "操作成功！",{theme: "warning"});
        }
    });
});
