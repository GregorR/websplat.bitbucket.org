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
    (function (Weapon) {
        var WeaponW = (function () {
            function WeaponW(name, ioHandler) {
                this.name = name;
                this.ioHandler = ioHandler;
            }
            //adding mutators:

            return WeaponW;
        })();
        Weapon.WeaponW = WeaponW;        
        Weapon.weapons = [];
        var Bazooka;
        (function (Bazooka) {
            var bazRad = 100;
            var bazPower = 50;
            var bazPowerupTime = 2000;
            var bazSpeed = 30;
            var bazMaxAge = 34;
            var gd = WebSplat.conf.gridDensity;
            var bazPowerMult = bazPower / bazRad;
            var rocketLauncherImageSets = {
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
                }
            };
            function Rocket(firedBy) {
                this.expended = false;
                this.firedBy = firedBy;
                WebSplat.Sprite.call(this, "base.", rocketLauncherImageSets, "r", "r", true, false);
                this.slowxacc = 0;
                this.lifespan = bazMaxAge;
                this.ownGravity = 0.5;
            }
            Rocket.prototype = new WebSplat.SpriteChild();
            Rocket.prototype.tick = function () {
                this.thru[this.firedBy.el.wpID] = true;
                WebSplat.Sprite.prototype.tick.call(this);
                this.lifespan--;
                if(this.lifespan <= 0) {
                    this.explode();
                }
            };
            Rocket.prototype.collision = function (els, xs, ys) {
                if(els === null) {
                    return els;
                }
                this.explode();
                return els;
            };
            Rocket.prototype.explode = function () {
                if(this.expended) {
                    return;
                }
                this.expended = true;
                WebSplat.deplatformSprite(this);
                WebSplat.remSprite(this);
                this.el.parentNode.removeChild(this.el);
                WebSplat.curPony = (WebSplat.curPony + 1) % WebSplat.ponies.length;
                WebSplat.player = WebSplat.ponies[WebSplat.curPony];
                WebSplat.assertPlayerViewport();
                this.midFire = false;
                var bazX = this.x;
                var bazY = this.y;
                var minX = bazX - bazRad;
                var maxX = bazX + bazRad;
                var minY = bazY - bazRad;
                var maxY = bazY + bazRad;
                var minXB = minX >> gd;
                var maxXB = maxX >> gd;
                var minYB = minY >> gd;
                var maxYB = maxY >> gd;
                for(var y = minYB; y <= maxYB; y++) {
                    for(var x = minXB; x <= maxXB; x++) {
                        var els = WebSplat.getElementsGridPosition(x, y);
                        if(els === null) {
                            continue;
                        }
                        for(var i = 0; i < els.length; i++) {
                            var el = els[i];
                            if("wpSprite" in el) {
                                var sprite = el.wpSprite;
                                var dx = sprite.x - bazX;
                                var dy = sprite.y - bazY;
                                var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                                if(dist < bazRad) {
                                    var angle = Math.atan2(Math.abs(dy), Math.abs(dx));
                                    sprite.xvel = Math.cos(angle) * (bazRad - dist) * bazPowerMult * ((dx > 0) ? 1 : -1);
                                    sprite.forceyvel = Math.sin(angle) * (bazRad - dist) * bazPowerMult * ((dy > 0) ? 1 : -1);
                                }
                            } else if("wpUndestroyable" in el) {
                            } else if(WebSplat.elInDistance(el, bazRad, bazX, bazY)) {
                                WebSplat.remElementPosition(el);
                                el.style.visibility = "hidden";
                            }
                        }
                    }
                }
            };
            var BazookaFireIOHandler = (function (_super) {
                __extends(BazookaFireIOHandler, _super);
                function BazookaFireIOHandler(prev, next) {
                                _super.call(this, prev, next);
                    this.$$jali$$value$mdStart = null;
                    this.$$jali$$value$firing = null;
                    this.$$jali$$value$midFire = false;
                }
                BazookaFireIOHandler.prototype.onmousedown = function (ev) {
                    if(this.firing || this.midFire) {
                        return true;
                    }
                    this.mdStart = new Date().getTime();
                    return false;
                };
                BazookaFireIOHandler.prototype.onmouseup = function (ev) {
                    if(WebSplat.player === null) {
                        return true;
                    }
                    if(this.mdStart === null) {
                        return true;
                    }
                    var bazTime = new Date().getTime() - this.mdStart;
                    this.mdStart = null;
                    bazTime /= bazPowerupTime;
                    if(bazTime > 1.0) {
                        bazTime = 1.0;
                    }
                    bazTime = bazTime * 0.75 + 0.25;
                    ev.preventDefault();
                    ev.stopPropagation();
                    var angle = Math.atan2(ev.pageY - WebSplat.player.y, ev.pageX - WebSplat.player.x);
                    var xvel = Math.cos(angle) * bazSpeed * bazTime;
                    var yvel = Math.sin(angle) * bazSpeed * bazTime;
                    if(WebSplat.player instanceof WebSplat.Pony) {
                        WebSplat.player.state = "c";
                        WebSplat.player.frame = 0;
                        if(xvel < 0) {
                            WebSplat.player.dir = "l";
                        } else {
                            WebSplat.player.dir = "r";
                        }
                    }
                    var rocket = new Rocket(WebSplat.player);
                    rocket.setXY(WebSplat.player.x, WebSplat.player.y);
                    rocket.startingPosition();
                    rocket.xvel = xvel;
                    rocket.yvel = yvel;
                    WebSplat.addSprite(rocket);
                    this.midFire = true;
                    this.advance();
                    return false;
                };
                BazookaFireIOHandler.prototype.onclick = function (ev) {
                    return false;
                };
                //adding mutators:

                Object.defineProperty(BazookaFireIOHandler.prototype, "mdStart", {
                    configurable: true, enumerable: true,
                    get: function() { return this.$$jali$$value$mdStart; },
                    set: function(v) { this.$$jali$$value$mdStart = v; }
                });
                Object.defineProperty(BazookaFireIOHandler.prototype, "firing", {
                    configurable: true, enumerable: true,
                    get: function() { return this.$$jali$$value$firing; },
                    set: function(v) { this.$$jali$$value$firing = v; }
                });
                Object.defineProperty(BazookaFireIOHandler.prototype, "midFire", {
                    configurable: true, enumerable: true,
                    get: function() { return this.$$jali$$value$midFire; },
                    set: function(v) { this.$$jali$$value$midFire = v; }
                });
                return BazookaFireIOHandler;
            })(WebSplat.IO.IOHandler);            
            Weapon.weapons.push(new WeaponW("Bazooka", BazookaFireIOHandler));
        })(Bazooka || (Bazooka = {}));
    })(WebSplat.Weapon || (WebSplat.Weapon = {}));
    var Weapon = WebSplat.Weapon;
})(WebSplat || (WebSplat = {}));
