/**
 * !Resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
  var currentWidth = $('body').outerWidth();
  resizeByWidth = prevWidth !== currentWidth;
  if (resizeByWidth) {
    $(window).trigger('resizeByWidth');
    prevWidth = currentWidth;
  }
});

/**
 * !Detected touchscreen devices
 * */
var TOUCH = Modernizr.touchevents;
var DESKTOP = !TOUCH;

/**
 * !Detect scroll page
 */
function detectScroll() {
  // external js:
  // 1) resizeByWidth (resize only width);

  var $page = $('html'),
      // $fixedElement = $('.main-nav'),
      // var minScrollTop = $fixedElement.offset().top,
      minScrollTop = $('.header').outerHeight(),
      currentScrollTop = $(window).scrollTop();

  $page.toggleClass('page-scrolled', (currentScrollTop > minScrollTop));

  $(window).on('load resizeByWidth scroll', function () {

    // minScrollTop = $fixedElement.offset().top;
    minScrollTop = $('.header').outerHeight();
    currentScrollTop = $(window).scrollTop();
    $page.toggleClass('page-scrolled', (currentScrollTop > minScrollTop));
  })
}

/**
 * !Toggle class on a form elements on focus
 * */
function inputFocusClass() {
  var $inputs = $('.field-js');

  if ($inputs.length) {
    var $fieldWrap = $('.input-wrap');
    var $selectWrap = $('.select');
    var classFocus = 'focused';

    $inputs.focus(function () {
      var $currentField = $(this);
      var $currentFieldWrap = $currentField.closest($fieldWrap);

      $currentField.addClass(classFocus);
      $currentField.prev('label').addClass(classFocus);
      $currentField.closest($selectWrap).prev('label').addClass(classFocus);
      $currentFieldWrap.addClass(classFocus);
      $currentFieldWrap.find('label').addClass(classFocus);

    }).blur(function () {
      var $currentField = $(this);
      var $currentFieldWrap = $currentField.closest($fieldWrap);

      $currentField.removeClass(classFocus);
      $currentField.prev('label').removeClass(classFocus);
      $currentField.closest($selectWrap).prev('label').removeClass(classFocus);
      $currentFieldWrap.removeClass(classFocus);
      $currentFieldWrap.find('label').removeClass(classFocus);

    });
  }
}

/**
 * !Toggle class on a form elements if this one has a value
 * */
function inputHasValueClass() {
  var $inputs = $('.field-js');

  if ($inputs.length) {
    var $fieldWrap = $('.input-wrap');
    var $selectWrap = $('.select');
    var classHasValue = 'filled';

    $.each($inputs, function () {
      switchHasValue.call(this);
    });

    $inputs.on('keyup change', function () {
      switchHasValue.call(this);
    });

    function switchHasValue() {
      var $currentField = $(this);
      var $currentFieldWrap = $currentField.closest($fieldWrap);

      //first element of the select must have a value empty ("")
      if ($currentField.val().length === 0) {
        $currentField.removeClass(classHasValue);
        $currentField.prev('label').removeClass(classHasValue);
        $currentField.closest($selectWrap).prev('label').removeClass(classHasValue);
        $currentFieldWrap.removeClass(classHasValue);
        $currentFieldWrap.find('label').removeClass(classHasValue);
      } else if (!$currentField.hasClass(classHasValue)) {
        $currentField.addClass(classHasValue);
        $currentField.prev('label').addClass(classHasValue);
        $currentField.closest($selectWrap).prev('label').addClass(classHasValue);
        $currentFieldWrap.addClass(classHasValue);
        $currentFieldWrap.find('label').addClass(classHasValue);
      }
    }
  }
}

/**
 * !jquery.ms-switch-class.js
 * Version: 2018.1.0
 * Author: *
 * Description: Extended toggle class
 */

(function ($) {
  'use strict';

  var countFixedScroll = 0;
  // Нужно для корректной работы с доп. классом фиксирования скролла

  var SwitchClass = function (element, config) {
    var self,
        $element = $(element),
        $html = $('html'),
        pref = 'jq-switch-class',
        pluginClasses = {
          initClass: pref + '_initialized'
        },
        mod = {
          scrollFixedClass: 'css-scroll-fixed'
        },
        $switchClassTo = $element.add(config.switcher).add(config.adder).add(config.remover).add(config.switchClassTo),
        classIsAdded = false; //Флаг отвечающий на вопрос: класс добавлен?

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('switchClass.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        prevent = function (event) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        },
        toggleFixedScroll = function () {
          $html.toggleClass(mod.scrollFixedClass, !!countFixedScroll);
        },
        add = function () {
          if (classIsAdded) return;

          // Callback before added class
          $element.trigger('switchClass.beforeAdded');

          // Добавить активный класс на:
          // 1) Основной элемент
          // 2) Дополнительный переключатель
          // 3) Элементы указанные в настройках экземпляра плагина
          $switchClassTo.addClass(config.modifiers.activeClass);

          classIsAdded = true;

          if (config.cssScrollFixed) {
            // Если в настойках указано, что нужно добавлять класс фиксации скролла,
            // То каждый раз вызывая ДОБАВЛЕНИЕ активного класса, увеличивается счетчик количества этих вызовов
            ++countFixedScroll;
            toggleFixedScroll();
          }

          // callback after added class
          $element.trigger('switchClass.afterAdded');
        },
        remove = function () {
          if (!classIsAdded) return;

          // callback beforeRemoved
          $element.trigger('switchClass.beforeRemoved');

          // Удалять активный класс с:
          // 1) Основной элемент
          // 2) Дополнительный переключатель
          // 3) Элементы указанные в настройках экземпляра плагина
          $switchClassTo.removeClass(config.modifiers.activeClass);

          classIsAdded = false;

          if (config.cssScrollFixed) {
            // Если в настойках указано, что нужно добавлять класс фиксации скролла,
            // То каждый раз вызывая УДАЛЕНИЕ активного класса, уменьшается счетчик количества этих вызовов
            --countFixedScroll;
            toggleFixedScroll();
          }

          // callback afterRemoved
          $element.trigger('switchClass.afterRemoved');
        },
        events = function () {
          $element.on('click', function (event) {
            if (classIsAdded) {
              remove();

              event.preventDefault();
              return false;
            }

            add();

            prevent(event);
          });

          $(config.switcher).on('click', function (event) {
            $element.click();
            prevent(event);
          });

          $(config.adder).on('click', function (event) {
            add();
            prevent(event);
          });

          $(config.remover).on('click', function (event) {
            remove();
            prevent(event);
          })

        },
        removeByClickOutside = function () {
          $html.on('click', function (event) {
            if (classIsAdded && config.removeOutsideClick && !$(event.target).closest('.' + config.modifiers.stopRemoveClass).length) {
              remove();
              // event.stopPropagation();
            }
          });
        },
        removeByClickEsc = function () {
          $html.keyup(function (event) {
            if (classIsAdded && config.removeEscClick && event.keyCode === 27) {
              remove();
            }
          });
        },
        init = function () {
          $element.addClass(pluginClasses.initClass).addClass(config.modifiers.initClass);
          $element.trigger('switchClass.afterInit');
        };

    self = {
      callbacks: callbacks,
      remove: remove,
      events: events,
      removeByClickOutside: removeByClickOutside,
      removeByClickEsc: removeByClickEsc,
      init: init
    };

    return self;
  };

  // $.fn.switchClass = function (options, params) {
  $.fn.switchClass = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;
    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        _[i].switchClass = new SwitchClass(_[i], $.extend(true, {}, $.fn.switchClass.defaultOptions, opt));
        _[i].switchClass.callbacks();
        _[i].switchClass.events();
        _[i].switchClass.removeByClickOutside();
        _[i].switchClass.removeByClickEsc();
        _[i].switchClass.init();
      }
      else {
        ret = _[i].switchClass[opt].apply(_[i].switchClass, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return _;
  };

  $.fn.switchClass.defaultOptions = {
    switcher: null,
    /**
     * @description - Дополнительный элемент, которым можно ДОБАВЛЯТЬ/УДАЛЯТЬ класс
     * @example {String}{JQ Object} null - '.switcher-js', или $('.switcher-js')
     */
    adder: null,
    /**
     * @description - Дополнительный элемент, которым можно ДОБАВЛЯТЬ класс
     * @example {String}{JQ Object} null - '.adder-js', или $('.adder-js')
     */
    remover: null,
    /**
     * @description - Дополнительный элемент, которым можно УДАЛЯТЬ класс
     * @example {String}{JQ Object} null - '.remover-js', или $('.remover-js')
     */
    switchClassTo: null,
    /**
     * @description - Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
     * @example {JQ Object} null - 1) $('html, .popup-js, .overlay-js')
     * @example {JQ Object} null - 2) $('html').add('.popup-js').add('.overlay-js')
     */
    removeOutsideClick: true,
    /**
     * @description - Удалать класс по клику по пустому месту на странице? Если по клику на определенный элемент удалять класс не нужно, то на этот элемент нужно добавить дата-антрибут [data-tc-stop]
     * @param {boolean} true - или false
     */
    removeEscClick: true,
    /**
     * @description - Удалять класс по клику на клавишу Esc?
     * @param {boolean} true - или false
     */
    cssScrollFixed: false,
    /**
     * @description - Добавлять на html дополнительный класс 'css-scroll-fixed'? Через этот класс можно фиксировать скролл методами css
     * @see - _mixins.sass =scroll-blocked()
     * @param {boolean} true - или false.
     */
    modifiers: {
      initClass: null,
      activeClass: 'active',
      stopRemoveClass: 'stop-remove-class' // Если кликнуть по елементу с этим классам, то событие удаления активного класса не будет вызвано
    }
    /**
     * @description - Список классов-модификаторов
     */
  };

})(jQuery);

/**
 * !Toggle shutters panel, like a search panel, a catalog shutter etc.
 */
function switchClasses() {
  // Toggle shutter navigation
  var $shutterNavSwitcher = $('.shutter-nav-switcher-js'), $html = $('html');
  if ($shutterNavSwitcher.length) {
    $shutterNavSwitcher.switchClass({
      switchClassTo: $('.shutter-nav-js').add('.shutter-overlay-js')
      , remover: $('.shutter-nav-close-js')
      , modifiers: {
        activeClass: 'shutter-nav_is-open'
      }
      , cssScrollFixed: true
      , removeOutsideClick: true
      , afterAdded: function () {
        $html.addClass('open-only-mob');
      }
      , afterRemoved: function () {
        $html.removeClass('open-only-mob');
      }
    });
  }
}

/**
 * !Initial sliders on the project
 * */
function slidersInit() {
  /** Cases slider */
  var $casesSlider = $('.cases-slider-js');
  if ($casesSlider.length) {
    $casesSlider.each(function () {
      var $thisSlider = $(this),
          $thisPag = $('.swiper-pagination', $thisSlider),
          casesSliderJs;

      casesSliderJs = new Swiper($thisSlider, {
        init: false,

        // Optional parameters
        loop: true,
        loopedSlides: 20,
        spaceBetween: 40,
        slidesPerView: 'auto',
        watchSlidesVisibility: true,
        parallax: true,
        slideToClickedSlide: true,
        // autoplay: {
        //   delay: 3000,
        //   disableOnInteraction: true
        // },
        pagination: {
          el: $thisPag,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          639: {
            spaceBetween: 20
          }
        }
      });

      casesSliderJs.on('init', function() {
        $(casesSliderJs.el).closest($thisSlider).addClass('is-loaded');
        $(casesSliderJs.slides).matchHeight({
          byRow: true, property: 'height', target: null, remove: false
        });
      });

      casesSliderJs.init();
    });
  }

  /** Advantages slider */
  var $advantagesSlider = $('.advantages-slider-js');
  if ($advantagesSlider.length) {
    $advantagesSlider.each(function () {
      var $thisSlider = $(this),
          $thisPag = $('.swiper-pagination', $thisSlider),
          advantagesSliderJs;

      advantagesSliderJs = new Swiper($thisSlider, {
        init: false,

        // Optional parameters
        loop: true,
        loopedSlides: 20,
        spaceBetween: 122,
        slidesPerView: 'auto',
        centeredSlides: true,
        watchSlidesVisibility: true,
        parallax: true,
        slideToClickedSlide: true,
        // autoplay: {
        //   delay: 3000,
        //   disableOnInteraction: true
        // },
        pagination: {
          el: $thisPag,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          639: {
            spaceBetween: 20
          }
        }
      });

      advantagesSliderJs.on('init', function() {
        $(advantagesSliderJs.el).closest($thisSlider).addClass('is-loaded');
      });

      advantagesSliderJs.init();
    });
  }
}

/**
 * !Form validation
 * */
function scrollToAnchor(){
  var $page = $('html, body');

  $('body').on('click', 'a[href^="#"]', function (e) {

    var $curAnchor = $(this);

    if ($curAnchor.attr('href') === '#') {
      return;
    }

    e.preventDefault();

    var $scrollElem = $($curAnchor.attr('href'));

    if (!$page.is(':animated')) {
      $page.stop().animate({scrollTop: $scrollElem.offset().top - $('.header').innerHeight()}, 300);
    }
  });

  $('.logo').on('click', function (e) {
    e.preventDefault();

    if (!$page.is(':animated')) {
      $page.stop().animate({scrollTop: 0}, 300);
    }
  })
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(document).ready(function () {
  detectScroll();
  inputFocusClass();
  inputHasValueClass();
  switchClasses();
  slidersInit();
  scrollToAnchor();
  objectFitImages(); // object-fit-images initial
});
