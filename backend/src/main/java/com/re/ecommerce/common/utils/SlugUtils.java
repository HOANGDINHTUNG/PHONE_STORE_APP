package com.re.ecommerce.common.utils;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public final class SlugUtils {
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
    private static final Pattern MULTIPLEDASH = Pattern.compile("-+");

    private SlugUtils() {}

    public static String toSlug(String input) {
        if (input == null || input.trim().isEmpty()) {
            return "";
        }
        
        // Remove diacritics (Vietnamese accents)
        String temp = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        temp = pattern.matcher(temp).replaceAll("");

        // Specific Vietnamese letter mappings not covered by Form.NFD, e.g. đ -> d
        temp = temp.replace('đ', 'd').replace('Đ', 'D').replace('Đ', 'd');

        // Convert to lower case
        String slug = temp.toLowerCase(Locale.ENGLISH);

        // Replace whitespace characters with slug separator -
        slug = WHITESPACE.matcher(slug).replaceAll("-");

        // Remove any non-alphanumeric, non-separator characters
        slug = NONLATIN.matcher(slug).replaceAll("");

        // Collapse multiple dashes into one
        slug = MULTIPLEDASH.matcher(slug).replaceAll("-");

        // Trim leading/trailing dashes
        if (slug.startsWith("-")) {
            slug = slug.substring(1);
        }
        if (slug.endsWith("-")) {
            slug = slug.substring(0, slug.length() - 1);
        }

        return slug;
    }
}
