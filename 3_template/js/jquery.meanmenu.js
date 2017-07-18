/*!
 * jQuery meanMenu v2.0.6.custom-3
 * @Copyright (C) 2012-2013 Chris Wharton (https://github.com/weare2ndfloor/meanMenu)
 *
 */
(function ($) {
	"use strict";
    $.fn.meanmenu = function (options) {
        var defaults = {
            meanMenuTarget: jQuery(this), // Target the current HTML markup you wish to replace
            meanMenuContainer: '#mnavigation', // Choose where meanmenu will be placed within the HTML
            meanMenuClose: '<span class="mtxt">MENU</span> <span class="micn"><span /><span /><span /></span>', // single character you want to represent the close menu button
            meanMenuCloseSize: "18px", // set font size of close button
            meanMenuOpen: '<span class="mtxt">MENU</span> <span class="micn"><span /><span /><span /></span>', // text/markup you want when menu is closed
            meanRevealPosition: "right", // left right or center positions
            meanRevealPositionDistance: "0", // Tweak the position of the menu
            meanRevealColour: "", // override CSS colours for the reveal background
            meanRevealHoverColour: "", // override CSS colours for the reveal hover
            meanScreenWidth: "990", // set the screen width you want meanmenu to kick in at
            meanNavPush: "", // set a height here in px, em or % if you want to budge your layout now the navigation is missing.
            meanShowChildren: true, // true to show children in the menu, false to hide them
            meanExpandableChildren: true, // true to allow expand/collapse children
            meanExpand: '<span></span>', // single character you want to represent the expand for ULs
            meanContract: '<span></span>', // single characracter you want to represent the contract for ULs
            meanRemoveAttrs: false, // true to remove classes and IDs, false to keep them
            onePage: false, // set to true for one page sites
            removeElements: "" // set to hide page elements
        };
        var options = $.extend(defaults, options);
        
        // get browser width
       var currentWidth = window.innerWidth || document.documentElement.clientWidth;

        return this.each(function () {
            var meanMenu = options.meanMenuTarget;
            var meanContainer = options.meanMenuContainer;
            var meanReveal = options.meanReveal;
            var meanMenuClose = options.meanMenuClose;
            var meanMenuCloseSize = options.meanMenuCloseSize;
            var meanMenuOpen = options.meanMenuOpen;
            var meanRevealPosition = options.meanRevealPosition;
            var meanRevealPositionDistance = options.meanRevealPositionDistance;
            var meanRevealColour = options.meanRevealColour;
            var meanRevealHoverColour = options.meanRevealHoverColour;
            var meanScreenWidth = options.meanScreenWidth;
            var meanNavPush = options.meanNavPush;
            var meanRevealClass = ".meanmenu-reveal";
            var meanShowChildren = options.meanShowChildren;
            var meanExpandableChildren = options.meanExpandableChildren;
            var meanExpand = options.meanExpand;
            var meanContract = options.meanContract;
            var meanRemoveAttrs = options.meanRemoveAttrs;
            var onePage = options.onePage;
            var removeElements = options.removeElements;
                        
            //detect known mobile/tablet usage
            if ( (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/Blackberry/i)) || (navigator.userAgent.match(/Windows Phone/i)) ) {
                var isMobile = true;
            }
            
            if ( (navigator.userAgent.match(/MSIE 8/i)) || (navigator.userAgent.match(/MSIE 7/i)) ) {
            	// add scrollbar for IE7 & 8 to stop breaking resize function on small content sites
                jQuery('html').css("overflow-y" , "scroll");
            }
                        
            function meanCentered() {
            	if (meanRevealPosition == "center") {
	            	var newWidth = window.innerWidth || document.documentElement.clientWidth;
	            	var meanCenter = ( (newWidth/2)-22 )+"px";
	            	meanRevealPos = "left:" + meanCenter + ";right:auto;";
	            	
	            	if (!isMobile) {	            	
	            		jQuery('.meanmenu-reveal').css("left",meanCenter); 
	            	} else {
		            	jQuery('.meanmenu-reveal').animate({
		            	    left: meanCenter
		            	});
	            	}
            	}
            }
            
            var menuOn = false;
            var meanMenuExist = false;
            
            if (meanRevealPosition == "right") {
                meanRevealPos = "right:" + meanRevealPositionDistance + ";left:auto;";
            }
            if (meanRevealPosition == "left") {
                var meanRevealPos = "left:" + meanRevealPositionDistance + ";right:auto;";
            } 
            // run center function	
            meanCentered();
            
            // set all styles for mean-reveal
            var meanStyles = "background:"+meanRevealColour+";color:"+meanRevealColour+";"+meanRevealPos;
			var $navreveal = "";
			
            function meanInner() {
                // get last class name
                if (jQuery($navreveal).is(".meanmenu-reveal.meanclose")) {
                    $navreveal.html(meanMenuClose);
                } else {
                    $navreveal.html(meanMenuOpen);
                }
            }    
            //re-instate original nav (and call this on window.width functions)
            function meanOriginal() {
            	jQuery('.mean-bar,.mean-push').remove();
            	jQuery(meanContainer).removeClass("mean-container");
            	jQuery(meanMenu).show();
            	menuOn = false;
            	meanMenuExist = false;
            	jQuery(removeElements).removeClass('mean-remove');
// ------------------- --------  tuk shte sloja aside
				if ($("aside").length > 0){
					$("aside").show();
					$("#content").removeClass( "no-side-menu" );
				} 
			}
            //navigation reveal 
            function showMeanMenu() {
                if (currentWidth <= meanScreenWidth) {
		            jQuery(removeElements).addClass('mean-remove');        
                	meanMenuExist = true;
                	// add class to body so we don't need to worry about media queries here, all CSS is wrapped in '.mean-container'
                	jQuery(meanContainer).addClass("mean-container");
                	jQuery('.mean-container').prepend('<div class="mean-bar"><a href="#nav" class="meanmenu-reveal" style="'+meanStyles+'">Show Navigation</a><nav class="mean-nav"></nav></div>');
                    
                    //push meanMenu navigation into .mean-nav
                    var meanMenuContents = jQuery(meanMenu).html();
                    jQuery('.mean-nav').html(meanMenuContents);
            		
            		// remove all classes from EVERYTHING inside meanmenu nav
            		if(meanRemoveAttrs) {
            			jQuery('nav.mean-nav ul, nav.mean-nav ul *').each(function() {
            				jQuery(this).removeAttr("class");
            				jQuery(this).removeAttr("id");
            			});
            		}
                    
                    // push in a holder div (this can be used if removal of nav is causing layout issues)
                    jQuery(meanMenu).before('<div class="mean-push" />');
                    jQuery('.mean-push').css("margin-top",meanNavPush);
                    
                    // hide current navigation and reveal mean nav link
                    jQuery(meanMenu).hide();
                    jQuery(".meanmenu-reveal").show();
                    
                    // turn 'X' on or off 
                    jQuery(meanRevealClass).html(meanMenuOpen);
                    $navreveal = jQuery(meanRevealClass);
// ------------------- --------  tuk shte sloja aside
 					if ($("aside").length > 0) {
						$(".mean-nav").append("<div class='aside-top-menu'></div>");
						$(".aside-top-menu").append($("aside ul").clone());
						$("aside").hide();
						$("#content").addClass( "no-side-menu" );
						
						$(".mean-bar").prepend($("aside .sub-contacts").clone());
						$(".mean-bar .sub-contacts").addClass("mobile-contacts").removeClass("sub-contacts");
						$(".meanmenu-reveal").before("<div class='contacts-c-b'><a href='#' title='Click to show/hide contact information'></a></div>");
						$(".mobile-contacts").hide();
					}			
                    //hide mean-nav ul
                    jQuery('.mean-nav ul').hide();
                    
                    // hide sub nav
	                   if(meanShowChildren) {
	                   		// allow expandable sub nav(s)
	                       if(meanExpandableChildren){
		                       jQuery('.mean-nav ul ul').each(function() {
		                           if(jQuery(this).children().length){
		                               jQuery(this,'li:first').parent().append('<a class="mean-expand" href="#" style="font-size: '+ meanMenuCloseSize +'">'+ meanExpand +'</a>');                               
		                           }
		                       });
		                       jQuery('.mean-expand').on("click",function(e){
		                       		e.preventDefault();
		                       	   if (jQuery(this).hasClass("mean-clicked")) {
		                       	   		jQuery(this).html(meanExpand);
		                               jQuery(this).prev('ul').slideUp(300, function(){});
		                           } else {
		                           		jQuery(this).html(meanContract);
		                           		jQuery(this).prev('ul').slideDown(300, function(){});
		                           }   
		                           jQuery(this).toggleClass("mean-clicked"); 
		                       });     
	                       } else {
	                           jQuery('.mean-nav ul ul').show();   
	                       }
	                   } else {
	                       jQuery('.mean-nav ul ul').hide();
	                   }
	                   
                    // add last class to tidy up borders
                    jQuery('.mean-nav ul li').last().addClass('mean-last');
                
                    $navreveal.removeClass("meanclose");
                    jQuery($navreveal).click(function(e){
                    	e.preventDefault();
	            		if( menuOn == false ) {
	                        $navreveal.css("text-align", "center");
	                        $navreveal.css("text-indent", "0");
	                        $navreveal.css("font-size", meanMenuCloseSize);
	                        jQuery('.mean-nav ul:first').slideDown(); 
// ----------------- tuk pak e moe :)
 							if ($("aside").length > 0){
								jQuery('.mean-nav .aside-top-menu ul').slideDown(); 
							} 
	                        menuOn = true;
	                    } else {
	                    	jQuery('.mean-nav ul:first').slideUp();
// ----------------- tuk pak e moe :)
 							if ($("aside").length > 0){
								jQuery('.mean-nav .aside-top-menu ul').slideUp(); 
							}
	                    	menuOn = false;
	                    }    
                        $navreveal.toggleClass("meanclose");
                        meanInner();
                        jQuery(removeElements).addClass('mean-remove');
                    });
// ------------------- --------  tova e za kontaktite
  	$('.contacts-c-b a').on('click', function(event){
		$('.mobile-contacts').toggle();
		event.preventDefault();
		if( menuOn == true ) {
			jQuery('.mean-nav ul:first').slideUp();
			if ($("aside").length > 0){
				jQuery('.mean-nav .aside-top-menu ul').slideUp(); 
			}
			menuOn = false;   
			$navreveal.toggleClass("meanclose");
			meanInner();
			jQuery(removeElements).addClass('mean-remove');
		}
	});
	$('body').click(function(e) {
	
	var target = $(e.target);
	if(!target.is('.contacts-c-b') && !target.is('.contacts-c-b *') && !target.is('.mobile-contacts') && !target.is('.mobile-contacts *')) {
		if ( $('.mobile-contacts').is(':visible') ) {
			$('.mobile-contacts').hide();
		}
	}

	}); 
                    
                    // for one page websites, reset all variables...
                    if ( onePage ) {
                    
						jQuery('.mean-nav ul > li > a:first-child').on( "click" , function () {
							jQuery('.mean-nav ul:first').slideUp();
							menuOn = false;
							jQuery($navreveal).toggleClass("meanclose").html(meanMenuOpen);
						
						});
                    
                    }
                    
                } else {
                	meanOriginal();
                }	
            } 
            
            if (!isMobile) {
                //reset menu on resize above meanScreenWidth
                jQuery(window).resize(function () {
                    currentWidth = window.innerWidth || document.documentElement.clientWidth;
                    if (currentWidth > meanScreenWidth) {
                        meanOriginal();
                    } else {
                    	meanOriginal();
                    }	
                    if (currentWidth <= meanScreenWidth) {
                        showMeanMenu();
                        meanCentered();
// ------------------- --------  tova e za kontaktite
					 	$('#header-buttons.sh').hide(); 
						
                    } else {
                    	meanOriginal();
                    }	
                });
            }

       		// adjust menu positioning on centered navigation     
            window.onorientationchange = function() {
            	meanCentered();
            	// get browser width
            	currentWidth = window.innerWidth || document.documentElement.clientWidth;
            	if (currentWidth >= meanScreenWidth) {
            		meanOriginal();
            	}
            	if (currentWidth <= meanScreenWidth) {
            		if (meanMenuExist == false) {
            			showMeanMenu();
            		}
            	}
            }
           // run main menuMenu function on load
           showMeanMenu(); 
		   meanOriginal();
           showMeanMenu(); 
        });
    };
})(jQuery);