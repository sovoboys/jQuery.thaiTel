# ***<span style="color:red">THIS PLUGIN NOT READY YET !!! </span>***

# **jQuery.thaiTel**

This plugin is written for dealing with **(mainly) Thai phone numbers**, especially unformatted, Thai-style numbers, to be able to use with tasks which requires formatted phone numbers. For example, to pass phone numbers to some phone call management apps/softwares via ```<a href="tel:*"></a>``` link protocol.

## **Disclaimer**

\# TODO

## **Example**

\# TODO

## **Usage**

Creat element(s), and add [data-phone-number] attribute, for example..
```
<div data-phone-number="089-987-6543"></div>
<div data-phone-number="+66 2 234 5678"></div>

<!-- data-force-cc are optional -->
<div data-phone-number="+66 (0) 2 1234567" data-force-cc="0"></div>
```

Include jQuery and plugin:
```
<script type="text/javascript" src="/path/to/jquery.js"></script>
<script type="text/javascript" src="/path/to/jquery.thaitel.js"></script>
```

And call the plugin
```
$('[data-phone-number]').thaiTel()
```

## **Options **

|Key|Accept values|Default value|Description|
|:---|:------------|:------------|:----------|
|forceUseCC|_string ("+66" or "0"), null_|_null_|Returned numbers by this call may be forced to use this value as country code. _(This value may be set individually for each element via [data-force-cc]) - see [Usage](#Usage) and [Example](#Example)_|
|maxGeneratedRange|_(Natural) Integer_|_20_|Max phone number to be generated for Thai-style range. All range numbers may be discarded if range numbers are more than this value.|
|render|_function_|_(function)_|Called when one or more numbers returned after parsed.|
|fail|_function_|_(function)_|Called when no numbers returned after parsed.|

\# TODO
