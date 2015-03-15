/**
 * @file jQuery Plugin: jquery.semi-responsive
 * @version 1.0.3
 * @author Yuusaku Miyazaki [toumin.m7@gmail.com]
 * @license MIT License
 */
(function($) {

/**
 * @desc プラグインをjQueryのプロトタイプに追加する
 * @global
 * @memberof jQuery
 * @param {Object} [option] オプションを格納した連想配列
 * @param {string} [option.btn_class='semi_responsive'] - CSS切り替えボタンとして機能する要素のクラス名
 * @param {string} [option.btn_class_selected='semi_responsive_selected'] - 選択されている切り替えボタンのクラス名
 * @param {string} [option.link_href_attr='sr-link-href'] - CSSファイルのパスを格納する属性の名前
 * @param {string} [option.min_width_attr='sr-min-width'] - CSS切り替えの基準となる幅を格納する属性の名前
 * @param {string} [option.param_val_attr='sr-param-val'] - URLパラメータの値を格納する属性の名前
 * @param {string} [option.param_key='view'] - URLパラメータのキーの名前
 */
$.fn.semiResponsive = function(option) {
	return this.each(function() {
		new SemiResponsive(this, option);
	});
};

/**
 * @global
 * @constructor
 * @classdesc 要素ごとに適用される処理を集めたクラス
 * @param {Object} elem - プラグインを適用するHTML要素
 * @param {Object} option - オプションを格納した連想配列
 *
 * @prop {Object} elem - プラグインを適用するHTML要素
 * @prop {Object} option - オプションを格納した連想配列
 * @prop {Array} order_child - 切り替えボタンをmin_widthの大きい順に並べ替えてインデックスと幅を保管するオブジェクト配列
 * @prop {Object} parsed- URLを分解して連想配列として保管する
 */
function SemiResponsive(elem, option) {
	this.elem = elem;
	this.option = option;

	this.setOption();
	this.sortChild();
	this.setParsed();
	this.setCssDependOnUrlParam();
	this.ehAnchor();
	this.ehResize();
}

$.extend(SemiResponsive.prototype, /** @lends SemiResponsive.prototype */ {
	/**
	 * @private
	 * @desc オプションを初期化する
	 */
	setOption: function() {
		var id = $(this.elem).attr('id');
		this.option =  $.extend({
			btn_class: 'semi_responsive',
			btn_class_selected: 'semi_responsive_selected',
			link_href_attr: 'sr-link-href',
			min_width_attr: 'sr-min-width',
			param_val_attr: 'sr-param-val',
			param_key: 'view',
		}, this.option);
	},

	/**
	 * @private
	 * @desc min_widthの大きい順に並べ替えて、インデックスを配列に格納する。(AUTOの要素は除く)
	 */
	sortChild: function() {
		this.order_child = [];
		var self = this;
		$(self.elem).find('.' + self.option.btn_class).each(function(idx) {
			var num = $(this).attr(self.option.min_width_attr);
			if (num != undefined) {
				self.order_child.push({
					idx: idx,
					min_width: $(this).attr(self.option.min_width_attr)
				});
			}
		});
		this.order_child.sort(function(a, b) {
			return parseInt(b.min_width) - parseInt(a.min_width);
		});
	},

	/**
	 * @private
	 * @desc URL文字列からGETパラメータを識別する
	 */
	setParsed: function() {
		var parsed = {
			not_param: '',
			param: {},
		};

		var url_split = location.href.split('?');
		parsed.not_param = url_split[0];

		if (url_split.length > 1) {
			var params = url_split[1].split('&');
			for (var i = 0; i < params.length; i++) {
				var pair = params[i].split('=');
				parsed.param[pair[0]] = pair[1];
			}
		}
		this.parsed = parsed;
	},

	/**
	 * @private
	 * @desc URLのGETパラメータに応じてCSSを変更する
	 */
	setCssDependOnUrlParam: function() {
		if (this.parsed.param[this.option.param_key] == undefined) {
			this.setCssDependOnWidth();
			this.changeSelectedCSS(null);
		} else {
			this.setCss(this.parsed.param[this.option.param_key]);
			this.changeSelectedCSS(this.parsed.param[this.option.param_key]);
		}
	},

	/**
	 * @private
	 * @desc 画面の幅に応じてCSSを変更する
	 */
	setCssDependOnWidth: function() {
		this.sortChild();
		for (var i = 0; i < this.order_child.length; i++) {
			if (window.matchMedia( '(min-width: ' + this.order_child[i].min_width +'px)' ).matches) {
				this.setCss(
					$(this.elem).find('.' + this.option.btn_class).eq(this.order_child[i].idx).attr(this.option.param_val_attr)
				);
				break;
			}
		}
	},

	/**
	 * @private
	 * @desc 適用するCSSファイルを変更する
	 * @param {string} selected - 選択された要素の param_val_attr の値
	 */
	setCss: function(selected) {
		var self = this;
		$(this.elem).find('.' + this.option.btn_class).each(function() {
			$('head link[href="' + $(this).attr(self.option.link_href_attr) +'"]').remove();
		});
		var href = $(this.elem).find('.' + this.option.btn_class + '[' + this.option.param_val_attr + '=' + selected + ']').attr(this.option.link_href_attr);
		$('<link rel="stylesheet" type="text/css" href="' + href + '">').appendTo('head');
	},

	/**
	 * @private
	 * @desc 切り替えの引き金となる要素のCSSを変更
	 * @param {string} selected - 選択された要素の param_val_attr の値
	 */
	changeSelectedCSS: function(selected) {
		$(this.elem).find('.' + this.option.btn_class).removeClass(this.option.btn_class_selected);
		if (!selected) {
			var self = this;
			$(this.elem).find('.' + this.option.btn_class).each(function() {
				if ($(this).attr(self.option.param_val_attr) == undefined) {
					$(this).addClass(self.option.btn_class_selected);
				}
			});
		} else {
			$(this.elem).find('.' + this.option.btn_class + '[' + this.option.param_val_attr + '=' + selected + ']').addClass(this.option.btn_class_selected);
		}
	},

	/**
	 * @private
	 * @desc CSSを選ぶアンカーのイベントハンドラ
	 */
	ehAnchor: function() {
		var self = this;
		$(self.elem).find('.' + self.option.btn_class).on('click', function(e) {
			// 適用中の項目がクリックされたら、ここで終了する
			if ($(e.target).hasClass(self.option.btn_class_selected)) return false;

			// parsedの中身を整える
			if ($(e.target).attr(self.option.param_val_attr) == undefined) { // AUTO を選択した場合
				if (self.parsed.param[self.option.param_key] != undefined) {
					delete self.parsed.param[self.option.param_key];
				}
			} else { // CSSファイルを選択した場合
				self.parsed.param[self.option.param_key] = $(e.target).attr(self.option.param_val_attr);
			}

			// parsedを再びURL文字列にする
			var param_text = '';
			for (var key in self.parsed.param) {
				param_text += '&' + key + '=' + self.parsed.param[key];
			}
			if (param_text != '') {
				param_text = '?' + param_text.substring(1);
			}

			// URLを書き換える
			if (window.history && window.history.pushState) {
				var url = self.parsed.not_param + param_text;
				history.pushState(null, null, url);
			}

			// 適用するCSSファイルを変更
			self.setCssDependOnUrlParam();
		});
	},

	/**
	 * @private
	 * @desc ウィンドウサイズが変わった場合の処理
	 */
	ehResize: function() {
		var self = this;
		$(window).on('resize', function() {
			// AUTOのみ、レスポンシブとなる
			if (self.parsed.param[self.option.param_key] == undefined) {
				self.setCssDependOnWidth();
			}
		});
	},
}); // end of "$.extend"

})( /** namespace */ jQuery);