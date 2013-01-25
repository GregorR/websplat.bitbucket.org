var WebSplat;
(function (WebSplat) {
    var pressingUp = false;
    WebSplat.addHandler("postload", function () {
        var keydown = function (ev) {
            if(ev.ctrlKey || ev.altKey || ev.metaKey) {
                return true;
            }
            if(WebSplat.player === null) {
                return true;
            }
            switch(ev.which) {
                case 37:
                case 65: {
                    WebSplat.player.xacc = -1;
                    WebSplat.player.xaccmax = WebSplat.conf.moveSpeed * -1;
                    break;

                }
                case 39:
                case 68: {
                    WebSplat.player.xacc = 1;
                    WebSplat.player.xaccmax = WebSplat.conf.moveSpeed;
                    break;

                }
                case 38:
                case 87: {
                    if(pressingUp) {
                        break;
                    }
                    pressingUp = true;
                    if(WebSplat.player.on !== null) {
                        WebSplat.player.on = null;
                        WebSplat.player.yvel = -WebSplat.conf.jumpSpeed;
                    }
                    break;

                }
                case 40:
                case 83: {
                    if(WebSplat.player.on !== null) {
                        WebSplat.player.mode = "jfc";
                        WebSplat.player.frame = 0;
                        for(var i = 0; i < WebSplat.player.on.length; i++) {
                            WebSplat.player.thru[WebSplat.player.on[i].wpID] = true;
                        }
                        WebSplat.player.on = null;
                    }
                    break;

                }
                case 70:
                case 32: {
                    break;

                }
            }
            ev.stopPropagation();
            return false;
        };
        $(document.body).keydown(keydown);
        $(window).keydown(keydown);
        var keyup = function (ev) {
            if(WebSplat.player === null) {
                return true;
            }
            switch(ev.which) {
                case 37:
                case 65: {
                    if(WebSplat.player.xacc < 0) {
                        WebSplat.player.xacc = false;
                        WebSplat.player.xaccmax = false;
                    }
                    break;

                }
                case 39:
                case 68: {
                    if(WebSplat.player.xacc > 0) {
                        WebSplat.player.xacc = false;
                        WebSplat.player.xaccmax = false;
                    }
                    break;

                }
                case 38:
                case 87: {
                    pressingUp = false;
                    break;

                }
                case 40:
                case 83: {
                    break;

                }
                case 70:
                case 32: {
                    break;

                }
            }
            ev.stopPropagation();
            return false;
        };
        $(document.body).keyup(keyup);
        $(window).keyup(keyup);
    });
})(WebSplat || (WebSplat = {}));
