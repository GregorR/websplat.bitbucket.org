<?PHP
/*
 * Copyright (C) 2010 Gregor Richards
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// metadata
$frameOffsets = array(
    array(5, 5),
    array(5, 4),
    array(3, 5),
    array(2, 5),
    array(3, 5),
    array(5, 4),
    array(6, 4),
    array(6, 5)
);
$imagew = 25;
$imageh = 32;

// figure out what our request is
$domain = stripslashes($_REQUEST["domain"]);
$frame = stripslashes($_REQUEST["frame"]);

// validate the frame
if (strlen($frame) != 7 || $frame[0] != "s") {
    die("Invalid frame");
}
$frameNo = intval($frame[1]);
if ($frameNo < 0 || $frameNo >= count($frameOffsets)) {
    die("Invalid frame number.");
}
$dir = $frame[2];
if ($dir != "l" && $dir != "r") {
    die("Invalid direction.");
}

// then get the favicon
$dsha = sha1($domain);
$dcache = "cache/" . $dsha;
$favicon = null;
$old = time() - 7 * 24 * 60 * 60;

// if it's in the cache, easy
if (file_exists($dcache) && filemtime($dcache) >= $old) {
    $favicon = file_get_contents($dcache);
} else {
    $favicon = file_get_contents("http://www.google.com/s2/favicons?domain=" . urlencode($domain));
    // we'll just trust Google not to give craziness :)
    file_put_contents($dcache, $favicon);
}

// now load the favicon image
$fgd2 = imagecreatefromstring($favicon);
imagesavealpha($fgd2, true);

// and load the base
$bgd2 = imagecreatefrompng("favicon-s" . $frameNo . $dir . ".png");
imagesavealpha($bgd2, true);

// figure out our offset
$offset = $frameOffsets[$frameNo];
if ($dir == "r") {
    $offset[0] = $imagew - $offset[0] - 16;
}

// then put them together
$im = imagecreatetruecolor($imagew, $imageh);
imagesavealpha($im, true);
$tr = imagecolorallocatealpha($im, 255, 255, 255, 127);
imagefill($im, 0, 0, $tr);
imagecopy($im, $fgd2, $offset[0], $offset[1], 0, 0, 16, 16);
imagecopy($im, $bgd2, 0, 0, 0, 0, $imagew, $imageh);
imagedestroy($fgd2);
//imagedestroy($bgd2);

// and output it
header("Content-type: image/png");
imagepng($im);
imagedestroy($im);
?>
