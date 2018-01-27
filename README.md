# ***<span style="color:red">THIS PLUGIN NOT READY YET !!! </span>***

# **jQuery.thaiTel**

This plugin is written for dealing with **(only) Thai phone numbers**, especially unformatted, Thai-style numbers, to be able to use with tasks which requires formatted phone numbers. For example, to pass phone numbers to some phone call management apps/softwares via ```<a href="tel:*"></a>``` link protocol.

## **Disclaimer**

\# TODO

## **Example**

\# TODO

## **Usage**

Creat element(s), and add [data-phone-number] attribute, for example..
```
<div data-phone-number="089-987-6543"></div>
<div data-phone-number="+66 2 234 5678"></div>
<div data-phone-number="+66 (0) 2 1234567"></div>
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

\# TODO
