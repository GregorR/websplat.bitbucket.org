var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WebSplat;
(function (WebSplat) {
    var ponyConf = {
        ponies: [
            "pp2."
        ],
        moveSpeed: 3,
        pointsPerKill: 500,
        edgeDetectDist: 5,
        edgeDetectSize: 10
    };
    var ponyImageSets = {
        r: {
            frames: 16,
            frameRate: 3,
            width: 53,
            height: 53,
            bb: [
                23, 
                39, 
                31, 
                35
            ]
        },
        c: {
            frames: 32,
            frameRate: 3,
            width: 82,
            height: 58,
            bb: [
                36, 
                68, 
                37, 
                40
            ]
        }
    };
    var Pony = (function (_super) {
        __extends(Pony, _super);
        function Pony() {
                _super.call(this, ponyConf.ponies[WebSplat.getRandomInt(0, ponyConf.ponies.length)], ponyImageSets, "r", "r", true, true);
            this.munching = false;
            this.dead = false;
            this.xacc = 0;
        }
        Pony.prototype.updateImagePrime = function () {
            if(this.state === "c" && this.frame >= ponyImageSets.c.frames) {
                this.state = "r";
                this.frame = 0;
            }
        };
        Pony.prototype.tick = function () {
            if(!this.onScreen()) {
                return;
            }
            if(this.dead) {
                if(this.state === "da") {
                    this.state = "db";
                    this.frame = 0;
                } else {
                    if(this.state === "db") {
                        this.state = "dc";
                        this.frame = 0;
                    } else {
                        if(this.state === "dc") {
                            this.state = "dd";
                            this.frame = 0;
                        }
                    }
                }
                this.updateImage();
                return;
            }
            _super.prototype.tick.call(this);
            if(WebSplat.player === this) {
                return;
            }
            if(!this.munching && this.on !== null) {
                if(this.leftOf !== null || this.noPlatform(this.x - ponyConf.edgeDetectDist - ponyConf.edgeDetectSize)) {
                    this.xacc = 1;
                    this.xaccmax = ponyConf.moveSpeed;
                } else {
                    if(this.rightOf !== null || this.noPlatform(this.x + this.w + ponyConf.edgeDetectDist)) {
                        this.xacc = -1;
                        this.xaccmax = -ponyConf.moveSpeed;
                    } else {
                        if(this.xacc === false || this.xacc === 0) {
                            this.xacc = 1;
                            this.xaccmax = ponyConf.moveSpeed;
                        }
                    }
                }
            } else {
                this.xacc = false;
            }
            if(this.y < 0) {
                this.setXY(this.x, 0);
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
        return Pony;
    })(WebSplat.Sprite);
    WebSplat.Pony = Pony;    
    WebSplat.addHandler("postload", function () {
        var last = null;
        WebSplat.spritesOnPlatform(ponyImageSets.r.width, ponyImageSets.r.height, 480, 480 * 320, function () {
            return (last = new Pony());
        });
        WebSplat.player = last;
        WebSplat.assertPlayerViewport();
    });
})(WebSplat || (WebSplat = {}));
