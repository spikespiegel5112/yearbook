/*!
 * =====================================================
 * SOUL v1.0.0 (http://www.yearbook.com.cn)
 * =====================================================
 */
/**
 * Copyright 2015, Wuxi SOUL.
 * 
 */
!(function($, window){
	'use strict';

	var __Msg = {
			showLoadingImg : function(){
				if ($('#index_loadingimg').length <= 0) {
					$(document.body).prepend('<div id="index_loadingimg" class="loadingimg" style="display: none;"><img src="img/loading5.gif" /></div>');
				}
				if ($('#index_loadinglayer').length <= 0) {
					$(document.body).prepend('<div id="index_loadinglayer" class="loadinglayer" style="display: none;"></div>');
				}
				$("#index_loadingimg").show();
				$("#index_loadinglayer").show();
			},
			
			hideLoadingImg : function (){
				if ($('#index_loadingimg').length > 0){
					$("#index_loadingimg").hide();
				}
				if ($('#index_loadinglayer').length >0) {
					$("#index_loadinglayer").hide();
				}
			},
	
			showLoadBar : function(msg){
				$.SureMsg.showLoadingImg();
			},
			
			hideLoadBar : function() {	
				$.SureMsg.hideLoadingImg();
			},


			confirm : function(msg, ok, can) {
				art.dialog({
				    content: msg,
				    ok: ok,
				    cancelVal: '取消',
				    cancel: can //为true等价于function(){}
				});
			},

			alert : function(msg, callbackFn) {
				art.dialog({
				    content: msg,
				    lock : true,
				    ok: callbackFn
				});
			},

			info : function(title, msg, callbackFn) {
				art.dialog({
					title : title || "",
					content : msg,
					lock : true,
					ok : function() {
						if (callbackFn instanceof Function) {
							callbackFn();
						}
					}
				});
			},

			showErrorInfo : function(title, msg, callbackFn) {
				art.dialog({
					title : title,
					content : msg,
					lock : true,
					ok : function() {
						if (callbackFn instanceof Function) {
							callbackFn();
						}
					}
				});
			},

			showNormalInfo : function(title, msg, callbackFn) {
				var args = "String.format(msg,";
				for ( var i = 2; i < arguments.length; i++) {
					if (i == arguments.length - 1)
						args += 'arguments[' + i + ']';
					else
						args += 'arguments[' + i + '],';
				}
				args += ")";
				var showStr = '';
				try {
					showStr = eval(args);
				} catch (error) {
					showStr = msg;
				}
				art.dialog({
					title : title,
					content : showStr,
					lock : true,
					ok : function() {
						if (callbackFn instanceof Function) {
							callbackFn();
						}
					}
				});
			},

			parseResponse : function(response, callbackFn) {
				var me = this,errorJson = null;
				var errorMsg = response.responseText;
				if (response.hasOwnProperty("responseJSON")){
					errorJson = response.responseJSON;
				}else{
					try{
						errorJson = eval("(" + errorMsg + ")");
					}catch(error){
						if(window.console){
							console.log(error);
						}
					}
				}
				if (errorJson != null) {
					me.showErrorInfo("错误", SureError.parseErrorMsg(errorJson), callbackFn);
				} else if (errorMsg.length > 0) {
					me.showErrorInfo("错误", errorMsg, callbackFn);
				} else if (errorMsg.length == 0) {
					me.showErrorInfo(response.status, response.statusText, callbackFn);
				}
			},

			showWarningInfo : function(msg, ok, can) {
				art.dialog({
				    content: msg,
				    lock : true,
				    ok: ok,
				    cancelVal: '取消',
				    cancel: can //为true等价于function(){}
				});
			}

	};

	window.SureMsg = __Msg;
}(jQuery, window));


/**
 * Created by xingweiwei on 15/6/19.
 */
(function($, window) {

	'use strict'

	//默认隐藏标题，自动处理成 XXX...
	//全文自动设置为 title属性
	$.fn.extend({
		init_title: function() {
			$(this).each(function() {
				var sv = "";
				var __div = $(this);
				var max_length = __div.attr("max-length");
				if (max_length === undefined)
					max_length = 20;

				var value = __div.html();

				if (value.length > max_length) {
					var start = value.substr(0, max_length - 4);
					var end = value.substr(max_length - 1, 1)
					sv = start + "...";

					__div.html(sv);
					__div.attr('title', value);
				}

			});
		},

		//滚动距离顶部一定距离后固定在屏幕上方
		scrollFixedTools: function(offset) {
			window.onscroll = function() {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > offset) {
					this.attr('id', 'scrolltop_fixed');
					this.css({
						'position': 'fixed',
						'top': '0',
						'z-index': '99'
					});
					$('body').css('padding', '170px 0 0 0');
				} else {
					this.attr('id', '');
					this.css({
						'position': 'relative'
					});
					$('body').css('padding', '0');
				}
			}
		},
		//回到顶部
		scrollToTop: function(offset) {
			$('.scrolltop_item .more_btn').click(function() {
				var $this = $(this);
				if ($this.find('span').hasClass('rotateto225')) {
					$this.find('span').removeClass('rotateto225').addClass('rotatefrom225');
					$this.prev().stop().animate({
						height: '0'
					});
				} else {
					$this.find('span').removeClass('rotatefrom225').addClass('rotateto225');
					$this.prev().stop().animate({
						height: '285px'
					});
				}
			});
			$(window).scroll(function() {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > 300) {
					$('.scrolltop_item').stop().fadeIn();
				} else {
					var morebtn = $('.scrolltop_item .more_btn');
					$('.scrolltop_item').stop().fadeOut();
				}
			});
			$('.scrolltop_item .gotop_btn').click(function() {
				$('html,body').animate({
					scrollTop: '0px'
				}, 200);
			});
		},
		//联系我们浮动菜单
		suspendMenu: function(offset) {
			/*var popupEl=$('.cus_popup_item');
			var popopFlag=false;
			$('.contactus_suspend_item .more_btn').click(function() {
				var $this = $(this);
				if ($this.find('span').hasClass('rotateto225')) {
					$('.cus_popup_wrapper>div').fadeOut();
					$this.find('span').removeClass('rotateto225').addClass('rotatefrom225');
					$this.prev().stop().animate({
						height: '0'
					});
				} else {
					$this.find('span').removeClass('rotatefrom225').addClass('rotateto225');
					$this.prev().stop().animate({
						height: '320px'
					});
				}
			});*/
			$(window).scroll(function() {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > 300) {
					$('.gotop_btn').stop().fadeIn().css('display', 'block');
				} else {
					$('.gotop_btn').stop().fadeOut();
				}
			});
			$('.toolbar_tabs .gotop_btn').click(function() {
				$('html,body').animate({
					scrollTop: '0px'
				}, 200);
			});
			$('#suggest_btn').click(function() {
					art.dialog({
						title: '意见反馈',
						lock: true,
						content: document.querySelector('.feedback_container_float'),
						okVal: '发送',
						ok: function() {},
						cancelVal: '取消',
						cancel: function() {},
					});
				})
				/*$('.cus_tool_wrapper li').click(function(){
					var $this=$(this);
					var index=$this.index();
					var thisPopupEl=$('.cus_popup_wrapper .cus_popup_item').eq(index);
					if($('.cus_popup_wrapper .cus_popup_item').eq(index).is(':visible')){
						thisPopupEl.hide();
						popopFlag=false;
					}else{
						popupEl.hide();
						$this.find('a').addClass('active').end().siblings().find('a').removeClass('active');
						thisPopupEl.show().css('margin-top',80*index+55);
						popopFlag=true;
					}
				});
				$('.cus_suggestion_submit_wrapper>input[type=submit]').click(function(){
					$('.cus_popup_wrapper .cus_popup_item').eq(3).hide();
				});*/
		},
		//footer自动贴底效果，任意调整浏览器窗口高度都可以自动贴底，同时让页面主体内容垂直居中
		footerAlignBottom: function() {
			var $this = $(this);
			realign();
			$(window).resize(function() {
				realign();
			});

			function realign() {
				var availHeight = $(window).height();
				var thisHeight = $this.height();
				var loginMargin = availHeight - 210 - thisHeight;
				if (loginMargin > 0) {
					$this.css({
						'margin-top': loginMargin / 2,
						'margin-bottom': loginMargin / 2,
					});
					$('.footer').css('position', 'absolute');
				} else if (loginMargin < 0) {
					$this.css({
						'margin-top': 0,
						'margin-bottom': 0,
					});
				}
			}
		},
		//banner双向滑动效果
		toolsSlide: function(bsContainer, bsInner, arrowLeft, arrowRight, liPadding) {
			var $this = $(this);
			var thisLi = $this.find('li');
			var thisLiWidth = $this.find('li').width();
			var thisUl = $this.find('ul');
			var thisUlWidth = thisUl.width();
			var slideFlag = true;
			var liLength = $this.find('li').length;
			var flag = 0;
			var liCount = 0;

			var ulEl = function() {
				return $('<ul>' + thisUl.html() + '</ul>');
			}
			for (var i = 0; i < 2; i++) {
				$(bsInner).append(ulEl());
			};

			$(bsInner).find('ul').eq(0).addClass('prev');
			$(bsInner).find('ul').eq(2).addClass('next');

			sortUl();
			if (liLength > 4) {
				$(bsContainer).hover(function() {
					$(arrowLeft + ',' + arrowRight).show();
				}, function() {
					$(arrowLeft + ',' + arrowRight).hide();
				});
			} else {
				$(bsInner).css({
					width: (thisLiWidth + 50) * liLength
				});
			}
			$(arrowRight).click(function() {
				liCount++;
				var ulLength = $(bsInner).find('ul').length;
				if (slideFlag == true) {
					slideFlag = false;
					if (liCount >= 5) {
						$this.find('ul').stop().animate({
							'left': '+=' + thisLiWidth
						}, 'fast', 'swing', function() {
							$this.find('ul').eq(2).detach();
							$(bsInner).prepend(ulEl());
							sortUl();
							$(bsInner).find('ul').removeClass();
							$(bsInner).find('ul').eq(0).addClass('prev');
							$(bsInner).find('ul').eq(2).addClass('next');
							liCount = 0;
							slideFlag = true;
						});
					} else {
						$this.find('ul').stop().animate({
							'left': '+=' + thisLiWidth
						}, 'fast', 'swing', function() {
							slideFlag = true;
						});
					}
				}
			});
			$(arrowLeft).click(function() {
				liCount--;
				var ulLength = $(bsInner).find('ul').length;
				if (slideFlag == true) {
					slideFlag = false;
					if (liCount <= -5) {
						$this.find('ul').stop().animate({
							'left': '-=' + thisLiWidth
						}, 'fast', 'swing', function() {
							$this.find('ul').eq(2).detach();
							$(bsInner).append(ulEl());
							sortUl();
							$(bsInner).find('ul').removeClass();
							$(bsInner).find('ul').eq(0).addClass('prev');
							$(bsInner).find('ul').eq(2).addClass('next');
							liCount = 0;
							slideFlag = true;
						});
					} else {
						$this.find('ul').stop().animate({
							'left': '-=' + thisLiWidth
						}, 'fast', 'swing', function() {
							slideFlag = true;
						});

					}
				}
			});

			function sortUl() {
				var ulLength = $(bsInner).find('ul').length;
				for (var i = 0; i < ulLength; i++) {
					$this.find('ul').eq(i).css({
						'left': (thisUlWidth) * (i - 1)
					});
				}
			}
		},
		carousel: function(options) {
			var $this = $(this);
			var thisUl = $this.find('ul');
			var availWidth = $(window).width();
			var liWidth = availWidth;
			var carouselLi = $this.find('.ybindex_carousel_item');
			var liLength = $this.find('li').length;
			var liCount = 0;
			var slideFlag = true;
			var pagination = 0;
			var paginationEl = $('.carousel_pagination_wrapper div')
			var ulEl = function() {
				return $('<ul>' + thisUl.html() + '</ul>');
			}

			carouselLi.css({
				'width': liWidth
			})
			options = $.extend({
				arrowLeft: 'carousel_arrow_left',
				arrowRight: 'carousel_arrow_right',
			}, options);
			$this.css({
				'width': liWidth,
				'height': '550px',
				'position': 'relative',
				'overflow': 'hidden'
			});
			for (var i = 0; i < 2; i++) {
				$this.append(ulEl());
			};
			for (var i = liLength; i >= 0; i--) {
				$('.carousel_pagination_wrapper div').css({
					'width': 15 * (liLength * 2)
				}).append('<a href="javascript:;"><span></span></a>');
			};
			paginationEl.find('a').eq(0).addClass('active');
			sortUl();
			$this.children('a').click(function() {
				if ($(this).index() == 0 && slideFlag == true) {
					slideFlag == false;
					liCount++;
					if (liCount >= liLength) {
						$this.append($(this).find('ul').eq(0));
						sortUl();
						liCount = 0;
					}
					$this.find('ul').stop().animate({
						'left': '-=' + $(window).width()
					}, 'fast', 'swing', function() {
						slideFlag = true;
					});
					pagination = Math.abs(liCount);
					paginationEl.find('a').removeClass('active');
					paginationEl.find('a').eq(pagination - 1).addClass('active');
				} else if ($(this).index() == 1 && slideFlag == true) {
					slideFlag == false;
					liCount--;
					if (liCount <= -liLength) {
						$this.prepend($(this).find('ul').eq(2));
						sortUl();
						liCount = 0;
					}
					$this.find('ul').stop().animate({
						'left': '+=' + $(window).width()
					}, 'fast', 'swing', function() {
						slideFlag = true;
					});
					pagination = Math.abs(liLength / 3 - liCount);
					paginationEl.find('a').removeClass('active');
					paginationEl.find('a').eq(pagination - 1).addClass('active');
				}
			})


			function sortUl() {
				for (var i = 0; i < $this.find('ul').length; i++) {
					$this.find('ul').eq(i).css({
						'width': liWidth * liLength,
						'position': 'absolute',
						'left': liWidth * liLength * (i - 1)
					});
				};
				$this.find('ul').eq(0).addClass('prev');
				$this.find('ul').eq(1).addClass('active');
				$this.find('ul').eq(2).addClass('next');
			}

		},
		loading: function(options) {
			var $this = $(this);
			options = $.extend({
				autodestroy: false,
				duration: 0,
				img: 'img/dynamicloading_100_55.gif',
				text: 'loading',
				style: 'dynamicloading',
				background: '#fff',
				initiation: function() {
					var loadingHTML = $("<div class='" + options.style + "'><div><img src=" + options.img + "><label>" + options.text + "</label></div></div>");
					var thisWidth = $this.width();
					var thisHeigt = $this.height();
					$this.css('position', 'relative');
					loadingHTML.css({
						'width': thisWidth,
						'height': thisHeigt
					});
					loadingHTML.find('img').css({
						'display': 'block'
					});
					loadingHTML.find('label').css({
						'display': 'block'
					});
					if (options.style == 'dynamicloading') {
						loadingHTML.css({
							'background': options.background,
							'position': 'absolute',
							'top': '0px',
							'z-index': '99999'
						});
						loadingHTML.find('img').css({
							'margin': (thisHeigt / 2 - 45) + 'px auto 0'
						});
						loadingHTML.find('label').css({
							'margin': '30px 0 0 0',
							'text-align': 'center'
						});
					}
					$this.append(loadingHTML);
				}
			}, options);

			if (typeof(options) == 'string') {
				switch (options) {
					case 'destroy':
						$('.' + options.style).fadeOut();
						setTimeout(function() {
							$('.' + options.style).detach();
						}, 1000);
						break;
					default:
						break;
				}
			} else if (options.duration > 0) {
				options.initiation();
				setTimeout(function() {
					$('.' + options.style).fadeOut();
					setTimeout(function() {
						$('.' + options.style).detach();
					}, 1000);
				}, options.duration);
			} else {
				options.initiation();
			}
			return this;
		},
		showLoadingImg: function(options) {
			var options = {
				loadmsg: '小忆拼命加载中'
			}
			if ($('#index_loadingimg').length <= 0) {
				$(document.body).prepend('<div id="index_loadingimg" class="loadingimg" style="display: none;"><span class="loadingimg_roundborder"><img src="img/dynamicloading_100_55.gif" /><label>' + options.loadmsg + '</label></span></div>');
			}
			if ($('#index_loadinglayer').length <= 0) {
				$(document.body).prepend('<div id="index_loadinglayer" class="loadinglayer" style="display: none;"></div>');
			}
			$(this).each(function() {
				$(this).click(function() {
					$("#index_loadingimg").show();
					$("#index_loadinglayer").show();
				})
			})
		},
		loginPopupDialog: function() {
			$(this).each(function() {
				$(this).click(function() {
					$('.loginpopup_container').addClass('active');
				})
				$('.loginpopup_header_wrapper a').click(function() {
					$('.loginpopup_container').removeClass('active');
				})
			})
		},
		priceCalculator: function(options) {
			var $this = $(this),
				totalPriceArr = [],
				config = {
					unitprice: '',
					subtotal: '',
					totalprice: '',
					onchange: function() {}
				};
			if (options) {
				$.extend(config, options)
			};
			init($this);
			$.each($this, function(index) {
				var $this = $(this),
					counterEl = $this.find('input');
				$this.find('a').on('click', function() {
					var counter = counterEl.val();
					switch ($(this).index()) {
						case 0:
							counter--;
							if (counter < 0) {
								counter = 0;
							}
							break;
						case 2:
							counter++;
							break;
					}
					counterEl.val(counter);
					setter(index, counter);
					config.onchange();
					fireOnchange(counterEl);
				})
				counterEl.on('keydown keyup', function(e) {
					var $this = $(this),
						counter = 0,
						keycode = e.charCode ? e.charCode : e.keyCode;
					switch (e.type) {
						case 'keydown':
							if (keycode != 8 && keycode != 37 && keycode != 39 && keycode < 48 || keycode > 57 && keycode < 96 || keycode > 105) {
								e.preventDefault();
							} else if (keycode != 37 && keycode != 39) {
								$this.val() != 0 ? $this.val() != 0 : $this.val('');
							}
							break;
						case 'keyup':
							counter = counterEl.val();
							setter(index, counter);
							config.onchange();
							fireOnchange(counterEl);
							break;
					}
				})
			});

			function getUnitprice(index) {
				var unitPrice = $(config.unitprice).eq(index).text().replace("￥", '');
				return unitPrice;
			}

			function setter(index, counter) {
				var result = getUnitprice(index) * counter;
				$(config.subtotal).eq(index).html(parseFloat(result).toFixed(2));
				totalprice(index, result)
			}

			function totalprice(index, price) {
				totalPriceArr[index] = price;
				var totalPrice = 0;
				for (var i = totalPriceArr.length - 1; i >= 0; i--) {
					totalPrice += totalPriceArr[i];
				};
				$(config.totalprice).html(parseFloat(totalPrice).toFixed(2));
			}

			function init(_this) {
				var length = _this.length;
				$.each(_this, function(index) {
					var val = _this.eq(index).find('input').val();
					setter(index, val)
				});
			}

			function fireOnchange(_this) {
				_this.trigger('onchange');
			}
		}
	});

	$.extend({
		globalhint: function() {
			$('.globalhint_close_btn').click(function() {
				$('.globalhint_wrapper').fadeOut('fast');
			});
		}
	})
	$('.manage_tab').toolsSlide('.bannerslider_container', '.manage_tab .bannerslider_inner', '.manage_tab .bs_arrowbtn_left', '.manage_tab .bs_arrowbtn_right', 40);
	$('.hide_title').init_title();

	$('.bannerslider_wrapper').toolsSlide('.bannerslider_wrapper', '.ybbanner_wrapper .bannerslider_inner', '.ybbanner_wrapper .bs_arrowbtn_left', '.ybbanner_wrapper .bs_arrowbtn_right', 40);

	// setTimeout(function(){
	// 	$('.ybbanner_wrapper').loading('destroy');
	// },5000)
	// $('.ybindex_carousel_wrapper').carousel();

})(jQuery, window);

/**
 * 检查运行环境
 * 使用方法
 *
 *  $.os.android
 *  $.os.version
 */
(function ($, window) {

    function detect(ua) {
        this.os = {};
        var lowua = ua.toLowerCase();
        var funcs = [

            function () {//检查是否移动端和PC端
                this.os.mobile = !!ua.match(/AppleWebKit.*Mobile.*/);
                return false;
            },

            /**
             * 检查浏览器的语言
             */
                function () {
                this.os.language = (navigator.browserLanguage || navigator.language).toLowerCase();
            },

            /**
             * 检查内核版本
             */
                function () {
                //IE内核
                this.os.trident = ua.indexOf('Trident') > -1;
                //opera内核
                this.os.presto = ua.indexOf('Presto') > -1;
                //苹果、谷歌内核
                this.os.webKit = ua.indexOf('AppleWebKit') > -1;
                //火狐内核
                this.os.gecko = ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1;

                //ios终端
                this.os.ios = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                //android终端或者uc浏览器
                this.os.android = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;
                //是否为iPhone或者QQHD浏览器
                this.os.iPhone = ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1;
                //是否iPad
                this.os.iPad = ua.indexOf('iPad') > -1;
                //是否web应该程序，没有头部与底部
                this.os.webApp = ua.indexOf('Safari') == -1;
            },

            /**
             * 检查微信环境
             */
                function () { //wechat
                var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
                if (wechat) { //wechat
                    this.os.wechat = {
                        version: wechat[2].replace(/_/g, '.')
                    };
                }
            },

            /**
             * 检查android文件
             */
                function () { //android
                var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
                if (android) {
                    this.os.android = true;
                    this.os.version = android[2];

                    this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
                }
                return this.os.android === true;
            },

            /**
             * 检查iOS
             */
                function () { //ios
                var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
                if (iphone) { //iphone
                    this.os.ios = this.os.iphone = true;
                    this.os.version = iphone[2].replace(/_/g, '.');
                } else {
                    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
                    if (ipad) { //ipad
                        this.os.ios = this.os.ipad = true;
                        this.os.version = ipad[2].replace(/_/g, '.');
                    }
                }
                return this.os.ios === true;
            },

            /**
             * 检查火狐
             * @returns {boolean}
             */
                function () { //火狐
                var firefox = lowua.match(/firefox\/([\d.]+)/);
                if (firefox) {
                    this.os.firefox = true;
                    this.os.version = firefox[1];
                }
                return this.os.firefox === true;

            },

            /**
             * 检查IE
             * @returns {boolean}
             */
                function () { //IE
                var ie = lowua.match(/msie ([\d.]+)/);
                if (ie) {
                    this.os.ie = true;
                    this.os.version = ie[1];
                }
                return this.os.ie === true;

            },

            /**
             * 检查谷歌
             * @returns {boolean}
             */
                function () { //chrome
                var chrome = lowua.match(/chrome\/([\d.]+)/);
                if (chrome) {
                    this.os.chrome = true;
                    this.os.version = chrome[1];
                }
                return this.os.chrome === true;

            },

            /**
             * 检查Safari
             * @returns {boolean}
             */
                function () { //safari
                var safari = lowua.match(/version\/([\d.]+).*safari/);
                if (safari) {
                    this.os.safari = true;
                    this.os.version = safari[1];
                }
                return this.os.safari === true;

            }


        ];
        [].every.call(funcs, function (func) {
            return !func.call($);
        });
    }

    detect.call($, navigator.userAgent);

}(jQuery, window));


;
(function($) {

	// Jquery ajax请求时，用传统方式组装参数。设置此值后，参数不能传嵌套数组
	jQuery.ajaxSettings.traditional = true;

	window.BaseData = {
		path: "", // 项目的根路径
		imgUrl: "",
		curUri: null, // 当前页面请求地址
		backUri: null, // 点击返回按钮执行的请求
		tmpPath: "tmp",
		dialog_req: "DIALOG_REQ", //标记此次请求是弹出框发送的请求，controller返回callback(closeDialog(), response)格式的数据
		userId: "USER_ID",
		userMobile: "USER_MOBILE",
		nickName: "NICK_NAME",
		cityName: "CITY_NAME",
		lastOrderMobile: "LAST_ORDER_MOBILE", //上次订单的联系手机号码
		lastOrderNum: "LAST_ORDER_NUM", //上次订单的预定人数
		isNeedPromptCityName: "IS_NEED_PROMPT_CITYNAME",
		lat: "LAT",
		lng: "LNG",
		returnUrl: "RETURN_URL",
		wxAppid: "wxb5b9cbfeea81cf36",
		wxRepAppid: "wxb27de4938f158826",
		userInfo: null,
		validateObj: null, //验证框架返回的对象
		c_time: new Date(), // 客户端当前时间
		time_out: 30, // session连接超时时间（分钟）
		submit_form: false, // 登录成功后需要链式请求的form表单
		callBack: false, // ajax登录成功后需要执行的函数
		suc: "0", // 请求返回成功的标识
		init: function(init_data) {
			//初始化数据
			if (init_data) {
				if (init_data.path)
					BaseData.path = init_data.path;
				if (init_data.imgUrl)
					BaseData.imgUrl = init_data.imgUrl;
				if (utils.isString(init_data.curUri))
					BaseData.curUri = init_data.curUri;
				if (utils.isString(init_data.backUri))
					BaseData.backUri = init_data.backUri;
			}
			BaseData.c_time = new Date();
			//BaseData.submit_form = false;
			BaseData.callBack = false;
		}
	};

	window.utils = {
		extend: function(target, source) {
			for (var p in source) {
				if (source.hasOwnProperty(p)) {
					target[p] = source[p];
				}
			}
			return target;
		},
		loadJs: function(url, callback) {
			var done = false;
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.language = 'javascript';
			script.src = url;
			script.onload = script.onreadystatechange = function() {
				if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
					done = true;
					script.onload = script.onreadystatechange = null;
					if (callback) {
						callback.call(script);
					}
				}
			};
			document.getElementsByTagName("head")[0].appendChild(script);
		},
		runJs: function(url, callback) {
			loadJs(url, function() {
				document.getElementsByTagName("head")[0].removeChild(this);
				if (callback) {
					callback();
				}
			});
		},
		loadCss: function(url, callback) {
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.media = 'screen';
			link.href = url;
			document.getElementsByTagName('head')[0].appendChild(link);
			if (callback) {
				callback.call(link);
			}
		},
		obtainEvent: function() {
			// 获取事件的对象
			var e = window.event ? window.event : null;
			if (!e) {
				var fun = utils.obtainEvent.caller;
				while (fun) {
					// Firefox 中一个隐含的对象 arguments，第一个参数为 event 对象
					var arg0 = fun.arguments[0];
					if (arg0 && ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof arg0 === "object" && arg0.preventDefault && arg0.stopPropagation))) {
						e = arg0;
						break;
					}
					fun = fun.caller;
				}
			}
			return e;
		},
		obtainEventSrc: function() {
			var e = utils.obtainEvent();
			return e ? e.srcElement ? e.srcElement : e.target : null;
		},
		isParamUrl: function(url) {
			// 判断指定的URL是否带参数
			if (url) {
				var index = url.indexOf("?");
				if (index != -1) {
					url = url.substring(index + 1);
					if (url.length > 0)
						return true;
				}
			}
			return false;
		},
		/**
		 * 获取url参数，组装成对象
		 *
		 * @param url
		 *            不传默认使用当前地址 xxx.xxx.xxx?name=wang&age=100 ==> {name:
		 *            "wang", age: "100"}
		 */
		getUrlParams: function(url) {
			url = url || window.location.href;
			var data = {},
				index = url.indexOf("?");
			if (index != -1) {
				url = url.substring(index + 1);
				var params = url.split("&");
				for (var i = 0; i < params.length; i++) {
					var obj = params[i].split("=");
					data[obj[0]] = obj[1] ? encodeURIComponent(obj[1]) : obj[1];
				}
			}
			return data;
		},

		addUrlParams: function(url, name, value) {
			if (!utils.isString(url) || !name)
				return url;
			if (url) {
				// 标示此请求为历史请求
				if (url.lastIndexOf("?") == -1)
					url += "?";
				else if (url.lastIndexOf("?") < url.length - 1)
					url += "&";
				url += name + (utils.isUndefined(value) ? "" : "=" + value);
			}
			return url;
		},
		regex: function(val, regex, mod) {
			if (!utils.isString(val)) return false;
			if (typeof regex === "string")
				return new RegExp(regex, mod || "").test(val);
			return regex.test(val);
		},
		// 获取文件类型
		fileType: function(file) {
			return file && file.substring(file.lastIndexOf(".") + 1).toLowerCase();
		},
		// 获取文件名
		fileName: function(file) {
			if (!file)
				return file;
			var t = file.replace("\\", "/"),
				start = t.lastIndexOf("/"),
				end = t
				.lastIndexOf(".");
			return t.substring(start == -1 ? 0 : start + 1, end);
		},
		clone: function(obj) {
			if (obj === null || obj === undefined || typeof obj !== "object")
				return obj;
			var o = obj.constructor === Array ? [] : {};
			for (var i in obj) {
				o[i] = typeof obj[i] === "object" ? utils.clone(obj[i]) : obj[i];
			}
			return o;
		},
		// url 需要删除或增加的规则 ad/abc_r100c100_r50c50.jpg
		// mode == add || remove rule == r100c100
		imgUrlFormat: function(url, mode, rule) {
			if (!url || (url = $.trim(url)) === "" || !rule)
				return url;
			if (mode === 'remove') {
				return url.replace(new RegExp("_" + rule, "g"), "");
			} else if (mode === 'add') {
				return url
					.replace(
						new RegExp(
							"^((https?://)?(/|\\\\)?([^/\\\\]+(/|\\\\))*?[0-9a-z]+(_[0-9a-z]+)*)(\\.[a-z]+)$",
							"g"), "$1_" + rule + "$7");
			}
		},
		// 获取图片地址的原图
		imgUrlOriginal: function(url) {
			if (!url || (url = $.trim(url)) === "")
				return url;
			return url.replace(new RegExp("_[0-9a-z]+", "g"), "");
		},
		// 获取路径倒数第二个path
		url2ndEndPath: function(url) {
			var m = new RegExp(
					"^.*?(/|\\\\)([^/\\\\]+)(/|\\\\)[^/\\\\]+(/|\\\\)?$")
				.exec(url);
			return m && m[2];
		},
		isArray: function(val) {
			return Object.prototype.toString.call(val) === '[object Array]';
		},
		isFunction: function(val) {
			return Object.prototype.toString.call(val) === '[object Function]';
		},
		isUndefined: function(val) {
			return typeof(val) === "undefined";
		},
		isString: function(val) {
			return Object.prototype.toString.call(val) === '[object String]';
		},
		isNumber: function(val) {
			return Object.prototype.toString.call(val) === '[object Number]' && !isNaN(val);
		},
		//8.00 也视为int数据
		isInt: function(val) {
			return utils.isNumber(val) && parseInt(val) === val;
		},
		isBoolean: function(val) {
			return Object.prototype.toString.call(val) === '[object Boolean]';
		},
		isObject: function(val) {
			return Object.prototype.toString.call(val) === '[object Object]';
		},
		//转换数据为int类型，NaN转为0
		parseInt: function(val, radix) {
			if (utils.isString(val) && (val = val.trim()).length > 0) {
				var c = val.charAt(val.length - 1);
				if (c === '%') {
					val = parseFloat(val) / 100;
				} else if (c === '‰') {
					val = parseFloat(val) / 1000;
				}
			}
			val = parseInt(val, radix);
			if (isNaN(val)) val = 0;
			return val;
		},
		//转换数据为float类型，NaN转为0
		parseFloat: function(val) {
			if (utils.isString(val) && (val = val.trim()).length > 0) {
				var c = val.charAt(val.length - 1);
				if (c === '%') {
					val = parseFloat(val) / 100;
				} else if (c === '‰') {
					val = parseFloat(val) / 1000;
				}
			}
			val = parseFloat(val);
			if (isNaN(val)) val = 0;
			return val;
		},
		//获取参数val的值，如果val是函数则return函数的返回值，否则直接返回val
		val: function(val, defaultVal) {
			var tmp = val;
			if (utils.isFunction(tmp))
				tmp = tmp();
			if (utils.isUndefined(tmp) || tmp === null)
				tmp = defaultVal;
			return tmp;
		},
		/**
		 * 返回字符窜，如果val不能转化成数字，则返回0的格式化。digit为小数位数
		 *
		 * @param removeZero
		 *            boolean类型，默认值false
		 * @param roundMode
		 *            格式化类型，默认是"floor"
		 *            值为"ceil"(向上舍入)，"floor"(向下舍入)，"round"(四舍五入，当值为负数中间值"-0.5"时结果和java相反，)
		 *            例子： 1. utils.fmtDecimal(1.567, 2) 2.
		 *            utils.fmtDecimal(1.567, 2, "round") 3.
		 *            utils.fmtDecimal(1.567, 2, true) 1.
		 *            utils.fmtDecimal(1.567, 2, true, "floor")
		 */
		fmtDecimal: function(val, digit, removeZero, roundMode) {
			val = utils.parseFloat(val);
			digit = digit && digit > 0 ? digit : 0;
			if (utils.isString(removeZero)) {
				roundMode = removeZero;
				removeZero = false;
			}
			roundMode = roundMode ? roundMode : "floor";
			if (digit > 0)
				val = val * Math.pow(10, digit);
			switch (roundMode) {
				case "ceil":
					val = Math.ceil(val);
					break;
				case "floor":
					val = Math.floor(val);
					break;
				case "round":
					val = Math.round(val);
					break;
			}
			if (digit > 0)
				val = val / Math.pow(10, digit);
			if (removeZero)
				return val.toString();
			else
				return val.toFixed(digit);
		},
		/**
		 * 格式化整数，小数直接切割，不会进位。digit为整数位数
		 */
		fmtNumber: function(val, digit) {
			val = utils.parseInt(val).toString();
			if (!digit)
				return val;
			if (val.length < digit) {
				return "0".repeat(digit - val.length) + val;
			} else if (val.length == digit)
				return val;
			else {
				return val.substr(-digit);
			}
		},
		/**
		 * expression 对象导航表达式   例：utils.ognl({per: {name: "wang"}}, "per.name");
		 */
		ognl: function(obj, expression) {
			if (!obj || !expression) return null;
			var token = new StringToken(expression),
				key;

			function nextKey() {
				arrayQuotKey = false;
				var c, key = "";
				HEAD:
					while ((c = token.next()) != StringToken.NULL) {

						switch (c) {

							case '\\':
								key = key.concat(c).concat(token.next());
								break;
							case '.':
								break HEAD;

							case '[':
								if (key.length > 0) {
									token.back();
									break HEAD;
								}

								var inner;
								INNER:
									while ((inner = token.next()) != NULL) {

										switch (inner) {

											case ']':
												break INNER;
											case '\\':
												key = key.concat(inner).concat(token.next());
												break;
											case '"':
											case '\'':
												var inmost;
												INMOST:
													while ((inmost = token.next()) != NULL) {
														if (inmost == inner) {
															break INMOST;
														} else if (inmost == '\\')
															key = key.concat(inmost).concat(token.next());
														else
															key = key.concat(inmost);
													}
												break;
											default:
												key = key.concat(inner);
												break;
										}
									}
								break;
							default:
								key = key.concat(c);
								break;
						}
					}
				return key.trim();
			}
			while ((key = nextKey(true)) !== "") {
				if (!obj) return null;
				obj = obj[key];
			}
			return obj;
		},
		// 添加单位（默认px）
		addUnit: function(val, unit) {
			unit = unit || 'px';
			return val && new RegExp(regex.decemal).test(val) ? val + unit : val;
		},
		// 删除单位
		removeUnit: function(val) {
			var match;
			return val && (match = /(([\+-]?)\d*\.?\d+)/.exec(val)) ? utils
				.parseFloat(match[1]) : 0;
		},
		escape: function(val) {
			return val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(
				/>/g, '&gt;').replace(/"/g, '&quot;');
		},
		unescape: function(val) {
			return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(
				/&quot;/g, '"').replace(/&amp;/g, '&');
		},
		// 创建dom元素
		dom: function(domTag, id, className, css) {
			var element = document.createElement(domTag);
			if (id)
				element.id = id;
			if (css)
				element.style.cssText = css;
			if (className)
				element.className = className;
			return element;
		},
		// 创建dom元素jquery对象
		$dom: function(domTag, id, className, css) {
			return $(utils.dom(domTag, id, className, css));
		},
		//多个jq对象相加，自动处理为undefined、null的参数
		$add: function($raw, $add) {
			$raw = $raw ? $raw.jquery ? $raw : $($raw) : $raw;
			$add = $add ? $add.jquery ? $add : $($add) : $add;
			if (!$raw)
				return $add;
			else if (!$add)
				return $raw;
			else
				return $raw.add($add);
		},
		//获取html字符窜的属性值,没有指定属性返回null
		htmlAttrVal: function(html, attrKey) {
			var patt = new RegExp(attrKey + "\\s*=\\s*(('([^']*)')|(\"([^\"]*)\")|(([^'\"\\s>]*)[\\s>]))"),
				res = patt.exec(html);
			return res === null ? res :
				res[3] ? res[3] : res[5] ? res[5] : res[7] ? res[7] : "";
		},
		/**
		 * 获取指定Tag的自身tag标签代码,不包含子元素.dom可以是字符窜或dom元素
		 * excludeAttrs 需要排除的属性， 字符窜或数组
		 * addAttrs 添加的属性，当属性名是class、style时在原有属性上累加，不会替换之前的值，如果想替换需要在excludeAttrs中传入class、style。例子：{id: "1", "name": "name"}
		 */
		domShuck: function(dom, excludeAttrs, addAttrs) {
			dom = dom && dom.jquery ? dom.get(0) : dom;
			if (!dom) return;
			if (utils.isObject(excludeAttrs)) {
				addAttrs = excludeAttrs;
				excludeAttrs = null;
			} else if (!utils.isArray(excludeAttrs)) {
				excludeAttrs = [excludeAttrs];
			}
			var html = utils.isString(dom) ? dom : dom.outerHTML,
				token = new StringToken(html),
				assemble = "", //属性字符窜集合
				tag = "",
				curPropKey = "",
				curPropVal = "",
				propKeying = false, //正在解析属性名
				propValing = false, //正在解析属性值
				intactProp = false, //判断属性是否是完整的键值对
				propValEndChar = null,
				start = false,
				tagEnd = false,
				c;
			//          if(html) {
			//              //提取html最外层的tag
			//              var matchs = new RegExp("^\\s*(<\\s*(\\w+)[^>/]*(/\\s*)?>)([\\s\\S]*?(<\\s*/\\s*\\2\\s*>))?\\s*$", "i").exec(html);
			//              if(matchs && (matchs[3] || matchs[4]) && (!matchs[3] || !matchs[4])) {
			//                  tag = matchs[1] + (matchs[5] ? matchs[5] : "");
			//              }
			//          }
			//          //排除指定的属性
			//          if(tag && excludeAttrs.length > 0) {
			//              for(var i in excludeAttrs) {
			//                  if(excludeAttrs[i])
			//                      tag = tag.replace(new RegExp("\\s+" + excludeAttrs[i] + "\\s*=\\s*(('[^']*')|(\"[^\"]*\")|([^\\s'\">]*(?=\\s+\\w+=|\\s*/\\s*>)))"), " ");
			//              }
			//          }
			function operateProp() {
				var exclude = false;
				for (var i = 0; i < excludeAttrs.length; i++) {
					if (excludeAttrs[i] === curPropKey) {
						exclude = true;
						break;
					}
				}
				if (!exclude) {
					if (intactProp) {
						if (addAttrs) {
							if (curPropKey === "class" && addAttrs["class"]) {
								curPropVal += " " + addAttrs["class"];
								delete addAttrs["class"];
							} else if (curPropKey === "style" && addAttrs.style) {
								curPropVal += (curPropVal.length > 0 ? ";" : "") + addAttrs.style;
								delete addAttrs.style;
							}
						}
						propValEndChar = propValEndChar ? propValEndChar : '"';
						assemble += curPropKey + "=" + propValEndChar + curPropVal + propValEndChar + " ";
					} else {
						assemble += curPropKey + " ";
					}
				}
				intactProp = false;
				propValing = false;
				curPropVal = "";
				propValEndChar = null;
			}

			LOOP:
				while ((c = token.next()) != StringToken.NULL) {
					switch (c) {

						case '<':
							if (propValing) {
								curPropVal = curPropVal.concat(c);
							} else {
								start = true;
							}
							break;
						case '\\':
							if (propValing) {
								curPropVal = curPropVal.concat(c).concat(token.next());
							}
							break;
						case ' ':
							if (start && tag !== "") {
								if (!tagEnd) {
									tagEnd = true;
									break;
								} else if (propKeying) {
									propKeying = false;
									break;
								}
							} else {
								break;
							}
						case '>':
							//修改tagEnd标记，继续执行default代码
							tagEnd = !tagEnd && tag ? true : tagEnd;
						default:
							if (start) {
								if (tagEnd) {
									if ((!propValing || propValEndChar === ' ') && (c === "/" || c === ">")) {
										if (curPropKey) {
											operateProp();
											propKeying = false;
											curPropKey = "";
										}
										break LOOP;
									} else if (!propKeying && curPropKey === "") {
										if (c !== "=") {
											propKeying = true;
											curPropKey = curPropKey.concat(c);
										}
									} else if (propKeying) {
										if (c === "=") {
											intactProp = true;
											propKeying = false;
										} else {
											curPropKey = curPropKey.concat(c);
										}
									} else if (!propKeying && curPropKey !== "") {
										if (!intactProp) {
											if (c === "=") {
												intactProp = true;
											} else {
												operateProp();
												propKeying = true;
												curPropKey = c;
											}
										} else {
											if (!propValing && curPropVal === "") {
												propValing = true;
												if (c === '\'' || c === '"') {
													propValEndChar = c;
												} else {
													propValEndChar = ' ';
													curPropVal = curPropVal.concat(c);
												}
											} else if (propValing) {
												if (c === propValEndChar) {
													operateProp();
													propKeying = false;
													curPropKey = "";
												} else {
													curPropVal = curPropVal.concat(c);
												}
											}
										}
									}
								} else {
									tag = tag.concat(c);
								}
							}
							break;
					}
				}
			if (tag) {
				if (addAttrs) {
					for (var key in addAttrs) {
						if (addAttrs[key] === null || addAttrs[key] === undefined) {
							assemble += key + " ";
						} else {
							assemble += key + '="' + addAttrs[key] + '" ';
						}
					}
				}
				assemble = "<" + tag + " " + assemble + " ></" + tag + ">";
			}
			return assemble;
		},
		// 返回指定iframe dom对象的document对象
		iframeDoc: function(iframe) {
			return iframe.contentDocument || iframe.contentWindow.document;
		},
		// 验证指定对象是否绑定了指定类型的事件
		bindedEvent: function($obj, eventType, namespace) {
			var evts = $obj ? $obj.data("events") : null,
				binded = false;
			if (evts && evts[eventType]) {
				if (namespace) {
					for (var i = 0; i < evts[eventType].length; i++) {
						if (evts[eventType][i].namespace === namespace) {
							binded = true;
							break;
						}
					}
				} else
					binded = true;
			}
			return binded;
		},
		//防止过度频繁操作某个函数
		debounce: function(callback, delay) {
			if (!utils.isFunction(callback)) {
				return;
			}
			delay = delay || 100;
			var timeout;
			return (function() {
				if (timeout)
					clearTimeout(timeout);
				var _this = this;
				timeout = setTimeout(function() {
					callback.apply(_this, arguments);
				}, delay);
			});
		},
		lazyload: function() {
			if (!utils.bindedEvent($win, "scroll", "lazy")) {
				$win
					.bind(
						"scroll.lazy",
						function() {
							var elements = $("img[lazy!='loaded'],iframe[lazy!='loaded']");
							var scrollTop = $win.scrollTop();
							elements.each(function() {
								var element = $(this);
								if (($win.height() + scrollTop) >= $(
										this).offset().top) {
									element.attr("src", element
										.attr("lazy"));
									element.attr("lazy", "loaded");
								}
							});
						});
			}
		},
		/**
		 * @param ele
		 *            （必填参数）当window
		 *            scroll时，指定的HTML标签也跟着scroll，ele可以是dom对象或jquery对象，
		 * @param stops（可选参数）停止的相对位置（即当指定的元素到达stops对象时position改为static状态）
		 *            stops可以是dom元素、精确值(800px、800)、函数（函数返回精准值），精确值表示滑动对象的最底部到达页面上边缘的距离
		 * @param pos（可选参数）
		 *            精密调度位置例:{left: "900px", top: "10px"} 即滑动对象滑动时的位置
		 */
		scroll: function(ele, stops, pos) {
			if (!ele)
				return false;
			pos = pos || {};
			if (stops && (stops.left || stops.top)) {
				pos = stops;
				stops = null;
			}
			$(ele).each(function() {
				var $this = $(this);
				$this.data("init_pos", {
					top: $this.offset().top
				});
			});
			$win
				.bind(
					"scroll.follow",
					function() {
						var scrollTop = $win.scrollTop(),
							stopHeight;
						if (stops) {
							if (utils.isNumber(stops) || utils.isString(stops)) {
								stopHeight = utils.removeUnit(stops);
							} else if (utils.isFunction(stops)) {
								stopHeight = stops();
							} else if ($(stops).length > 0)
								stopHeight = $(stops).offset().top;
						}
						$(ele)
							.each(
								function() {
									var $this = $(this),
										init_pos = $this
										.data("init_pos");
									if (scrollTop >= init_pos.top && (!stopHeight || stopHeight > (scrollTop + $this
											.outerHeight()))) {
										$this
											.css({
												top: pos.top ? pos.top : '-' + $this
													.css("marginTop"),
												left: pos.left ? pos.left : "",
												position: "fixed"
											});
									} else if (stopHeight && stopHeight <= (scrollTop + $this
											.outerHeight())) {
										$this
											.css({
												top: stopHeight - scrollTop - $this
													.outerHeight(),
												left: pos.left ? pos.left : "",
												position: "fixed"
											});
									} else {
										$this.css({
											top: "",
											left: "",
											position: "static"
										});
									}
								});
					});
			$win.trigger("scroll.follow");
		},
		// 获取图片的宽度和高度,如果不能从url获取宽高，就只能动态加载图片，动态加载图片不能返回宽高，只能通过回调函数执行以后的操作
		imgWH: function(url, callback) {
			var match, _wh;
			if (!_wh) {
				_wh = (match = new RegExp("_[rt]([0-9]+)c([0-9]+)f\\.[a-z]+$")
					.exec(url)) ? {
					width: match[1],
					height: match[2]
				} : null;
			}
			if (!_wh) {
				_wh = (match = new RegExp(
						"_((d)|(td)|(rd)|(tb)|(rb))([0-9]+)c([0-9]+)\\.[a-z]+$")
					.exec(url)) ? {
					width: match[7],
					height: match[8]
				} : null;
			}

			if (_wh) {
				if (callback && utils.isFunction(callback))
					callback(_wh);
				return _wh;
			} else if (callback && utils.isFunction(callback)) {
				// 根据url规则获取不到宽高，且有回调函数时，会动态加载图片
				var img = new Image();
				img.src = url;
				img.onload = function() {
					callback({
						width: img.width,
						height: img.height
					});
				};
				return null;
			}
		},
		/**
		 * @param scale
		 *            指定是否等比缩放，默认是true。
		 *            scale=true时w、h出现0或非数字时则依据另一方的值，如果都为0，则返回原尺寸 scale=false
		 *            且w、h出现0或非数字时，则图片强制宽、高设置为0
		 * @param magnify
		 *            指定是否能够放大图片，默认是可以的true
		 */
		zoomImg: function(imgW, imgH, w, h, scale, magnify) {
			var zoomW, zoomH, magnify = magnify === false ? false : true,
				scale = scale === false ? false : true,
				imgW = utils.parseFloat(imgW),
				imgH = utils
				.parseFloat(imgH),
				w = utils.parseFloat(w),
				h = utils
				.parseFloat(h);
			if (scale) {
				if (!w && !h) {
					zoomW = imgW;
					zoomH = imgH;
				} else if (!w) {
					var scaleH = imgH / h;
					zoomH = h;
					zoomW = imgW / scaleH;
				} else if (!h) {
					var scaleW = imgW / w;
					zoomW = w;
					zoomH = imgH / scaleW;
				} else if (imgW <= w && imgH <= h && !magnify) {
					zoomW = imgW;
					zoomH = imgH;
				} else {
					var scaleW = imgW / w,
						scaleH = imgH / h;
					if (scaleW > scaleH) {
						zoomW = w;
						zoomH = imgH / scaleW;
					} else {
						zoomH = h;
						zoomW = imgW / scaleH;
					}
				}
			} else {
				zoomH = h;
				zoomW = w;
			}
			return {
				width: zoomW,
				height: zoomH
			};
		}
	};
	/**
	 * 正则表达式
	 */
	window.regex = {
		alpha: "^[A-Za-z]+$", // 字母
		alphanum: "^[A-Za-z0-9]+$", // 字母、数字
		alpha_u: "^[A-Z]+$", // 大写字母
		alpha_l: "^[a-z]+$", // 小写字母
		word: "^\\w+$", // 用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串

		num: "^\\d+$", // 只包含数字，不包含正负号

		integer: "^[\\+-]?\\d+$", // 整数（包括负数、0、正数）
		int_plus: "^\\+?[0-9]*[1-9][0-9]*$", // 正整数
		int_minus: "^-[0-9]*[1-9][0-9]*$", // 负整数
		int_no_minus: "^\\+?\\d+$", // 非负整数（正整数 + 0）
		int_no_plus: "^((-\\d+)|(0))$", // 非正整数（负整数 + 0）

		decemal: "^([\\+-]?)\\d*\\.?\\d+$", // 浮点数 或 整数(包含正负数)
		decemal_plus: "^\\+?((\\d*[1-9]\\d*\\.?\\d*)|(0+\\.\\d*[1-9]\\d*))$", // 正小数、正整数
		decemal_minus: "^-((\\d*[1-9]\\d*\\.?\\d*)|(0+\\.\\d*[1-9]\\d*))$", // 负小数、负整数
		decemal_no_plus: "^-\\d*\\.?\\d+$", // 非正小数、非正整数
		decemal_no_minus: "^\\+?\\d*\\.?\\d+$", // 非负小数、非负整数

		decemal_only: "^([\\+-]?)\\d*\\.\\d+$", // 只能是浮点数不能为整数(包含正负数)
		decemal_plus_only: "^\\+?((\\d*[1-9]\\d*\\.\\d*)|(0+\\.\\d*[1-9]\\d*))$", // 正小数
		decemal_minus_only: "^-((\\d*[1-9]\\d*\\.\\d*)|(0+\\.\\d*[1-9]\\d*))$", // 负小数
		decemal_no_plus_only: "^-\\d*\\.\\d+$", // 非正小数
		decemal_no_minus_only: "^\\+?\\d*\\.\\d+$", // 非负小数

		chinese: "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$", // 仅中文
		word_zh: "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D\\w\\s\\(\\)\\（\\）]+$", //中文、英文、下划线、数字、左右小括号
		mobile: "^(13[0-9]{9}|15[0-9]{9}|18[0-9]{9}|147[0-9]{8})$", // 手机
		idcard: "(^\\d{15}$)|(^\\d{17}(\\d|X)$)", // 身份证
		tel: "^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$", // 电话号码的函数(包括验证国内区号,国际区号,分机号)
		email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", // 邮件
		color: "^[a-fA-F0-9]{6}$", // 颜色
		url: "^((https?|ftp):\\/\\/)?(\\/?[-A-Za-z0-9.:]+)(\\/[-A-Za-z0-9+&@#\\/%=~_|!:,.;]*)?(\\?[A-Za-z0-9+&@#\\/%=~_|!:,.;]*)?$", // url
		ascii: "^[\\x00-\\xFF]+$", // 仅ACSII字符
		zipcode: "^\\d{6}$", // 邮编
		ip4: "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$", // ip地址
		empty: "^\\s*$", // 空白
		not_empty: "^\\S+$", // 非空
		picture: "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", // 图片
		rar: "(.*)\\.(rar|zip|7zip|tgz)$", // 压缩文件
		date: "^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$", // 日期
		qq: "^[1-9]*[1-9][0-9]*$", // QQ号码
		usernameEmal: "^[\\w\\.@]+$",
		bankCard: "^(\\d+)$", // 银行卡
		busInfo: "^[\\u2E80-\\u9FFF\\w]+([,，][\\u2E80-\\u9FFF\\w]+)*?$"
	};

	//为了重写jquery方法
	var $origin = {
		ajax: $.ajax,
		outerWidth: $.fn.outerWidth,
		outerHeight: $.fn.outerHeight
	};
	$.extend({
		/**
		 * code = warn/info/error
		 */
		alert: function(code, msg, fn) {
			if (utils.isFunction(fn))
				fn();
		},
		confirm: function(content, yes, no) {
			if (window.confirm) {
				if (utils.isFunction(yes))
					yes();
			} else {
				if (utils.isFunction(no))
					no();
			}
		}
	});

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

!(function($) {
    'use strict';

    $._sureInput_init = {};
    $._sureInput_save = {};
    $._sureInput_cancel = {};
    $._sureInput_selectDiv = {};

    $.fn.sureInput = function (options) {

        var defaultFunc = function(){};

        var defaults = {
            type : "input",
            init : defaultFunc,
            save : defaultFunc,
            cancel : defaultFunc
        };

        var options = $.extend(defaults, options);

        var divName = this.attr('class') ||  this.attr('id');
        $._sureInput_save[divName] =  options.save;
        $._sureInput_init[divName] =  options.init;
        $._sureInput_cancel[divName] =  options.cancel;

        var _getInput = function() {
            return  "<div class='user-input-commit-tool'><div class='user-input-wapper'>"+
                "<div class='user-input-group'> <div class='input-group'>"+
                "<input type='text' class='form-control' placeholder='请输入...' aria-describedby='basic-addon-send'>"+
                "<span class='input-group-addon' id='basic-addon-send'>确定</span> </div> </div> </div> </div>";
        };

        var _getTextarea = function() {
            return "<div class='user-input-commit-tool-multi'>" +
                "<div class='user-input-textarea'>" +
            "<textarea type='text' class='form-control' id='user-input-textarea-content' placeholder='请输入...'></textarea>" +
            "<a id='user-input-textarea-save' type='button' class='btn btn-default'>确定</a>" +
            "<a id='user-input-textarea-cancel' type='button' class='btn btn-default'>取消</a>" +
            "</div>" +
            "</div>";
        };

        var setTriLeft = function(left, direction) {
        	var triangleStyle;
        	if (direction == 'up')
        		triangleStyle = "border-bottom: 1em solid #f7f7f7; top: -2em;";
        	else
        		triangleStyle = " border-top: 1em solid #f7f7f7; top: 4.5em;";
            $('head style').remove();
            $('head').append("<style>.user-input-commit-tool .user-input-group:before{left: "+ left + ";" + triangleStyle + "} </style>");
        };


        if ($('.mask').length == 0) {
            $('body').append("<div class='mask opacity'></div>");
        }

        if (options.type === "input") {
            if ($('.user-input-commit-tool').length == 0) {
                $('body').append(_getInput());

                $('#basic-addon-send').on('click', function() {
                    _close();

                    var selectDiv = $._sureInput_selectDiv;
                    $._sureInput_save[selectDiv.attr('class') ||  selectDiv.attr('id')](_getVaule(), selectDiv);

                    inputDiv.val("");
                });

                $('.mask').on('click', function(){
                    _close();
                });

            }

        } else {
            if ($('.user-input-commit-tool-multi').length == 0) {
                $('body').append(_getTextarea());

                $('#user-input-textarea-save').on('click', function() {
                    _close();

                    var selectDiv = $._sureInput_selectDiv;
                    $._sureInput_save[selectDiv.attr('class') ||  selectDiv.attr('id')](_getVaule(), selectDiv);
                    inputDiv.val("");
                });

                $('#user-input-textarea-cancel').on('click', function() {
                    _close();
                    var selectDiv = $._sureInput_selectDiv;
                    $._sureInput_cancel[selectDiv.attr('class') ||  selectDiv.attr('id')]()
                    inputDiv.val("");
                });

                $('.mask').on('click', function(){
                    _close();
                });
            }

        }

        var showDiv = options.type === "input" ?  $('.user-input-commit-tool') : $('.user-input-commit-tool-multi');
        var inputDiv = options.type === "input" ? $('.user-input-commit-tool input') : $('.user-input-commit-tool-multi textarea') ;

        var _show = function () {
            $('.mask').show();
            showDiv.fadeIn();
        };

        var _close = function () {
            $('.mask').hide();
            showDiv.fadeOut();
        };

        var _getVaule = function() {
            return inputDiv.val();
        };

        return $(this).each(function() {

            var $this = $(this);

            $this.on('click', function () {
                divName = $this.attr('class') ||  $this.attr('id');

                if (options.type === "input") {
                	var inputChange;
                	var direction = 'up';
                    var offset = $(this).offset();

                    var tLeft = offset.left;
                    var tTop = offset.top;
                    var tWidth = $this.width();
                    var tHeight = $this.height();
                    
                    var winHeight = $(window).height();
                    var scrollTop = $(window).scrollTop();
                    if ((winHeight + scrollTop) < (tTop + tHeight + 96)) {
                    	inputChange = (tTop - 86) + 'px';
                    	direction = 'down';
                    } else {
                    	inputChange = (tTop + tHeight) + 'px';
                    	direction = 'up';
                    }

                    $('.user-input-commit-tool').css({'top':inputChange});

                    var bcWigth = document.body.clientWidth;

                    var cLeft = tLeft * 100 / bcWigth + 1;

                    setTriLeft(cLeft + '%', direction);
                }

                $._sureInput_selectDiv = $this;

                _show();

            });
        });
    };

}(jQuery));
(function($) {
	'use strict';
	
	$(document).ready(function(){
		// global();
		// login();
		// album_list();
		// album_detail();
		// book_list();
		// chooesephoto();
		// uploadphoto();
	});
	function global(){
		//关于顶部菜单的滑动交互
		var touchFlag=true;
		$(document).on('touchstart',function(e) {
			touchFlag=true;
		});
		$(document).on('touchmove',function(e) {
			touchFlag=false;
			console.log(touchFlag)
			$(".album_list_tab_wapper").fadeOut();
			$(".tab_trigger_item").css('background','url(./img/inter_action/add.png) no-repeat');
			return;
		});
	}
	function uploadphoto(){
		var width=document.body.clientWidth;
		$(".uploadphoto_main_wrapper li").css("height",width/3-8);
		$(".uploadphoto_main_wrapper .closebutton_img").on("touchend",function(){
			$(this).parent("li").detach();
		});
		$(".photoqualitysetting_wrapper a").on("touchend",function(){
			$(this).parent("li").siblings("li").removeClass("active").end().addClass("active");
		});
	}
	function login(){
		var clientHeight = $(window).height();
		var bodyheight=$('body').height();
		if (window.innerHeight > clientHeight)
			clientHeight = window.innerHeight;
		$(".login-index").css({"height":bodyheight +"px"});
		if(bodyheight<clientHeight){
			$(".login-index").css({"height":clientHeight +"px"});
		}else{
			$(".login-index").css({"height":bodyheight +"px"});
		}
	}

	function album_list(){
		// $(".album_list_arrow").each(function(){
		// 	$(this).css("padding",($(this).parent("li").height()-80)/2+"px 0")});
		var clientHeight = document.body.clientHeight;
		var clientWidth = document.body.clientWidth;
		$(".album_list_desc_item a").click(function(){
			$(this).parent().parent().siblings("li").removeClass("active");
			$(this).parent().parent().addClass("active");
		});
		$(document).on('touchmove',function(){
            $('.album_list_tab_wapper').fadeOut();
            $('.tab_trigger_item').css("background","url(./img/inter_action/add.png) no-repeat")
        });
		$(".tab_trigger_item").on("touchend",function(){
			if($(".album_list_tab_wapper").is(":hidden")){
				$(this).css("background","url(./img/inter_action/cancel.png) no-repeat")
				$(".album_list_tab_wapper").fadeIn();
			}else{
				$(this).css("background","url(./img/inter_action/add.png) no-repeat")
				$(".album_list_tab_wapper").fadeOut();
			}
		});
		$(".album_list_tab_wapper").on("touchend",function(e){
			$(".album_list_tab_wapper").fadeOut();
		});
		if(clientWidth<clientHeight){
			$(".albumlist_wrapper").css({"height":clientHeight +"px"});
		}else{
			$(".albumlist_wrapper").css({"height":clientWidth +"px"});
		}
	}

	function album_detail(){
		$(".praise_wrapper .praise_button").on("touchend",function(){
			if($(this).hasClass("active")){
				$(this).removeClass("active");
			}else{
				$(this).addClass("active");
			}
		});
		$(".praise_wrapper .comment_button, .peply_item").on("touchend",function(){
			$(".mask").fadeIn();
			$(".album_detail_comment_window").show();
		});
		$(".album_detail_comment_window input").on("touchend",function(){
			$(".album_detail_comment_window").hide();
			$(".mask").fadeOut();
		});
		$(".album_detail_comment_list_wrapper .comment_content").each(function(){
			if ($(this).height()>100) {
				var readmoreEl="<a class='comment_content_readmore' href='javascript:;'>查看更多</a>"
				$(this).css({height:10+"em"});
				$(this).parent().append(readmoreEl);
			};
		});
		$(".comment_content_readmore").on("touchend",function(){
			$(this).prev("div").css("height","auto").end().hide();
		});
	}

	function book_list(){
		var touchFlag=true;
		$(".book_list_item").on('touchstart',function(e) {
			touchFlag=true;
		});
		$(".book_list_item").on('touchmove',function(e) {
			touchFlag=false;
			
		});
		$(".book_list_item").on('touchend',function(e) {
			// console.log(touchFlag)
			if(touchFlag==true){
				$(this).siblings(".book_list_item").find(".book_item_checked").hide();
				$(this).find(".book_item_checked").show();
			}else{
				e.stopPropagation();
			}
		});
	}
	function chooesephoto(){
		var touchFlag=true;
		var availWidth=window.screen.availWidth;
		$(".choosephoto_wrapper ul, .choosecover_wrapper ul").css("height",availWidth/3-10);
		$(".choosephoto_wrapper li, .choosecover_wrapper li").on("touchstart",function(){
			touchFlag=true;
		});
		$(".choosephoto_wrapper li, .choosecover_wrapper li").on("touchmove",function(){
			touchFlag=false;
		});
		$(".choosecover_wrapper li").on("touchend",function(e){
			if(touchFlag==true){
				$(".choosecover_wrapper li").removeClass("active");
				$(this).addClass("active");
			}else{
				e.stopPropagation();
			}
		});
		$(".choosephoto_wrapper ul li").on("touchend",function(e){
			if(touchFlag==true){
				if($(this).hasClass("active")){
					$(this).removeClass("active");
				}else{
					$(this).addClass("active");
				}
			}else{
				e.stopPropagation();
			}
		});
		$(".choosephoto_container .chooseall").on("touchend",function(){
			if($(".choosephoto_wrapper .active").length==0){
				$(".choosephoto_wrapper").find("li").addClass("active");
			}else{
				$(".choosephoto_wrapper").find("li").removeClass("active");
			}
		});
	}

	/** 改变视窗 **/
	function changeViewPort() {
		var phoneWidth = parseInt(window.screen.width);
		var phoneScale = phoneWidth / 320;

		var ua = navigator.userAgent;
		if (/Android (\d+\.\d+)/.test(ua)) {
			var version = parseFloat(RegExp.$1);
			if (version > 2.3) {
				document.write('<meta name="viewport" content="width=320, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
			} else {
				document.write('<meta name="viewport" content="width=320, target-densitydpi=device-dpi">');
			}
		} else {
			document.write('<meta name="viewport" content="width=320, user-scalable=no, target-densitydpi=device-dpi">');
		}
	}
} (jQuery));

