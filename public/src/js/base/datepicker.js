function Datepicker(opt){
    this.weeks = ['日','一','二','三','四','五','六'];
    this.datetime = new Date;
    this.format = 'y-m-d h:i';
    this.$link = null;
    this.$ct = null;
    this.$toInput = null;
    this.$el = null;
    this.isShow = false;
    this.css = {};
    this.dir = "bottom";
    this.timepicker = true;
    $.extend(true, this, opt);

    this.init();
}
Datepicker.prototype = (function(){
    var init = function(){
        !this.timepicker && this.format === 'y-m-d h:i' && (this.format = 'y-m-d');
        !this.$link && (this.$link = this.$toInput);
        this.$ct.css("position") === "static" && this.$ct.css("position","relative");

        this.$el = $('<div class="datepicker hidden date_'+this.dir+'">');
        this.resize();
        this.isShow && this.show();
        this.render();
        this.addEvent();

        this.$ct.append(this.$el);
    },render = function(){
        this.$el.html(this.renderHead());
        this.$el.append(this.renderBody());
        this.$el.append(this.renderFoot());
        this.$el.css(this.css);
    },renderHead = function(){
        var y = base.date('y',this.datetime);
        var m = base.date('m',this.datetime);
        var head = $('<div class="date_head">');
        head.append('<i class="iconfont icon-7cd icon_left_year"></i>'
            +'<i class="iconfont icon-824 icon_left_month"></i>'
            +'<span class="date_year">'+y+'</span>年'
            +'<span class="date_year">'+m+'</span>月'
            +'<i class="iconfont icon-823 icon_right_month"></i>'
            +'<i class="iconfont icon-7cc icon_right_year"></i>');
        return head;
    },renderBody = function(){
        var body = $('<div class="date_body">');
        var days_cur = +base.date('t',this.datetime);
        var days_prev = +base.date('t',base.calDate("m",-1,this.datetime).getTime());

        var hour = base.date('h', this.datetime);
        var minute = base.numToInt(+base.date('i', this.datetime)/5)*5;
        minute = base.toPad(minute, 0, 2, true);
        this.datetime.setMinutes(minute);

        body.append([_renderWeek(this.weeks),_renderDay(days_cur,days_prev,this)]);
        this.timepicker && body.append(_renderTime(hour,minute));
        return body;
    },_renderWeek = function(weeks){
        var week = $('<ul class="date_week">');
        var items = $.map(weeks, function(n){
                        return $('<li>'+n+'</li>');
                    });
        week.append(items);
        return week;
    },_renderDay = function(days_cur,days_prev,that){
        var date = that.datetime;
        var day = $('<ul class="date_day">');
        var today = +base.date('j',date);
        var week_firstDay = (new Date(date.getFullYear(), date.getMonth(), 1)).getDay();
        var week_lastDay = (new Date(date.getFullYear(), date.getMonth(), days_cur)).getDay();
        var items_cur = [],items_prev = [],items_next = [];
        while(week_firstDay > 0){
            items_prev.unshift($('<li class="day_disable">'+(days_prev--)+'</li>'));
            week_firstDay--;
        }
        for(var i = 0; week_lastDay < 6; week_lastDay++ ){
            items_next.push($('<li class="day_disable">'+(++i)+'</li>'));
        }
        while(days_cur > 0){
            var $item = $('<li'+(today === days_cur ? ' class="active"' : '')+'>'+(days_cur--)+'</li>');
            _validate($item,that);
            items_cur.unshift($item);
        }
        day.append(items_prev,items_cur,items_next,$('<li class="day_shadow">'));
        return day;
    },_renderTime = function(hour,minute){
        var time = $('<div class="date_time">');
        var hour_sel = $('<select>');
        var minute_sel = $('<select>');
        base.renderOption(hour_sel,['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']);
        base.renderOption(minute_sel,['00','05','10','15','20','25','30','35','40','45','50','55']);
        var hour_ct = $('<div class="date_hour">').append(hour_sel).append($('<div class="date_time_desc">时</div>'));
        var minute_ct = $('<div class="date_minute">').append(minute_sel).append($('<div class="date_time_desc">分</div>'));
        time.append(hour_ct,minute_ct);

        hour_sel.find('option[value="'+hour+'"]').prop('selected',true);
        minute_sel.find('option[value="'+minute+'"]').prop('selected',true);
        return time;
    },renderFoot = function(){
        var foot = $('<div class="date_foot">');
        foot.append('<button type="button" class="btn_date_cancel">取消</button>'
            +'<button type="button" class="btn_date_now">当前时间</button>'
            +'<button type="button" class="btn_date_sure">确认</button>');
        return foot;
    },_validate = function($item,that){
        if(that.max){
            var thisTime = new Date(base.date("y",that.datetime),base.date("n",that.datetime)-1,$item.text()).getTime();
            var maxTime = that.max === "today" ? new Date().getTime() : new Date(that.max).getTime();
            if(thisTime > maxTime){
                $item.addClass("day_disable");
            }
        }
        if(that.min){
            var thisTime = new Date(that.datetime).setDate($item.text());
            var minTime = that.min === "today" ? new Date(base.date("y"),base.date("n")-1,base.date("j")).getTime() : new Date(that.min).getTime();
            if(thisTime < minTime){
                $item.addClass("day_disable");
            }
        }
    },correctPos = function(){
        this.$el.toggleClass("date_right_align", ($(window).width() - this.$ct.offset().left) < 200);
    },resize = function(){
        var that = this;
        var resizeTimeout = 0;
        this.correctPos();
        $(window).resize(function() {
            resizeTimeout && clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function(){
                                that.correctPos();
                            },100);
        });
    },cgOpt = function(opt){
        var that = this;
        $.each(opt,function(key,val){
            that[key] = val;
        });
        this.render();
    },cgDatetime = function(newDatetime){
        var newTime = newDatetime.getTime();
        if(this.max){
            var maxTime = this.max === "today" ? new Date().getTime() : new Date(this.max).getTime();
            newTime = Math.min(maxTime,newTime);
        }
        if(this.min){
            var minTime = this.min === "today" ? new Date().getTime() : new Date(this.min).getTime();
            newTime = Math.max(minTime,newTime);
        }
        newDatetime = new Date(newTime);
        this.datetime = newDatetime;
        return this;
    },addEvent = function(){
        var that = this;
        this.$el.on("click", ".icon_left_year,.icon_right_year,.icon_left_month,.icon_right_month", function(e) {
            var $target = $(e.target);
            var date = that.datetime;
            if($target.is('.icon_left_year')){
                that.cgDatetime(base.calDate('y',-1,date));
            }else if($target.is('.icon_right_year')){
                that.cgDatetime(base.calDate('y',1,date));
            }else if($target.is('.icon_left_month')){
                that.cgDatetime(base.calDate('m',-1,date));
            }else if($target.is('.icon_right_month')){
                that.cgDatetime(base.calDate('m',1,date));
            }

            that.render();
        }).on("click", '.date_day li:not(".day_disable")', function(e) {
            $(this).addClass("active").siblings(".active").removeClass("active");
            that.datetime.setDate($(this).text());
            !that.timepicker && that.$el.find('.btn_date_sure').trigger("click");
            e.preventDefault();//以防$ct 和 $toInput同时被label嵌套时。
        }).on("change", ".date_hour select", function() {
            that.datetime.setHours($(this).val());
        }).on("change", ".date_minute select", function() {
            that.datetime.setMinutes($(this).val());
        }).on("click", ".btn_date_now", function() {
            that.datetime = new Date;
            that.render();
        }).on("click", ".btn_date_sure", function() {
            that.$toInput.val(base.date(that.format,that.datetime));
            that.$toInput.trigger("change");
            that.hide();
        }).on("click", ".btn_date_cancel", function() {
            that.hide();
        });

        this.$link.bind('click',function(e){
            that.toggle();
        });
    },toggle = function(){
        this.$el.is(".hidden") ? this.show() : this.hide();
    },show = function(){
        $(".datepicker").addClass("hidden");
        this.$el.removeClass("hidden");
    },hide = function(){
        this.$el.addClass("hidden");
    };
    return {
        init: init,
        render: render,
        cgOpt: cgOpt,
        renderHead: renderHead,
        renderBody: renderBody,
        renderFoot: renderFoot,
        cgDatetime: cgDatetime,
        correctPos: correctPos,
        resize: resize,
        show: show,
        hide: hide, 
        toggle: toggle,
        addEvent: addEvent
    }
})();