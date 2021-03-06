/**
 * extensions.js
 * Extends jQuery with a few custom methods
**/

'use strict';

;(function($, window, document, undefined){

    /**
     * $.accordion
     * Creates an accordion
    **/
    $.fn.accordion = function(options){
        // Defaults
        var defaults = {
            openfirst           : true,
            title_class         : 'accordion-title',
            section_class       : 'accordion-content',
            active_title_class  : 'active-title',
            active_section_class: 'active-content'
        };
        // Settings
        var settings = $.extend({}, defaults, options);
        // Return instance
        return this.each(function(){
            var plg     = $(this),
                title   = $('> .' + settings.title_class, plg),
                content = $('> .' + settings.section_class, plg);

            // Reset the accordion
            $('.' + settings.active_section_class, plg).removeClass(settings.active_section_class);
            $('.' + settings.active_title_class, plg).removeClass(settings.active_title_class);

            title.css({'cursor': 'pointer'});
            content.hide();
            if(settings.openfirst){
                title.first().show().addClass(settings.active_title_class);
                content.first().show().addClass(settings.active_section_class);
            }

            title.on('click', function(){
                if(!$(this).hasClass(settings.active_title_class)){
                    $('.' + settings.active_section_class, plg).slideUp(500).removeClass(settings.active_section_class);
                    $('.' + settings.active_title_class, plg).removeClass(settings.active_title_class);
                    $(this).addClass(settings.active_title_class, plg).next().slideDown(500).addClass(settings.active_section_class);
                }
            });
        });
    }

    /**
     * $.tabs
     * Creates tabs
    **/
    $.fn.tabs = function(options){
        // Defaults
        var defaults = {
            tab_class       : 'tab',
            nav_class       : 'nav',
            target_data_attr: 'tab-target',
            active_tab_class: 'active-tab'
        };
        // Settings
        var settings = $.extend({}, defaults, options);
        // Return instance
        return this.each(function(){
            var plg = $(this);

            $('.' + settings.tab_class, plg).hide();
            $('.' + settings.tab_class, plg).first().show().addClass(settings.active_tab_class);
            $('.' + settings.nav_class + ' li', plg).first().addClass(settings.active_tab_class);

            $('.' + settings.nav_class + ' li a', plg).on('click', function(e){
                e.preventDefault();
                var tab_nav    = plg.parent().parent(),
                    tab_system = tab_nav.next();

                if(!plg.parent().hasClass(settings.active_tab_class)){
                    var target = plg.data(settings.target_data_attr);

                    $('li.' + settings.active_tab_class, tab_nav).removeClass(settings.active_tab_class);
                    $(this).parent().addClass(settings.active_tab_class);
                    $('.' + settings.active_tab_class, tab_system).hide().removeClass(settings.active_tab_class);
                    $('#' + target, tab_system).fadeIn(500).addClass(settings.active_tab_class);
                }
            });
        });
    }

    /**
     * $.extCenter
     * Centers any element vertically, horizontally or both can pass an element to center relative to that element
    **/
    $.fn.extCenter = function(method, element){
        var el = (typeof element !== 'undefined') ? element : $(window);
        el.css({'position': 'relative'});
        this.css({'position': 'absolute', 'z-index': '999'});
        var methods = {
            all: function(){
                this.css('top', ((el.height() - this.outerHeight()) / 2) + el.scrollTop() + 'px');
                this.css('left', ((el.width() - this.outerWidth()) / 2) + el.scrollLeft() + 'px');
                return this;
            },
            vertical: function(){
                this.css('top', ((el.height() - this.outerHeight()) / 2) + el.scrollTop() + 'px');
                return this;
            },
            horizontal: function(){
                this.css('left', ((el.width() - this.outerWidth()) / 2) + el.scrollLeft() + 'px');
                return this;
            }
        }
        if(methods[method]){
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if(typeof method === 'object' || !method){
            return methods.all.apply(this, arguments);
        }
        else{
            $.error('Method ' +  method + ' does not exist on jQuery.extCenter');
        }
    }

    /**
     * $.extPreloader
     * Creates a preloading animation
    **/
    $.fn.extPreloader = function(options){
        var loader,
            el = this,
            rn = parseInt(Math.random() * (100 - 1) + 1, 10),
            defaults = {
                loader     : 'loader-' + rn,
                loadershape: 'spiral',
                loadersize : 30,
                loaderhex  : '#333',
                loadmethod : 'html',
                loaderstyle: 'display: inline-block;'
            }

        // Extend the defaults
        var settings = $.extend({}, defaults, options);

        // Return each instance
        return this.each(function(){

            // Adding the loader
            switch(settings.loadmethod){
                case 'html' :
                    el.html('<div id="' + settings.loader + '" style="' + settings.loaderstyle + '"></div>');
                break;
                case 'after' :
                    el.after('<div id="' + settings.loader + '" style="' + settings.loaderstyle + '"></div>');
                break;
                case 'before' :
                    el.before('<div id="' + settings.loader + '" style="' + settings.loaderstyle + '"></div>');
                break;
                case 'prepend' :
                    el.prepend('<div id="' + settings.loader + '" style="' + settings.loaderstyle + '"></div>');
                break;
                case 'append' :
                    el.append('<div id="' + settings.loader + '" style="' + settings.loaderstyle + '"></div>');
                break;
                default :
                    el.html('<div id="' + settings.loader + '" style="' + settings.loaderstyle + '"></div>');
                break;
            }

            // Get the canvas loader
            $.getScript('http://heartcode-canvasloader.googlecode.com/files/heartcode-canvasloader-min-0.9.js', function(){
                loader = new CanvasLoader(settings.loader);
                loader.setShape(settings.loadershape);
                loader.setDiameter(settings.loadersize);
                loader.setDensity(13);
                loader.setRange(0.6);
                loader.setSpeed(1);
                loader.setColor(settings.loaderhex);
                loader.show();
            });

            // Destroy method
            el.destroyExtPreloader = function(){
                loader.kill();
                $('#' + settings.loader).remove();
            }
        });
    }

    /**
     * Requests confirmation before completing action
    **/
    $('.confirm-action').on({
        click: function(e){
            var custom_message = $(this).data('confirm-message'),
                message        = (custom_message !== undefined) ? custom_message : 'Are you sure?';

            return confirm(message);
        }
    });

    /**
     * Buttonless form submittal
    **/
    $('.js-send').each(function(){
        var jsform = $(this).offsetParent('form');
        $('button', jsform).hide();
        $(this).on({
            change: function(){
                jsform.submit();
            }
        });
    });

    /**
     * Viewport Selector by Mika Tuupola
    **/
    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };
    $.abovethetop = function(element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
    $.rightofscreen = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    $.leftofscreen = function(element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };
    $.inviewport = function(element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };
    $.extend($.expr[':'], {
        "below-the-fold": function(a, i, m) {
            return $.belowthefold(a, {threshold : 0});
        },
        "above-the-top": function(a, i, m) {
            return $.abovethetop(a, {threshold : 0});
        },
        "left-of-screen": function(a, i, m) {
            return $.leftofscreen(a, {threshold : 0});
        },
        "right-of-screen": function(a, i, m) {
            return $.rightofscreen(a, {threshold : 0});
        },
        "in-viewport": function(a, i, m) {
            return $.inviewport(a, {threshold : 0});
        }
    });

    /**
     * jQuery Easing
    **/
    $.extend($.easing,{
        easeInQuad: function (x, t, b, c, d){
            return c*(t/=d)*t + b;
        },
        easeOutQuad: function (x, t, b, c, d){
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOutQuad: function (x, t, b, c, d){
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d){
            return c*(t/=d)*t*t + b;
        },
        easeOutCubic: function (x, t, b, c, d){
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d){
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },
        easeInQuart: function (x, t, b, c, d){
            return c*(t/=d)*t*t*t + b;
        },
        easeOutQuart: function (x, t, b, c, d){
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOutQuart: function (x, t, b, c, d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        easeInQuint: function (x, t, b, c, d){
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOutQuint: function (x, t, b, c, d){
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOutQuint: function (x, t, b, c, d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d){
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d){
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d){
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d){
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d){
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d){
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x, t, b, c, d){
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOutCirc: function (x, t, b, c, d){
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOutCirc: function (x, t, b, c, d){
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d){
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)){ a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOutElastic: function (x, t, b, c, d){
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)){ a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d){
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)){ a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s){
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s){
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s){
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeInBounce: function (x, t, b, c, d){
            return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d){
            if ((t/=d) < (1/2.75)){
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)){
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)){
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else{
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOutBounce: function (x, t, b, c, d){
            if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
            return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    });

})(jQuery, window, document);
