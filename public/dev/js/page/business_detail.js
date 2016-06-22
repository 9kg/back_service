$(function(){
    var id = base.getParam('id');
    $.ajax({
        url: "http://192.168.1.114:9211/js/json/detail.json",
        data:{
            id: id
        },
        type: "GET",
        dataType: "JSON"
    }).always(function(data){
        $.each(data,function(key,val){
            if(!$.isPlainObject(val)){
                $('.guest_'+key).text(val);
            }else{
                var text = '';
                val.input_by_date && (text += '每' + ({day:'日', week:'周', month:'月'})[val.charge_by_date] + val.input_by_date + '元<br>');
                val.input_by_one && (text += '每个' + val.input_by_one + '元<br>');
                val.input_by_other && (text += val.input_by_other);
                $('.guest_money').html(text);
            }
        });
    });
    
    $("body").on('click', '.query_num', function() {
        window.open('http://192.168.1.114:9211/html/report/guest_user.html?id='+id);
    }).on("click", ".btn_edit", function() {
        var id = $(this).data("data-id");
        
    });
});