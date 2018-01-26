/*
 *  jQuery.thaiTel.js
 *
 *  @copyright 2018 - https://www.sovoboys.net/about/ihut
 *  @version: 0.0.0
 */

 /**
 # TODO
 - force settings.useCCAs
 - remove non-numeric
 - handle parsed.postfix
 - do default render
 - do default onError - need to add param 2
 **/
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
    maxGeneratedRange: 20,
  }, options);

  //****************************************************************************

  let
    regexNumber = /^(?:(\( ?0 ?\)|0) {0,2}(?:\( ?\+? ?66 ?\)|)|(\( ?\+? ?66 ?\)|\+? ?66) {0,2}(?:\( ?0 ?\)|))[\- ]*(?:(2|[89] *[0-9])[\- ]*((?:[0-9][\- ]*){6}[0-9])|([3-7] *[1-9])[\- ]*((?:[0-9][\- ]*){5}[0-9])) *(.*)$/,
    regexAcceptablePostfix = /^([^0-9]+(.+)|)$/,
    regexThaiRangePostfix = /^\s*(?:\-|ถึง|to.?|\—)\s*([0-9]{1,3})(?:[^0-9]+.*|)\s*$/i,
    _parse = function (str) {
      let
        result = [],
        splitted = str.split(/\s*\,\s*/)
      ;
      // split string using ,
      splitted.forEach(function (each){
        each = _parseEach(each);
        if (each.wellFormed) {
          result.push(each.parsed);
          let rangeTo = each.postfix ? each.postfix.match(regexThaiRangePostfix) : null;
          if (Array.isArray(rangeTo) && rangeTo.length == 2 && /^[0-9]+$/.test(rangeTo[1])) {
            // do shift until rangeTo[1] or settings.maxGeneratedRange
            let range = _generateRangeNumberStr(each.parsed, rangeTo[1]);
            if (Array.isArray(range)) {
              result = result.concat(range);
            }
          }
        }
      })
      return result;
    },
    _parseEach = function (e) {
      let ped = {
        wellFormed: false,
        raw: e,
        captured: null,
        cc: null,
        number: null,
        number_p1: null,
        number_p2: null,
        isHomeNumber: false,
        isMobileNumber: false,
        postfix: null,
        parsed: null,
        formatted: null,
      };

      if (typeof e == typeof '') {
        e = e.replace(/^\s*|\s*$/ig, ''); // trim
        e = e.match(regexNumber);
        /**
          captured data should be
          e[1] = undefined (unless e[2]) || (cc) 0
          e[2] = undefined (unless e[1]) || (cc) \+?66
          e[3] = undefined (unless e[5]) || 2|[89][0-9]
          e[4] = undefined (unless e[6]) || {7 digit number after e[3]}
          e[5] = undefined (unless e[3]) || [3-7][0-9]
          e[6] = undefined (unless e[4]) || {6 digit number after e[5]}
          e[7] = || .* after e[4] or e[6]           * more validation required
        **/
        if (Array.isArray(e) && e.length == 8 && (e[1] || e[2]) && ((e[3] && e[4]) || (e[5] && e[6])) && regexAcceptablePostfix.test(e[7])) {
          ped.wellFormed = true;
          ped.captured = e[0];

          ped.cc = e[1] || "+66";
          ped.postfix = e[7] || null;
          if (e[3] && e[4]) {
            ped.number_p1 = e[3];
            ped.number_p2 = e[4];
            ped[e[3] == 2 ? 'isHomeNumber' : 'isMobileNumber'] = true;
          } else {
            ped.number_p1 = e[5];
            ped.number_p2 = e[6];
            ped.isHomeNumber = true;
          }
          ped.number_p1 = ped.number_p1.replace(/[^0-9]+/mg, '');
          ped.number_p2 = ped.number_p2.replace(/[^0-9]+/mg, '');
          ped.number = ped.number_p1 + ped.number_p2;
          ped.parsed = ped.cc + ped.number;
        }
      }

      return ped;
    },
    _generateRangeNumberStr = function (main, toPostfix)
    {
      let gen = [];
      if (typeof main == typeof '' && typeof toPostfix == typeof '' && /^[0-9]{1,3}$/.test(toPostfix)) {
        let regexPostfixMatched = new RegExp(toPostfix + '$');
        do {
          main = _shiftNumberStr(main);
          gen.push(main);
        } while (gen.length <= settings.maxGeneratedRange && (! regexPostfixMatched.test(main)));
        if (gen.length > settings.maxGeneratedRange) { // assume failed
          gen = false;
        }
      }
      return gen;
    },
    _shiftNumberStr = function (str) {
      let result = '0';
      if (typeof str == typeof '' && str.length) {
        let l = '', r = '', rDigits = 0, foundBreak = false;
        str = str.split('').reverse();
        for (let i in str) {
          if ((! foundBreak) && /^[0-9]$/.test(str[i])) {
            r = str[i] + r;
          } else {
            l = str[i] + l;
            foundBreak = true;
          }
        }
        rDigits = r.length;
        r = (rDigits ? parseInt(r) + 1 : 0) + '';
        while (rDigits > r.length) {r = '0' + r}
        result = l + r;
      }
      return result;
    }
  ;
  //****************************************************************************

  this.each(function() {
    let
      $self = $(this),
      str = ($self.data('phoneNumber') || '') + ''
      //_parse(str);
    ;
    console.warn('>>>>>>>>>>>>>>>>>>>>>>>>>>', str, _parse(str));
  });

  return this
};
}(jQuery));

console.warn('NOT READY YET!');
