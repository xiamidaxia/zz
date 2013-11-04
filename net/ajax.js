/**
 *  对 AJAX 请求进行包装, 自动识别是否跨域
 *
 *	方法                        描述
 *	-----------------------------------------------------------------------
 *	get(url, data, settings)    发出 GET 请求，使用 JSON 数据格式进行传输
 *	post(url, data, settings)   发出 POST 请求，使用 JSON 数据格式进行传输
 *
 *	url: 请求的 URL
 *	data: 参数数据
 *	settings : 设置，大部分设置同 jQuery，以 srx 开头的设置为三人行项目专用：
 *		srxMock { default: false } 是否启用 mock
 *		srxIgnoreDefaultProcess { default: null } 忽略默认状态处理。以“,”号分割的状态码字符串，例如：'301' 或 '301,302'
 *
 *	get/post 方法遵从 Deferred 设计模式（http://api.jquery.com/category/deferred-object/），可以多处附加 done/fail/always
 *	处理，所有的 done/fail/always 处理，采用统一的参数形式：function (output, xhr)，其中 output 是服务器端返回的数据，格式
 *	为：{ s, data, msg }，xhr 目前为 jqXHR 对象（http://api.jquery.com/jQuery.ajax/#jqXHR），一般用不到。处理函数内，this
 *	指向 settings.context（如果有） 或 xhr（如果没有 settings.context），相当于 SRX Model 里的 input，但该值更加灵活。
 *
 *	完整例子：
 *		var ajax = require('srx/net/ajax');
 *		// show loading if needed
 *		ajax.get('/user/panels/r.json', { names: 'classe,photo' }).done(function(output, xhr) {
 *			...
 *		}).fail(function(output, xhr) {
 *			switch (output.s) {
 *				...
 *			}
 *		}).always(function(output, xhr) {
 *			// hide loading if needed
 *		});
 *
 * @class srx_net_ajax
 * @author zhangpeng
 * @date 2012-11-16
 */
define(function(require) {
	var $ = require('jquery');
	var cookie = require("../cookie");
	var alert = require("srx/utls/alert");
	var defaultActions = {
		'301': function() {
			$(window).trigger("login_dlg");
		},
		'302': function() {
			alert('很抱歉，您的权限不足。');
		},
		'401': function() {
			alert('很抱歉，您发布的内容违反了相关法规和政策，请修改后再发布。');
		},
		'900222' : function() {
			alert('很抱歉，您发布内容的频率过高，请稍后再试。');
		}
	};


	// 对 jQuery.ajax 的简单包装
	function _request(url, data, settings) {
		settings = settings || {};

		var deferred = $.Deferred();
		var srxXHR = {};

		if (VAR.USERID != -1 // 只在登陆时验证，避免未登录即可调用的接口不能工作
			&& VAR.USERID != cookie.get('id')) {
			defaultActions['301']();
			// 请求没有发出，故而没有 XHR 参数
			deferred.rejectWith(settings.context, [ { s: 301 } ]);
		} else {
			var crossDomain = location.hostname !== 'www.3ren.cn';
			settings.crossDomain = crossDomain;

			// 保留原有的 beforeSend
			var beforeSend = settings.beforeSend;
			settings = $.extend({
				srxMock: false,
				srxIgnoreDefaultProcess: '',
				// 默认为 JSON 数据
				dataType: 'json'
			}, settings, {
				beforeSend: function(jqXHR, opts) {
					if (opts.url.slice(0, 1) == '/') {
						opts.url = 'http://www.3ren.cn' + ( opts.srxMock ? '/mock' : '' ) + opts.url;
					}

					// 解决跨域问题
					if (crossDomain) {
						opts.xhr = $('#jsonproxy')[0].contentWindow.getXHR;
						// 纠正 jQuery 的错误判断
						$.support.cors = true;
					}
					// 如果有原有 beforeSend，则进行调用
					if (beforeSend) {
						beforeSend(jqXHR, opts);
					}
				},
				// 请求参数
				data: data
			});

			$.ajax(url, settings).done(function(res, status, jqXHR) {
				if (res && res.s) {
					if (res.s == 200) {
						deferred.resolveWith(jqXHR.context || jqXHR, [ res, jqXHR ]);
					} else {
						// 检查是否忽略默认的处理
						if (settings.srxIgnoreDefaultProcess.indexOf(res.s) === -1) {
							var action = defaultActions[res.s];
							if (action) {
								// 如果有默认处理，执行默认处理
								action();
							}
						}
						deferred.rejectWith(jqXHR.context || jqXHR, [ res, jqXHR ] );
					}
				} else {
					deferred.rejectWith(jqXHR.context || jqXHR, [ { s: -1, msg: 'JSON数据格式解析错误' }, jqXHR ] );
				}
			}).fail(function(jqXHR, status, error) {
				deferred.rejectWith(jqXHR.context || jqXHR, [ { }, jqXHR ] );
			});
		}

		deferred.promise(srxXHR);
		return srxXHR;
	}

	/**
	 * 发出 GET 请求
	 * @method get
	 * @param url {string} 请求的 URL
	 * @param data {object} 参数数据
	 * @param settings {object} 设置
	 */
	function get(url, data, settings) {
		return _request(url, data, settings);
	}

	/**
	 * 发出 POST 请求
	 * @method post
	 * @param url {string} 请求的 URL
	 * @param data {object} 参数数据
	 * @param settings {object} 设置
	 */
	function post(url, data, settings) {
		return _request(url, data, T.extend({ type: 'POST' }, settings));
	}

	return {
		get: get,
		post: post
	};
});
