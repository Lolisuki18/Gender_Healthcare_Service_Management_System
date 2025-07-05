package com.healapp.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Khai báo chu kỳ kinh nguyệt của người dùng
@Entity
@Table(name = "menstrual_cycle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenstrualCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cycle_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserDtls user;

    @Past
    @Column(nullable = false)
    private LocalDate startDate; // ngay bat dau chu ki kinh nguyet

    @Column(nullable = false)
    @Min(value = 1)
    @Max(value = 30)
    private Long numberOfDays; // so ngay hanh kinh

    @Column(nullable = false)
    @Min(value = 1)
    private Long cycleLength; // chu ky kinh nguyet

    @Column(nullable = false)
    private LocalDate ovulationDate; // ngay rung trung

    @Column(name = "ovulation_remind", nullable = false)
    private Boolean ovulationRemind = false;

    @Column(name = "pregnancy_remind", nullable = false)
    private Boolean pregnancyRemind = false;

    @Column(nullable = false) // Ngày tạo chu kỳ kinh nguyệt
    private LocalDateTime createdAt = LocalDateTime.now();

}
