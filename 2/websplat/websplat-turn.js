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
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WebSplat;
(function (WebSplat) {
    var Turns;
    (function (Turns) {
        var MovePhaseIOHandler = (function (_super) {
            __extends(MovePhaseIOHandler, _super);
            function MovePhaseIOHandler() {
                        _super.call(this, null, null);
            }
            MovePhaseIOHandler.prototype.onkeydown = function (key) {
                if(WebSplat.player === null) {
                    return true;
                }
                switch(key) {
                    case 37:
                        WebSplat.player.xacc = -1;
                        WebSplat.player.xaccmax = WebSplat.conf.moveSpeed * -1;
                        break;
                    case 39:
                        WebSplat.player.xacc = 1;
                        WebSplat.player.xaccmax = WebSplat.conf.moveSpeed;
                        break;
                    case 38:
                        if(WebSplat.player.on !== null) {
                            WebSplat.player.on = null;
                            WebSplat.player.yvel = -WebSplat.conf.jumpSpeed;
                        }
                        break;
                    case 40:
                        if(WebSplat.player.on !== null) {
                            var thru = 0;
                            for(var i = 0; i < WebSplat.player.on.length; i++) {
                                var el = WebSplat.player.on[i];
                                if(el.wpThruable) {
                                    WebSplat.player.thru[el.wpID] = true;
                                    thru++;
                                }
                            }
                            if(thru === WebSplat.player.on.length) {
                                WebSplat.player.on = null;
                            }
                        }
                        break;
                }
                return false;
            };
            MovePhaseIOHandler.prototype.onkeyup = function (key) {
                if(WebSplat.player === null) {
                    return true;
                }
                switch(key) {
                    case 37:
                        if(WebSplat.player.xacc < 0) {
                            WebSplat.player.xacc = null;
                            WebSplat.player.xaccmax = null;
                        }
                        break;
                    case 39:
                        if(WebSplat.player.xacc > 0) {
                            WebSplat.player.xacc = null;
                            WebSplat.player.xaccmax = null;
                        }
                        break;
                    case 69:
                        this.advance();
                        break;
                }
                return false;
            };
            //adding mutators:

            return MovePhaseIOHandler;
        })(WebSplat.IO.IOHandler);        
        Turns.theMovePhaseIOHandler = new MovePhaseIOHandler();
        WebSplat.IO.setIOHandler(Turns.theMovePhaseIOHandler);
        var SelectPhaseIOHandler = (function (_super) {
            __extends(SelectPhaseIOHandler, _super);
            function SelectPhaseIOHandler() {
                        _super.call(this, null, null);
                this.$$jali$$value$selector = null;
                this.$$jali$$value$sselect = null;
            }
            SelectPhaseIOHandler.prototype.activate = function () {
                if(this.selector === null) {
                    var selector = document.createElement("div");
                    var sselect = document.createElement("select");
                    var option = document.createElement("option");
                    option.innerHTML = "Choose a weapon";
                    sselect.appendChild(option);
                    for(var w = 0; w < WebSplat.Weapon.weapons.length; w++) {
                        var weapon = WebSplat.Weapon.weapons[w];
                        var option = document.createElement("option");
                        option.innerHTML = weapon.name;
                        sselect.appendChild(option);
                    }
                    selector.appendChild(sselect);
                    var hThis = this;
                    sselect.addEventListener("change", function (ev) {
                        var wpIdx = sselect.selectedIndex - 1;
                        if(wpIdx < 0) {
                            return;
                        }
                        hThis.next = new (WebSplat.Weapon.weapons[wpIdx].ioHandler)(hThis, Turns.theMovePhaseIOHandler);
                        hThis.advance();
                    });
                    this.selector = selector;
                    this.sselect = sselect;
                }
                this.sselect.selectedIndex = 0;
                wpDisplayMessage(this.selector);
                return true;
            };
            SelectPhaseIOHandler.prototype.deactivate = function () {
                wpDisplayMessage();
            };
            SelectPhaseIOHandler.prototype.onkeyup = function (key) {
                if(WebSplat.player === null) {
                    return true;
                }
                switch(key) {
                    case 81:
                        this.regress();
                        break;
                    case 69:
                        this.advance();
                        break;
                }
                return false;
            };
            //adding mutators:

            Object.defineProperty(SelectPhaseIOHandler.prototype, "selector", {
                configurable: true, enumerable: true,
                get: function() { return this.$$jali$$value$selector; },
                set: function(v) { this.$$jali$$value$selector = v; }
            });
            Object.defineProperty(SelectPhaseIOHandler.prototype, "sselect", {
                configurable: true, enumerable: true,
                get: function() { return this.$$jali$$value$sselect; },
                set: function(v) { this.$$jali$$value$sselect = v; }
            });
            return SelectPhaseIOHandler;
        })(WebSplat.IO.IOHandler);        
        Turns.theSelectPhaseIOHandler = new SelectPhaseIOHandler();
        Turns.theMovePhaseIOHandler.next = Turns.theSelectPhaseIOHandler;
        Turns.theSelectPhaseIOHandler.prev = Turns.theMovePhaseIOHandler;
    })(Turns || (Turns = {}));
})(WebSplat || (WebSplat = {}));
