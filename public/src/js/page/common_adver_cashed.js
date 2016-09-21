$(function() {
    // 日期控件初始化及赋值
    var start_date = base.calDate('d',-30,new Date);
    var date_start = $(".date_start").val(base.date("y-m-d",start_date)).datepicker({timepicker:false,max: "today",min: "2016-07-20",datetime: start_date});
    var date_end = $(".date_end").val(base.now("y-m-d")).datepicker({timepicker:false,min: start_date,max: "today"});

    var all_data,$tip_ct;
    var box = new Box({
        title: "申请打款",
        html: "_HOST_/page/adver_cashed_add .adver_cashed_form",
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
                    url: "_HOST_/finance/adver_cash_request",
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
            key: "company",
            title: "广告主",
            sort: true,
            filter: true
        }, {
            key: "fee",
            title: "金额",
            sort: true,
            filter: true
        }, {
            key: "dealing_money",
            title: "预扣",
            sort: true,
            filter: true
        }],
        isLocal: true,
        url: "_HOST_/finance/adver_cashed",
        sendData: {
            sdate: $('.date_start').val(),
            edate: $('.date_end').val()
        }, fnAfterData: function(data){
            all_data = data && data.data;
        }, fnAfterRender: function(){
            $(".filter_type").eq(1).trigger('click');
        }
    };
    if(role === 5 || role === 7){
        opt.col.push({
            key: "source_id",
            title: "操作",
            width: 60,
            cls: "t_center",
            render: function(a, b, c, d) {
                var btn_query = $('<button type="button" class="btn btn_info btn_request" data-id="' + b + '">申请</button>');
                if(d.type == 0){
                    btn_query = $('<span class="btn">预付</span>');
                }
                a.append(btn_query);
            }
        });
    }
    
    var adver_cashed_table = new Table(opt);
    window.renderTable = function(){
        adver_cashed_table.data = null;     //将本地数据清空，table控件在render时才会重新发起请求拿数据
                                            //此处更好的做法应该是后台返回我成功添加的这条数据 我塞进本地数据。留作后期优化吧
        adver_cashed_table.render();
    };

    $('body').on('click','table .btn_request',function(){
        $tip_ct = $(this).parent();
        var id = $(this).data("id");
        box.initContent('_HOST_/page/adver_cashed_add .adver_cashed_form', function() {
            $('form.adver_cashed').prepend($('<input type="hidden" name="ad_id" value="'+id+'"/>'));
            box.show();
        });
    }).on("change", ".date_start", function(){
        date_end.cgOpt({min: $(this).val()});
        adver_cashed_table.sendData.sdate = $('.date_start').val();
        renderTable();
    }).on("change", ".date_end", function(){
        date_start.cgOpt({max: $(this).val()});
        adver_cashed_table.sendData.edate = $('.date_end').val();
        renderTable();
    }).on("click", ".filter_type", function(){
        if(!all_data){
            return false;
        }
        var type = $('.filter_type:checked').val();
        if(type == 0){
            adver_cashed_table.col[adver_cashed_table.col.length-1].show = false;
        }else{
            adver_cashed_table.col[adver_cashed_table.col.length-1].show = true;
        }
        adver_cashed_table.data = $.map(all_data,function(item){
            if(item.type == type){
                return item;
            }
        });
        adver_cashed_table.render();
    });
});
