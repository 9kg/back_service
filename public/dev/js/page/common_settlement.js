$(function() {
    var type_obj = {
        day: "日",
        week: "周",
        month: "月"
    };
    var opt = {
        $ct: $(".content"),
        theme: 'success',
        footerFix: true,
        sendData: {
            cur_page: 1,
            pay_cyc: 1
        },
        col: [{
            key: "uid",
            title: "用户ID",
            cls: "hidden_xs",
            sort: true,
            filter: true
        }, {
            key: "name",
            title: "名称",
            sort: true,
            filter: true
        }, {
            key: "alipay",
            title: "支付宝",
            cls: "hidden_xs",
            filter: true
        }, {
            key: "fee_date",
            title: "费用描述",
            cls: "hidden_xs",
            render: function(a,b,c,d){
                var desc = "";
                var type_num = b.split('_');
                if(type_num.length === 2){
                    if(+type_num[1]){
                        desc = "每" + type_obj[type_num[0]] + '<span class="accent_danger big">' + type_num[1] + '</span>元';
                    }
                    if(d.fee_per && (+d.fee_per)){
                        desc && (desc += "<br>");
                        desc += '每个<span class="accent_danger big">' + d.fee_per + "</span>元";
                    }
                    if(d.fee_other){
                        desc && (desc += "<br>");
                        desc += d.fee_other;
                    }
                }else{
                    desc = "数据失常";
                }
                a.append(desc);
            }
        }, {
            key: "payed_fee",
            title: "已付",
            sort: true,
            render: function(a,b,c,d){
                if(d.pay_time){
                    a.addClass("cal_fee");
                }else{
                    b = '<span class="accent_danger big">'+b+'</span>';
                }
                a.append(b);
            }
        }, {
            key: "cal_fee",
            title: "应付",
            sort: true,
            render: function(a,b,c,d){
                if(!d.pay_time){
                    a.addClass("cal_fee");
                }
                a.append(b);
            }
        }, {
            key: "inviated_num",
            title: "邀请人数",
            cls: "hidden_xs",
            sort: true
        }, {
            key: "id",
            title: "操作",
            width: 60,
            cls: "t_center",
            render: function(a, b, c, d) {
                var oper_desc,cls;
                if(d.pay_time){
                    oper_desc = "修改";
                    cls = "btn_warning";
                }else{
                    oper_desc = "支付";
                    cls = "btn_info";
                }
                var btn_query = $('<button type="button" class="btn '+cls+' btn_payment">'+oper_desc+'</button>');
                btn_query.data('row_obj',d);
                a.append(btn_query);
            }
        }],
        isLocal: true,
        url: "http://192.168.1.211:5211/back/finance/settlement_query"
    };
    var settlement_table = new Table(opt);

    window.renderTable = function(time){
        setTimeout(function(){
            settlement_table.data = null;
            settlement_table.render();
        },time || 0);
    };
    // settlement_confirm
    $('body').on('click','[name="pay_cyc"]',function(){
        // 切换状态时 对应的切换（#该状态下应该存在的按钮 #发送给后台的状态参数,重置当前页为第一页 #表格样式主题）并渲染表格
        var pay_cyc = +$(this).val();
        settlement_table.sendData.pay_cyc = pay_cyc;
        settlement_table.sendData.cur_page = 1;
        // 表格主题与状态值对应关系
        var obj = {
            '1': 'success',
            '2': 'primary',
            '3': 'magenta'
        }
        settlement_table.theme = obj[pay_cyc];
        renderTable();
    }).on('click','.btn_payment',function(){
        $(".btn_cacel").trigger("click");
        var row_obj = $(this).data("row_obj");
        var cal_fee_td = $(this).closest("tr").find(".cal_fee");
        var cal_fee = row_obj.pay_time ? row_obj.payed_fee : row_obj.cal_fee;
        cal_fee_td.html('<input type="text" data-validate="require,num,+" value="'+cal_fee+'">');
        $(this).removeClass('btn_info btn_payment').addClass('btn_success btn_sure').text("确认")
        .after($('<button type="button" class="btn btn_danger btn_cacel">取消</button>'));
    }).on('click','.btn_sure',function(){
        var $td = $(this).closest("td");
        var row_obj = $(this).data("row_obj");
        var cal_feeEle = $(this).closest("tr").find(".cal_fee input");
        if(!base.formValidate(cal_feeEle.parent())){
            return false
        }
        var thisMask = new Mask({$ct: $td,content:"提交中！"});
        var data_obj = {
            uid: row_obj.uid,
            pid: row_obj.pid,
            payed_fee: +cal_feeEle.val(),
            cal_fee: row_obj.cal_fee,
            fee_log_json: '{'
                +'fee_date: '+row_obj.fee_date+','
                +'fee_per: '+row_obj.fee_per+','
                +'fee_other: '+row_obj.fee_other+','
                +'fee_add_type: '+row_obj.fee_add_type
            +'}'
        };
        if(row_obj.pay_time){
            data_obj.bid = row_obj.bid;
        }
        $.ajax({
            url: 'http://192.168.1.211:5211/back/finance/settlement_confirm',
            dataType: 'json',
            data: data_obj
        }).done(function(data){
            if(data.status === 1){
                $td.operTip(data.msg || "成功", {dir:'left', css: {'white-space': 'nowrap'}, theme: 'success'});
            }else{
                $td.operTip(data.msg || "失败", {dir:'left', css: {'white-space': 'nowrap'}, theme: 'danger'});
            }
            renderTable(1000);
        }).fail(function(){
            $td.operTip("失败", {dir:'left', css: {'white-space': 'nowrap'}, theme: 'danger'});
        }).always(function(){
            thisMask.hide();
        });
    }).on('click','.btn_cacel',function(){
        var row_obj = $(this).prev().data("row_obj");
        var oper_desc,fee_num;
        if(row_obj.pay_time){
            oper_desc = "修改";
            fee_num = row_obj.payed_fee;
            cls = "btn_warning";
        }else{
            oper_desc = "支付";
            fee_num = row_obj.cal_fee;
            cls = "btn_info";
        }
        $(this).closest("tr").find(".cal_fee").html(fee_num);
        $(this).prev().removeClass('btn_success btn_sure').addClass('btn_payment '+cls).text(oper_desc)
        .next().remove();
    });
});
