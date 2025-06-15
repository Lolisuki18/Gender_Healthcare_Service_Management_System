package com.healapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healapp.dto.ServiceTestComponentRequest;
import com.healapp.repository.ServiceTestComponentRepository;

@Service
public class ServiceTestComponentService {

    @Autowired
    private ServiceTestComponentRepository serviceTestComponentRepository;

    // chỉnh sửa thông tin của ServiceTestComponent
    public void updateServiceTestComponent(ServiceTestComponentRequest request, Long id) {
        try {
            // kiểm tra xem ServiceTestComponent có tồn tại không
            if (serviceTestComponentRepository.existsById(id)) {
                // nếu tồn tại, cập nhật thông tin
                serviceTestComponentRepository.updateServiceTestComponent(
                        request.getTestName(),
                        request.getUnit(),
                        request.getReferenceRange(),
                        request.getInterpretation(),
                        id);
            } else {
                throw new RuntimeException("ServiceTestComponent with ID " + id + " does not exist.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error updating ServiceTestComponent: " + e.getMessage());
        }
    }

}
