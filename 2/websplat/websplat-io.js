var WebSplat;
(function (WebSplat) {
    (function (IO) {
        var IOHandler = (function () {
            function IOHandler() { }
            IOHandler.prototype.onkeydown = function (key) {
                return true;
            };
            IOHandler.prototype.onkeyup = function (key) {
                return true;
            };
            IOHandler.prototype.onmousedown = function () {
                return true;
            };
            IOHandler.prototype.onmouseup = function () {
                return true;
            };
            return IOHandler;
        })();
        IO.IOHandler = IOHandler;        
        IO.ioHandler = null;
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
                        ev.stopPropagation();
                        return false;
                    }
                }
                return true;
            };
            $(document.body).keyup(keyup);
            $(window).keyup(keyup);
        });
    })(WebSplat.IO || (WebSplat.IO = {}));
    var IO = WebSplat.IO;
})(WebSplat || (WebSplat = {}));
