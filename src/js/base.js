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
			var options = $.extend({
				loadmsg: '小忆拼命加载中'
			}, options);
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
			var windowHeight = $(window).height(),
				marginTop = (windowHeight - 560) / 2;
			if (marginTop < 0) { marginTop = 0; }
			$(this).each(function() {
				$(this).click(function() {
					console.log(marginTop);
					$('.common_login_container').addClass('active');
					$('.common_login_wrapper').css('margin-top', marginTop);

				});
				$('.common_loginheader_wrapper a').click(function() {
					$('.common_login_container').removeClass('active');
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
		//footer自动贴底效果，任意调整浏览器窗口高度都可以自动贴底，同时让页面主体内容垂直居中
		footerAlignBottom: function(options) {
			options = $.extend({
				marginOffset: 10,
				footer: '.footer'
			}, options);
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
						'margin-top': loginMargin / 2 + options.marginOffset,
						'margin-bottom': loginMargin / 2 + options.marginOffset
					});
					$(options.footer).css('position', 'absolute');
				} else if (loginMargin < 0) {
					$this.css({
						'margin-top': 0,
						'margin-bottom': 0,
					});
				}
			}
		},
		imgAlignCenter: function() {
			var $this = $(this),
				windowWidth = $(window).width(),
				imgWidth = $this.width();
			$(window).resize(function() {
				$this.css({
					'margin-left': (windowWidth - imgWidth) / 2
				});
			});
			$this.css({
				'margin-left': (windowWidth - imgWidth) / 2
			});
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
				timer,
				windowWidth = $(window).width(),
				windowHeight = $(window).height();
			//_this.attr('src', imgSrc + '?' + Date.parse(new Date()))

			aaa();
			$(window).resize(function() {
				aaa();
			});
			function aaa(){
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
								containerheight = $(options.container).eq(index).height();
								checkPosition($(this), containerheight)
								console.log('第' + index + '张图片的高度:' + containerheight)
							}
						});
						if (reload) {
							reload = false;
							checkBrowser({
								ie: function() {
									timer = window.setTimeout(function() {
										checkImgLoading();
									}, 100);
								},
								other: function() {
									timer = setTimeout(function() {
										checkImgLoading();
									}, 100);
								}
							})
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
					} else {
						checkPosition(_this);
						$(window).resize(function() {
							checkPosition(_this);
						})
					}
				}
			}

			function checkPosition(_this) {
				// console.log('begin aligning')
				checkBrowser({
					ie: function() {
						window.clearTimeout(timer);
					},
					other: function() {
						clearTimeout(timer);
					}
				})

				thisWidth = _this.outerWidth(),
					thisHeight = _this.outerHeight();

				switch (options.position) {
					case 'both':
						aligning(function(thisWidth, thisHeight) {
							if (options.container != '') {
								var marginY = (containerheight - thisHeight) / 2;
							} else {
								var marginY = ($(window).height() - thisHeight) / 2;
							}
							if (marginY <= 0) {
								marginY = 0;
							};
							if (thisWidth <= $(window).width()) {
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
				$(window).resize(function() {
					thisWidth = _this.outerWidth();
					thisHeight = _this.outerHeight();
					return callback(thisWidth, thisHeight)
				});
				return callback(thisWidth, thisHeight);
			}

			function checkBrowser(callback) {
				callback = $.extend({
					ie: function() {
						return;
					},
					other: function() {
						return;
					}
				}, callback)
				if (navigator.appName.indexOf("Explorer") > -1) {
					console.log('IE')
					callback.ie();
				} else {
					// console.log('other')
					callback.other();
				}
			}
			//屏幕方向探测器
			function orientationSensor(callback) {
				var windowWidth = $(window).width(),
					windowHeight = $(window).height(),
					orientation = '';
				callback = $.extend({
					portrait: function() {},
					landscape: function() {},
					orientationchange: function(windowWidth, windowHeight) {}
				}, callback)

				checkoritation();
				$(window).resize(function() {
					checkoritation();
				});

				function checkoritation() {
					callback.orientationchange();
					if (windowWidth < windowHeight) {
						return callback.portrait();
					} else {
						return callback.landscape();
					}
				}
				return (windowWidth < windowHeight) ? orientation = 'portrait' : orientation = 'landscape';
			}
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
		},
		orientationSensor: function(callback) {
			var windowWidth = $(window).width(),
				windowHeight = $(window).height(),
				orientation = '';
			callback = $.extend({
				portrait: function() {},
				landscape: function() {},
				orientationchange: function(windowWidth, windowHeight) {

				}
			}, callback);

			checkoritation();
			$(window).resize(function() {
				checkoritation();
			});

			function checkoritation() {
				callback.orientationchange();
				if (windowWidth < windowHeight) {
					return callback.portrait();
				} else {
					return callback.landscape();
				}
			}
			return (windowWidth < windowHeight) ? orientation = 'portrait' : orientation = 'landscape';
		},
		remResizing: function(options) {
			options = $.extend({
				fontsize: 16,
				minwidth: 320,
				maxwidth: 0,
				aligncenter: true
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
				windowWidth = $(window).width(),
				windowHeight = $(window).height();

				var factor = 0;
				// alert(windowWidth)
				if (options.minwidth == 0) {
					//alert('当最小宽度等于0时')
					bodyEl.css({
						'width': windowWidth
					});
					factor = windowWidth / options.minwidth;
				} else if (options.minwidth != 0 && windowWidth <= options.minwidth) {
					// alert('当最小宽度不等于0且屏幕宽度小于等于最小宽度时')
					if (orientationSensor() == 'portrait') {
						bodyEl.css({
							'width': options.minwidth,
							'height': 'auto'
						});
					} else {
						bodyEl.css({
							'width': 'auto',
							'height': options.minwidth
						});
					}
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
		},
		editphoto: function(config) {
			var transformData = {
					scale: 1,
					rotate: 0,
					left: 0,
					top: 0
				},
				config = $.extend({
					image: '',
					tools: {
						photoFrame: '',
						turnRightBtn: '',
						turnLeftBtn: '',
						zoomInBtn: '',
						zoomOutBtn: '',
						reScaleBtn: '',
						rePositionBtn: '',
						originalSizeBtn: '',
						scrollBar: ''
					},
					destroy: false
				}, config);
			if (config.destroy==true) {
				destroy();
			};
			var windowWidth = $(window).width(),
				windowHeight = $(window).height(),
				image = $(config.image),
				frameRatio = 0.9, //相框宽高比,此值由被点击的槽位宽高比决定
				startPosX = 0,
				startPosY = 0,
				imageTop = 0,
				imageLeft = 0,
				endPosX = 0,
				endPosY = 0,
				offsetPosX = 0,
				offsetPosY = 0,
				originalWidth = 0,
				originalHeight = 0,
				originalRatio = 0,
				saveRatio = 0,
				epscrollbarWidth,
				zoomingSlider,
				sliderPosX,
				initMarginleft = 0,
				marginleft = 0;

			if (config.tools.scrollBar != '') {
				epscrollbarWidth = $(config.tools.scrollBar).find('label').width(),
				zoomingSlider = $(config.tools.scrollBar).find('span'),
				sliderPosX = zoomingSlider.offset().left*transformData.scale;
				//	sliderPosX=(windowWidth-(windowWidth*0.8))/2;
			} else {
				return;
			}

			init();

			function init() {
				image.css('transition', 'transform 0.5s');
				image.css(transformData);
				var photoframe = $(config.tools.photoFrame);
				if (frameRatio >= 1) {
					photoframe.css({
						width: $(window).width() * 0.9,
						height: ($(window).width() * 0.9) / frameRatio
					});
				} else if (frameRatio > 0 && frameRatio < 1) {
					photoframe.css({
						width: $(window).height() * 0.6 * frameRatio,
						height: $(window).height() * 0.6
					})
					if (photoframe.width() > $(window).width()) {
						photoframe.css({
							width: $(window).width(),
							height: photoframe.height() * ($(window).width() / photoframe.width())
						});
						alert(photoframe.height());
					};
				}

				//获取图片原始尺寸
				var imgObj = new Image;
				imgObj.src = image.attr('src');
				originalWidth = imgObj.width;
				originalHeight = imgObj.height;
				originalRatio = originalWidth / (photoframe.width() * 0.9);

				if (windowWidth<windowHeight) {
						$(config.tools.scrollBar).css('width', windowWidth);
					}else{
						$(config.tools.scrollBar).css('width', windowHeight);
					}
				$(window).resize(function(){
					if (windowWidth<windowHeight) {
						$(config.tools.scrollBar).css('width', windowWidth);
					}else{
						$(config.tools.scrollBar).css('width', windowHeight);
					}
				})
				
				//根据图片原始宽度和屏幕宽度的比利算出滑块初始位置
				// initMarginleft = $(config.tools.scrollBar).find('label').width() / originalRatio;		
				// zoomingSlider.css('margin-left', initMarginleft);

				initMarginleft=1/originalRatio;
				zoomingSlider.css('margin-left', (initMarginleft*100)+'%');
				//先居中相框再居中图片
				$(config.tools.photoFrame).align();
				image.align({
					container: '.makebook_epeditarea_wrapper'
				});
			};
			//原始尺寸
			$(config.tools.originalSizeBtn).on('touchend', function() {
				image.css(cssSettings({
					'scale': originalRatio
				}));
				saveRatio = initMarginleft * originalRatio;
				zoomingSlider.css('margin-left', '80%');
			});
			//向右转
			$(config.tools.turnRightBtn).on('touchend', function() {
				transformData.rotate += 90;
				image.css(cssSettings(transformData));
			});
			//向左转
			$(config.tools.turnLeftBtn).on('touchend', function() {
				transformData.rotate -= 90;
				image.css(cssSettings(transformData));
			});
			//放大
			$(config.tools.zoomoutBtn).on('touchend', function() {
				marginleft -= epscrollbarWidth / 2 / 5
				if (marginleft <= 0) {
					marginleft = 0;
				}
				image.css(cssSettings({
					'scale': Number(marginleft / epscrollbarWidth) * 2
				}));
				zoomingSlider.css('margin-left', marginleft);
			});
			//缩小
			$(config.tools.zoominBtn).on('touchend', function() {
				marginleft += epscrollbarWidth / 2 / 5;
				if (marginleft >= epscrollbarWidth - 10) {
					marginleft = epscrollbarWidth - 10;
				}
				image.css(cssSettings({
					'scale': Number(marginleft / epscrollbarWidth) * 2
				}));
				zoomingSlider.css('margin-left', marginleft);
			});
			//重新归位
			$(config.tools.rePositionBtn).on('touchend', function() {
				transformData = $.extend(transformData, {
					left: 0,
					top: 0
				});
				image.css(transformData);
			});
			function sliderEvent(e){
				var touch = e.originalEvent.touches[0];
				var movingPosX = touch.pageX;
				
				// marginleft = ((movingPosX-(windowWidth-(windowWidth*0.8))/2)/windowWidth)*0.8;
				marginleft = (movingPosX/windowWidth) - (sliderPosX/windowWidth);
				// console.log("windowWidth: "+windowWidth+' sliderPosX: '+sliderPosX+' movingPosX: '+movingPosX)				
				
				if (marginleft <= 0) {
					//console.log('<0')
					marginleft = 0;
				} else if (marginleft >= 0.8) {
					marginleft = 0.8
				} else {
					zoomingSlider.css('margin-left', (marginleft*100)+'%');
					var scalecss = {
						scale: marginleft * originalRatio
					}
					image.css(cssSettings(scalecss));
					console.log('滑块操作后的marginleft: ' + marginleft);
				}
				if (marginleft > saveRatio) {
					//大于最低清晰度
					//console.log(marginleft+' '+saveRatio)
				};
			}
			zoomingSlider.on('touchstart',function(e){
				sliderEvent(e);
			});
			zoomingSlider.on('touchmove',function(e){
				console.log(windowWidth)
				sliderEvent(e);
			});
			image.on('touchstart',function(e){
				console.log('image touchstart')
				var touch = e.originalEvent.touches[0];
				startPosX = touch.pageX,
				startPosY = touch.pageY,
				imageLeft = Number(image.css('left').replace('px', '')),
				imageTop = Number(image.css('top').replace('px', ''))
				console.log(transformData)
			});
			function eventHandler(e, transformData){
				if ($(e.target).closest(image).length > 0) {
					var touch = e.touches[0];
					switch (e.type) {
						case 'touchstart':
							startPosX = touch.pageX,
							startPosY = touch.pageY,
							imageLeft = Number(image.css('left').replace('px', '')),
							imageTop = Number(image.css('top').replace('px', ''))
							break;
						case 'touchmove':
							console.log('image touchmove')
							e.preventDefault;
							endPosX = touch.pageX,
							endPosY = touch.pageY,
							offsetPosX = endPosX - startPosX;
							offsetPosY = endPosY - startPosY;
							var positioncss = {
								position: 'relative',
								left: offsetPosX + imageLeft,
								top: offsetPosY + imageTop
							};
							cssSettings(positioncss);
							transformData = $.extend(transformData, positioncss)
							image.css(transformData);
							break;
					}
				}
			}
			
			//某些必须集合多个参数的样式的设置模式
			function cssSettings(config) {
				transformData = $.extend(transformData, config);
				var cssObj = transformData;
				if (transformData.rotate || transformData.scale) {
					$.extend(transformData, {
						'transform': 'rotate(' + transformData.rotate + 'deg) scale(' + transformData.scale + ')'
					})
					console.log(transformData);
					return transformData;
				};
			}
			var touchstartEvent=function(){
					window.addEventListener('touchstart', eventHandler, false);
				}(), 
				touchmoveEvent=function(){
					window.addEventListener('touchmove', eventHandler, false);
				}()
			$('.action_btn').on('touchend', function() {
				console.log(transformData);
			});
			function destroy(){
				touchstartEvent=null;
				touchmoveEvent=null;
				$('.action_btn').off();
			}
		}
	});
	$('.manage_tab').toolsSlide('.bannerslider_container', '.manage_tab .bannerslider_inner', '.manage_tab .bs_arrowbtn_left', '.manage_tab .bs_arrowbtn_right', 40);
	$('.hide_title').init_title();

	$('.bannerslider_wrapper').toolsSlide('.bannerslider_wrapper', '.ybbanner_wrapper .bannerslider_inner', '.ybbanner_wrapper .bs_arrowbtn_left', '.ybbanner_wrapper .bs_arrowbtn_right', 40);

	// setTimeout(function(){
	// 	$('.ybbanner_wrapper').loading('destroy');
	// },5000)
	// $('.ybindex_carousel_wrapper').carousel();

})(jQuery, window);