<?php

namespace App\Helpers;


class ColorHelper
{
    //Code by Dest.Com (https://github.com/DestroyCom)
    public static function randRGB()
    {
        $red = rand(0, 255);
        $green = rand(0, 255);
        $blue = rand(0, 255);

        return [$red, $green, $blue];
    }

    public static function convertRGBToHexa($rvb)
    {
        return sprintf("#%02x%02x%02x", $rvb[0], $rvb[1], $rvb[2]);
    }



    public static function prettyHexadecimal($variance = 20)
    {
        $randomizerColorVariance = ['red', 'green', 'blue'];

        $defaultRGB = self::randRGB();

        $color_1 = self::convertRGBToHexa($defaultRGB);
        $color_2 = null;

        $randomizerColorVariance = $randomizerColorVariance[rand(0, 2)];

        if ($randomizerColorVariance == 'red') {
            $newRed = ($defaultRGB[0] + $variance) % 255;
            $color_2 = sprintf("#%02x%02x%02x", $newRed, $defaultRGB[1], $defaultRGB[2]);
        } elseif ($randomizerColorVariance == 'green') {
            $newGreen = ($defaultRGB[1] + $variance) % 255;
            $color_2 = sprintf("#%02x%02x%02x", $defaultRGB[0], $newGreen, $defaultRGB[2]);
        } elseif ($randomizerColorVariance == 'blue') {
            $newBlue = ($defaultRGB[2] + $variance) % 255;
            $color_2 = sprintf("#%02x%02x%02x", $defaultRGB[0], $defaultRGB[1], $newBlue);
        }

        return [$color_1, $color_2];
    }
}
