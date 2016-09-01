$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "createdAt",
            title: "提现时间",
            sort: true,
            filter: true,
            cls: 'hidden_xs'
        }, {
            key: "updatedAt",
            title: "处理时间",
            sort: true,
            filter: true,
            cls: 'hidden_xs'
        }, {
            key: "uid",
            title: "用户ID",
            cls: 'hidden_xs',
            sort: true,
            filter: true
        }, {
            key: "nickname",
            title: "微信昵称",
            filter: true,
            cls: 'hidden_xs'
        }, {
            key: "alipay_name",
            title: "真实姓名",
            filter: true
        }, {
            key: "price",
            title: "提现金额",
            sort: true,
            filter: true
        }, {
            key: "alipay",
            title: "支付宝账号",
            sort: true,
            filter: true
        }, {
            key: "errmsg",
            title: "结果",
            filter: true,
            render: function(a, b) {
                a.append(b ? "失败" : "成功");
            }
        }, {
            key: "uid",
            title: "订单号/错误原因",
            filter: true,
            render: function(a, b, c, d) {
                a.append( d.errmsg || d.alipay_id || d.duiba_order);
            }
        }, {
            key: "uid",
            title: "操作",
            width: '60',
            render: function(a, b) {
                a.append($('<button type="button" class="btn btn_info btn_query_detail" data-id="' + b + '">查看</button>'));
            }
        }],
        // isLocal: true,
        url: "http://192.168.1.211:5211/back/finance/cash_record_query"
    };
    new Table(opt);
    
    $("body").on('click','table .btn_query_detail',function(){
        window.open('http://192.168.1.211:5211/back/page/user_detail/'+$(this).data('id'));
    });
});
