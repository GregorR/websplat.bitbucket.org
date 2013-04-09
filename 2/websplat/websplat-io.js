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

        function dynamicTypeError(expected, foundVal) {
            var found = classOf(foundVal);
            throw new Error("Dynamic type check failure. Expected " + expected + ", found " + found);
        }

        Object.defineProperty(Function.prototype, "$$jali$$check", {
            value: function(x) {
                if (x === null || x === void 0 || x instanceof this) {
                    return x;
                } else {
                    var expected;
                    expected = this.name;
                    if (expected === void 0)
                        expected = "(unknown)";
                    dynamicTypeError(expected, x);
                }
            }
        });

        Object.defineProperty(Object, "$$jali$$implements", {
            value: function(obj, iface) {
                if (typeof obj === "object") {
                    if (obj !== null && obj.$$jali$$implementsList && obj.$$jali$$implementsList["+" + iface]) {
                        return obj;
                    } else {
                        return obj; // FIXME: obviously wrong, need to wrap for checking
                    }
                } else if (obj === void 0) {
                    return obj; // undefined is just another null
                } else {
                    dynamicTypeError(iface, obj);
                }
            }
        });

        Object.defineProperty(Object.prototype, "$$jali$$implementsList", {
            writable: true, configurable: true,

            value: {}
        });

        Object.defineProperty(Object, "$$jali$$primitive$function", {
            value: { $$jali$$check: function(x) {
                if (typeof x === "function") {
                    return x;
                } else {
                    dynamicTypeError("Function", x);
                }
            }}
        });


        function primCheck(type) {
            return function(x) {
                if (typeof x === type) {
                    return x;
                } else {
                    dynamicTypeError(type, x);
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
            /*var realSize = Object.getOwnPropertyNames(this).length;
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
            }*/
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
    (function (IO) {
        var IOHandler = (function () {
            function IOHandler() { }
            IOHandler.prototype.activate = function () {
                return true;
            };
            IOHandler.prototype.deactivate = function () {
            };
            IOHandler.prototype.onkeydown = function (key) {
                return true;
            };
            IOHandler.prototype.onkeyup = function (key) {
                return true;
            };
            IOHandler.prototype.onmousedown = function (ev) {
                return true;
            };
            IOHandler.prototype.onmouseup = function (ev) {
                return true;
            };
            IOHandler.prototype.onclick = function (ev) {
                return true;
            };
            return IOHandler;
        })();
        IO.IOHandler = IOHandler;        
        IO.ioHandler = null;
        function setIOHandler(to) {
            if(IO.ioHandler !== null) {
                unsetIOHandler();
            }
            if(to !== null) {
                IO.ioHandler = to;
                if(!to.activate()) {
                    IO.ioHandler = null;
                }
            }
        }
        IO.setIOHandler = setIOHandler;
        function unsetIOHandler() {
            IO.ioHandler.deactivate();
            IO.ioHandler = null;
        }
        IO.unsetIOHandler = unsetIOHandler;
        var keysDown = {
        };
        function markKeyDown(key) {
            if(keysDown[key]) {
                return true;
            } else {
                keysDown[key] = true;
                return false;
            }
        }
        function markKeyUp(key) {
            delete keysDown[key];
        }
        function translateKey(key) {
            switch(key) {
                case 65:
                    key = 37;
                    break;
                case 87:
                    key = 38;
                    break;
                case 68:
                    key = 39;
                    break;
                case 83:
                    key = 40;
                    break;
            }
            return key;
        }
        WebSplat.addHandler("postload", function () {
            var keydown = function (ev) {
                if(ev.ctrlKey || ev.altKey || ev.metaKey) {
                    return true;
                }
                var key = translateKey(ev.which);
                if(markKeyDown(key)) {
                    return false;
                }
                if(IO.ioHandler) {
                    if(IO.ioHandler.onkeydown(key)) {
                        return true;
                    } else {
                        ev.preventDefault();
                        ev.stopPropagation();
                        return false;
                    }
                }
                return true;
            };
            $(document.body).keydown(keydown);
            $(window).keydown(keydown);
            var keyup = function (ev) {
                var key = translateKey(ev.which);
                markKeyUp(key);
                if(IO.ioHandler) {
                    if(IO.ioHandler.onkeyup(key)) {
                        return true;
                    } else {
                        ev.preventDefault();
                        ev.stopPropagation();
                        return false;
                    }
                }
                return true;
            };
            $(document.body).keyup(keyup);
            $(window).keyup(keyup);
            $(document.body).mousedown(function (ev) {
                if(IO.ioHandler) {
                    if(IO.ioHandler.onmousedown(ev)) {
                        return true;
                    } else {
                        ev.preventDefault();
                        ev.stopPropagation();
                        return false;
                    }
                }
                return true;
            });
            $(document.body).mouseup(function (ev) {
                if(IO.ioHandler) {
                    if(IO.ioHandler.onmouseup(ev)) {
                        return true;
                    } else {
                        ev.preventDefault();
                        ev.stopPropagation();
                        return false;
                    }
                }
                return true;
            });
            $(document.body).click(function (ev) {
                if(IO.ioHandler) {
                    if(IO.ioHandler.onclick(ev)) {
                        return true;
                    } else {
                        ev.preventDefault();
                        ev.stopPropagation();
                        return false;
                    }
                }
                return true;
            });
        });
    })(WebSplat.IO || (WebSplat.IO = {}));
    var IO = WebSplat.IO;
})(WebSplat || (WebSplat = {}));
