package com.healapp.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healapp.service.STITestService;

@RestController
@RequestMapping("/sti-tests")
public class STITestServiceController {
    @Autowired
    private STITestService stiTestService;

    // ... existing endpoints ...

    @PutMapping("/{testId}/service-note")
    @PreAuthorize("hasRole('ROLE_CONSULTANT') or hasRole('ROLE_STAFF') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateConsultantNoteForService(
            @PathVariable Long testId,
            @RequestBody Map<String, Object> body) {
        Long serviceId = ((Number) body.get("serviceId")).longValue();
        Long consultantId = body.get("consultantId") != null ? ((Number) body.get("consultantId")).longValue() : null;
        String note = (String) body.get("note");
        stiTestService.updateConsultantNoteForService(testId, serviceId, consultantId, note);
        return ResponseEntity.ok().body(Map.of("success", true));
    }
} 