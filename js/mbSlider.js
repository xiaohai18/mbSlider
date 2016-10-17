(function(window, undefined){
    'use strict';
    /*
        移动端焦点图
        Date: 2016-8-23
        Author: hishion
        site: www.byex.cn/mbSlider/
    */
    window.mbSlider = function (options){
        this.config = {
            container: '.mb-container',
            wrapper: '.mb-wrapper',
            itmes: '.mb-slide',
            //自动播放 : Number/ms || Boolean
            autoplay: 4500,
            //动画持续时间  Number/ms
            duration: 300,
            //方向 : 'vertical||horizontal'
            direction: 'horizontal',
            //是否显示左右按钮
            isControl: false,
            //是否显示分页按钮
            isPages: false,
            //滑动开始
            tapStart: function(){
                //console.log('tapStart!')
            },
            //滑动中
            tapMove: function(){
                //console.log('tapMove!')
            },
            //滑动结束
            tapEnd: function(){
               //console.log('tapEnd!')
            },
            //运动开始
            aniStart: function(){
                //console.log('aniStart!')
            },
            //运动结束
            aniEnd: function(){
                //console.log('aniEnd!')
            },
            // 浏览器前缀
            engine: ['webkit', 'ms', 'o', 'moz']
        };
        return this.init.apply(this, arguments);
    };
    mbSlider.prototype = {
        /*
            初始化
        */
        init: function(config){
            var config          = this.setConfig(config);
            this.container      = document.querySelector(config.container);
            this.wrapper        = this.container.querySelector(config.wrapper);
            this.itmes          = this.container.querySelectorAll(config.itmes);
            this.itemSize       = this.itmes.length;
            this.timer          = null;
            this.boxViewSize    = this.getViewSize();
            var lastNode  = this.itmes[this.itemSize-1].cloneNode(true);
            var firstNode = this.itmes[0].cloneNode(true);

            if(config.direction == 'vertical'){
                this.container.className += ' mb-container-vertical';
                this.setAttributes('flexDirection', 'column');
            }

            if(config.isPages){
                this.showPages();
            }
            if(config.isControl){
                this.showControl();
            }

            this.autoplay();
            this.wrapper.insertBefore(lastNode, this.itmes[0]);
            this.wrapper.appendChild(firstNode);

            this.curIndex = -1;
            this.setMove();

            this.bindTouchEvent();
            this.bindTransition();

            var context = this;
            var timer   = null;
            this.on(window, 'resize', function(){
                clearTimeout(timer);
                timer = setTimeout(function(){
                    context.boxViewSize = context.getViewSize();
                    context.setState();
                }, 150);
            });
        },
        getViewSize: function(){
            var container = this.container;
            return this.config.direction == 'vertical' ? container.clientHeight || container.offsetHeight : container.clientWidth || container.offsetWidth;
        },
        /*
            设置运动
        */
        setMove: function(add){
            var config = this.config;
            var dis    = this.curIndex * this.boxViewSize + (add || 0);

            if(this.duration){config.aniStart()};
            this.setAttributes('transform', this.config.direction == 'vertical' ? 'translate3d(0px, '+dis+'px, 0px)' : 'translate3d('+dis+'px, 0px, 0px)');
        },
        bindTransition: function(){
            var arr = ['webkitTransitionEnd','transitionend','oTransitionEnd otransitionend'];
            var config = this.config;
            for(var i = 0; i < arr.length; i++){
                this.on(this.wrapper, arr[i], function(){
                    config.aniEnd();
                })
            }
        },
        /*
            设置配置项
        */
        setConfig: function(options){
            for(var attr in options){
                if(this.config.hasOwnProperty(attr)){
                    this.config[attr] = options[attr];
                }
            }
            return this.config;
        },
        /*
            设置 动画的时间, 为0时即无动画
        */
        setTransitionDuration: function(time){
            this.duration = time;
            this.setAttributes('transitionDuration', time + 'ms');
        },
        /*
            设置 样式属性, 并做浏览器前缀兼容处理。
        */
        setAttributes: function(attr, value){
            var engine = this.config.engine;
            for(var i = 0; i < engine.length; i++){
                this.wrapper.style[engine[i] + this.capitalize(attr)] = value;
            }
            this.wrapper.style[attr] = value;
        },
        /*
            英文字符首字母大写.
        */
        capitalize: function(str){
            return str.substr(0,1).toUpperCase() + str.substr(1)
        },
        /*
            绑定事件
        */
        on: function(elem, eventType, callback){
            return elem.addEventListener(eventType, callback, false)
        },
        /*
            移动事件
        */
        off: function(elem, eventType, callback){
            return elem.removeEventListener(eventType, callback, false)
        },
        /*
            清除自动播放
        */
        stop: function(){
            clearInterval(this.timer);
        },
        /*
            设置运动与当前分页状态
        */
        setState: function (){
            var curIndex = this.curIndex, self = this;
            self.setTransitionDuration(self.config.duration);
            self.setMove();

            if(curIndex < -self.itemSize || curIndex > -1){
                curIndex < -self.itemSize && (self.curIndex = -1);
                curIndex > -1 && (self.curIndex = -self.itemSize);

                self.timer2 = setTimeout(function(){
                    self.setTransitionDuration(0);
                    self.setMove();
                    clearTimeout(self.timer2);
                }, self.config.duration);
            }

            if(self.config.isPages){
                curIndex = Math.abs(self.curIndex%self.itemSize);
                self.setPagesSelected( curIndex == 0 ? self.itemSize-1 : curIndex-1 );
            }
        },
        /*
            自动播放
        */
        autoplay: function(){
            var self = this;
            if(!self.config.autoplay || self.config.autoplay <= self.config.duration)return;
            self.stop();
            self.timer = setInterval(function(){
                self.curIndex -= 1;
                self.setState();
            }, self.config.autoplay)
        },
        /*
            绑定触摸事件
        */
        bindTouchEvent: function(){
            var self = this, container = this.container;
            var a = 0, b = 0, dir = this.config.direction;

            function start(e){
                self.stop();
                e.preventDefault();
                self.setTransitionDuration(0);
                a = dir == 'vertical' ? e.touches[0].clientY : e.touches[0].clientX;

                self.on(container, 'touchmove', move);
                self.on(container, 'touchend', end);
                self.config.tapStart.call(container, e);
            }

            function move(e){
                e.preventDefault();
                b = dir == 'vertical' ? e.touches[0].clientY - a : e.touches[0].clientX - a;
                self.setMove(b);
                self.config.tapMove.call(container, e);
            }

            function end(){
                if(Math.abs(b) >= self.boxViewSize/2){
                    self.curIndex += (b > 0 ? 1 : -1);
                }
                self.setTransitionDuration(self.config.duration);
                self.setState();
                self.autoplay();

                self.off(container, 'touchmove', move);
                self.off(container, 'touchend', end);
                self.config.tapEnd.call(container);
            }

            this.on(container, 'touchstart', start);
        },
        /*
            获得当前索引
        */
        getCurIndex: function(){
            return parseInt(this.distance/this.boxViewSize);
        },
        /*
            获得子项数目
        */
        getItemSize: function(){
            return this.itemSize;
        },
        setPagesSelected: function(index){
            index = index || 0;
            for(var i = 0; i < this.itemSize; i++){
                this.aPages[i].className = '';
            }
            this.aPages[index].className = 'active';
        },
        /*
            显示 pages;
        */
        showPages: function(){
            var oPager = document.createElement('div');
            var html   = [];

            for(var i = 0; i < this.itemSize; i++){
                html.push('<a href="javascript:;"></a>');
            }

            oPager.className = 'mb-pager';
            oPager.innerHTML = html.join('');
            this.container.appendChild(oPager);

            this.aPages = oPager.querySelectorAll('a');
            this.setPagesSelected();
            this.bindPagesEvent();
        },
        bindPagesEvent: function(){
            var self = this, fn = function(e){
                e.preventDefault();
                e.stopPropagation();
                self.stop();
                self.setPagesSelected(this.index);
                self.curIndex = -(this.index+1);
                self.setTransitionDuration(self.config.duration);
                self.setState();
                self.autoplay();
            }
            for(var i = 0; i < this.itemSize; i++){
                this.aPages[i].index = i;
                this.on(this.aPages[i], 'touchstart', fn)
            }
        },
        /*
            显示左右切换按钮
        */
        showControl: function(){
            var oControl = document.createElement('div');
            var html = [
                '<a href="javascript:;" class="mb-control mb-control-pre"></a>',
                '<a href="javascript:;" class="mb-control mb-control-next"></a>'
            ];
            oControl.innerHTML = html.join('')
            this.container.appendChild(oControl);
            this.preControl  = oControl.querySelector('.mb-control-pre');
            this.nextControl = oControl.querySelector('.mb-control-next');
            this.bindControlEvent();
        },
        now: function(){
            return new Date() - 0;
        },
        bindControlEvent: function(){
            var self = this, start = 0;
            var fn = function(e, dis){
                e.stopPropagation();
                e.preventDefault();
                if(self.now() - start < self.config.duration)return;
                start = self.now();
                self.curIndex += dis > 0 ? 1 : -1;
                self.stop();
                self.setState();
                self.autoplay();
            };
            this.on(this.preControl, 'touchstart', function(e){
                fn(e, self.boxViewSize)
            });
            this.on(this.nextControl, 'touchstart', function(e){
                fn(e, -self.boxViewSize)
            });
        }
    }

}(window));


/*===========================
mbSlider AMD Export
===========================*/
if (typeof(module) !== 'undefined')
{
    module.exports = window.mbSlider;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.mbSlider;
    });
}