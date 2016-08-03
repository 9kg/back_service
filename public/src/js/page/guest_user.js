$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "type",
            title: "类别",
            sort: true,
            filter: true
        }, {
            key: "name",
            title: "姓名",
            sort: true,
            filter: true
        }, {
            key: "pay",
            title: "费用",
            sort: true,
            filter: true
        }, {
            key: "payed",
            title: "已付",
            sort: true,
            cls: "hidden_xs"
        }, {
            key: "xx",
            title: "好友数",
            sort: true
        }, {
            key: "xx",
            title: "任务数",
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
        url: "_HOST_/guest_user/query"
    };
    new Table(opt);
    $('body').on('click','table .btn_query_detail',function(){
        window.open('_HOST_/page/guest_user_detail/'+$(this).data('id'));
    });
});
