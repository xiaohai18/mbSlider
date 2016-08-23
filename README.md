
#mbSlider.js
##移动端 焦点图插件，无依赖，轻巧


在线演示：[http://www.byex.cn/mbSlider](http://www.byex.cn/mbSlider/)

Written by: hishion

##使用步骤

###Step 1: 引入资源文件


```html
<!-- mbSlider CSS file -->
<link href="mbSlider.css" rel="stylesheet" />
<!-- mbSlider Javascript file -->
<script src="mbSlider.js"></script>
```

###Step 2: 编写html

```html
<div class="mb-container">
    <div class="mb-wrapper">
        <div class="mb-slide mb-slide1">1</div>
        <div class="mb-slide mb-slide2">2</div>
        <div class="mb-slide mb-slide3">3</div>
    </div>
</div>
```

###Step 3: 调用 mbSlider 

```javascript
var app = new mbSlider({
    container: '.mb-container'
});
```

##配置项

以下参数全部为默认值
```
var app = new mbSlider({
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
    //运动结束
    aniStart: function(){
        //console.log('aniStart!')
    },
    //运动结束
    aniEnd: function(){
        console.log('aniEnd!')
    },
    //浏览器前缀
    engine: ['webkit', 'ms', 'o', 'moz']
});
```

