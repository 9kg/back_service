$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "uid",
            title: "用户ID",
            cls: "hidden_xs",
            sort: true,
            filter: true
        }, {
            key: "type",
            title: "类别",
            cls: "hidden_xs",
            sort: true,
            filter: true
        }, {
            key: "name",
            title: "名称",
            sort: true,
            filter: true
        }, {
            key: "pay",
            title: "费用",
            sort: true,
            filter: true
        }, {
            key: "alipay",
            title: "支付宝",
            sort: true,
            cls: "hidden_xs"
        }, {
            key: "fans_num",
            title: "粉丝数",
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
        url: "http://192.168.1.211:5211/back/guest_user/query"
    };
    if(role !== 6){
        opt.col.unshift({
            key: "pname",
            title: "推广人员",
            sort: true,
            filter: true
        });
    }
    window.renderTable = function(){
        guest_user_table.data = null;    //将本地数据清空，table控件在render时才会重新发起请求拿数据
                                //此处更好的做法应该是后台返回我成功添加的这条数据 我塞进本地数据。留作后期优化吧
        guest_user_table.render();
    };
    var guest_user_table = new Table(opt);
    $('body').on('click','table .btn_query_detail',function(){
        window.open('http://192.168.1.211:5211/back/page/guest_user_detail/'+$(this).data('id'));
    });
});
