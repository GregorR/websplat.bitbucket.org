if (typeof Object.$$jali$$frontendVersion === "undefined" ||
    Object.$$jali$$frontendVersion < 1) {
    Object.$$jali$$frontendVersion = 1;

    (function() {
        function classOf(x) {
            if (x === null) {
                return "null";
            } else if (typeof x === "object") {
                if (x.constructor && x.constructor.name) {
                    return x.constructor.name;
                } else {
                    return "(unknown)";
                }
            } else {
                return typeof x;
            }
        }

        Object.defineProperty(Object, "$$jali$$maybeUnwrap", {
            value: function(obj) {
                if (typeof obj === "object" && obj !== null) return obj.$$jali$$unwrap();
                return obj;
            }
        });

        Object.defineProperty(Object.prototype, "$$jali$$unwrap", {
            writable: true, // overridable
            value: function() { return this; }
        });

        function dynamicTypeError(expected, foundVal, stack) {
            var found = classOf(foundVal);
            if (typeof stack === undefined) stack = "";
            throw new Error("Dynamic type check failure. Expected " + expected + ", found " + found + "\n" + stack);
        }
        Object.defineProperty(Object, "$$jali$$dynamicTypeError", {
            value: dynamicTypeError
        });

        Object.defineProperty(Function.prototype, "$$jali$$check", {
            value: function(x, stack) {
                if (x === null || x === void 0 || x instanceof this) {
                    return x;
                } else {
                    var expected;
                    expected = this.name;
                    if (expected === void 0)
                        expected = "(unknown)";
                    dynamicTypeError(expected, x, stack);
                }
            }
        });

        Object.defineProperty(Object, "$$jali$$implements", {
            value: function(obj, iface, tid, stack) {
                if (typeof obj === "object") {
                    if (obj !== null && obj.$$jali$$implementsList && obj.$$jali$$implementsList["+" + iface]) {
                        return obj;
                    } else {
                        return Object["$$jali$$object$" + tid].$$jali$$check(obj, stack);
                    }
                } else if (obj === void 0) {
                    return obj; // undefined is just another null
                } else {
                    dynamicTypeError(iface, obj, stack);
                }
            }
        });

        Object.defineProperty(Object.prototype, "$$jali$$implementsList", {
            writable: true, configurable: true,

            value: {}
        });

        Object.defineProperty(Object, "$$jali$$primitive$function", {
            value: { $$jali$$check: function(x, stack) {
                if (typeof x === "function") {
                    return x;
                } else {
                    dynamicTypeError("Function", x, stack);
                }
            }}
        });


        function primCheck(type) {
            return function(x, stack) {
                if (typeof x === type) {
                    return x;
                } else {
                    dynamicTypeError(type, x, stack);
                }
            }
        }
        Object.defineProperty(Object, "$$jali$$primitive$bool", {
            value: { $$jali$$check: primCheck("boolean") }
        });
        Object.defineProperty(Object, "$$jali$$primitive$number", {
            value: { $$jali$$check: primCheck("number") }
        });
        Object.defineProperty(Object, "$$jali$$primitive$string", {
            value: { $$jali$$check: primCheck("string") }
        });

        // the rest is unused on Truffle
        if (Object.$$jali$$version) return;
    
        function jaliDirect() {
            return this;
        }
    
        var jaliDirectDesc = {value: jaliDirect};

        function jaliDirectWriteVerify(protoSteps, expectedSize) {
            /*
            var realSize = Object.getOwnPropertyNames(this).length;
            if (realSize !== expectedSize) {
                var msg = "Misconstructed class: Expected size " + expectedSize + ", found " + realSize;
                if (console && console.trace) {
                    console.trace(msg);
                } else {
                    var err = new Error(msg);
                    if (err.stack && console && console.log) {
                        console.log(msg + "\n" + err.stack);
                    } else {
                        throw err;
                    }
                }
            }
            */
            return this;
        }

        var jaliDirectWriteVerifyDesc = {value: jaliDirectWriteVerify};
    
        Object.defineProperty(Object.prototype, "$$jali$$direct", jaliDirectDesc);
        Object.defineProperty(Object.prototype, "$$jali$$directInt", jaliDirectDesc);
        Object.defineProperty(Object.prototype, "$$jali$$directDouble", jaliDirectDesc);

        Object.defineProperty(Object.prototype, "$$jali$$lookupOnce", jaliDirectDesc);

        Object.defineProperty(Object.prototype, "$$jali$$directWrite", jaliDirectWriteVerifyDesc);
        Object.defineProperty(Object.prototype, "$$jali$$directWriteInt", jaliDirectDesc);
        Object.defineProperty(Object.prototype, "$$jali$$directWriteDouble", jaliDirectDesc);
    })();

    //! stable.js 0.1.3, https://github.com/Two-Screen/stable
    //! � 2012 St�phan Kochen, Angry Bytes. MIT licensed.

    if (!Array.prototype.sort) (function() {

    // A stable array sort, because `Array#sort()` is not guaranteed stable.
    // This is an implementation of merge sort, without recursion.

    var stable = function(arr, comp) {
        if (typeof(comp) !== 'function') {
            comp = function(a, b) {
                return String(a).localeCompare(b);
            };
        }

        var len = arr.length;

        // Ensure we always return a new array, even if no passes occur.
        if (len <= 1) {
            return arr.slice();
        }

        // Rather than dividing input, simply iterate chunks of 1, 2, 4, 8, etc.
        // Chunks are the size of the left or right hand in merge sort.
        // Stop when the left-hand covers all of the array.
        for (var chk = 1; chk < len; chk *= 2) {
            arr = pass(arr, comp, chk);
        }
        return arr;
    };

    // Run a single pass with the given chunk size. Returns a new array.
    var pass = function(arr, comp, chk) {
        var len = arr.length;
        // Output, and position.
        var result = new Array(len);
        var i = 0;
        // Step size / double chunk size.
        var dbl = chk * 2;
        // Bounds of the left and right chunks.
        var l, r, e;
        // Iterators over the left and right chunk.
        var li, ri;

        // Iterate over pairs of chunks.
        for (l = 0; l < len; l += dbl) {
            r = l + chk;
            e = r + chk;
            if (r > len) r = len;
            if (e > len) e = len;

            // Iterate both chunks in parallel.
            li = l;
            ri = r;
            while (true) {
                // Compare the chunks.
                if (li < r && ri < e) {
                    // This works for a regular `sort()` compatible comparator,
                    // but also for a simple comparator like: `a > b`
                    if (comp(arr[li], arr[ri]) <= 0) {
                        result[i++] = arr[li++];
                    }
                    else {
                        result[i++] = arr[ri++];
                    }
                }
                // Nothing to compare, just flush what's left.
                else if (li < r) {
                    result[i++] = arr[li++];
                }
                else if (ri < e) {
                    result[i++] = arr[ri++];
                }
                // Both iterators are at the chunk ends.
                else {
                    break;
                }
            }
        }

        return result;
    };

    Array.prototype.sort = function(comp) {
        return stable(this, comp);
    };

    })();

    // END stable

}
var WebSplat;
(function (WebSplat) {
    var maxLineOff = 256;
    var linePadding = 32;
    var Line = (function () {
        function Line() {
            this.$$jali$$value$cLeft = 0;
            this.$$jali$$value$cTop = 0;
            this.$$jali$$value$cWidth = 0;
            this.$$jali$$value$cHeight = 0;
            this.$$jali$$value$r = 0;
            this.$$jali$$value$g = 0;
            this.$$jali$$value$b = 0;
            this.$$jali$$value$t = 1;
            this.canvas = document.createElement("canvas");
            this.canvas.style.position = "absolute";
            this.canvas.style.left = "0px";
            this.canvas.style.top = "0px";
            this.canvas.width = 0;
            this.canvas.height = 0;
            this.canvas.style.zIndex = WebSplat.conf.zIndexes.ui;
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext("2d");
            this.setLineStyle(255, 0, 0, 3);
        }
        Line.prototype.destroy = function () {
            document.body.removeChild(this.canvas);
        };
        Line.prototype.coverRange = function (minX, minY, maxX, maxY) {
            if(minX > maxX) {
                this.coverRange(maxX, minY, minX, maxY);
                return;
            }
            if(minY > maxY) {
                this.coverRange(minX, maxY, maxX, minY);
                return;
            }
            var changed = false;
            if(this.cLeft > minX || this.cLeft < minX - maxLineOff) {
                changed = true;
                this.cLeft = minX - linePadding;
                if(this.cLeft < 0) {
                    this.cLeft = 0;
                }
            }
            var cRight = this.cLeft + this.cWidth;
            if(cRight <= maxX || cRight > maxX + maxLineOff) {
                changed = true;
                cRight = maxX + linePadding;
                this.cWidth = cRight - this.cLeft;
            }
            if(this.cTop > minY || this.cTop < minY - maxLineOff) {
                changed = true;
                this.cTop = minY - linePadding;
                if(this.cTop < 0) {
                    this.cTop = 0;
                }
            }
            var cBottom = this.cTop + this.cHeight;
            if(cBottom <= maxY || cBottom > maxY + maxLineOff) {
                changed = true;
                cBottom = maxY + linePadding;
                this.cHeight = cBottom - this.cTop;
            }
            if(changed) {
                this.canvas.style.left = this.cLeft + "px";
                this.canvas.style.top = this.cTop + "px";
                this.canvas.width = this.cWidth;
                this.canvas.height = this.cHeight;
                this.assertLineStyle();
            }
        };
        Line.prototype.setLineStyle = function (r, g, b, t) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.t = t;
            this.assertLineStyle();
        };
        Line.prototype.assertLineStyle = function () {
            this.ctx.strokeStyle = "rgb(" + this.r + "," + this.g + "," + this.b + ")";
            this.ctx.lineWidth = this.t;
        };
        Line.prototype.rkify = function () {
            var id = this.ctx.getImageData(0, 0, this.cWidth, this.cHeight);
            var dlen = id.data.length;
            for(var i = 0; i < dlen; i += 4) {
                if(id.data[i + 3] < 8) {
                    id.data[i + 3] = 0;
                } else {
                    id.data[i + 3] = 255;
                    if(id.data[i] < 128) {
                        id.data[i] = id.data[i + 1] = id.data[i + 2] = 0;
                    } else {
                        id.data[i] = 255;
                        id.data[i + 1] = id.data[i + 2] = 0;
                    }
                }
            }
            this.ctx.putImageData(id, 0, 0);
        };
        Line.prototype.drawLine = function (fromX, fromY, toX, toY) {
            this.coverRange(fromX, fromY, toX, toY);
            fromX -= this.cLeft;
            toX -= this.cLeft;
            fromY -= this.cTop;
            toY -= this.cTop;
            this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
            this.ctx.beginPath();
            this.ctx.moveTo(fromX + 0.5, fromY + 0.5);
            this.ctx.lineTo(toX + 0.5, toY + 0.5);
            this.ctx.stroke();
        };
        Line.prototype.drawLineLen = function (fromX, fromY, toX, toY, len) {
            var angle = Math.atan2(toX - fromX, toY - fromY);
            toX = Math.round(fromX + Math.sin(angle) * len);
            toY = Math.round(fromY + Math.cos(angle) * len);
            this.drawLine(fromX, fromY, toX, toY);
        };
        Line.prototype.drawBar = function (fromX, fromY, toX, toY, onR, onG, onB, onT, onLen, offR, offG, offB, offT, offLen) {
            var angle = Math.atan2(toX - fromX, toY - fromY);
            var onToX = Math.round(fromX + Math.sin(angle) * onLen);
            var onToY = Math.round(fromY + Math.cos(angle) * onLen);
            var offToX = Math.round(fromX + Math.sin(angle) * offLen);
            var offToY = Math.round(fromY + Math.cos(angle) * offLen);
            var lowX = Math.min(fromX, onToX, offToX);
            var highX = Math.max(fromX, onToX, offToX);
            var lowY = Math.min(fromY, onToY, offToY);
            var highY = Math.max(fromY, onToY, offToY);
            this.coverRange(lowX, lowY, highX, highY);
            fromX -= this.cLeft;
            onToX -= this.cLeft;
            offToX -= this.cLeft;
            fromY -= this.cTop;
            onToY -= this.cTop;
            offToY -= this.cTop;
            this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
            this.setLineStyle(offR, offG, offB, offT);
            this.ctx.beginPath();
            this.ctx.moveTo(fromX + 0.5, fromY + 0.5);
            this.ctx.lineTo(offToX + 0.5, offToY + 0.5);
            this.ctx.stroke();
            this.setLineStyle(onR, onG, onB, onT);
            this.ctx.beginPath();
            this.ctx.moveTo(fromX + 0.5, fromY + 0.5);
            this.ctx.lineTo(onToX + 0.5, onToY + 0.5);
            this.ctx.stroke();
            this.rkify();
        };
        //adding mutators:

        Object.defineProperty(Line.prototype, "cLeft", {
            configurable: true, enumerable: true,
            get: function() { return this.$$jali$$value$cLeft; },
            set: function(v) { this.$$jali$$value$cLeft = v; }
        });
        Object.defineProperty(Line.prototype, "cTop", {
            configurable: true, enumerable: true,
            get: function() { return this.$$jali$$value$cTop; },
            set: function(v) { this.$$jali$$value$cTop = v; }
        });
        Object.defineProperty(Line.prototype, "cWidth", {
            configurable: true, enumerable: true,
            get: function() { return this.$$jali$$value$cWidth; },
            set: function(v) { this.$$jali$$value$cWidth = v; }
        });
        Object.defineProperty(Line.prototype, "cHeight", {
            configurable: true, enumerable: true,
            get: function() { return this.$$jali$$value$cHeight; },
            set: function(v) { this.$$jali$$value$cHeight = v; }
        });
        Object.defineProperty(Line.prototype, "r", {
            configurable: true, enumerable: true,
            get: function() { return this.$$jali$$value$r; },
            set: function(v) { this.$$jali$$value$r = v; }
        });
        Object.defineProperty(Line.prototype, "g", {
            configurable: true, enumerable: true,
            get: function() { return this.$$jali$$value$g; },
            set: function(v) { this.$$jali$$value$g = v; }
        });
        Object.defineProperty(Line.prototype, "b", {
            configurable: true, enumerable: true,
            get: function() { return this.$$jali$$value$b; },
            set: function(v) { this.$$jali$$value$b = v; }
        });
        Object.defineProperty(Line.prototype, "t", {
            configurable: true, enumerable: true,
            get: function() { return this.$$jali$$value$t; },
            set: function(v) { this.$$jali$$value$t = v; }
        });
        return Line;
    })();
    WebSplat.Line = Line;    
})(WebSplat || (WebSplat = {}));
