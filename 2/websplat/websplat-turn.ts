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
///<reference path="websplat-io.ts" />

module WebSplat {
    module Turns {
        /* Turn is in four phases: Move, select, fire, effect:
         * Move:
         *   Move the player on the screen. Advance by pressing 'e'.
         *
         * Select:
         *   Choose a weapon to fire. Not a normal I/O handler, only displays a
         *   dialog.
         *
         * Fire:
         *   Fire a weapon. I/O handler per weapon provided by WebSplat.Weapon.
         *
         * Effect:
         *   Wait for the effect of the weapon to complete before advancing to
         *   the next turn in the move phase.
         */
        class MovePhaseIOHandler extends IO.IOHandler {
            constructor() {
                super(null, null);
            }

            public onkeydown(key: number) {
                if (player === null) return true;
                switch (key) {
                    case 37: // left
                        player.xacc = -1;
                        player.xaccmax = conf.moveSpeed * -1;
                        break;

                    case 39: // right
                        player.xacc = 1;
                        player.xaccmax = conf.moveSpeed;
                        break;

                    case 38: // up
                        if (player.on !== null) {
                            player.on = null;
                            player.yvel = -conf.jumpSpeed;
                        }
                        break;

                    case 40: // down
                        if (player.on !== null) {
                            var thru = 0;
                            for (var i = 0; i < player.on.length; i++) {
                                var el = player.on[i];
                                if (el.wpThruable) {
                                    player.thru[el.wpID] = true;
                                    thru++;
                                }
                            }
                            if (thru === player.on.length)
                                player.on = null;
                        }
                        break;

                    case 69: // e
                }
                return false;
            }

            public onkeyup(key: number) {
                if (player === null) return true;
                switch (key) {
                    case 37: // left
                        if (player.xacc < 0) {
                            player.xacc = null;
                            player.xaccmax = null;
                        }
                        break;

                    case 39: // right
                        if (player.xacc > 0) {
                            player.xacc = null;
                            player.xaccmax = null;
                        }
                        break;
                }
                return false;
            }
        }

        export var theMovePhaseIOHandler = new MovePhaseIOHandler();
        IO.setIOHandler(theMovePhaseIOHandler);

        class SelectPhaseIOHandler extends IO.IOHandler {
            constructor() {
                super(null, null);
            }
        }

        export var theSelectPhaseIOHandler = new SelectPhaseIOHandler();
        theMovePhaseIOHandler.next = theSelectPhaseIOHandler;
        theSelectPhaseIOHandler.prev = theMovePhaseIOHandler;
    }
}
