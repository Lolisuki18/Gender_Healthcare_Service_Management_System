package com.healapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healapp.dto.ApiResponse;
import com.healapp.dto.CategoryRequest;
import com.healapp.dto.CategoryResponse;
import com.healapp.model.BlogPost;
import com.healapp.model.BlogPostStatus;
import com.healapp.model.Category;
import com.healapp.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public ApiResponse<Category> createCategory(CategoryRequest request) {
        try {
            if (categoryRepository.existsByName(request.getName())) {
                return ApiResponse.error("Category with this name already exists");
            }

            Category category = new Category();
            category.setName(request.getName());
            category.setDescription(request.getDescription());

            Category savedCategory = categoryRepository.save(category);
            return ApiResponse.success("Category created successfully", savedCategory);
        } catch (Exception e) {
            return ApiResponse.error("Failed to create category: " + e.getMessage());
        }
    }

    public ApiResponse<Category> updateCategory(Long categoryId, CategoryRequest request) {
        try {
            Optional<Category> existingCategory = categoryRepository.findByCategoryId(categoryId);
            if (existingCategory.isEmpty()) {
                return ApiResponse.error("Category not found");
            }

            if (!existingCategory.get().getName().equals(request.getName()) &&
                    categoryRepository.existsByName(request.getName())) {
                return ApiResponse.error("Category with this name already exists");
            }

            Category category = existingCategory.get();
            category.setName(request.getName());
            category.setDescription(request.getDescription());
            category.setIsActive(request.getIsActive());
            Category updatedCategory = categoryRepository.save(category);
            return ApiResponse.success("Category updated successfully", updatedCategory);
        } catch (Exception e) {
            return ApiResponse.error("Failed to update category: " + e.getMessage());
        }
    }

    public ApiResponse<String> deleteCategory(Long categoryId) {
        try {
            Optional<Category> categoryOpt = categoryRepository.findByCategoryIdAndIsActiveTrue(categoryId);
            if (categoryOpt.isEmpty()) {
                return ApiResponse.error("Category not found");
            }

            Category category = categoryOpt.get();
            // Cập nhật trạng thái các bài viết liên quan nếu cần (giữ nguyên logic cũ)
            List<BlogPost> affectedPosts = category.getPosts();
            LocalDateTime now = LocalDateTime.now();
            String cancellationReason = "Category '" + category.getName() + "' has been deleted";

            for (BlogPost post : affectedPosts) {
                post.setStatus(BlogPostStatus.CANCELED);
                post.setRejectionReason(cancellationReason);
                post.setUpdatedAt(now);
            }

            // Đánh dấu category là không hoạt động
            category.setIsActive(false);
            categoryRepository.save(category);

            return ApiResponse.success("Category deleted (soft) successfully and " + affectedPosts.size() +
                    " related blog posts have been canceled", null);
        } catch (Exception e) {
            return ApiResponse.error("Failed to delete category: " + e.getMessage());
        }
    }

    public ApiResponse<Category> getCategoryById(Long categoryId) {
        try {
            Optional<Category> category = categoryRepository.findByCategoryIdAndIsActiveTrue(categoryId);
            if (category.isEmpty()) {
                return ApiResponse.error("Category not found");
            }
            return ApiResponse.success("Category retrieved successfully", category.get());
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve category: " + e.getMessage());
        }
    }

    public ApiResponse<List<Category>> getAllCategories() {
        try {
            List<Category> categories = categoryRepository.findAllByIsActiveTrue();
            return ApiResponse.success("Categories retrieved successfully", categories);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve categories: " + e.getMessage());
        }
    }

    // Thêm method mới để trả về categories với số lượng bài viết
    public ApiResponse<List<CategoryResponse>> getAllCategoriesWithPostCount() {
        try {
            List<Category> categories = categoryRepository.findAllByIsActiveTrue();
            List<CategoryResponse> categoryResponses = categories.stream()
                    .map(CategoryResponse::new)
                    .collect(Collectors.toList());
            return ApiResponse.success("Categories retrieved successfully", categoryResponses);
        } catch (Exception e) {
            return ApiResponse.error("Failed to retrieve categories: " + e.getMessage());
        }
    }
}