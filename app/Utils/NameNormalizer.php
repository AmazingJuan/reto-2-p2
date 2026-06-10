<?php

namespace App\Utils;

class NameNormalizer
{
    /**
     * Normalize a given name by trimming whitespace and converting to lowercase.
     *
     * @param string $name
     * @return string
     */
    public static function normalize(string $value): string
    {
        $value = iconv('UTF-8', 'ASCII//TRANSLIT', $value);
        $value = mb_strtolower($value, 'UTF-8');
        $value = preg_replace('/[^a-z0-9]+/', '_', $value);
        return trim($value, '_');
    }
}