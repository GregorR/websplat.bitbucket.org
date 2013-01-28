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
                _super.apply(this, arguments);

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
                    case 69:
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
                }
                return false;
            };
            return MovePhaseIOHandler;
        })(WebSplat.IO.IOHandler);        
        WebSplat.IO.ioHandler = new MovePhaseIOHandler();
    })(Turns || (Turns = {}));
})(WebSplat || (WebSplat = {}));
