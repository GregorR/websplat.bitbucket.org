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
    WebSplat.ponies = [];
    WebSplat.curPony = 0;
    var ponyConf = {
        ponies: [
            "base."
        ],
        moveSpeed: 3,
        pointsPerKill: 500,
        edgeDetectDist: 5,
        edgeDetectSize: 10
    };
    var ponyImageSets = {
        r: {
            frames: 1,
            frameRate: 3,
            width: 50,
            height: 50,
            bb: [
                16, 
                16 + 17, 
                25, 
                25 + 9
            ]
        },
        c: {
            frames: 1,
            frameRate: 3,
            width: 50,
            height: 50,
            bb: [
                16, 
                16 + 17, 
                25, 
                25 + 9
            ]
        }
    };
    var Pony = (function (_super) {
        __extends(Pony, _super);
        function Pony() {
                _super.call(this, ponyConf.ponies[WebSplat.getRandomInt(0, ponyConf.ponies.length)], ponyImageSets, "r", "r", true, true);
            this.$$jali$$value$munching = false;
            this.$$jali$$value$dead = false;
            this.xacc = 0;
        }
        Pony.prototype.updateImagePrime = function () {
            if(this.state === "c" && this.frame >= ponyImageSets.c.frames) {
                this.state = "r";
                this.frame = 0;
            }
        };
        Pony.prototype.noPlatform = function (x) {
            var els = WebSplat.getElementsByBoxThru(this, this.thru, false, x, ponyConf.edgeDetectSize, this.y + this.h, ponyConf.edgeDetectSize);
            if(els === null) {
                return true;
            }
            return false;
        };
        Pony.prototype.hitBottom = function () {
            this.setXY(this.x, this.h * 2);
        };
        Pony.prototype.takeDamage = function (from, pts) {
            this.dead = true;
            this.mode = "d";
            this.state = "da";
            this.frame = 0;
            this.updateImage();
            var spthis = this;
            WebSplat.deplatformSprite(spthis);
            setTimeout(function () {
                WebSplat.remSprite(spthis);
                spthis.el.style.display = "none";
            }, 5000);
            return false;
        };
        //adding mutators:

        Object.defineProperty(Pony.prototype, "munching", {
            configurable: true, enumerable: true,
            get: function() { return this.$$jali$$value$munching; },
            set: function(v) { this.$$jali$$value$munching = v; }
        });
        Object.defineProperty(Pony.prototype, "dead", {
            configurable: true, enumerable: true,
            get: function() { return this.$$jali$$value$dead; },
            set: function(v) { this.$$jali$$value$dead = v; }
        });
        return Pony;
    })(WebSplat.Sprite);
    WebSplat.Pony = Pony;    
    WebSplat.addHandler("postload", function () {
        WebSplat.spritesOnPlatform(ponyImageSets.r.width, ponyImageSets.r.height, 480, 2, function () {
            var p = new Pony();
            WebSplat.ponies.push(p);
            return p;
        });
        WebSplat.player = WebSplat.ponies[0];
        WebSplat.assertPlayerViewport();
    });
})(WebSplat || (WebSplat = {}));
