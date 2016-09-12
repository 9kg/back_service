$(function() {
    // 配置广告主表格参数并初始化
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "bd_name",
            title: "商务",
            sort: true,
            filter: true,
            cls: "hidden_xs"
        }, {
            key: "company",
            title: "公司",
            sort: true,
            filter: true,
            cls: "hidden_xs"
        }, {
            key: "name",
            title: "姓名",
            sort: true,
            filter: true
        }, {
            key: "phone",
            title: "电话",
            sort: true,
            filter: true,
            cls: "hidden_xs"
        }, {
            key: "price_all",
            title: "消费",
            sort: true,
            filter: true
        }, {
            key: "money",
            title: "余额",
            sort: true,
            filter: true
        }, {
            key: "taskNum",
            title: "任务数",
            sort: true,
            filter: true,
            show: false,
            cls: "hidden_xs"
        }, {
            key: "username",
            title: "账号",
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
        url: "http://192.168.1.211:5211/back/adver/query"
    };
    var adverTable = new Table(opt);


    window.renderTable = function(){
        adverTable.data = null;    //将本地数据清空，table控件在render时才会重新发起请求拿数据
                                //此处更好的做法应该是后台返回我成功添加的这条数据 我塞进本地数据。留作后期优化吧
        adverTable.render();
    };
    $('body').on('click','table .btn_query_detail',function(){
        window.open('http://192.168.1.211:5211/back/page/adver_detail/'+$(this).data('id'));
    }).on('click','.btn_adver_add',function(){
        // 添加任务时 初始化弹窗标题及内容
        oper_adver.box.initHeader('添加广告主');

        oper_adver.box.initContent('http://192.168.1.211:5211/back/page/adver_add .add_adver_form', function() {
            oper_adver.box.show();
        });
        var $tip_ct = $(this).parent();
        oper_adver.box.afterfnSure = function(success, tip){
            if(success){
                $tip_ct.operTip(tip || "操作成功！",{theme: "warning"});
                renderTable();
            }else{
                $tip_ct.operTip(tip || "操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
            }
        }
    });
});
