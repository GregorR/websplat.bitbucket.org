var WebSplat;
(function (WebSplat) {
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
            width: 53,
            height: 53,
            bb: [
                23, 
                39, 
                31, 
                35
            ]
        }
    };
    function Rocket(firedBy) {
        this.expended = false;
        this.firedBy = firedBy;
        WebSplat.Sprite.call(this, "pp2.", rocketLauncherImageSets, "r", "r", true, false);
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
        midFire = false;
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
    var mdStart = null;
    var firing = null;
    var midFire = false;
    WebSplat.addHandler("ontick", function () {
        if(!midFire && firing !== null) {
            var player = firing.player;
            if(player.frame >= 16) {
                var rocket = new Rocket(player);
                rocket.setXY(player.x, player.y);
                rocket.startingPosition();
                rocket.xvel = firing.xvel;
                rocket.yvel = firing.yvel;
                WebSplat.addSprite(rocket);
                firing = null;
                midFire = true;
            }
        }
    });
    $(document.body).mousedown(function (ev) {
        if(firing || midFire) {
            return true;
        }
        console.log((ev.target).constructor.name);
        mdStart = new Date().getTime();
        ev.preventDefault();
        ev.stopPropagation();
    });
    $(document.body).mouseup(function (ev) {
        if(WebSplat.player === null) {
            return true;
        }
        if(mdStart === null) {
            return true;
        }
        var bazTime = new Date().getTime() - mdStart;
        mdStart = null;
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
        firing = {
            xvel: xvel,
            yvel: yvel,
            player: WebSplat.player
        };
        return false;
    });
    $(window).click(function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
    });
})(WebSplat || (WebSplat = {}));
