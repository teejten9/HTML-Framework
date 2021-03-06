/**
 *
 * jQuery lightBox plugin
 * $('.foo').lightBox();
 *
 * Options:
 * - parentlink: Boolean. Whether to use the href of the image parent or not.
 * - blurBG: Boolean. Whether to blur the background or not.
 * - overlay_background: String. Colour of the background overlay.
 * - modal_box_shadow: String. Colour of the modal box shadow.
 * - modal_border_radius: String. Border radius of the modal box.
 * - modal_border_style: String. Border style of the modal box.
 * - modal_background: String. Background colour of the modal box.
 * - modal_padding: String. Padding of the modal box.
 * - close_btn_text: String. Text for the close button.
 * - close_btn_padding: String. Padding for the close button.
 * - close_btn_color: String. Colour of the close button
 * - close_btn_bg: String. Background colour for the close button.
 * - close_btn_bg_hover: String. Background for the close button hover.
 * - close_btn_border_radius: String. Border radius for the close button.
 * - close_btn_shadow: String. Shadow for the close button.
 * - close_btn_font: String. Font for the close button.
 *
**/

;(function($, window, document, undefined){
	'use strict';

	$.fn.lightBox = function(options){
		/* -- Defaults -- */
		// Our application defaults
		var defaults = {
			parentlink              : false,
			blurBG				    : true,
			overlay_background      : 'rgba(0, 0, 0, 0.6)',
            modal_box_shadow        : '0 0 30px rgba(0, 0, 0, 0.6) ',
            modal_border_radius     : '4px',
            modal_border_style      : '3px solid #EFEFEF',
            modal_background        : '#FFF',
            modal_padding           : '1.8em',
            close_btn_text          : 'Close',
            close_btn_padding       : '10px 30px',
            close_btn_color         : '#000',
            close_btn_bg            : '#EFEFEF',
            close_btn_bg_hover      : '#e2e0e0',
            close_btn_border_radius : '0.25em',
            close_btn_shadow        : '',
            close_btn_font          : 'bold 0.9em Arial'
		};

		/* -- Settings -- */
		// Combine the defaults and custom settings
		var settings = $.extend({}, defaults, options);

		/* -- Utilities -- */
		// Center any element
		$.fn.fn_center = function(method, element){
			var el      = (element != null) ? $(element) : $(window);
	        var methods = {
	            all: function(){
	                el.css('position', 'relative');
	                this.css('position', 'absolute');
	                if(this.outerWidth() > el.width()){
		                var perc = (this.outerWidth() / 100) * 90;
		                this.css('width', perc + 'px');
		            }
	                this.css('top', ((el.height() - this.outerHeight()) / 2) + el.scrollTop() + 'px');
	                this.css('left', ((el.width() - this.outerWidth()) / 2) + el.scrollLeft() + 'px');
	                return this;
	            },
	            vertical: function(){
	                el.css('position', 'relative');
	                this.css('position', 'absolute');
	                this.css('top', ((el.height() - this.outerHeight()) / 2) + el.scrollTop() + 'px');
	                return this;
	            },
	            horizontal: function(){
	                el.css('position', 'relative');
	                this.css('position', 'absolute');
	                if(this.outerWidth() > el.width()){
		                var perc = (this.outerWidth() / 100) * 90;
		                this.css('width', perc + 'px');
		            }
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
	            $.error('Method ' +  method + ' does not exist on jQuery.fn_center');
	        }
	    }

	    // Add a blur class to any element
	    // Requires a .blur class to be set up in CSS.
	    $.fn.fn_blur = function(method){
	    	if(settings.blurBG){
		        var methods = {
		            on: function(){
		                this.nextUntil('div').addClass('blur');
		                return this;
		            },
		            off: function(){
		                this.nextUntil('div').removeClass('blur');
		                return this;
		            }
		        };
		        if(methods[method]){
		            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		        }
		        else if(typeof method === 'object' || !method){
		            return methods.on.apply(this, arguments);
		        }
		        else{
		            $.error('Method ' +  method + ' does not exist on jQuery.fn_blur');
		        }
		    }
		    else{
		    	return false;
		    }
   		}

		return this.each(function(){
			var plg = $(this);

			/* -- App methods -- */
			var app = {
				init: function(){
					this.cacheElements();
				},
				cacheElements: function(){
					this.dombody     = $('body');
					this.target_src  = (settings.parentlink) ? plg.parent().attr('href') : plg.attr('href');
					this.target_type = this.target_src.substr((this.target_src.lastIndexOf('.') +1));
					this.overlay     = $('<div class="overlay"></div>').css({'width': '100%', 'height': '100%', 'position': 'absolute', 'z-index': '998', 'top': '0', 'left': '0', 'background': settings.overlay_background}).hide();
					this.modal       = $('<div class="modal"></div>').css({'z-index': '999', 'overflow': 'hidden', 'border-radius': settings.modal_border_radius, 'box-shadow': settings.modal_box_shadow, 'padding': settings.modal_padding, 'border': settings.modal_border_style, 'background': settings.modal_background}).hide();
					this.new_image   = $('<img>');
					this.close_btn   = $('<a href="#" class="close-btn" title="Close">' + settings.close_btn_text + '</a>').css({'padding': settings.close_btn_padding, 'font': settings.close_btn_font, 'background': settings.close_btn_bg, 'color': settings.close_btn_color, 'border-radius': settings.close_btn_border_radius, 'position': 'absolute', 'top': '5px', 'right': '5px', 'box-shadow': settings.close_btn_shadow});
					this.extensions  = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
				},
		        loadingAnimation: function(){
		            $.getScript('http://heartcode-canvasloader.googlecode.com/files/heartcode-canvasloader-min-0.9.js', function(){
		                var loader = new CanvasLoader('loader');
		                loader.setShape('spiral');
		                loader.setDiameter(30);
		                loader.setDensity(15);
		                loader.setRange(0.6);
		                loader.setSpeed(1);
		                loader.setColor('#FFFFFF');
		                loader.show();
		            });
		        }
			}

			/* -- Custom methods -- */
			var lightbox = {
				loadImage: function(){
                    this.window_width  = $(document).width();
                    this.window_height = $(document).height();

                    // Source is a file and extension is in allowed array
					if($.inArray(app.target_type, app.extensions) != -1){
	                    this.createModal();
	                    app.modal.prepend(app.new_image);

	                    app.new_image.attr('src', app.target_src).load(function(){
	                    	var img = $(this);

	                    	var tempImage = new Image();
							tempImage.src = img.attr('src');

	                    	if(tempImage.height > ($(window).height() - 200)){
	                    		img.height(($(window).height() - 200));
	                    	}
	                    	lightbox.doModal();
	                    });
	                }
	                // Source is a DOM element
	                else if($('#' + app.target_type).length > 0 || $('.' + app.target_type).length > 0){
	                    this.createModal();
	                    this.contentLoad = ($('#' + app.target_type).length > 0) ? $('#' + app.target_type) : $('.' + app.target_type);
	                    app.modal.prepend(this.contentLoad.html());
	                    lightbox.doModal();
	                }
	                // None of the above alert the user
	                else{
	                    alert('Not a supported file type');
	                }
				},
				createModal: function(){
	                app.dombody.prepend(app.overlay.fadeIn(500));
					app.overlay.css({
						'width'				: this.window_width,
						'height'			: this.window_height,
						'padding-bottom'    : '5%',
						'-webkit-box-sizing': 'content-box',
						'-moz-box-sizing'	: 'content-box',
						'-ms-box-sizing'	: 'content-box',
						'box-sizing'		: 'content-box'
					});
                    app.overlay.before('<div id="loader"></div>');
                    $('#loader').css({'z-index': '999'}).fn_center('all');
                    app.loadingAnimation();

					app.overlay.prepend(app.modal);

					app.modal.prepend(app.close_btn);
				},
				doModal: function(){
					$('#loader').fadeOut(250, function(){
						$(this).remove();
					})
                    app.modal.fn_center('all').fadeIn(500);
                    if(app.modal.position().top <= 25){
                        app.modal.css({'top': '5%'});
                    }
                    if(app.overlay.height() <= app.modal.outerHeight()){
                        app.overlay.css({'height': (app.modal.outerHeight() + parseFloat(app.modal.css('top'))) + 'px'});
                    }
                    app.overlay.fn_blur('on');
				},
				removeModal: function(){
                    app.modal.fadeOut(500, function(){
                        app.overlay.fadeOut(300, function(){
                            app.overlay.fn_blur('off');
                            app.overlay.remove();
                        });
                    });
				}
			}

			/* -- Click events -- */
			plg.on('click', function(e){
				e.preventDefault();

				// Initialise the application
				app.init();

				// Load our lightbox image
				lightbox.loadImage();

				// Close button click event
	            app.close_btn.on({
	                click: function(e){
	                    e.preventDefault();
						lightbox.removeModal();
	                },
	                mouseover: function(){
	                    app.close_btn.css({'background': settings.close_btn_bg_hover});
	                },
	                mouseout: function(){
	                    app.close_btn.css({'background': settings.close_btn_bg});
	                }
	            });

	            // ESC button event
	            $(document).on({
	            	keyup: function(e){
	                    if(e.keyCode == 27){
							lightbox.removeModal();
						}
	            	}
	            });
			});
		});
	};

})(jQuery, window, document);
