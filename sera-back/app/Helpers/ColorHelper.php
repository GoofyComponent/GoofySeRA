<?php

namespace App\Helpers;


class ColorHelper
{
    public static function generateRandomGradientColor($baseColor = null)
    {
        $baseColor = $baseColor ?? self::randomHexColor();
        $complementaryColor = self::generateColorVariant($baseColor);

        return [$baseColor, $complementaryColor];
    }

    public static function randomHexColor()
    {
        return sprintf("#%06x", rand(0, 16777215));
    }

    public static function generateColorVariant($baseColor)
    {
        $hsl = self::hexToHsl($baseColor);

        // Modifier la luminosité de la couleur de base pour générer une variante
        $variantLightness = ($hsl['l'] < 0.5) ? $hsl['l'] + 0.2 : $hsl['l'] - 0.2;

        // Convertir la nouvelle luminosité en couleur HEX
        $variantColor = self::hslToHex($hsl['h'], $hsl['s'], $variantLightness);

        return $variantColor;
    }

    private static function hexToHsl($color)
    {
        $color = ltrim($color, '#');
        $red = hexdec(substr($color, 0, 2));
        $green = hexdec(substr($color, 2, 2));
        $blue = hexdec(substr($color, 4, 2));

        return self::rgbToHsl($red, $green, $blue);
    }

    private static function rgbToHsl($red, $green, $blue)
    {
        $red = $red / 255;
        $green = $green / 255;
        $blue = $blue / 255;

        $max = max($red, $green, $blue);
        $min = min($red, $green, $blue);

        $hue = 0;
        $saturation = 0;
        $lightness = ($max + $min) / 2;

        if ($max !== $min) {
            $delta = $max - $min;
            $saturation = $delta / (1 - abs(2 * $lightness - 1));

            switch ($max) {
                case $red:
                    $hue = 60 * fmod((($green - $blue) / $delta), 6);
                    break;
                case $green:
                    $hue = 60 * ((($blue - $red) / $delta) + 2);
                    break;
                case $blue:
                    $hue = 60 * ((($red - $green) / $delta) + 4);
                    break;
            }
        }

        return [
            'h' => $hue,
            's' => $saturation,
            'l' => $lightness
        ];
    }

    private static function hslToHex($hue, $saturation, $lightness)
    {
        $hue = $hue / 360;
        $saturation = $saturation;
        $lightness = $lightness;

        if ($saturation === 0) {
            $red = $lightness;
            $green = $lightness;
            $blue = $lightness;
        } else {
            $q = $lightness < 0.5 ? $lightness * (1 + $saturation) : $lightness + $saturation - $lightness * $saturation;
            $p = 2 * $lightness - $q;

            $red = self::hueToRgb($p, $q, $hue + (1 / 3));
            $green = self::hueToRgb($p, $q, $hue);
            $blue = self::hueToRgb($p, $q, $hue - (1 / 3));
        }

        $red = round($red * 255);
        $green = round($green * 255);
        $blue = round($blue * 255);

        return sprintf("#%02x%02x%02x", $red, $green, $blue);
    }

    private static function hueToRgb($p, $q, $t)
    {
        if ($t < 0) {
            $t += 1;
        }
        if ($t > 1) {
            $t -= 1;
        }
        if ($t < 1 / 6) {
            return $p + ($q - $p) * 6 * $t;
        }
        if ($t < 1 / 2) {
            return $q;
        }
        if ($t < 2 / 3) {
            return $p + ($q - $p) * (2 / 3 - $t) * 6;
        }
        return $p;
    }

    public static function convertToTailwindGradient($colors)
    {
        $fromColor = $colors[0];
        $toColor = end($colors);

        $gradient = "bg-gradient-to-r from-[{$fromColor}] to-[{$toColor}]";

        return $gradient;
    }

    //Code by Dest.Com

    //Hexadecimal generator

    public static function randRGB(){
        $red = rand(0, 255);
        $green = rand(0, 255);
        $blue = rand(0, 255);

        return [$red, $green, $blue];
    }

    public static function convertRGBToHexa($rvb){
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