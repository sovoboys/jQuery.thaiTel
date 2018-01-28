/*
 *  jQuery.thaiTel.js
 *
 *  Copyright 2018, Phongphatt Cheewahkidakarn - https://www.sovoboys.net/about/ihut
 *  Released under the WTFPL license
 *  http://www.wtfpl.net/
 *
 *  Github: https://github.com/sovoboys/jQuery.thaiTel
 *  Version: 0.0.1
 */

(function($){
$.fn.thaiTel = function(options, param2){

  // handle given params
  if (typeof options == typeof function(){}) {
    options = {render: options};
  } else if (typeof options != typeof {}) {
    options = {};
  }
  if (typeof param2 == typeof function(){}) {
    options.fail = param2;
  }

  // merge params with default settings
  let settings = $.extend({
    forceUseCC: null,
    maxGeneratedRange: 20,
    render: function (numbers, $stage, inputData){
      // default render() - render one .btn or .btn-group dropdown (twitter bootstrap v3)
      let $ele = $('<div>').addClass('btn-group'),
        $mainBtn = $('<button>').addClass('btn btn-info dropdown-toggle').attr({type: 'button', 'data-toggle': 'dropdown', 'aria-haspopup': true, 'aria-expanded': false}),
        $mainBtnLabel = $('<span>').append($('<span>').addClass('glyphicon glyphicon-earphone')).append($('<span>').text(' ' + inputData + ' ')).append($('<span>').addClass('caret')),
        $ul = $('<ul>').addClass('dropdown-menu')
      ;
      $mainBtn.append($mainBtnLabel).appendTo($ele);
      numbers.forEach(function (number){
        let $li = $('<li>'), $a = $('<a>').attr('href', 'tel:' + number.parsedForceCC).append($('<span>').addClass('glyphicon glyphicon-earphone')).append($('<span>').text(' ' + number.formatted));
        $li.append($a).appendTo($ul);
      });
      $ele.append($ul);

      $ele.appendTo($stage);
    },
    fail: function ($stage, inputData){
      // default fail() *on failed to parse all phone numbers for an element
      let $ele = $('<div>').addClass('btn-group'),
        $mainBtn = $('<button>').addClass('btn btn-warning dropdown-toggle').attr({type: 'button', 'data-toggle': 'dropdown', 'aria-haspopup': true, 'aria-expanded': false}),
        $mainBtnLabel = $('<span>').append($('<span>').addClass('glyphicon glyphicon-earphone')).append($('<span>').text(' ')).append($('<span>').addClass('glyphicon glyphicon-exclamation-sign')).append($('<span>').text(' ' + inputData + ' ')).append($('<span>').addClass('caret')),
        $ul = $('<ul>').addClass('dropdown-menu'),
        $li = $('<li>'), $a = $('<a>').attr('href', 'tel:' + inputData).append($('<span>').addClass('glyphicon glyphicon-earphone')).append($('<span>').text(' ' + inputData))
      ;
      $li.append($a).appendTo($ul);
      $mainBtn.append($mainBtnLabel).appendTo($ele);
      $ele.append($ul).appendTo($stage);
    },
  }, options);

  //************ private *******************************************************

  let
    regexNumber = new RegExp(
      '^' + //
        // ▼ country code 0|+66 ▼
        '(?:' +
            '(' +
              '\\( ?0 ?\\)|0' + // use 0
            ')' +
            ' {0,2}' +
            '(?:' +
              '\\( ?\\+? ?66 ?\\)|\\+? ?66|' +  // may followed by +66
            ')' +
          '|' +   // ..or..
            '(' +
              '\\( ?\\+? ?66 ?\\)|\\+? ?66' +   // use 66
            ')' +
            ' {0,2}' +
            '(?:' +
              '\\( ?0 ?\\)|0|' +  // may followed by 0
            ')' +
        ')' +
        // ▲ country code +66|0 ▲
        // ▼ numbers ▼
        '[\\-\\— ]*' +
        '(?:' +
            // ▼ starts with 2 or [8-9][0-9] ▼
            '(2|[89] *[0-9])' +   // starts with 2 or [8-9][0-9]
            '[\\-\\— ]*' +
            '(' +
              '(?:[0-9][\\-\\— ]*){6}[0-9]' +  // and 7 digits after
            ')' +
            // ▲ starts with 2 or [8-9][0-9] ▲
          '|' +   // ..or..
            // ▼ starts with [3-7][1-9] ▼
            '([3-7] *[1-9])' +  // starts with [3-7][1-9]
            '[\\-\\— ]*' +
            '(' +
              '(?:[0-9][\\-\\— ]*){5}[0-9]' +  // and 6 digits after
            ')' +
            // ▲ starts with [3-7][1-9] ▲
        ')' +
        // ▲ numbers ▲
        ' *' +
        '(.*)' +  // ** postfix, needs to validate this data - @see regexAcceptablePostfix
      '$'
    ),
    regexAcceptablePostfix = /^([^0-9]+(.+)|)$/,
    regexThaiRangePostfix = /^\s*(?:\-|ถึง|to.?|\—)\s*([0-9]{1,3})(?:[^0-9]+.*|)\s*$/i,
    _parse = function (str, forceUseCC) {
      let
        result = [],
        splitted = str.split(/\s*\,\s*/)
      ;
      // split string using ,
      splitted.forEach(function (each){
        each = _parseEach(each, forceUseCC);
        if (each.wellFormed) {
          result.push(each);

          let rangeTo = each.postfix ? each.postfix.match(regexThaiRangePostfix) : null;
          if (Array.isArray(rangeTo) && rangeTo.length == 2 && /^[0-9]+$/.test(rangeTo[1])) {
            // do shift until rangeTo[1] or settings.maxGeneratedRange
            let range = _generateRangeNumberStr(each.parsed, rangeTo[1]);
            if (Array.isArray(range)) {
              range.forEach(function (eachRange){
                eachRange = _parseEach(eachRange, forceUseCC, each.raw);
                if (eachRange.wellFormed) {
                  result.push(eachRange);
                }
              });
            }
          }
        }
      })
      return result;
    },
    _parseEach = function (e, forceUseCC, forceRaw = null) {
      let ped = {
        wellFormed: false,
        raw: forceRaw || e,
        captured: null,
        cc: null,
        number: null,
        number_p1: null,
        number_p2: null,
        isHomeNumber: false,
        isMobileNumber: false,
        postfix: null,
        parsed: null,
        parsedForceCC: null,
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
          ped.parsedForceCC = _forceUseCC(ped.parsed, forceUseCC);
          ped.formatted = _formatNumberStr(ped.parsedForceCC);
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
    },
    _formatNumberStr = function (str) {
      let regex1 = /^(\+66|0)(2)([0-9]{3})([0-9]{4})$/,
        regex2 = /^(\+66|0)([89][0-9])([0-9]{3})([0-9]{4})$/,
        regex3 = /^(\+66|0)([3-7][1-9])([0-9]{3})([0-9]{3})$/;
      if (regex1.test(str)) {
        return str.replace(regex1, '$1$2-$3-$4');
      } else if (regex2.test(str)) {
        return str.replace(regex2, '$1$2-$3-$4');
      } else if (regex3.test(str)) {
        return str.replace(regex3, '$1$2-$3-$4');
      }
      return str;
    },
    _forceUseCC = function (str, forceUseCC) {
      let force = ((forceUseCC === null || typeof forceUseCC == typeof undefined) ? settings.forceUseCC : forceUseCC) + ''
      if (force === '0') {
        return str.replace(/^(\+?66)/, '0');
      } else if (force === '+66') {
        return str.replace(/^(0)/, '+66');
      }
      return str;
    }
  ;

  //****************************************************************************

  this.each(function() {
    let
      $self = $(this),
      str = ($self.data('phoneNumber') || '') + '',
      parsed = null
    ;
    if (! $self.data('parsedThaiTel')) {
      parsed = _parse(str, $self.data('forceCc'));
      if (Array.isArray(parsed) && parsed.length) {
        if (typeof settings.render == typeof function(){}) {
          settings.render(parsed, $self, str);
        } else {
          throw "$.fn.thaiTel requires options.render as a callable.";
        }
      } else {
        if (typeof settings.fail == typeof function(){}) {
          settings.fail($self, str);
        } else {
          throw "$.fn.thaiTel requires options.fail as a callable.";
        }
      }
      $self.data('parsedThaiTel', true); // add this data to avoid recall
    }

  });
  return this
};
}(jQuery));
