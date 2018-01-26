/*
 *  $.thaiTel.js
 *
 *  @copyright 2018 - https://www.sovoboys.net/about/ihut
 *  @version: 0.0.0
 */
 (function($){
$.fn.thaiTel = function(options){

  if (typeof options == typeof function(){}) {
    options = {render: options};
  } else if (typeof options != typeof {}) {
    options = {};
  }

  let settings = $.extend({
    render: function (){/* # FIXME */},
    useCCAs: '0',
    maxGeneratedRange = 20,
  }, options);

  //****************************************************************************

  let
    regexRemovePrefix = /^(\s*)((ติดต่อ(ที่|)|)(หมายเลข|)(โทร(ศัพท์|\s*ฯ?))|tel\s*\.?)\s*[^0-9\+\(\)]+/i,
    regexNumber = /^(?:\( *|)(0|\+? *6[\- ]*6)(?: *\(|)[\- ]*(?:(2|[89][0-9])[\- ]*((?:[0-9][\- ]*){6}[0-9])|([3-7][1-9])[\- ]*((?:[0-9][\- ]*){5}[0-9])) *(.*)$/,
    regexAcceptablePostfix = /^([^0-9]+(.+)|)$/,
    regexThaiRangePostfix = /^\s*(?:\-|ถึง|to.?|\—)\s*[0-9]{1,3}$/,
    _parse = function (str) {
      let
        result = [],
        splitted = str.split(/\s*\,\s*/)
      ;
      // split string using ,
      splitted.forEach(function (each){
        each = _parseEach(each);
        each.wellForm && result.push([each.tel, each.postfix]);
      })
      return result;
    },
    _parseEach = function (e) {
      let parsed = {
        wellForm: false,
        raw: e,
        captured: null,
        cc: null,
        number: null,
        number_p1: null,
        number_p2: null,
        isHomeNumber: false,
        isMobileNumber: false,
        postfix: null,
        tel: null,
      };

      if (typeof e == typeof '') {
        e = e.replace(regexRemovePrefix, ''); // remove prefix
        e = e.replace(/^\s*|\s*$/ig, ''); // trim
        e = e.match(regexNumber);
        if (Array.isArray(e) && e[1] && ((e[2] && e[3]) || (e[4] && e[5])) && (e[6] === null || regexAcceptablePostfix.test(e[6]))) {
          parsed.wellForm = true;
          parsed.captured = e[0];
          parsed.cc = e[1];
          parsed.postfix = e[6] || null;
          if (e[2] && e[3]) {
            parsed.number_p1 = e[2];
            parsed.number_p2 = e[3];
          } else {
            parsed.number_p1 = e[4];
            parsed.number_p2 = e[5];
          }
          parsed.number_p1 == '66' && (parsed.number_p1 = '+66');
          parsed.number_p1 = parsed.number_p1.replace(/[^0-9\+]+/mg, '');
          parsed.number_p2 = parsed.number_p2.replace(/[^0-9]+/mg, '');
          parsed.number = parsed.number_p1 + parsed.number_p2;
          parsed.tel = parsed.cc + parsed.number;
        }
      }

      return parsed;
    },
    _generateRangeNumbers = function (main, range)
    {
      let result = [];
      if (/^+?[0-9]+$/.test(main) && /^[0-9]+$/.test(range) && main.length >= range.length) {
        let to = main.slice(0, -(range.length)) + range.length, x = main;
        if (to.length == main.length && to > main) { // as string
          do {
            x;
          } while (result.length <= (settings.maxGeneratedRange || 20) && x != to);
        }
      }
      return result;
    }
  ;
  //****************************************************************************

  this.each(function() {
    let
      $self = $(this),
      str = ($self.data('phoneNumber') || '') + ''
    ;
    console.warn('>>>>>>>>>>>>>>>>>>>>>>>>>>', str, _parse(str));
  });

  return this
};
}(jQuery));

console.warn('NOT READY YET!');
