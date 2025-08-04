package com.healapp.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class TimezoneUtils {
    public static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    public static final ZoneId UTC_ZONE = ZoneId.of("UTC");
    
    public static LocalDateTime convertUtcToVietnam(LocalDateTime utcDateTime) {
        if (utcDateTime == null) return null;
        
        return utcDateTime
            .atZone(UTC_ZONE)
            .withZoneSameInstant(VIETNAM_ZONE)
            .toLocalDateTime();
    }

    public static LocalDateTime convertVietnamToUtc(LocalDateTime vietnamDateTime) {
        if (vietnamDateTime == null) return null;
        
        return vietnamDateTime
            .atZone(VIETNAM_ZONE)
            .withZoneSameInstant(UTC_ZONE)
            .toLocalDateTime();
    }

    public static LocalDateTime nowInVietnam() {
        return LocalDateTime.now(VIETNAM_ZONE);
    }
    
    public static LocalDateTime nowInUtc() {
        return LocalDateTime.now(UTC_ZONE);
    }

    public static boolean isCurrentVietnamTimeInRange(int startHour, int endHour) {
        int currentHour = nowInVietnam().getHour();
        
        if (startHour <= endHour) {
            return currentHour >= startHour && currentHour <= endHour;
        } else {
            return currentHour >= startHour || currentHour <= endHour;
        }
    }
}
