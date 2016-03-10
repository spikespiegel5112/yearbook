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
			});
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
			var windowHeight=$(window).height(),
				marginTop=(windowHeight-560)/2;
				if (marginTop<0) {marginTop=0;}
			$(this).each(function() {
				$(this).click(function() {
					console.log(marginTop);
					$('.loginpopup_container').addClass('active');
					$('.loginpopup_wrapper').css('margin-top',marginTop);

				});
				$('.loginpopup_header_wrapper a').click(function() {
					$('.loginpopup_container').removeClass('active');
				});
			});
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
		},
		imgAlignCenter:function(){
			var $this=$(this),
				windowWidth=$(window).width(),
				imgWidth=$this.width();
			$(window).resize(function(){
				$this.css({
					'margin-left':(windowWidth-imgWidth)/2
				});
			});
			$this.css({
				'margin-left':(windowWidth-imgWidth)/2
			});
		}
	});

	$.extend({
		globalhint: function() {
			$('.globalhint_close_btn').click(function() {
				$('.globalhint_wrapper').fadeOut('fast');
			});
		},
		tipsBox: function(options) {
					options = $.extend({
						obj: null,
						str: "+1",
						startSize: "12px",
						endSize: "30px",
						interval: 600,
						color: "#5d7895",
						callback: function() {}
					}, options);
					$("body").append("<span class='num'>" + options.str + "</span>");
					var box = $(".num");
					var left = options.obj.offset().left + options.obj.width() / 2;
					var top = options.obj.offset().top;
					box.css({
						"position": "absolute",
						"left": left + "px",
						"top": top + "px",
						"z-index": 9999,
						"font-size": options.startSize,
						"line-height": options.endSize,
						"color": options.color
					});
					box.animate({
						"font-size": options.endSize,
						"opacity": "0",
						"top": top - parseInt(options.endSize) + "px"
					}, options.interval, function() {
						box.remove();
						options.callback();
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
				maxwidth: 640
			}, options);
			var htmlEl = $('html'),
				bodyEl = $('body'),
				windowWidth = $(window).width();
			sizeConstraint();
			$(window).resize(function() {
				sizeConstraint();
			});

			function sizeConstraint() {
				var windowWidth = $(window).width(),
					windowHeight = $(window).height();
				if (windowWidth >= options.maxwidth && windowWidth <= windowHeight) {
					console.log(windowWidth, windowHeight)
					bodyEl.css({
						'width': options.maxwidth,
						'margin': '0 auto'
					});
					htmlEl.css('font-size', options.fontsize / 16 * 200 + '%');
				} else {
					var windowWidth = $(window).width(),
						windowHeight = $(window).height();
					factor = 0;
					if (windowWidth < windowHeight) {
						factor = windowWidth / 320;
					} else {
						factor = windowHeight / 320;
					}

					bodyEl.css('width', 'auto');
					//$(excaption).css('font-size', '100%');
					htmlEl.css('font-size', options.fontsize / 16 * 100 * factor + '%');
				}
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
        popNewOption();
        mobileToPcSwitch();
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

    /*
    * 通用主底栏弹出新建
    * */
    function popNewOption(){
        var winWidth = $(window).width(),
            winHeight = $(window).height(),
            midTop = winHeight/2-54,
            midLeft = winWidth/2-40,
            phL = (winWidth)/2-120,
            phT = winHeight/3-60,
            iaL = (winWidth)/2+40,
            jiaT = winHeight/3+80;
        var curPageIcon = $('.footer_nav li.active').index();

        $('.footer_nav li').on('touchend',function (){
            $('.footer_nav li').each(function(){
                $(this).removeClass('active');
            });
            $(this).addClass('active');
        })

        $('.new_option ul li').css({'top':midTop,'left':midLeft});
        /*new option page fadein*/
        $('#open_new_option a').on('touchend',function(){
            $('.open_new_container').addClass('animated fadeIn').removeClass('fadeOut').show();
            $('.new_option').show().addClass('animated fadeIn').removeClass('fadeOut');
            $('.new_option ul .new_ph').animate({
                left: phL,
                top: phT
            }, 300, function() {});
            $('.new_option ul .new_ia').animate({
                left: iaL,
                top: phT
            }, 300, function() {});
            $('.new_option ul .join_ia').animate({
                left: midLeft,
                top: jiaT
            }, 300, function() {});
        });
        /*new option page fadeout*/
        $('.open_new_container .close_btn a').on('touchend',function(){
            //保存当前页面
            $('.new_option').removeClass(' fadeIn').addClass('fadeOut');
            $('.open_new_container').addClass('fadeOut').removeClass('fadeIn');
            $('.new_option ul li').animate({'top':midTop,'left':midLeft},300,function(){});
            setTimeout(function(){
                $('.new_option').hide();
                $('.open_new_container').hide();
            },500);
            $('.footer_nav li').eq(curPageIcon).addClass('active').siblings().removeClass('active');;
        });
    }

    /*
     * mobile to pc switch
     * */
    function mobileToPcSwitch(){
        var conHeight = $('.main_container').height(),
            minHeight = $(window).height()-39;
        if($('.main_container').hasClass('has_footer_nav')){
            if(!$('.ft_pc')){
                $('.main_container').removeClass('has_footer_nav');
                $('.ft_pc').addClass('has_footer_nav');
                minHeight = minHeight - 70;
            }
        }
        if(conHeight < minHeight){
            $('.main_container').css('min-height',minHeight);
        }
        $(window).resize(function(){
            mobileToPcSwitch();
        })
    }
} (jQuery));

