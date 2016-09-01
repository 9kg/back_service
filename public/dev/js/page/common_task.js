$(function() {
    // 配置任务表格参数并初始化
    var opt = {
        $ct: $(".content"),
        pageSizes: [10,25,50,100,200],
        theme: 'warning',
        // isLocal: true,
        footerFix: true,
        url: "http://192.168.1.211:5211/back/task/query",
        sendData: {
            page_size: 25,
            filter_key: 'name',
            sort: 'id',
            sort_dir: 'desc',
            cur_page: 1,
            status: -1
        },
        col: [
            {
                key: "id",
                title: '<label class="checkbox"><input type="checkbox" name="sel_task_all"><span class="opt_imitate"></span></label>',
                width: 20,
                render: function(a, b) {
                    var btn_query = $('<label class="checkbox"><input type="checkbox" value="'+b+'" name="sel_task"><span class="opt_imitate"></span></label>');
                    a.append(btn_query);
                }
            }, {
                key: "id",
                title: "ID",
                filter: true,
                sort: true,
                cls: "hidden_xs"
            }, {
                key: "pname",
                title: "商务",
                sort: true,
                filter: true,
                cls: "hidden_md"
            }, {
                key: "company",
                title: "公司",
                sort: true,
                filter: true,
                cls: "hidden_md"
            }, {
                key: "name",
                title: "名称",
                sort: true,
                filter: true,
                render: function(a,b){
                    b && a.text(b.slice(0,15)+(b.length>15 ? '...' : ''));
                }
            }, {
                key: "keyword",
                title: "关键词",
                sort: true,
                filter: true,
                cls: "hidden_xs"
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
                sort: true,
                filter: true,
                cls: "hidden_xs",
                render: function(a,b,c,d){
                    a.html(b+'('+d.source_id+')');
                }
            }, {
                key: "taskprice",
                title: "单价",
                sort: true,
                filter: true,
                cls: "hidden_xs"
            }, {
                key: "id",
                title: "操作",
                width: 60,
                cls: "t_center",
                render: function(a, b, c, d) {
                    var status = +$('[name="status"]:checked').val();
                    var btn_query = '<button type="button" class="btn btn_info btn_query_detail">查看</button>';
                    btn_query += '<button type="button" class="btn btn_primary btn_copy">续单</button>';
                    if(status < 1){
                        btn_query += '<button type="button" class="btn btn_warning btn_modify">修改</button>';
                    }else{
                        btn_query += '<button type="button" class="btn btn_warning btn_idfa">标识</button>';
                    };
                    a.html($(btn_query));
                    a.data('row_data',d);
                }
            }
        ]
    };
    var task_table = new Table(opt);

    // idfa记录弹框
    var idfa_box = new Box({
        title:"idfa记录",
        html:'<div class="idfa_list"></div>',
        css:{
            "min-width": "320px"
        },
        footer: false
    });
    // idfa表格
    var idfa_table;
    $('body').on('click','table .btn_query_detail',function(){
        // 跳转详情页
        var id = $(this).closest('td').data('row_data').id;
        window.open('http://192.168.1.211:5211/back/page/task_detail/'+id);
    }).on('click','tbody tr',function(e){
        // 行点击 选中复选框
        if(!$(e.target).is('.btn,.opt_imitate,[type="checkbox"]')){
            $(this).find('[type="checkbox"]').trigger("click");
        }
    }).on('click','[name="status"]',function(){
        // 切换状态时 对应的切换（#该状态下应该存在的按钮 #发送给后台的状态参数,重置当前页为第一页 #表格样式主题）并渲染表格
        var status = +$(this).val();
        $('.btn_delete').toggleClass('hidden',status > -1);
        $('.btn_agree,.btn_disagree').toggleClass('hidden',status !== -1);
        $('.btn_pause').toggleClass('hidden',status !== 1);
        $('.btn_start').toggleClass('hidden',status !== 2);
        $('.btn_stop').toggleClass('hidden',status !== 1 && status !==2);
        $('.btn_export').toggleClass('hidden',status < 1);
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
    }).on('click','table .btn_modify',function(){
        // 任务修改
        var row_data = $(this).closest('td').data('row_data');

        oper_task.box.initHeader('修改任务');
        oper_task.box.operType = 'modify';
        oper_task.box.initContent('http://192.168.1.211:5211/back/page/task_add .add_task_form', function() {
            oper_task.box.show();
            oper_task.initWidget();
            $('form.add_task .show_by_edit').removeClass('hidden').find('input').prop('disabled',false);
            // $('form.add_task').prepend($('<input type="hidden" name="id" value="'+row_data.id+'"><input type="hidden" name="power" value="-1">'));
            window.oper_task.renderTaskForm(row_data);
        });
        var $tip_ct = $(this).parent();
        oper_task.box.afterfnSure = function(success,tip){
            if(success){
                $tip_ct.operTip(tip || "操作成功！",{theme: "warning", css:{"white-space": "nowrap"}});
                task_table.render();
            }else{
                $tip_ct.operTip(tip || "操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
            }
        }
    }).on("click", ".btn_add", function() {
        // 添加任务时 初始化弹窗标题及内容
        oper_task.box.initHeader('添加任务');
        oper_task.box.operType = 'insert';
        oper_task.box.initContent('http://192.168.1.211:5211/back/page/task_add .add_task_form', function() {
            oper_task.box.show();
            oper_task.initWidget();
        });
        var $tip_ct = $(this).parent();
        oper_task.box.afterfnSure = function(success,tip){
            if(success){
                $tip_ct.operTip(tip || "操作成功！",{theme: "warning", css:{"white-space": "nowrap"}});
                task_table.render();
            }else{
                $tip_ct.operTip(tip || "操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
            }
        }
    }).on("click", ".btn_copy", function() {
        //续单任务时 初始化弹窗标题及内容
        var row_data = $(this).closest('td').data('row_data');

        oper_task.box.initHeader('任务续单');
        oper_task.box.operType = 'insert';
        oper_task.box.initContent('http://192.168.1.211:5211/back/page/task_add .add_task_form', function() {
            oper_task.box.show();
            oper_task.initWidget();
            window.oper_task.renderTaskForm(row_data);
        });
        var $tip_ct = $(this).parent();
        oper_task.box.afterfnSure = function(success,tip){
            if(success){
                $tip_ct.operTip(tip || "操作成功！",{theme: "warning", css:{"white-space": "nowrap"}});
                task_table.render();
            }else{
                $tip_ct.operTip(tip || "操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
            }
        }
    }).on("click", ".btn_idfa", function() {
        var id = $(this).closest('td').data('row_data').id;
        idfa_box.show();
        var opt = {
            $ct: $(".idfa_list"),
            col: [{
                key: "task_end",
                title: "完成时间",
                sort: true,
                filter: true
            }, {
                key: "idfa",
                title: "IDFA",
                sort: true,
                filter: true
            }, {
                key: "ip",
                title: "IP",
                sort: true,
                filter: true,
                cls: "hidden_xs"
            }],
            // isLocal: true,
            theme: 'lightblue',
            sendData: {
                id: id
            },
            url: "http://192.168.1.211:5211/back/task/idfa_query"
        };
        if($(".idfa_list .table").length){
            idfa_table.sendData.id = id;
            idfa_table.render();
        }else{
            idfa_table = new Table(opt);
        };
    }).on("click", ".btn_agree", function() {
        batch_oper('同意',1);
    }).on("click", ".btn_export", function() {
        batch_oper('导出IDFA',function(ids){
            // 批量导出(此处token待改)
            window.open('http://es2.laizhuan.com/admin/idfaExcelMore?id='+ids+'&token=e43151e1643ec65786c1ea6097497a4e');
            $('[name="sel_task"]').prop('checked',false);
        });
    }).on("click", ".btn_disagree", function() {
        batch_oper('拒绝',-2);
    }).on("click", ".btn_pause", function() {
        batch_oper('暂停',2);
    }).on("click", ".btn_start", function() {
        batch_oper('开始',1);
    }).on("click", ".btn_stop", function() {
        batch_oper('终止',8);
    }).on("click", ".btn_delete", function() {
        batch_oper('删除');
    });

    // 批量操作 confirm
    var confirm_tip = new Tip({
        $ct: $(".btn_batch_ct"),
        confirm: true,
        isShow: false,
        theme: "warning",
        css: {
            'word-break': 'break-word'
        }
    });

    // 批量操作
    function batch_oper(operDesc, power){
        var $tip_ct = $('th:first-child');
        var ids = $('[name="sel_task"]:checked').map(function(){
            return $(this).val();
        }).get().join();
        if(!ids){
            $tip_ct.operTip('请勾选您要'+operDesc+'的任务！',{theme: "primary", dir: 'right'});
            return false;
        }else{
            var sendData;
            var oper;
            confirm_tip.content = $.type(power) === 'function' ? '您确认要导出id为('+ids+')的任务的IDFA？' : '您确认要'+operDesc+'id为('+ids+')的任务？';
            confirm_tip.alertfn = function(flag){
                if(flag){
                    if($.type(power) === 'number'){
                        oper = 'modify';
                        sendData = {
                            id: ids,
                            power: power
                        }
                    }else if($.type(power) === 'function'){
                        power(ids);
                        return true;
                    }else if($.type(power) === 'undefined'){
                        oper = 'remove';
                        sendData = {
                            id: ids
                        }
                    }

                    $.ajax({
                        url: "http://192.168.1.211:5211/back/task/"+oper,
                        type: "POST",
                        dataType: "json",
                        data: sendData
                    }).done(function(data){
                        var $tip_ct = $(".table_filter");
                        if(data.status == 1){
                            $tip_ct.operTip((data && data.msg) || "操作成功！",{theme: "success", css:{"white-space": "nowrap"}});
                            task_table.render();
                        }else{
                            $tip_ct.operTip((data && data.msg) || "操作失败！",{theme: "danger", css:{"white-space": "nowrap"}});
                        }
                    }).fail(function(e){
                        console.dir(e);
                    });
                }
            };
            confirm_tip.init();
            confirm_tip.show();
        }
    }
});
