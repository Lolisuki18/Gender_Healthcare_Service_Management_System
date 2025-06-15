package com.healapp.repository;

import java.util.List;

import com.healapp.model.ServiceTestComponent;

public interface ServiceTestComponentRepository {

    void saveAll(List<ServiceTestComponent> components);

}
