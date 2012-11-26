Background Queue Execution Plugin
===

About
---
The background queue execution was born from the need to perform batch function operations in the browser, while still keeping the DOM responsive. The ability to queue function calls and delegate them to workers was necessary to keep the overhead of concurrent processing manageable.

Getting Started & Examples
---
<code>
```javascript
$(document).ready(function() {
	//--Initialize the Queue :: MUST be called first--
	$.initQueue();
    
	//--Example 1--
	var f1 = (function($body) {
	    return function() {
	        $body.append("<p>Completed working on immediate execution</p>");
	    };
	})($("body"));   
	$.schedule(f1);

	//--Example 2--
	var f2 = (function($body) {
	    return function() {
	        $body.append("<p>Completed working on delayed execution</p>");
	    };
	})($("body"));
	setTimeout((function() {$.schedule(f2); }), 2000);

	//--Example 3--
	for (var i=0;i<10;i++) {
	    var func = (function($body, $i) {
	            return function() {
	                $body.append("<p>Completed batch work on "+$i+"</p>");
	            };
	    })($("body"), i);
	    $.schedule(func);
	}
});
```
</code>

Options
---
<code>
```javascript
$initQueue({ workers: <int>, interval: <int of milliseconds> });
```
</code>

<strong>workers</strong> (Default 5): The number of background processors that the queue will delegate calls to.
<strong>interval</strong> (Default 5): The queue polling interval. If performance is affected by the default interval of 5ms, then it may be prudent to increase the polling frequency.

Credit and Use Agreement
---
Written by Dan Woods. You can use this for whatever the hell you want. You can copy the code and claim it as your own. You can take parts of the code and adjust them to suit your needs. You can put this code in a project that makes you a ton of money and give me none of it. You don't even have to credit me in the comments -- although, it would be nice. This code's license is completely royalty-free and without restriction. Free to you, from me.
