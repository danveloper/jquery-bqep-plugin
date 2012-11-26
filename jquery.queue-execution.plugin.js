!function($) {
    var Runner = function(func, options) {
        this.func = func;
        this.isRunning = false;
        this.result = null;
        this.workers = (options != null && options.workers != null) ? options.workers : 5;
        this.interval = (options != null && options.interval != null) ? options.interval : 5;
        this.count = 0;
        this.queue = [];
        this.initPoll();
    };
    Runner.prototype = {
        constructor: Runner,
        toString: function() {
            return "Runner";
        },
        schedule: function(func) {
            this.queue.push(func);
        },
        initPoll: function() {
            var $this = this;
            var proc = setInterval(function() {
                if ($this.count < $this.workers && $this.queue.length > 0) {
                    var func = $this.queue.shift();
                    $this.runInFrame(func);  
                }
            }, this.interval);
        },    
        runInFrame: function(func) {
            this.count++;
            var $body = document.body;
            var $this = this;
            var iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.onload = function() {
                var script = document.createElement("script");
                script.innerHTML = $this.source();
                iframe.contentWindow.document.body.appendChild(script);
                iframe.contentWindow["r"] = new iframe.contentWindow["Runner"](func);
                iframe.contentWindow["r"].run();
                $body.removeChild(iframe);
                $this.count--;
            }
            $body.appendChild(iframe);
            return iframe;
        },
        run: function() {
            this.isRunning = true;
            this.result = this.func.call();
            this.isRunning = false;
        },        
        source: function() {
            var src = "var " + this.toString() + " = " + this.constructor + ";\n";
            src += this.toString()+".prototype = {\n\tconstructor: "+this.toString()+",\n";
            for (var key in this.__proto__) {
                if (!(key in ['constructor', '__proto__'])) {
                    src += "\t"+key+": "+this[key]+",\n";
                }
            }
            src += "\ttoString: "+this["toString"]+"\n};";
            return src;
        }
    }
        
    $.initQueue = function(options) {
        window["queueRunner"] = new Runner(null, options);
    }
    $.schedule = function(func) {
        window["queueRunner"].schedule(func);
    }
}(window.jQuery);
