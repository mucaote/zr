/*--String.prototype--*/
~function (pro) {
    function queryURLParameter() {
        var reg = /([^?&=#]+)=([^?&=#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        reg = /#([^?=&#]+)/;
        this.replace(reg, function () {
            obj['HASH'] = arguments[1];
        });
        return obj;
    }

    pro.queryURLParameter = queryURLParameter;
}(String.prototype);

/*--MAIN--*/
~function () {
    var $header = $('.header'),
        $main = $('.main'),
        $menu = $main.children('.menu');

    //->computedMainHeight:计算MAIN区域的高度
    function computedMainHeight() {
        var winH = $(window).outerHeight(),
            headerH = $header.outerHeight(),
            tarH = winH - headerH - 40;
        $main.css('height', tarH);
        $menu.css('height', tarH - 2);
    }

    computedMainHeight();
    $(window).on('resize', computedMainHeight);
}();

/*--MENU--*/
var menuRender = (function () {
    var menuExample = null,
        $menu = $('.menu'),
        $link = $menu.find('a'),
        HASH = null;

    var $menuPlan = $.Callbacks();//->create plan
    //->add:to plan method
    //->remove: remove plan method
    //->fire: fire plan method run

    //->实现局部滚动
    $menuPlan.add(function () {
        menuExample = new IScroll('.menu', {
            mouseWheel: true,
            scrollbars: true,
            fadeScrollbars: true
        });
    });

    //->通过HASH值来定位
    $menuPlan.add(function () {
        HASH = window.location.href.queryURLParameter()['HASH'];
        HASH = HASH || 'nba';
        var $tarLink = $link.filter('[href="#' + HASH + '"]');
        $tarLink = $tarLink.length === 0 ? $link.eq(0) : $tarLink;
        $tarLink.addClass('bg');
        menuExample.scrollToElement($tarLink[0], 0);
        calendarRender.init($tarLink.attr('data-cid'));
    });

    //->绑定点击事件
    $menuPlan.add(function () {
        $link.on('click', function () {
            var _this = this;
            $link.each(function (index, item) {
                _this === item ? $(item).addClass('bg') : $(item).removeClass('bg');
            });

            calendarRender.init($(this).attr('data-cid'));
        });
    });

    return {
        init: function () {
            $menuPlan.fire();
        }
    }
})();
menuRender.init();

//日历区域：
var calendarRender=(function(){
    var  $calendarPlan= $.Callbacks();
    $calendarPlan.add(function(){//数据绑定，先使用Jsonp获取到数据 ，通知方法执行；

    });
    $calendarPlan.add(function(){//定位到今天位置

    });
    $calendarPlan.add(function(){//实现左右切换

    });
    return{
        init:function(cid){
            $.ajax({
                url:'http://matchweb.sports.qq.com/kbs/calendar?columnId=100000='+cid,
                type:'get',
                dataType:'jsonp',
                success:function (result){
                     if(result&&result.code==0){
                         result=result['data'];
                         var today=result['today'],
                             data=result['data'];
                         $calendarPlan.fire(today,data,cid);
                     }
                }
            })

        }
    }
})();
menuRender.init();

