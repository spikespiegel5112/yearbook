;
(function($) {
	$.fn.extend({
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
		},
		alignCenter: function(options) {
			options = $.extend({
				direction: 'both'
			}, options);
			var windowWidth = $(window).width(),
				windowHeight = $(window).height(),
				thieWidth = this.width(),
				thisHeight = this.height(),
				_this = this;
			switch (options.direction) {
				case 'both':
					aligning(function() {
						_this.css({
							'margin-left': (windowWidth - thieWidth) / 2,
							'margin-top': (windowHeight - thisHeight) / 2,
						});
					});
				break;
				case 'vertical':
					aligning(function() {
						_this.css({
							'margin-top': (windowHeight - thisHeight) / 2
						});
					});
				break;
				case 'horizonal':
					aligning(function() {
						_this.css({
							'margin-left': (windowWidth - thieWidth) / 2
						});
					});
				break;
			}
			function aligning(callback) {
				$(window).resize(function() {
					callback()
				});
				callback()
			}
		},
		align: function(options) {
			options = $.extend({
				position: 'both',
				container: '',
				isImage: false,
				obstacleX: 0,
				obstacleY: 0,
				offsetY: 0
			}, options);

			var _this = this,
				imgSrc = _this.attr('src'),
				reload = false,
				thisWidth = 0,
				thisHeight = 0,
				containerheight = 0,
				windowWidth = $(window).width(),
				windowHeight = $(window).height();
			//_this.attr('src', imgSrc + '?' + Date.parse(new Date()))


			//当居中元素是img标签时，特殊处理！
			if (_this.is('img')) {
				//递归判断需要居中的图片是否加载完成，如果没有就重载
				var checkImgLoading = function() {
					_this.each(function(index) {
						if ($(this).height() == 0) {
							console.log('load failed ' + $(this).width())
							reload = true;
							return false;
						} else {
							var containerheight = $(options.container).eq(index).height();
							checkPosition($(this), containerheight)
						}
					});
					if (reload) {
						reload = false;
						setTimeout(function() {
							checkImgLoading();
						}, 100);
					}
				}
				checkImgLoading();
				//缺省情况
			} else {
				//需要遍历每个居中对象，判断其每个container尺寸不同时，需分别处理
				//container设置判断
				if (options.container != '') {
					_this.each(function(index) {
						var containerheight = $(options.container).eq(index).height();
						windowWidth = $(options.container).width();
						checkPosition($(this));
					})
				}else{
					checkPosition(_this);
				}
			}

			function checkPosition(_this) {
				clearTimeout();
				thisWidth = _this.outerWidth(),
					thisHeight = _this.outerHeight();

				switch (options.position) {
					case 'both':
						aligning(function(thisWidth, thisHeight) {
							if (options.container != '') {
								var marginY = (containerheight - thisHeight) / 2;
							} else {
								var marginY = (windowHeight - thisHeight) / 2;
							}
							if (marginY <= 0) {
								marginY = 0;
							};
							// alert(_this.width())
							console.log(thisWidth);
							// console.log(containerheight);
							if (thisWidth <= windowWidth) {
								_this.css({
									'margin': marginY + options.offsetY + 'px auto'
								});
							} else {
								_this.css({
									'margin': marginY + options.offsetY + 'px ' + (windowWidth - thisWidth) / 2 + 'px'
								});
							}
						});
						break;
					case 'top':
						aligning(function(thisWidth, thisHeight) {
							if ($(document).height() > $(window).height()) {
								return;
							} else {
								_this.css({
									'margin': (windowWidth - thisWidth) / 2 + ' auto'
								});
							}
						});
						break;
					case 'right':
						aligning(function(thisWidth, thisHeight) {
							_this.css({
								'margin': (windowHeight - thisHeight) / 2 + 'px 0 0 ' + (windowWidth - thisWidth) + 'px'
							});
						});
						break;
					case 'bottom':
						aligning(function(thisWidth, thisHeight) {
							_this.css({
								'margin': (windowHeight - thisHeight) + 'px auto 0'
							});
						});
						break;
					case 'left':
						aligning(function(thisWidth, thisHeight) {
							_this.css({
								'margin': (windowHeight - thisHeight) / 2 + 'px 0 0 0'
							});
						});
						break;
				}
			}

			function aligning(callback) {
				// var thisWidth = _this.outerWidth(),
				// 	thisHeight = _this.outerHeight();
				$(window).resize(function() {
					thisWidth = _this.outerWidth();
					thisHeight = _this.outerHeight();
					return callback(thisWidth, thisHeight)
				});
				return callback(thisWidth, thisHeight);
			}
		}
	});
	var textCountSettings = {
		countId: "icer_text_count_id",
		totalCount: 500,
		process: false
	};


	// 扩展ajax函数,用于处理返回code信息
	$.extend({
		//移动端滚动到底部加载插件
		// collideLoading: function(options) {
		//  options = $.extend({
		//      onScrollBottom: function() {}
		//  }, options);
		//  $(window).scroll(function() {
		//      var availHeight = $(window).height(),
		//          scrollTop = $(window).scrollTop(),
		//          docHeight = $(document).height();
		//      if (availHeight==docHeight&&scrollTop==0) {
		//          return;
		//      }else{
		//          if (availHeight + scrollTop >= docHeight) {
		//              options.onScrollBottom();
		//          }
		//      }
		//  });
		// },
		collideLoading: function(options) {
			options = $.extend({
				onScrollBottom: function() {
					alert('已触发底部但没有任何操作')
				}
			}, options)
			window.onscroll = function() {
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
				console.log(docHeight);
			}
		},
		remResizing: function(options) {
			options = $.extend({
				fontsize: 16,
				minwidth: 320,
				maxwidth: 0,
				aligncenter: true,
				forcePortrait:false,
				forceLandescape:false
			}, options);
			var htmlEl = $('html'),
				bodyEl = $('body'),
				windowWidth = $(window).width(),
				windowHeight = $(window).height();

			sizeConstraint();

			$(window).resize(function() {
				sizeConstraint();
			});

			function sizeConstraint() {
				if(options.forcePortrait){
					orientationSensor({
						portrait:function(){
							windowWidth = $(window).width(),
							windowHeight = $(window).height();
						},
						landscape:function(){
							windowWidth = $(window).height(),
							windowHeight = $(window).width();
						}
					});
				}else if(options.forceLandescape){
					orientationSensor({
						portrait:function(){
							windowWidth = $(window).width(),
							windowHeight = $(window).height();
						},
						landscape:function(){
							windowWidth = $(window).height(),
							windowHeight = $(window).width();
						}
					});
				}else{
					windowWidth = $(window).width(),
					windowHeight = $(window).height();
				}

				var factor = 0;
				// alert(windowWidth)
				if (options.minwidth == 0) {
					//alert('当最小宽度等于0时')
					bodyEl.css({
						'width': windowWidth
					});
					factor = 1;
				} else if (options.minwidth != 0 && windowWidth <= options.minwidth) {
					// alert('当最小宽度不等于0且屏幕宽度小于等于最小宽度时')
					bodyEl.css({
						'width': options.minwidth,
						'height': 'auto'
					});
					factor = 1;
				} else if (options.maxwidth == 0 || windowWidth > options.minwidth && windowWidth <= options.maxwidth) {
					//alert('当屏幕宽度大于最小宽度且小于最大宽度，或没有最大宽度时')
					bodyEl.css({
						'width': windowWidth
					});
					//alert(windowWidth)
					// factor = 2;
					factor = windowWidth / options.minwidth;
					//alert(factor = windowWidth / options.minwidth)
				} else if (windowWidth > options.maxwidth) {
					//alert('当屏幕宽度大于最大宽度时')
					if (!options.aligncenter) {
						bodyEl.css({
							'margin': '0 auto'
						})
					} else {
						bodyEl.css({
							'margin': '0 auto',
							'width': options.maxwidth
						})
					}
					factor = 1
				} else {
					alert('abnormal')
				}
				htmlEl.css('font-size', options.fontsize * factor);
			}
			//屏幕方向探测器
			function orientationSensor(callback) {
				var windowWidth = $(window).width(),
					windowHeight = $(window).height(),
					orientation = '';
				checkoritation();
				$(window).resize(function() {
					checkoritation();
				});

				function checkoritation() {
					if (typeof(callback) == 'undefined') {
						callback = {
							portrait: function() {},
							landscape: function() {}
						}
					} else {
						if (windowWidth < windowHeight) {
							return callback.portrait();
						} else {
							return callback.landscape();
						}
					}
				}
				console.log((windowWidth < windowHeight) ? orientation = 'portrait' : orientation = 'landscape')
				return (windowWidth < windowHeight) ? orientation = 'portrait' : orientation = 'landscape';
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