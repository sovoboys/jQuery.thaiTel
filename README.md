# ***<span style="color:red">THIS PLUGIN NOT READY YET !!! </span>***

# **jQuery.thaiTel**

This plugin is written for dealing with **(mainly, actually only) Thai phone numbers**, especially unformatted, Thai-(various)-style numbers, to be able to use with tasks which requires proper formatted phone numbers. For example, to pass phone numbers to some phone call management apps/softwares via ```<a href="tel:*"></a>``` link protocol.

## **Disclaimer**

\# TODO

## **Example**

See [here](https://www.sovoboys.net/p/github/jquery.thaitel)

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
$('[data-phone-number]').thaiTel()
```

## **Options**

|Key|Accept values|Default value|Description|
|:---|:------------|:------------|:----------|
|forceUseCC|_string ("+66" or "0"), null_|_null_|Returned numbers by this call may be forced to use this value as country code. _(This value may be set individually for each element via [data-force-cc]) - see [Usage](#usage) and [Example](#example)_|
|maxGeneratedRange|_(Natural) Integer_|_20_|Max phone number to be generated for Thai-style range. All range numbers may be discarded if range numbers are more than this value.|
|render|_function_|_(function to render numbers as Twitter Bootstrap v3's .btn-group)_|Called when one or more numbers returned after parsed.|
|fail|_function_|_(function similar as render, but only for input value)_|Called when no numbers returned after parsed.|

## **License**
\# TODO
