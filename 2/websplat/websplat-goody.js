/*
* Copyright (c) 2010, 2012-2013 Gregor Richards
*
* Permission to use, copy, modify, and/or distribute this software for any
* purpose with or without fee is hereby granted, provided that the above
* copyright notice and this permission notice appear in all copies.
*
* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
* SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
* OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
* CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
///<reference path="websplat.ts" />
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
                    // a
                    WebSplat.player.xacc = -1;
                    WebSplat.player.xaccmax = WebSplat.conf.moveSpeed * -1;
                    break;

                }
                case 39:
                case 68: {
                    // d
                    WebSplat.player.xacc = 1;
                    WebSplat.player.xaccmax = WebSplat.conf.moveSpeed;
                    break;

                }
                case 38:
                case 87: {
                    // w
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
                    // s
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
                    // space
                    //player.specialOn();
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
                    // a
                    if(WebSplat.player.xacc < 0) {
                        WebSplat.player.xacc = false;
                        WebSplat.player.xaccmax = false;
                    }
                    break;

                }
                case 39:
                case 68: {
                    // d
                    if(WebSplat.player.xacc > 0) {
                        WebSplat.player.xacc = false;
                        WebSplat.player.xaccmax = false;
                    }
                    break;

                }
                case 38:
                case 87: {
                    // w
                    pressingUp = false;
                    break;

                }
                case 40:
                case 83: {
                    // s
                    break;

                }
                case 70:
                case 32: {
                    // space
                    //player.specialOff();
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
