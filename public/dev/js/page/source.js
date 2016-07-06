$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "id",
            title: "ID",
            sort: true,
            filter: true
        }, {
            key: "name",
            title: "名称",
            sort: true,
            filter: true
        }, {
            key: "createdAt",
            title: "创建时间",
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
        url: "http://192.168.1.211:9211/source/query"
    };
    var sourceTable = new Table(opt);
    window.renderTable = function(){
        sourceTable.data = null;    //将本地数据清空，table控件在render时才会重新发起请求拿数据
                                //此处更好的做法应该是后台返回我成功添加的这条数据 我塞进本地数据。留作后期优化吧
        sourceTable.render();
    };
    $('body').on('click','table .btn_query_detail',function(){
        window.open('http://192.168.1.211:9211/page/source_detail/'+$(this).data('id'));
    }).on('click','.btn_source_add',function(){
        // 添加来源时 初始化弹窗标题及内容
        oper_source.box.initHeader('添加来源');
        oper_source.box.operType = 'insert';
        oper_source.box.initContent('http://192.168.1.211:9211/page/source_add .add_source_form', function() {
            oper_source.box.show();
        });
        var $tip_ct = $(this).parent();
        oper_source.box.afterfnSure = function(success,tip){
            if(success){
                $tip_ct.operTip(tip || "操作成功！",{theme: "warning", css:{"white-space": "nowrap"}});
                renderTable();
            }else{
                $tip_ct.operTip(tip || "操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
            }
        }
    });
});
