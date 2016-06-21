$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "idfa",
            title: "推广",
            sort: false,
            filter: true,
            cls: "hidden_xs",
            show: false
        }, {
            key: "id",
            title: "ID",
            sort: true,
            filter: true
        }, {
            key: "login_times",
            title: "类别",
            sort: false,
            filter: true
        }, {
            key: "phone",
            title: "姓名",
            sort: false,
            filter: true
        }, {
            key: "money",
            title: "费用",
            sort: true
        }, {
            key: "money",
            title: "已付",
            sort: true,
            cls: "hidden_xs"
        }, {
            key: "money",
            title: "好友",
            sort: true
        }, {
            key: "money",
            title: "任务",
            sort: true,
            cls: "hidden_xs"
        }, {
            key: "money",
            title: "好友总消费",
            sort: true,
            show: false
        }, {
            key: "wechat",
            title: "手机",
            sort: false,
            filter: true,
            cls: "hidden_xs"
        }, {
            key: "ip",
            title: "微信",
            sort: false,
            filter: true,
            cls: "hidden_xs"
        }, {
            key: "login",
            title: "平台",
            sort: false,
            filter: true,
            show: false
        }, {
            key: "today",
            title: "粉丝(在线观看)人数",
            sort: false,
            filter: true,
            show: false
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
    };
    new Table(opt);
    $('body').on('click','table .btn_query_detail',function(){
        window.open('_HOST_/html/detail/guest_user_detail.html?id='+$(this).data('id'));
    });
});
