package com.healapp.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rating_summary")
public class RatingSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "summary_id")
    private Long summaryId;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 20)
    private Rating.RatingTargetType targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "total_ratings", nullable = false)
    private Integer totalRatings = 0;

    @Column(name = "average_rating", precision = 2, scale = 1, nullable = false)
    private BigDecimal averageRating = BigDecimal.ZERO;

    // Star distribution
    @Column(name = "five_star_count", nullable = false)
    private Integer fiveStarCount = 0;

    @Column(name = "four_star_count", nullable = false)
    private Integer fourStarCount = 0;

    @Column(name = "three_star_count", nullable = false)
    private Integer threeStarCount = 0;

    @Column(name = "two_star_count", nullable = false)
    private Integer twoStarCount = 0;

    @Column(name = "one_star_count", nullable = false)
    private Integer oneStarCount = 0;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    // Constructor convenience
    public RatingSummary(Rating.RatingTargetType targetType, Long targetId) {
        this.targetType = targetType;
        this.targetId = targetId;
        this.lastUpdated = LocalDateTime.now();
    }
}
