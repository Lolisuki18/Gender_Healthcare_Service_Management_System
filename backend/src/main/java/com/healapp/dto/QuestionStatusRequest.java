package com.healapp.dto;

import com.healapp.model.Question.QuestionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuestionStatusRequest {
    @NotNull(message = "Status is required")
    private QuestionStatus status;

    private String rejectionReason;

    // Cho phép chỉ định người sẽ trả lời khi xác nhận câu hỏi
    private Long replierId;
}