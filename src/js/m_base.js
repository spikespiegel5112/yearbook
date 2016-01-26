;
(function($) {

	

	$.fn.extend({
		/**
		 * 如果操作的对象很多（超过1000个），
		 * 最好的做法是想办法直接调用$obj.width(200)，避免再获取原始值;
		 */
		innerWidth: function(val) {
			if (val == undefined) {
				var elem = this[0];
				return elem ? elem.style ?
					utils.parseFloat(jQuery.css(elem, "width", "padding")) :
					this.width() :
					null;
			}
			return this.each(function() {
				var $this = $(this);
				$this.width(val - (utils.parseFloat($this.css("paddingLeft")) + utils.parseFloat($this.css("paddingRight"))));
			});
		},
		/**
		 * 如果操作的对象很多（超过1000个），最好不用此方法。
		 * 最好的做法是想办法直接调用$obj.height(200)，避免再获取原始值;
		 */
		innerHeight: function(val) {
			if (val == undefined) {
				var elem = this[0];
				return elem ? elem.style ?
					utils.parseFloat(jQuery.css(elem, "height", "padding")) :
					this.height() :
					null;
			}
			return this.each(function() {
				var $this = $(this);
				$this.height(val - (utils.parseFloat($this.css("paddingTop")) + utils.parseFloat($this.css("paddingBottom"))));
			});
		},
		/**
		 * val 不传值为取值，否则设值
		 * 如果操作的对象很多（超过1000个），最好不用此方法。因为遍历对象先获取对象的原始宽度再设置新的宽度，获取对象原始宽度很耗性能。
		 * 最好的做法是想办法直接调用$obj.width(200)，避免再获取原始值;
		 * @param margin 计算宽度是否包含margin
		 * @param val
		 * @returns
		 */
		outerWidth: function(margin, val) {
			if (margin && !utils.isBoolean(margin)) {
				val = margin;
				margin = false;
			}
			if (val == undefined) {
				if (this[0] == window) {
					return this.width() || document.body.clientWidth;
				}
				return $origin.outerWidth.call(this, margin) || 0;
			}
			return this.each(function() {
				$(this).width(val - ($origin.outerWidth.call($(this), margin) - $(this).width()));
			});
		},
		/**
		 * 如果操作的对象很多（超过1000个），最好不用此方法。因为遍历对象先获取对象的原始宽度再设置新的宽度，获取对象原始宽度很耗性能。
		 * 最好的做法是想办法直接调用$obj.height(200)，避免再获取原始值;
		 */
		outerHeight: function(margin, val) {
			if (margin && !utils.isBoolean(margin)) {
				val = margin;
				margin = false;
			}
			if (val == undefined) {
				if (this[0] == window) {
					return this.height() || document.body.clientHeight;
				}
				return $origin.outerHeight.call(this, margin) || 0;
			}
			return this.each(function() {
				$(this).height(val - ($origin.outerHeight.call($(this), margin) - $(this).height()));
			});
		},
		afterChange: function(fn) {
			this.keyup(function(e) {
				if (!e.ctrlKey && !e.altKey) {
					fn.call(this, e);
				}
			});
			this.mouseup(fn);
			return this;
		},
		textCount: function(settings) {
			//当textArea输入框文字字数变化时，自动显示字数
			settings = $.extend({}, textCountSettings, settings);
			return this.afterChange(function() {
				if (settings.func)
					settings.func.call(this);
				else {
					var len = $(this).val().replace(/\r\n|\n|\r|(\s+)/g, '').length;
					if (len > settings.totalCount) {
						var str = $(this).val().match(new RegExp("^([(\r\n)\n\r(\\s+)]*([^(\r\n)\n\r(\\s+)][(\r\n)\n\r(\\s+)]*){" + settings.totalCount + "})", "g"));
						$(this).val(str);
						$("#" + settings.countId).text(settings.totalCount);
					} else
						$("#" + settings.countId).text(len);
				}
			});
		},
		priceCalculator: function(options) {
			var counter = 0,
				subtotal = 0,
				unitPrice = ''
			options = $.extend({
				unitprice: '',
				subtotal: '',
				onchange: function() {}
			}, options);
			$(this).each(function() {
				var $this = $(this),
					counterEl = $this.find('input');
				counterEl.html('0');
				$this.find('a').click(function() {
					switch ($(this).index()) {
						case 0:
							counter--;
							if (counter < 0) {
								counter = 0;
							}
							counterEl.val(counter);
							getter();
							setter();
							options.onchange();
							break;
						case 2:
							counter++;
							counterEl.val(counter);
							getter();
							setter();
							options.onchange();
							break;
					}
					fireOnchange(counterEl);
				});

				counterEl.bind('keydown keyup', function(e) {
					var $this = $(this),
						keycode = e.charCode ? e.charCode : e.keyCode;
					switch (e.type) {
						case 'keydown':
							if (keycode != 8 && keycode < 48 || keycode > 57 && keycode < 96 || keycode > 105) {
								e.preventDefault();
							} else {
								$this.val() != 0 ? $this.val() != 0 : $this.val('');
							}
							break;
						case 'keyup':
							counter = counterEl.val();
							getter();
							setter();
							options.onchange();
							fireOnchange(counterEl);
							break;
					}
				})
			});

			function getter() {
				var unitPriceEl = $(options.unitprice).text();
				unitPrice = unitPriceEl.replace("￥", '');
			}

			function setter() {
				var result = unitPrice * counter;
				$(options.subtotal).html(parseFloat(result).toFixed(2));
			}

			function fireOnchange(_this) {
				_this.trigger('onchange');
			}
		}
	});
	var textCountSettings = {
		countId: "icer_text_count_id",
		totalCount: 500,
		process: false
	};

	/**
	 * 无论返回成功或者失败都会执行callback
	 * settings = { verifyLogin: false, //验证是否登录 loginCallback: function(){},
	 * //登录成功后的回调函数 sucMsg : "操做成功", failMsg : "操作有误", sucClose :
	 * function(data){}, //请求成功关闭alert框后执行的函数 failClose : function(data){},
	 * //请求失败关闭alert框后执行的函数 success : function(data){} //不管成功或者失败都会执行 ... };
	 */
	// 扩展post函数,用于处理返回code信息
	$.each(["get", "post"], function(i, method) {
		$[method] = function(url, data, callback, dataType, settings) {
			// shift arguments if data argument was omitted
			if (utils.isFunction(data)) {
				settings = dataType;
				dataType = callback;
				callback = data;
				data = undefined;
			}
			if (utils.isString(data) && $.ajaxSettings.accepts[data.toLowerCase()]) {
				settings = callback;
				dataType = data;
				data = undefined;
				callback = undefined;
			}
			if (utils.isString(callback) && $.ajaxSettings.accepts[callback.toLowerCase()]) {
				settings = dataType;
				dataType = callback;
				callback = undefined;
			}
			if (utils.isObject(callback)) {
				settings = callback;
				dataType = undefined;
				callback = undefined;
			}
			if (utils.isObject(dataType)) {
				settings = dataType;
				dataType = undefined;
			}
			settings = settings || {};
			$.extend(settings, {
				type: method,
				url: url,
				data: data,
				success: callback,
				dataType: dataType
			});
			return $.ajax(settings);
		};
	});
	// 扩展ajax函数,用于处理返回code信息
	$.extend({
		ajax: function(settings) {
			var s = $.extend({
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					var dataType = this.dataTypes ? this.dataTypes[1] ? this.dataTypes[1] : this.dataTypes[0] : null;
					if (dataType == "html" && utils.isString(XMLHttpRequest.responseText)) {
						this.success(
							XMLHttpRequest.responseText,
							textStatus,
							XMLHttpRequest);
					} else {
						// $.alert("error", "系统错误!");
						if (window.console) {
							console.error(this.url + "请求异常");
							console.info(errorThrown);
						}
					}
				}
			}, settings || {});
			var ajaxSuccess = s.success;
			s.success = function(data, textStatus, jqXHR) {
				var dataType = this.dataTypes ? this.dataTypes[1] ? this.dataTypes[1] : this.dataTypes[0] : null;
				if (dataType) {
					if (dataType === "script") {
						// 如果是返回类型是script，则直接跳出。因为jquery已经初始化过返回的脚本数据
						return;
					} else if (dataType === "json" && utils.isString(data)) {
						try {
							data = JSON.parse(data);
						} catch (err) {

						}
					} else if (dataType === "xml" && data.activeElement)
						data = {};
				}
				data = data || {};
				if (s.verifyLogin) {
					// 判断此用户有没有登录
					if (!utils.judgeLogin({
							data: data,
							callBack: s.loginCallback
						}))
						return;
				}
				dataProcess(data, s, ajaxSuccess);
			};

			var msgObj = {
				code: "code",
				msg: "msg",
				msgDefaults: {
					sucMsg: false,
					failMsg: false
				}
			};
			/**
			 * ajax请求返回数据的处理,例如异常处理 settings 可参考msgDefaults 设置相应的错误信息
			 * data为ajax返回的数据， return true ==> 操作成功 return false ==>操作失败
			 *  code = BaseData.suc或者为空 都会执行sucClose、ajaxSuccess函数，
			 *  当code不等于空且不等于BaseData.suc则执行failClose、ajaxSuccess函数
			 */
			var dataProcess = function(_data, settings, ajaxSuccess) {
				if (_data instanceof Object && !!_data[msgObj.code]) {
					var code = _data[msgObj.code],
						msg = _data[msgObj.msg];
					if (code == BaseData.suc) {
						msg = msg ? msg : settings.sucMsg ? settings.sucMsg : "操作成功！";
						$.alert("info", msg, function() {
							if (typeof settings.sucClose == "function")
								settings.sucClose(_data);
							if (typeof ajaxSuccess == "function")
								ajaxSuccess(_data);
						});
						return true;
					} else {
						msg = msg ? msg : settings.failMsg ? settings.failMsg : "操作失败！";
						$
							.alert(
								"error",
								msg,
								function() {
									if (typeof settings.failClose == "function")
										settings
										.failClose(_data);
									if (typeof ajaxSuccess == "function")
										ajaxSuccess(_data);
								});
						return false;
					}
				}
				if (typeof settings.sucClose == "function")
					settings.sucClose(_data);
				if (typeof ajaxSuccess == "function")
					ajaxSuccess(_data);
				return true;
			};

			$origin.ajax(s);
		},
		//移动端滚动到底部加载插件
		// collideLoading:function(options){
		// 	options=$.extend({
		// 		callback:function(){}
		// 	},options)
		// 	$(window).scroll(function(){
		// 		var availHeight=$(window).height(),
		// 			scrollTop=$(window).scrollTop(),
		// 			docHeight=$(document).height();
		// 		console.log('aaa')
		// 		if (availHeight+scrollTop>=docHeight) {
		// 			options.callback();
		// 		}
		// 	})
		// },
		collideLoading:function(options) {
			options = $.extend({
				onScrollBottom: function () {
					alert('aaa')
				}
			}, options)
			window.onscroll = function () {
				var clientHeight = 0,
					scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop,
					docHeight = document.scrollHeight ? document.scrollHeight : document.documentElement.scrollHeight;

				if (document.documentElement.clientHeight && document.body.clientHeight) {
					clientHeight = Math.min(document.documentElement.clientHeight, document.body.clientHeight);
				} else {
					clientHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
				}

				if (clientHeight + scrollTop >= docHeight) {
					options.onScrollBottom()
				}
				;
				console.log(docHeight)
			}
		}
	});

	/**
	 * 跳转到新页面
	 */
	window.openWin = function openWin(_url) {
		window.location.href = _url;
	};

	/**
	 * StringToken 用来遍历字符窜使用
	 */
	window.StringToken = window.StringToken || function(val) {
		window.StringToken.NULL = '\000';
		this.index = -1;
		this.more = function() {
			return val && this.index < val.length - 1;
		};
		this.next = function() {
			if (this.more()) {
				return val.charAt(++this.index);
			}
			return StringToken.NULL;
		};
		this.back = function() {
			if (this.index > 0)
				this.index--;
		};
		this.setIndex = function(index) {
			this.index = index;
		};
	};

	String.prototype.toText = function() {
		return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
			'&gt;').replace(/\'/g, '&#039;').replace(/\"/g, '&quot;');
	};
	/**
	 * 格式化字符窜占位符 aaa{0}bbb{1}c{name}cc ==> aaa-bbb+ccc
	 */
	String.prototype.placeholder = function() {
		var assemble = "",
			key,
			token = new StringToken(this);

		function nextKey(isAssemble) {
			var c, holder = false,
				key = "";
			KEY:
				while ((c = token.next()) != StringToken.NULL) {

					switch (c) {

						case '\\':
							if (holder) {
								key = key.concat(c).concat(token.next());
							} else {
								if (isAssemble)
									assemble = assemble.concat(c).concat(token.next());
							}
							break;
						case '{':
							if (holder) {
								throw Error("char '{' can not nest");
							} else {
								holder = true;
							}
							break;
						case '}':
							if (holder) {
								break KEY;
							} else {
								if (isAssemble)
									assemble = assemble.concat(c);
							}
							break;
						default:
							if (holder) {
								key = key.concat(c);
							} else {
								if (isAssemble)
									assemble = assemble.concat(c);
							}
							break;
					}

				}

			return key;
		}
		while ((key = nextKey(true)) !== "") {
			var val = null;
			if (utils.regex(key, regex.num)) {
				var intKey = parseInt(key);
				val = arguments.length > intKey ? arguments[intKey] : null;
			} else {
				for (var i in arguments) {
					var arg = arguments[i];
					if (utils.isObject(arg)) {
						if (key in arg) {
							val = arg[key];
							break;
						}
					}
				}
			}
			assemble = assemble.concat(val);
		}
		return assemble;
	};

	// 格式化字符串的日期，转换成 date类型;例如：'2015-01-27 13:11:30' 转换成date格式
	String.prototype.splitDate = function() {

		var dateString = this.toString();

		var dateSplitArrary = dateString.split(' ');
		var dateArrary = dateSplitArrary[0].split('-');
		var timeArrary = dateSplitArrary[1].split(':');

		var year = dateArrary[0];
		var mo = dateArrary[1];
		var day = dateArrary[2];

		var ho = timeArrary[0];
		var min = timeArrary[1];
		var send = timeArrary[2];

		var date = new Date();
		date.setYear(year);
		date.setMonth(mo - 1);
		date.setDate(day);
		date.setHours(ho);
		date.setMinutes(min);

		if (send != undefined) {
			date.setSeconds(send);
		}

		return date;
	};

	// 截取一定字符的字符串
	String.prototype.textCut = function(remainNum, replaceSymble, escape) {
		var str = this.toString(),
			output = new Array();
		if (!str || !typeof remainNum == "number")
			return false;
		if (str.length > 0) {
			var n = 0;
			var pattern = /^[\u4E00-\u9FA5]+$/;
			for (var i = 0; i < str.length; i++) {
				var strTemp = str.substring(i, i + 1);
				if (pattern.test(strTemp)) {
					n += 2;
				} else {
					n++;
				}
				if (n > remainNum) {
					if (utils.isString(replaceSymble)) {
						output.push(replaceSymble);
					}
					break;
				}
				output.push(strTemp);
			}
		}
		if (escape) {
			return escape(output.join(""));
		}
		return output.join("");
	};
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			var str = this.toString();
			return str.replace(/^\s+/, "").replace(/\s+$/, "");
		};
	}
	if (!String.prototype.repeat) {
		String.prototype.repeat = function(num) {
			if (!utils.isNumber(num))
				num = utils.parseInt(num);
			return new Array(++num).join(this);
		};
	}

	// 格式化日期格式
	if (!Date.prototype.format) {
		Date.prototype.format = function(format) {
			format = format || "yyyy-MM-dd HH:mm:ss";
			var o = {
				"M+": this.getMonth() + 1, // month
				"d+": this.getDate(), // day
				"H+": this.getHours(), // hour
				"m+": this.getMinutes(), // minute
				"s+": this.getSeconds(), // second
				"q+": Math.floor((this.getMonth() + 3) / 3), // quarter
				"S": this.getMilliseconds()
					// millisecond
			};
			if (/(y+)/.test(format)) {
				var year = this.getFullYear().toString(),
					year = 4 - RegExp.$1.length < 0 ? year : year.substr(4 - RegExp.$1.length);
				format = format.replace(RegExp.$1, year);
			}
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1,
						RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
						.substr(o[k].toString().length));
				}
			}
			return format;
		};
	}

})(jQuery);


//create by fqian
function Map() {

	this.elements = new Array();

	this.size = function() {
		return this.elements.length;
	}

	this.isEmpty = function() {
		return (this.elements.length < 1);
	}

	this.clear = function() {
		this.elements = new Array();
	}

	this.put = function(_key, _value) {

		this.remove(_key);

		this.elements.push({
			key: _key,
			value: _value
		});
	}

	this.remove = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	this.get = function(_key) {
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return null;
		}
	}

	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	}

	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	this.values = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	}

	this.keys = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	}
}
