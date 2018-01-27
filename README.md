# ***<span style="color:red">THIS PLUGIN NOT READY YET !!! </span>***

# **jQuery.thaiTel**

This plugin is written for dealing with **(~~mainly,~~ actually only) Thai phone numbers**, especially unformatted, Thai-_(various)_-styles numbers, to be able to use with tasks which requires proper formatted phone numbers. For example, to pass phone numbers to some phone call management apps/softwares via ```<a href="tel:*"></a>``` link protocol.

---

## **Example**

See [here (https://www.sovoboys.net/p/github/jquery.thaitel)](https://www.sovoboys.net/p/github/jquery.thaitel)

---

## **Usage**

Creat element(s), and add phone number(s) to its [data-phone-number] attribute, for example..

```
<div data-phone-number="098-765-4321"></div>
<div data-phone-number="+66 2 345 6789 - 90"></div>

<!-- data-force-cc are optional -->
<div data-phone-number="055 666777" data-force-cc="+66"></div>
```

And include jQuery and plugin:
```
<script type="text/javascript" src="/path/to/jquery.js"></script>
<script type="text/javascript" src="/path/to/jquery.thaitel.js"></script>
```

And call the plugin
```
$('[data-phone-number]').thaiTel();


// You may pass (object) options, for example

$('[data-phone-number]').thaiTel({
  forceUseCC: '+66',
  render: function () { /* to create your new own way to render links, or something */ }
});


// or you may pass one or two functions as options.render and options.fail, for example

$('[data-phone-number]').thaiTel(function () {
  /* as options.render */
}, function () {
  /* options.fail */
});

```
---

## **Options**

|Key|Accept values|Default value|Description|
|:---|:------------|:------------|:----------|
|forceUseCC|_string ("+66" or "0"), null_|_null_|Returned numbers by this call may be forced to use this value as country code. _(This value may be set individually for each element via [data-force-cc] - see [Usage](#usage) and [Example](#example))_|
|maxGeneratedRange|_(Natural) Integer_|_20_|Max phone number to be generated for Thai-style range. All range numbers may be discarded if range numbers are more than this value.|
|render|_function_|_(function to render numbers as Twitter Bootstrap v3's .btn-group)_|Called when one or more numbers returned after parsed.|
|fail|_function_|_(function similar as render, but only for input value)_|Called when no numbers returned after parsed.|

### **options.render**

_(function)_ options.render will be called if one or more phone numbers parsed and returned.

|No.|Data type|Description|Example|
|--:|:--|:--|:--|:--|
|1|_(Array contains one or more objects)_   |All parsed phone numbers | _(see [Parsed phone numbers data](#parsed-phone-numbers-data) below)_|
|2|_(jQuery instance)_                      |each element that called this plugin      |-|
|3|_(String)_                               |Input data ([data-phone-number] attribute value)| ```"098-765-4321"```|

#### **Parsed phone number data**

```
// example
{
  wellFormed:        true,
  raw:               "+66 (0)98-765-4321 (Ext. 112)"
  cc:                "+66",
  number:            "987654321",
  number_p1:         "98",
  number_p2:         "7654321",
  isHomeNumber:      false,
  isMobileNumber:    true,
  postfix:           "(Ext. 112)",
  parsed:            "+66987654321",
  parsedForceCC:     "0987654321",
  formatted:         "+6698-765-4321",
}
```

#### **Custom render() example**

For example: to change render way to just display parsed phone numbers as ul > li list into the element.

```
$('[data-phone-number]').thaiTel({
  render: function (numbers, $element, rawData) {
    let $ul = $('<ul></ul>');                 // create empty ul
    numbers.forEach(function (number) {       // and for each phone number..
      $('<li></li>').text(number.formatted)
        .appendTo($ul);                       // ..add new li with number.formatted as text
    });
    $element.append($ul);                     // and append ul to $element
  },
});
```

### **options.fail**

_(function)_ options.fail is similar as options.render, except it will be called if **none** of phone numbers be parsed and return.

|No.|Data type|Description|Example|
|--:|:--|:--|:--|:--|
|1|_(jQuery instance)_                      |each element that called this plugin      |-|
|2|_(String)_                               |Input data ([data-phone-number] attribute value)| ```"1112"```|

#### **Custom fail() example**

For example: to add div.alert.alert-warning into the element.

```
$('[data-phone-number]').thaiTel({
  fail: function ($element, rawData) {
    $element.append(
      $('<div></div>').addClass('alert alert-warning').text('No phone numbers parsed.')
    );
  },
});
```
---

## **Disclaimer**

**You are responsible for your own actions** - This plugin **CANNOT GUARANTEE** the accuracy of any data conversion. Users may be charges for dialing to wrong numbers.

---

## **License**

[WTFPL License](http://www.wtfpl.net/)
