# jquery.semiResponsive
jQuery plugin for changing css file automatically or manually.


## Demo
http://www.usamimi.info/~sutara/sample2/semiResponsive/

## JSDoc
http://www.usamimi.info/~sutara/sample2/semiResponsive/JSDoc/


## Usage

### Basic
###### HTML and JavaScript
```html
<nav>
	<a href="javascript:void(0)" class="semi_responsive" sr_link_href="css/pc.css" sr_param_val="pc" sr_min_width="1000">PC</a>
	<a href="javascript:void(0)" class="semi_responsive" sr_link_href="css/sp.css" sr_param_val="sp" sr_min_width="0">Smart Phone</a>
	<a href="javascript:void(0)" class="semi_responsive">AUTO</a>
</nav>

<script src="http://code.jquery.com/jquery.min.js"></script>
<script src="js/jquery.semiResponsive.1.0.js"></script>
<script>
	$('nav').semiResponsive();
</script>
```

### Original attributes
You should set original html attributes.  
(このプラグイン独自のHTML属性を設定しなければなりません。)

| attribute  | explain  |
| :----------- |:---------------|
| sr_link_href | Path to css file. (CSSファイルまでのパス。link要素のhref属性となる。) |
| sr_param_val | Value of url parameter. (現在適用しているCSSを保存するURLパラメータの値。) |
| sr_min_width | Minimum width to change css file automatically. (自動的にCSSを切り替える際に基準となる画面の幅の最小値) |

It is not necessary to set these attributes if you create a "AUTO" button.  
(自動認識させるボタンには、これらの属性を記述する必要はありません。)

###### Example (HTML)
```html
<a href="javascript:void(0)" class="semi_responsive" sr_link_href="css/pc.css" sr_param_val="pc" sr_min_width="1200">PC</a>
<a href="javascript:void(0)" class="semi_responsive" sr_link_href="css/tb.css" sr_param_val="tb" sr_min_width="800">Tablet</a>
<a href="javascript:void(0)" class="semi_responsive" sr_link_href="css/sp.css" sr_param_val="sp" sr_min_width="0">Smart Phone</a>
<a href="javascript:void(0)" class="semi_responsive">AUTO</a>
```

### Options
Please read JSDoc.  
http://www.usamimi.info/~sutara/sample2/semiResponsive/JSDoc/global.html#semiResponsive

## License
MIT License