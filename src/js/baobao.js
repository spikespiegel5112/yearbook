var baobao=function(){};

baobao.prototype = {
    ready: function(callback) {
        window.onload = function() {
            callback();
        }
    },
    os: function() {
        alert('aaa')
        var ua = navigator.userAgent;
        this.prototype = {
            mobile: function() {
                return 'aaa';
                // return ua.match(/AppleWebKit.*Mobile.*/);
            }
        }
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
            aligncenter: false,
            keepportrait: false,
            keeplandscape: false
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
            if (options.keepportrait) {
                orientationSensor({
                    portrait: function() {
                        windowWidth = $(window).width(),
                            windowHeight = $(window).height();
                    },
                    landscape: function() {
                        windowWidth = $(window).height(),
                            windowHeight = $(window).width();
                    }
                });
            } else if (options.keeplandscape) {
                orientationSensor({
                    portrait: function() {
                        windowWidth = $(window).width(),
                            windowHeight = $(window).height();
                    },
                    landscape: function() {
                        windowWidth = $(window).height(),
                            windowHeight = $(window).width();
                    }
                });
            } else {
                windowWidth = $(window).width(),
                    windowHeight = $(window).height();
            }

            var factor = 0;
            // alert(windowWidth)
            if (options.minwidth == 0) {
                //alert('当最小宽度等于0时')
                if (!options.aligncenter) {
                    return;
                } else {
                    bodyEl.css({
                        'width': windowWidth
                    });
                }
                factor = 1;
            } else if (options.minwidth != 0 && windowWidth <= options.minwidth) {
                // alert('当最小宽度不等于0且屏幕宽度小于等于最小宽度时')
                if (!options.aligncenter) {
                    bodyEl.css({
                        'margin': '0 auto'
                    })
                } else {
                    bodyEl.css({
                        'margin': '0 auto',
                        'width': options.minwidth,
                    })
                }
                factor = 1;
            } else if (options.maxwidth == 0 || windowWidth > options.minwidth && windowWidth <= options.maxwidth) {
                //alert('当屏幕宽度大于最小宽度且小于最大宽度，或没有最大宽度时')
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
        var initConfig = config;
        var transformData = {
            scale: 1,
            rotate: 0,
            left: 0,
            top: 0
        }

        var config = $.extend({
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
        if (config.destroy == true) {
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
                sliderPosX = zoomingSlider.offset().left * transformData.scale;
            //  sliderPosX=(windowWidth-(windowWidth*0.8))/2;
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

            if (windowWidth < windowHeight) {
                $(config.tools.scrollBar).css('width', windowWidth);
            } else {
                $(config.tools.scrollBar).css('width', windowHeight);
            }
            $(window).resize(function() {
                if (windowWidth < windowHeight) {
                    $(config.tools.scrollBar).css('width', windowWidth);
                } else {
                    $(config.tools.scrollBar).css('width', windowHeight);
                }
            })

            //根据图片原始宽度和屏幕宽度的比利算出滑块初始位置
            // initMarginleft = $(config.tools.scrollBar).find('label').width() / originalRatio;        
            // zoomingSlider.css('margin-left', initMarginleft);

            initMarginleft = 1 / originalRatio;
            zoomingSlider.css('margin-left', (initMarginleft * 100) + '%');
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

        if (initConfig == 'transformData') {
            alert('aaa')
            switch (config) {
                case 'transformData':
                    alert('aaa');
                    return {
                        'transform': 'rotate(' + transformData.rotate + 'deg) scale(' + transformData.scale + ')',
                        '-webkit-transform': 'rotate(' + transformData.rotate + 'deg) scale(' + transformData.scale + ')',
                        'position': 'absolute',
                        'left': transformData.left,
                        'top': transformData.top
                    }
            }
        };

        function sliderEvent(e) {
            var touch = e.originalEvent.touches[0];
            var movingPosX = touch.pageX;

            // marginleft = ((movingPosX-(windowWidth-(windowWidth*0.8))/2)/windowWidth)*0.8;
            marginleft = (movingPosX / windowWidth) - (sliderPosX / windowWidth);
            // console.log("windowWidth: "+windowWidth+' sliderPosX: '+sliderPosX+' movingPosX: '+movingPosX)               

            if (marginleft <= 0) {
                //console.log('<0')
                marginleft = 0;
            } else if (marginleft >= 0.8) {
                marginleft = 0.8
            } else {
                zoomingSlider.css('margin-left', (marginleft * 100) + '%');
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
        zoomingSlider.on('touchstart', function(e) {
            sliderEvent(e);
        });
        zoomingSlider.on('touchmove', function(e) {
            console.log(windowWidth)
            sliderEvent(e);
        });
        image.on('touchstart', function(e) {
            console.log('image touchstart')
            var touch = e.originalEvent.touches[0];
            startPosX = touch.pageX,
                startPosY = touch.pageY,
                imageLeft = Number(image.css('left').replace('px', '')),
                imageTop = Number(image.css('top').replace('px', ''))
            console.log(transformData)
        });

        function eventHandler(e, transformData) {
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
                });
                // console.log(transformData);
                return transformData;
            };
        }
        var touchstartEvent = function() {
                window.addEventListener('touchstart', eventHandler, false);
            }(),
            touchmoveEvent = function() {
                window.addEventListener('touchmove', eventHandler, false);
            }()
        $('.action_btn').on('touchend', function() {
            console.log(transformData);
        });

        function destroy() {
            touchstartEvent = null;
            touchmoveEvent = null;
            $('.action_btn').off();
        }
    },
    imageTransition: function(options) {
        var config = $.extend({
            mintime: 2,
            maxtime: 2,
            transittime: 1,
            container: '',
            imagesrc: []
        }, options);
        var bgLength = config.imagesrc.length,
            index = 0,
            imgReady = false,
            imgCounter = 0,
            randomPeriod = 1000,
            windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            container = $(config.container),
            ffimgcontainerClass = 'ffimgcontainer',
            ffimgcontainerEl = $('<div></div>').addClass(ffimgcontainerClass).css({
                width: '100%',
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0
            })

        config.mintime = (config.mintime < config.transittime * 2) ? config.transittime * 2 : config.mintime;
        config.maxtime = (config.maxtime < config.mintime) ? config.mintime : config.maxtime;
        //加载所有图片
        for (var i = 0; i < bgLength; i++) {
            var imgEl = $('<img/>').attr('src', config.imagesrc[i]).css('position', 'absolute').addClass('transition_bg').hide();
            container.append(imgEl);
        }
        container.append(ffimgcontainerEl);
        var bgImg = $('.transition_bg');
        ffimgcontainerEl.append(bgImg);
        //检查每个图片是否加载完成
        bgImg.each(function(index) {
            $(this).load(function() {
                imgCounter++;
                console.log(imgCounter)
                if (imgCounter == bgLength) {
                    console.log('imgReady');
                    var bgImgWidth = bgImg.width(),
                        bgImgHeight = bgImg.height();
                    console.log(bgImgWidth);
                    var timer = setInterval(function() {
                        randomPeriod = config.mintime * 1000 + (Math.random() * (config.maxtime - config.mintime) * 1000);
                        console.log(randomPeriod);
                        if (index == bgLength) {
                            index = 0;
                        };
                        if (getVendorPrefix() == 'webkit') {
                            container.css({
                                'background-image': 'url(' + config.imagesrc[index] + ')',
                                '-webkit-transition': 'background-image ' + config.transittime + 's'
                            });
                        } else {
                            bgImg.eq(index - 1).fadeOut(config.transittime * 1000);
                            bgImg.eq(index).fadeIn(config.transittime * 1000);
                            bgImg.eq(index).css({
                                top: (windowHeight - bgImgHeight) / 2,
                                left: (windowWidth - bgImgWidth) / 2
                            });
                            console.log(bgImgHeight);
                        }
                        index++;
                    }, config.mintime * 1000 + (Math.random() * (config.maxtime - config.mintime) * 1000));
                };
            });
        });

        function getVendorPrefix() {
            var body = document.body || document.documentElement,
                style = body.style,
                vendor = ['webkit', 'khtml', 'moz', 'ms', 'o'];

            for (var i = 0; i < vendor.length; i++) {
                if (typeof style[vendor[i] + 'Transition'] === 'string') {
                    return vendor[i];
                }
            }
        }
    }
}
