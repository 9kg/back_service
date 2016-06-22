$(function() {
    // 配置任务表格参数并初始化
    var opt = {
        $ct: $(".content"),
        pageSizes: [10,25,50,100,200],
        theme: 'warning',
        // isLocal: true,
        url: "_HOST_/task/query",
        sendData: {
            page_size: 25,
            sort: 'id',
            sort_dir: 'desc',
            cur_page: 1,
            status: -1
        },
        col: [
            {
                key: "objectId",
                title: '<label class="checkbox"><input type="checkbox" name="sel_task_all"><span class="opt_imitate"></span></label>',
                width: 20,
                render: function(a, b) {
                    var btn_query = $('<label class="checkbox"><input type="checkbox" value="'+b+'" name="sel_task"><span class="opt_imitate"></span></label>');
                    a.append(btn_query);
                }
            }, {
                key: "objectId",
                title: "ID",
                sort: true,
                cls: "hidden_xs"
            }, {
                key: "name",
                title: "商务",
                sort: false,
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
                title: "名称",
                sort: false,
                filter: true
            }, {
                key: "keyword",
                title: "关键词",
                sort: false,
                filter: true,
                cls: "hidden_md"
            }, {
                key: "iscomment",
                title: "评论",
                sort: true,
                cls: "hidden_xs"
            }, {
                key: "countall",
                title: "投放",
                sort: true
            }, {
                key: "num_finish",
                title: "已完成",
                sort: true,
                cls: "hidden_xs"
            }, {
                key: "stime",
                title: "开始时间",
                sort: true
            }, {
                key: "adTemp",
                title: "来源",
                sort: false,
                filter: true,
                cls: "hidden_xs"
            }, {
                key: "taskprice",
                title: "单价",
                sort: false,
                filter: true,
                cls: "hidden_xs"
            }, {
                key: "objectId",
                title: "操作",
                width: 60,
                cls: "t_center",
                render: function(a, b) {
                    var status = +$('[name="status"]:checked').val();
                    var btn_query = '<button type="button" class="btn btn_info btn_query_detail" data-id="' + b + '">查看</button>';
                    status < 1 && (btn_query += '<button type="button" class="btn btn_warning btn_modify" data-id="' + b + '">修改</button>');
                    btn_query += '<button type="button" class="btn btn_primary btn_copy" data-id="' + b + '">续单</button>';
                    a.append($(btn_query));
                }
            }
        ]
    };
    var task_table = new Table(opt);

    $('body').on('click','table .btn_query_detail',function(){
        // 跳转详情页
        window.open('_HOST_/page/detail/task_detail.html?id='+$(this).data('id'));
    }).on('click','[name="status"]',function(){
        // 切换状态时 对应的切换（1.该状态下应该存在的按钮 2.发送给后台的状态参数,重置当前页为第一页 3.表格样式主题）并渲染表格
        var status = +$(this).val();
        $('.btn_delete').toggleClass('hidden',status > -1);
        $('.btn_agree,.btn_disagree').toggleClass('hidden',status !== -1);
        $('.btn_pause').toggleClass('hidden',status !== 1);
        $('.btn_stop').toggleClass('hidden',status !== 1 && status !==2);
        $('.btn_idfa').toggleClass('hidden',status < 1);
        task_table.sendData.status = status;
        task_table.sendData.cur_page = 1;
        // 表格主题与状态值对应关系
        var obj = {
            '-2': 'gray',
            '-1': 'warning',
            '1': 'info',
            '2': 'magenta',
            '8': 'danger',
            '9': 'success'
        }
        task_table.theme = obj[status];
        task_table.render();
    }).on("click", ".btn_add", function() {
        // 添加任务时 初始化弹窗标题及内容
        var id = $(this).data("data-id");
        oper_task.box.initHeader('添加任务');

        oper_task.box.initContent('_HOST_/page/task_add .add_task_form', function() {
            oper_task.box.show();
            oper_task.initDateBox();
        });
        var $tip_ct = $(this).closest("td");
        oper_task.box.afterfnSure = function(tip){
            $tip_ct.operTip(tip || "操作成功！",{theme: "warning"});
        }
    })
});
