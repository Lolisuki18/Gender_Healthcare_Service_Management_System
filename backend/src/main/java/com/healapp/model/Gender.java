package com.healapp.model;

public enum Gender {
    MALE("Nam"),
    FEMALE("Nữ"),
    OTHER("Khác");

    private final String displayName;

    Gender(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Gender fromDisplayName(String displayName) {
        if (displayName == null) {
            throw new IllegalArgumentException("Gender cannot be null");
        }

        // First try exact match with display name
        for (Gender gender : Gender.values()) {
            if (gender.displayName.equalsIgnoreCase(displayName.trim())) {
                return gender;
            }
        }

        // If not found, try matching with enum name
        try {
            return Gender.valueOf(displayName.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            // Not a valid enum name either
            throw new IllegalArgumentException("Invalid gender: " + displayName);
        }
    }

    public static String getDisplayNameFromEnumName(String enumName) {
        if (enumName == null) {
            return null;
        }
        try {
            return Gender.valueOf(enumName.toUpperCase()).getDisplayName();
        } catch (IllegalArgumentException e) {
            return enumName; // Return as-is if not a valid enum name
        }
    }
}