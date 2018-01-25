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
  }, options);

  //****************************************************************************

  let
    regexPrefix = /^(\s*)((ติดต่อ(ที่|)|)(หมายเลข|)(โทร(ศัพท์|\s*ฯ?))|tel\s*\.?)\s*[^0-9\+\(\)]+/i,
    regexNumber = /^(?:\( *|)(0|\+? *6[\- ]*6)(?: *\(|)[\- ]*(?:(2|[89][0-9])[\- ]*((?:[0-9][\- ]*){6}[0-9])|([3-7][1-9])[\- ]*((?:[0-9][\- ]*){5}[0-9])) *(.*)$/,
    _parse = function (str) {
      let
        result = [],
        splitted = str.split(/\s*\,\s*/)
      ;
      // split string using ,
      splitted.forEach(function (each){
        each = _parseEach(each);
        typeof each == typeof '' && result.push(each);
      })
      return result;
    },
    _parseEach = function (e) {
      let parsed = [], shouldBeMobile = null;
      if (typeof e == typeof '') {
        e = e.replace(regexPrefix, ''); // remove prefix
        e = e.replace(/^\s*|\s*$/ig, ''); // trim

      }
      return parsed.length ? parsed.join('') : null;
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
