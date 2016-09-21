$(function() {
    // 日期控件初始化及赋值
    var start_date = base.calDate('d',-30,new Date);
    var date_start = $(".date_start").val(base.date("y-m-d",start_date)).datepicker({timepicker:false,max: "today",min: "2016-07-20",datetime: start_date});
    var date_end = $(".date_end").val(base.now("y-m-d")).datepicker({timepicker:false,min: start_date,max: "today"});

    var all_data,$tip_ct;
    var box = new Box({
        title: "申请打款",
        html: "http://192.168.1.211:5211/back/page/adver_cashed_add .adver_cashed_form",
        css: {
            "min-width": "320px",
            "max-width": "420px",
        },
        fnSure: function(that,fn) {
            var $dockForm = $('form.adver_cashed');
            if (!base.formValidate($dockForm)) {
                return false;
            } else {
                var data = $dockForm.serializeArray();
                $.ajax({
                    url: "http://192.168.1.211:5211/back/finance/adver_cash_update",
                    dataType: "json",
                    data: data
                }).done(function(data){
                    if(data.status == 1){
                        $tip_ct.operTip(data.msg || "操作成功!",{theme: "success",dir:'left',css:{'white-space':'nowrap'}});
                        setTimeout(function(){
                            renderTable();
                        }, 1000);
                    }else{
                        $tip_ct.operTip(data.msg || "操作失败!",{theme: "danger",dir:'left',css:{'white-space':'nowrap'}});
                    }
                }).fail(function(e){
                    $tip_ct.operTip("操作失败!",{theme: "danger",dir:'left',css:{'white-space':'nowrap'}});
                });
            }
        },
        fnCancel: function(t) {}
    });

    var opt = {
        $ct: $(".content"),
        col: [{
            key: "name",
            title: "广告主",
            cls: "hidden_xs",
            sort: true,
            filter: true
        }, {
            key: "time",
            title: "时间",
            cls: "hidden_xs",
            sort: true,
            filter: true
        }, {
            key: "fee",
            title: "收入/支出",
            sort: true,
            filter: true
        }, {
            key: "dsrp",
            title: "明细",
            sort: true,
            filter: true
        }, {
            key: "oper_role",
            title: "操作人",
            sort: true,
            cls: "hidden_xs"
        }, {
            key: "status",
            title: "状态",
            sort: true,
            cls: "hidden_xs",
            render: function(a,b){
                a.html(['<span class="label_danger">已拒绝</span>','<span class="label_warning">待审核</span>','<span class="label_success">已同意</span>'][+b+1]);
            }
        }, {
            key: "id",
            title: "操作",
            width: 60,
            cls: "t_center",
            render: function(a, b, c, d) {
                var btn_query = '';
                if(role === 2){
                    btn_query = '<button type="button" class="btn" data-id="' + b + '">确认</button>'
                            +'<button type="button" class="btn" data-id="' + b + '">拒绝</button>';
                    if(d.status == 0){
                        btn_query = '<button type="button" class="btn btn_success btn_confirm" data-id="' + b + '">确认</button>'
                                +'<button type="button" class="btn btn_danger btn_refuse" data-id="' + b + '">拒绝</button>';
                    }
                }else{
                    btn_query = '<button type="button" class="btn" data-id="' + b + '">修改</button>';
                    if(d.status == 0 && d.oper_role == user_id){
                        btn_query = '<button type="button" class="btn btn_warning btn_modify" data-id="' + b + '">修改</button>';
                    }
                }
                a.append($(btn_query)).data('cur_data',d);
            }
        }],
        isLocal: true,
        url: "http://192.168.1.211:5211/back/finance/adver_cash",
        sendData: {
            sdate: $('.date_start').val(),
            edate: $('.date_end').val()
        }, fnAfterData: function(data){
            all_data = data && data.data;
        }, fnAfterRender: function(){
            $(".filter_status").eq(1).trigger('click');
        }
    };
    window.renderTable = function(){
        adver_cash_table.data = null;       //将本地数据清空，table控件在render时才会重新发起请求拿数据
                                            //此处更好的做法应该是后台返回我成功添加的这条数据 我塞进本地数据。留作后期优化吧
        adver_cash_table.render();
    };

    var adver_cash_table = new Table(opt);

    $('body').on('click','table .btn_confirm, table .btn_refuse',function(){
        var $tip_ct = $(this).parent();
        var id = $(this).data("id");
        var status = $(this).is(".btn_confirm") ? 1 : -1;
        $.ajax({
            url: "http://192.168.1.211:5211/back/finance/adver_cash_confirm",
            dataType: "json",
            data: {
                id: id,
                status: status
            }
        }).done(function(data){
            if(data.status == 1){
                $tip_ct.operTip(data.msg || "操作成功!",{theme: "success",dir:'left',css:{'white-space':'nowrap'}});
                setTimeout(renderTable,1000);
            }else{
                $tip_ct.operTip(data.msg || "操作失败!",{theme: "danger",dir:'left',css:{'white-space':'nowrap'}});
            }
        }).fail(function(e){
            $tip_ct.operTip("操作失败!",{theme: "danger",dir:'left',css:{'white-space':'nowrap'}});
        });
    }).on('click','table .btn_modify',function(){
        $tip_ct = $(this).parent();
        var id = $(this).data("id");
        var cur_data = $(this).parent().data('cur_data');
        console.dir(cur_data);
        box.initContent('http://192.168.1.211:5211/back/page/adver_cashed_add .adver_cashed_form', function() {
            var $form = $('form.adver_cashed');
            $form.prepend($('<input type="hidden" name="id" value="'+id+'"/>'));
            $form.find('[name="price_all"]').val(cur_data.fee);
            $form.find('[name="descripe"]').val(cur_data.dsrp);
            box.show();
        });
    }).on("change", ".date_start", function(){
        date_end.cgOpt({min: $(this).val()});
        adver_cash_table.sendData.sdate = $('.date_start').val();
        renderTable();
    }).on("change", ".date_end", function(){
        date_start.cgOpt({max: $(this).val()});
        adver_cash_table.sendData.edate = $('.date_end').val();
        renderTable();
    }).on("click", ".filter_status", function(){
        if(!all_data){
            return false;
        }
        var status = $('.filter_status:checked').val();
        if(status != 0){
            adver_cash_table.col[adver_cash_table.col.length-1].show = false;
        }else{
            adver_cash_table.col[adver_cash_table.col.length-1].show = true;
        }
        adver_cash_table.data = $.map(all_data,function(item){
            if(item.status == status){
                return item;
            }
        });
        adver_cash_table.render();
    });
});
