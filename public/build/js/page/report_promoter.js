$(function(){function e(){$.ajax({url:"http://es2.laizhuan.com/back/promoter/query",type:"GET",dataType:"json"}).done(function(e){1===e.status?base.renderOption($("select.query_type"),e.data,["id","name"]):i.operTip(e.msg||"获取推广人员列表失败！",{theme:"danger",dir:"bottom",css:{"white-space":"nowrap"}})}).fail(function(e){i.operTip("获取推广人员列表失败！",{theme:"danger",dir:"bottom",css:{"white-space":"nowrap"}})})}function t(){var e={date_start:$(".date_start").val(),date_end:$(".date_end").val(),query_type:$(".query_type").val(),method:"readReport",report_type:2},t="全部特邀用户";if("some"===e.query_type&&$(".query_some").val())e.query_some=$(".query_some").val(),t="部分特邀用户("+$(".query_some option:selected").text()+")";else if("one"===e.query_type&&n)e.query_one=n,t="特邀用户("+e.query_one+")";else if("all"!==e.query_type)return!1;console.dir(e),$.ajax({url:u,data:e,dataType:"json"}).always(function(e){a(e,t)}),e.report_type=0,r(e)}function a(e,t){var a,r=e.list||e.data||[];return r.length?(a=$("#chart_type").prop("checked")?{title:{text:"好友数任务数关系图",subtext:t,x:"center"},tooltip:{trigger:"axis",formatter:function(e){return e[0].seriesName+" : "+e[0].value+" (个)<br/>"+e[1].seriesName+" : "+e[1].value+" (个)<br/>合计 : "+(e[0].value+e[1].value)+" (个)<br/>"}},legend:{data:["一级好友","二级好友","一级任务","二级任务"],x:"center",y:"45%"},dataZoom:[{show:!0,xAxisIndex:[0,1],backgroundColor:"rgba(0, 0, 0, .1)",showDataShadow:!1,fillerColor:"rgb(38, 52, 75)",bottom:"45%",handleSize:5},{type:"inside",xAxisIndex:[0,1]}],grid:[{top:50,left:50,right:50,height:"30%"},{left:50,right:50,bottom:50,height:"30%"}],xAxis:[{type:"category",boundaryGap:!1,axisLine:{onZero:!0},data:$.map(r,function(e){return e.day})},{gridIndex:1,type:"category",boundaryGap:!1,axisLine:{onZero:!0},data:$.map(r,function(e){return e.day})}],yAxis:[{name:"好友数(个)",type:"value"},{gridIndex:1,name:"任务数(个)",type:"value"}],series:[{name:"一级好友",type:"line",areaStyle:{normal:{}},symbolSize:5,hoverAnimation:!1,data:$.map(r,function(e){return e.friend_1}),stack:"总好友"},{name:"二级好友",type:"line",areaStyle:{normal:{}},symbolSize:5,hoverAnimation:!1,data:$.map(r,function(e){return e.friend_2}),stack:"总好友"},{name:"一级任务",type:"line",areaStyle:{normal:{}},xAxisIndex:1,yAxisIndex:1,symbolSize:5,hoverAnimation:!1,data:$.map(r,function(e){return e.task_1}),stack:"总任务"},{name:"二级任务",type:"line",areaStyle:{normal:{}},xAxisIndex:1,yAxisIndex:1,symbolSize:5,hoverAnimation:!1,data:$.map(r,function(e){return e.task_2}),stack:"总任务"}]}:{title:{text:"特邀用户支出费用",subtext:t,x:"center"},tooltip:{trigger:"axis",formatter:function(e){return e[0].seriesName+" : "+e[0].value+" (个)<br>"+e[1].seriesName+" : "+e[1].value+" (个)<br>"+e[2].seriesName+" : "+e[2].value+" (元)"}},grid:{bottom:100,left:50,right:50},legend:{data:["支出费用","邀请人数","完成任务数"],x:"left"},dataZoom:[{show:!0,backgroundColor:"rgba(0, 0, 0, .1)",showDataShadow:!1,fillerColor:"rgb(38, 52, 75)",handleSize:5}],xAxis:[{type:"category",boundaryGap:!1,axisLine:{onZero:!1},data:$.map(r,function(e){return e.createdAt})}],yAxis:[{name:"支出费用(元)",type:"value"}],series:[{name:"邀请人数",type:"line",hoverAnimation:!1,data:$.map(r,function(e){return e.inviated_num||0})},{name:"完成任务数",type:"line",hoverAnimation:!1,data:$.map(r,function(e){return e.done_task_num||0})},{name:"支出费用",type:"line",hoverAnimation:!1,data:$.map(r,function(e){return e.cal_fee||0})}]},void chart.renderChart($(".report_ct")[0],a)):void i.operTip("该条件下暂无数据！",{theme:"danger",dir:"bottom",css:{"white-space":"nowrap"}})}function r(e){var t={$ct:$(".table_ct"),col:[{key:"uid",title:"特邀用户ID",sort:!0,filter:!0},{key:"cal_fee",title:"理论金额",sort:!0,filter:!0},{key:"payed_fee",title:"支付金额",sort:!0,filter:!0},{key:"createdAt",title:"日期",sort:!0,filter:!0,cls:"hidden_xs"},{key:"done_task_num",title:"任务量",sort:!0,filter:!0},{key:"inviated_num",title:"推广量",sort:!0,filter:!0}],isLocal:!0,url:"http://es2.laizhuan.com/module/vip_report/interface.php",sendData:e};c?c.render():c=new Table(t)}var n,i=$(".filter_ct"),o=base.calDate("d",-30,new Date),l=$(".date_start").val(base.date("y-m-d",o)).datepicker({timepicker:!1,max:"today",datetime:o}),s=$(".date_end").val(base.now("y-m-d")).datepicker({timepicker:!1,min:o,max:"today"}),d=new Box({title:"选择特邀用户",html:'<div class="sel_guest_user"></div>',css:{},fnSure:function(e){var a=$('[name="sel_guest_user"]:checked').val();return a?(n=a,void t()):($(".table_filter").operTip("请选择一个特邀用户！",{theme:"danger"}),!1)},fnCancel:function(e){console.dir(e)}});6!==role?e():$('select.query_type option[value="some"]').remove();var c,u="http://es2.laizhuan.com/report/caltgTasks";$(".date_start").bind("change",function(){s.cgOpt({min:$(this).val()}),t()}),$(".date_end").bind("change",function(){l.cgOpt({max:$(this).val()}),t()}),$(".query_type,.query_some").bind("change",function(){t()}),$("#chart_type").bind("change",function(){var e=$("#chart_type").prop("checked");$(".btn_toggle_chart_table").toggleClass("hidden"),e?(u="http://es2.laizhuan.com/report/caltgTasks",$(".report_ct.hidden").removeClass("hidden"),$(".table_ct").addClass("hidden")):u="http://es2.laizhuan.com/module/vip_report/interface.php",t()}),$(".query_one").bind("click",function(){d.show();var e={$ct:$(".sel_guest_user"),col:[{key:"id",width:20,render:function(e,t){var a=$('<label class="radio"><input type="radio" value="'+t+'" name="sel_guest_user"><span class="opt_imitate"></span></label>');e.append(a)}},{key:"uid",title:"用户ID",sort:!0,filter:!0},{key:"type",title:"类别",sort:!1,filter:!0},{key:"name",title:"姓名",sort:!1,filter:!0},{key:"pay",title:"费用",sort:!1,filter:!0,cls:"hidden_xs"},{key:"alipay",title:"支付宝",sort:!1,filter:!0,cls:"hidden_xs"}],isLocal:!0,theme:"lightblue",url:"http://es2.laizhuan.com/back/guest_user/query"};6!==role&&e.col.unshift({key:"pname",title:"推广人员",sort:!0,filter:!0}),!$(".sel_guest_user .table").length&&new Table(e)}),$("body").on("click",".sel_guest_user tbody tr",function(){$(this).find('[type="radio"]').prop("checked",!0)}).on("click",".btn_toggle_chart_table",function(){$(".report_ct,.table_ct").toggleClass("hidden")}),base.getParam("id")?($(".query_type").val("one").trigger("change"),n=base.getParam("id"),$("#chart_type").prop("checked","money"!==base.getParam("type")),t()):t()});