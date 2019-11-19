/*
  Template Name : Swiftly Personal / Portfolio template
  Author: Harry
  Create Date: 15/10/2014
  Version: v1.0
*/

/* ------------------------------------------------------------------------------
 This is jquery module for main app
 ------------------------------------------------------------------------------ */
//var $ = jQuery.noConflict(); //Relinquish jQuery's control of the $ variable. 

/* Global constants */

/*global jQuery */
jQuery(function ($) {
    'use strict';

    /**
      * Contact Form Application
      */
      var ContactFormApp = {
        $contactForm: $("#contactForm"),
        $contactFormBtn: $("#contact_submit_btn"),
        $contactFormName: $("#contact_name"),
        $contactFormEmail: $("#contact_email"),
        $contactFormMessage: $("#contact_message"),
        $confirmMessage: $("#cformSuccessMsg"),
        $submitUrl: 'contact.php',

        //Validate Contact Us Data
        validate: function() {
          var err = "";
          //validating name
          var title = this.$contactFormName.val();
          
          if (title == "Name" || title == "" || title == null) {
            this.$contactFormName.addClass("validation");
            err = "error";
          } else {
            this.$contactFormName.removeClass("validation");
          }

          //validating email
          var email = this.$contactFormEmail.val();
          if (!(/(.+)@(.+){2,}\.(.+){2,}/.test(email))) {
            this.$contactFormEmail.addClass("validation");
            err = "error";
          } else {
            this.$contactFormEmail.removeClass("validation");
          }

          //validating message
          var message = this.$contactFormMessage.val();
          if (message == "Message" || message == "" || message == null) {
            this.$contactFormMessage.addClass("validation");
            err = "error";
          } else {
            this.$contactFormMessage.removeClass("validation");
          }
          return err;
        },
        //contact form submit handler
        contactFormSubmit: function(obj) {
          if (this.validate() == "") {
            var resulttext = $.ajax({
              type: "POST",
              url: this.$submitUrl,
              data: this.$contactForm.serialize(),
              async: false,
              success: function(status) {}
            }).responseText;

            this.$confirmMessage.html(resulttext);
            this.$contactForm.delay(100).slideUp(1000);
            this.$confirmMessage.delay(500).slideDown(500);
          
            this.$contactFormName.val('');
            this.$contactFormEmail.val('');
            this.$contactFormMessage.val('');
          }
          return false;
        },
        bindEvents: function() {
          //binding submit event
          this.$contactFormBtn.on('click', this.contactFormSubmit.bind(this));
        },
        init: function() {
          //initializing the contact form
          console.log('Contact form is initialized');
          this.bindEvents();
          return this;
        }
    };

    /**
        Floating menu app
    */
    var FloatingMenuApp = {
        //config
        $options: {float_speed: 1500, float_easing: 'easeOutQuint', menu_fade_speed: 500, closed_menu_opacity: 0.75}, //default config
        //vars
        $flmenu: $(".fl_menu"),
        $sidebarheader: $(".sidebar-section"),
        $sidebarsocial: $("#sidebar-social"),
        $menuPosition: 0,

        floatMenu: function () {
            var scrollAmount = $(document).scrollTop();
            var newPosition = this.$menuPosition + scrollAmount;

            if($(window).height() < this.$flmenu.height()) {
                this.$flmenu.css("top", this.$menuPosition);
            } else {
                if(newPosition <= 0)
                    newPosition=40
                this.$flmenu.stop().animate({top: newPosition}, this.$options.float_speed, this.$options.float_easing);
            }
        },
        initMenuOnLoad: function() {
            this.$menuPosition = this.$flmenu.position().top;
            this.floatMenu();

        },
        scrollMenu: function() {
            if($(document).width() >= 960)
                this.floatMenu();
        },
        bindEvents: function() {
            //any event binding related code should go here in future
        },
        init: function(_options) {
          //initializing the contact form
          console.log('Floating menu initializing');
          $.extend(this.$options, _options);
          this.bindEvents();
          return this;
        }
    };

    /**
    Main application module
    */
    var App = {
        $options: {},
        $floatMenu: FloatingMenuApp.init(),
        $loader: $(".loader"),
        $animationload: $(".animationload"),
        $responsiveMenu: $('a.elemadded'),
        $navbarVertical: $('.navbar-vertical'),
        $menuItem: $('.main-menu a'),
        $animateHeader: $(".tlt"),
        $portfolioGrid: $('#grid'),
        $backToTop: $('.back-to-top'),
        $modalContent: $(".md-content"), //modal box content

        bindEvents: function() {
          //binding events
          $(window).on('load', this.load.bind(this));
          $(window).on('scroll', this.scroll.bind(this));
          $(document).on('ready', this.docReady.bind(this));
        },
        //window load event
        load: function() {
            /* Page Preloader */
            this.$loader.delay(300).fadeOut();
            this.$animationload.delay(600).fadeOut("slow");
            //initilizing menu
            this.$floatMenu.initMenuOnLoad();
        },
        //window scroll event
        scroll: function() {
            //scrolling menu
            this.$floatMenu.scrollMenu();

            //back to top button
            if ($(window).scrollTop() > 100) {
                this.$backToTop.fadeIn();
            } else {
                this.$backToTop.fadeOut();
            }
        },
        //responsive menu
        responsiveMenuOnClick: function(e) {
            e.preventDefault(); //default
            if(this.$navbarVertical.hasClass('active'))
                this.$navbarVertical.removeClass('active');
            else
                this.$navbarVertical.addClass('active');
        },
        menuItemOnClick: function(e) {
            var $anchor = $(e.target);
            this.$menuItem.removeClass('active');
            $anchor.addClass('active');
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 50
            }, 1500, 'easeInOutExpo');
            e.preventDefault();
        },
        scrollToTop: function() {
            $("html, body").animate({ scrollTop: 0 }, 1000);
            return false;
        },
        //document ready event
        docReady: function() {
            //contat form
            ContactFormApp.init();

            /*  menu responsive */
            this.$responsiveMenu.on('click', this.responsiveMenuOnClick.bind(this));

            /* menu */
            this.$menuItem.on('click', this.menuItemOnClick.bind(this));

            /* scroll to top */
            this.$backToTop.on('click', this.scrollToTop.bind(this));

            /* animated header text */
            this.$animateHeader.textillate({
                loop: true,
                minDisplayTime: 2e3,
                initialDelay: 0,
                autoStart: true,
                "in": {
                    effect: "flipInY",
                    delayScale: 2.5,
                    delay: 50,
                    sync: false,
                    shuffle: false,
                    reverse: false
                },
                out: {
                    effect: "flipOutY",
                    delayScale: 2.5,
                    delay: 50,
                    sync: false,
                    shuffle: false,
                    reverse: false
                }
            });

            /* Portfolio Mix */
            this.$portfolioGrid.mixitup({
                targetSelector: '.mix',
            });

            /* NiceScroll */
            $("html").niceScroll({
                scrollspeed: 50,
                mousescrollstep: 38,
                cursorwidth: 7,
                cursorborder: 0,
                autohidemode: true,
                zindex: 9999999,
                horizrailenabled: false,
                cursorborderradius: 0
            });

            this.$modalContent.niceScroll({
                scrollspeed: 50,
                mousescrollstep: 38,
                cursorwidth: 7,
                cursorborder: 0,
                autohidemode: true,
                zindex: 9999999,
                horizrailenabled: false,
                cursorborderradius: 0,
                cursorcolor: 'transparent'
            });
            var wow = new WOW(
                {
                    boxClass: 'wow', // animated element css class (default is wow)
                    animateClass: 'animated', // animation css class (default is animated)
                    offset: 10, // distance to the element when triggering the animation (default is 0)
                    mobile: false        // trigger animations on mobile devices (true is default)
                }
            );
            wow.init();
        },
        init: function (_options) {
            $.extend(this.$options, _options);
            this.bindEvents();
        }
    };

    //Initializing the app
    App.init({});

});