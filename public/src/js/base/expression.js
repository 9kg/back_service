function Expression(opt){
    this.datas = [{
        name: "common",
        desc: "常用",
        chars: []
        // chars: ['🀄','🀀','🀁','🀂','🀃','🀅','🀆','🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏','🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘','🀙','🀚','🀛','🀜','🀝','🀞','🀟','🀠','🀡','🀢','🀣','🀤','🀥','🀦','🀧','🀨','🀩']
    }, {
        name: "person",
        desc: "人物",
        chars: ['😄','😊','😃','😉','😍','😘','😚','😳','😁','😋','😜','😝','😒','😏','😓','😶','😔','😌','💭','💬','😞','😖','😥','😰','😨','😫','😢','😭','😂','😲','😱','😠','😡','😪','😷','😇','👿','😈','👽','👤','👥','👹','👺','🙈','🙉','🙊','💧','💛','💙','💜','💚','💗','💔','💓','💘','✨','🌟','💢','💤','💨','💦','🔥','💩','🚶','🏃','👫','💃','👯','💏','💑','💀','👣','💋','👄','👀','👅','👬','👭','👪','👞','👟','👡','👠','👢','👕','👔','👗','👖','👘','👙','🎀','🌂','🎩','👑','👒','💼','👜','👓','👛','💄','💌','💍','💎','👍','👎','👌','👊','✊','👋','✋','👐','👆','👇','👈','👉','🙏','👏','💪','🙌','💅','👂','👃','🙅','🙆','💁','💆','💇','🙋','🙎','🙍','🙇','👦','👧','👱','👶','👵','👴','👼','👲','👳','👷','👮','👸','👰','💂','🎅']
    }, {
        name: "nature",
        desc: "大自然",
        chars: ['🌞','💧','🔥','🌛','🌙','🌝','🌘','🌑','🌚','🌕','🌀','🐾','🐱','🐈','🐶','🐕','🐩','🐭','🐁','🐀','🐹','🐰','🐺','🐸','🐯','🐅','🐨','🐻','🐷','🐽','🐖','🐗','🐮','🐂','🐃','🐄','🐒','🐵','🙈','🙉','🙊','🐴','🐎','🐫','🐪','🐑','🐐','🐘','🐍','🐦','🐤','🐥','🐣','🐔','🐓','🐧','🐝','🐛','🐜','🐞','🐙','🐌','🐊','🐢','🐲','🐉','🐠','🐟','🐳','🐋','🐬','🌲','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌴','🌵','🌾','🐚','🌰','🍄','🌐','🌎','🌍','🌏','🌋','🌊','🌌','🌠','⭐']
    }, {
        name: "material",
        desc: "物体",
        chars: ['🎎','🔮','🎑','🎁','📦','🎒','🎓','🎏','🎆','🎇','🎐','🎃','👻','🎅','🎄','🔦','🔌','🔋','🔔','🎉','🎈','💿','📀','💽','💾','🎮','🃏','📷','📹','🎥','💻','📺','📱','📠','📞','📼','🔊','🔇','📢','📣','📻','📡','⏰','⌚','⏳','⌛','🔍','🔓','🔒','🔑','🔨','🔧','🔩','🚪','💡','📲','💵','💶','💴','💳','📥','📤','📩','📧','📪','📫','📬','📭','📮','📈','📉','📜','📋','📃','📄','📁','📂','📅','📆','📌','📎','📏','📐','📕','📗','📘','📙','📓','📔','📒','🛀','🛁','🚿','🚽','💰','🔱','🚬','💣','🔫','🔪','💊','💉','🏈','🏀','⚽','🎾','⛳','🎱','🏊','🏄','🎣','🎿','🏁','🏇','🏉','🎽','🏂','🏆','👾','🀄','📝','📖','📚','🔖','🎲','🔬','🔭','📰','🎨','📯','🎷','🎸','🎵','🎶','🎼','🎧','🎤','🎹','🎺','🎻','🍵','🍺','🍻','🍸','🍷','🍶','🍼','🍴','🍔','🍟','🍗','🍖','🍝','🍛','🍱','🍣','🍙','🍘','🍚','🍜','🍲','🍞','🍳','🍢','🍡','🍦','🍧','🎂','🍰','🍭','🍪','🍫','🍬','🍩','🍮','🍨','🍯','🍤','🍕','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍐','🍈','🍌','🍍','🍅','🍆','🍠','🌽','👞','👟','👡','👠','👢','👕','👔','👗','👖','👘','👙','🎀','🌂','🎩','👑','👒','💼','👜','👓','👛','💄','💌','💍','💎','💛','💙','💜','💚','💗','💔','💓','💘']
    }, {
        name: "place",
        desc: "地点",
        chars: ['🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🏭','🏰','🏯','🌇','🌆','⛺','🗻','🌄','🌅','🌈','🌉','🗽','🎡','🎠','⛲','🎢','🚢','⛵','🚤','🚣','🚀','💺','🚂','🚊','🚉','🚄','🚅','🚠','🚇','🚈','🚃','🚎','🚌','🚍','🚚','🚗','🚘','🚙','🚕','🚖','🚨','🚓','🚔','🚒','🚑','🚐','🚲','🚡','🚜','🚏','🚥','🚦','🚧','⛽','🏮','💈','🎫','🎰','🎪','🎭','🚩']
    }, {
        name: "symbol",
        desc: "符号",
        chars: ['🔢','🔼','🔽','⏩','⏪','🆗','🆖','🔀','🔁','🔂','🆙','🆒','🆓','📶','🈯','🈳','🈴','🈲','🈹','🈺','🈶','🈚','🚾','🚻','🚹','🚺','🚼','🚰','🚭','🈸','🛃','🆘','🆔','🚫','🔞','📵','⛔','✅','❌','❕','❗','❔','❓','🆚','📳','📴','🅰','🅱','🆎','🅾','⛎','🔯','🏧','💱','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛','➕','➖','➗','💯','©','™','®']
    }];
    var commonChars = localStorage.getItem('expression');
    commonChars && (this.datas[0].chars = commonChars.split(','));

    this.commonLimit = 100;
    this.checkIndx = 0;
    this.isLock = false;
    this.$link = null;
    this.$ct = null;
    this.$toInput = null;
    this.$el = null;
    this.isShow = false;
    this.css = {};
    this.triangleCss = {};
    this.dir = "bottom";
    $.extend(true, this, opt);

    this.init();
}
Expression.prototype = (function(){
    var init = function(){
        !this.$link && (this.$link = this.$ct);
        this.$ct.css("position") === "static" && this.$ct.css("position","relative");

        this.$el = $('<div class="expression_box hidden expression_'+this.dir+'">');
        this.isShow && this.show();
        this.render();
        this.addEvent();
    },render = function(){
        var that = this;
        var mainView = $('<div class="expression_view">');
        var mainCt = $('<div class="expression_ct">').appendTo(mainView);
        var menuCt = $('<ul class="grid expression_footer">');
        $.each(this.datas,function(i,item){
            var mainItem = $('<ul class="expressions">');
            var menuItem = $('<li class="ex_option option_'+item.name+'">'+item.desc+'</li>');

            i === that.checkIndx && mainItem.add(menuItem).addClass("active");

            var charItems = item.chars.length ? $('<li>'+item.chars.join('</li><li>')+'</li>').appendTo(mainItem) : '';

            mainCt.append(mainItem);
            menuCt.append(menuItem);
        });
        menuCt.append($('<li class="bg_active">'))

        this.$el.html(mainView);
        this.$el.append(menuCt);
        this.$el.append($('<i class="iconfont icon-847 expressions_fixed'+(this.isLock ? " active" : "")+'">'));

        this.$el.append($('<span class="triangle">').css(this.triangleCss));

        this.$el.css(this.css);
        this.$ct.append(this.$el);
    },addEvent = function(){
        var that = this;
        this.$el.on("click", ".ex_option", function() {
            var indx = $(this).index();
            that.checkIndx = indx;
            indx === 0 && that.render();
            $(this).addClass("active").siblings(".active").removeClass("active");
            $(".expression_ct",that.$ct).attr("data-expression", "" + indx);
        }).on("click", ".expressions li", function() {
            var item = $.trim($(this).text());
            var commonChars = localStorage.getItem('expression');
            if(!commonChars){
                commonChars = item;
            }else{
                !~commonChars.indexOf(item) && (commonChars = item+','+commonChars);  
            };
            var commonCharArr = commonChars.split(",").slice(0,that.commonLimit);
            that.datas[0].chars = commonCharArr;
            localStorage.setItem('expression',commonCharArr.join(","));

            base.insertVal(that.$toInput[0],item);
            that.hideByLocking();
        }).on("click", ".expressions_fixed", function() {
            that.isLock = !that.isLock;
            $(this).toggleClass("active");
            that.hideByLocking();
        });

        this.$link.click(function(e){
            if($(e.target).closest(".expression_box").is(that.$el)){
                return false;
            }
            that.toggle();
            that.$toInput.focus();
        });
    },toggle = function(){
        this.$link.toggleClass("active");
        this.$el.toggleClass("hidden");
    },show = function(){
        this.$link.addClass("active");
        this.$el.removeClass("hidden");
    },hide = function(){
        this.$link.removeClass("active");
        this.$el.addClass("hidden");
    },hideByLocking = function(){
        !$(".expressions_fixed",this.$el).is(".active") && this.hide();
    };
    return {
        init: init,
        render: render,
        show: show,
        hide: hide,
        hideByLocking: hideByLocking,
        toggle: toggle,
        addEvent: addEvent
    }
})();