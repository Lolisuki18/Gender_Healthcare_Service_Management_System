package com.healapp.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import com.healapp.model.UserDtls;
import com.healapp.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider, userDetailsService());
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter)
            throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ========= PUBLIC ENDPOINTS =========
                        // Static resources
                        .requestMatchers("/img/**", "/static/**").permitAll()

                        // API Authentication & User Management
                        .requestMatchers("/users/register", "/users/login", "/users/logout",
                                "/users/forgot-password", "/users/reset-password", "/users/send-verification",
                                "/users/check-username")
                        .permitAll()

                        // JWT Authentication endpoints
                        .requestMatchers("/auth/login", "/auth/refresh-token", "/auth/logout")
                        .permitAll()

                        // Consultant public endpoints
                        .requestMatchers(HttpMethod.GET, "/consultants").permitAll()
                        .requestMatchers(HttpMethod.GET, "/consultants/{userId}").permitAll()

                        // Consultation public endpoints
                        .requestMatchers(HttpMethod.GET, "/consultations/consultants").permitAll()
                        .requestMatchers(HttpMethod.GET, "/consultations/available-slots").permitAll()
                        .requestMatchers(HttpMethod.GET, "/consultations/consultant/{consultantId}/profile").permitAll()

                        // STI Services public endpoints
                        .requestMatchers(HttpMethod.GET, "/sti-services").permitAll()
                        .requestMatchers(HttpMethod.GET, "/sti-services/{serviceId}").permitAll()

                        // STI Packages public endpoints
                        .requestMatchers(HttpMethod.GET, "/sti-packages").permitAll()
                        .requestMatchers(HttpMethod.GET, "/sti-packages/{packageId}").permitAll()

                        // ========= BLOG PUBLIC ENDPOINTS =========
                        .requestMatchers(HttpMethod.GET, "/blog").permitAll()
                        .requestMatchers(HttpMethod.GET, "/blog/{postId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/blog/category/{categoryId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/blog/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/blog/latest").permitAll()

                        // ========= RATING PUBLIC ENDPOINTS =========
                        .requestMatchers(HttpMethod.GET, "/ratings/consultant/{consultantId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ratings/sti-service/{serviceId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ratings/sti-package/{packageId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ratings/summary/consultant/{consultantId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ratings/summary/sti-service/{serviceId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ratings/summary/sti-package/{packageId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ratings/testimonials").permitAll()

                        // ========= QUESTION PUBLIC ENDPOINTS =========
                        .requestMatchers(HttpMethod.GET, "/questions/answered").permitAll()
                        .requestMatchers(HttpMethod.GET, "/questions/search").permitAll()

                        // ========= AUTHENTICATED USER ENDPOINTS =========
                        // USER PROFILE MANAGEMENT
                        .requestMatchers(HttpMethod.GET, "/users/profile").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/users/profile/basic").authenticated()
                        .requestMatchers(HttpMethod.POST, "/users/profile/email/send-verification").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/users/profile/email").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/users/profile/password").authenticated()
                        .requestMatchers(HttpMethod.POST, "/users/profile/avatar").authenticated()

                        // API Consultations (Authenticated user endpoints)
                        .requestMatchers(HttpMethod.POST, "/consultations").authenticated()
                        .requestMatchers(HttpMethod.GET, "/consultations/my-consultations").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/consultations/{consultationId}/status").authenticated()
                        .requestMatchers(HttpMethod.GET, "/consultations/status/{status}").authenticated() // API STI
                                                                                                           // Tests
                                                                                                           // (Authenticated
                                                                                                           // user
                                                                                                           // endpoints)
                        .requestMatchers(HttpMethod.POST, "/sti-services/book-test").authenticated()
                        .requestMatchers(HttpMethod.GET, "/sti-services/my-tests").authenticated()
                        .requestMatchers(HttpMethod.GET, "/sti-services/tests/{testId}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/sti-services/tests/{testId}/cancel").authenticated()
                        .requestMatchers(HttpMethod.GET, "/sti-services/tests/{testId}/results").authenticated()

                        // API Payment Info (Authenticated user endpoints)
                        .requestMatchers(HttpMethod.GET, "/payment-info").authenticated()
                        .requestMatchers(HttpMethod.GET, "/payment-info/default").authenticated()
                        .requestMatchers(HttpMethod.GET, "/payment-info/{paymentInfoId}/for-payment").authenticated()
                        .requestMatchers(HttpMethod.POST, "/payment-info").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/payment-info/{paymentInfoId}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/payment-info/{paymentInfoId}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/payment-info/{paymentInfoId}/set-default").authenticated()

                        // API STI Package (Authenticated user endpoints)
                        .requestMatchers(HttpMethod.GET, "/sti-services/packages").permitAll()
                        .requestMatchers(HttpMethod.GET, "/sti-services/packages/{packageId}").permitAll()

                        // ========= BLOG AUTHENTICATED ENDPOINTS =========
                        .requestMatchers(HttpMethod.POST, "/blog").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/blog/{postId}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/blog/{postId}").authenticated()
                        .requestMatchers(HttpMethod.GET, "/blog/my-posts").authenticated()

                        // ========= RATING AUTHENTICATED ENDPOINTS =========
                        .requestMatchers(HttpMethod.POST, "/ratings/consultant/{consultantId}").authenticated()
                        .requestMatchers(HttpMethod.POST, "/ratings/sti-service/{serviceId}").authenticated()
                        .requestMatchers(HttpMethod.POST, "/ratings/sti-package/{packageId}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/ratings/{ratingId}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/ratings/{ratingId}").authenticated()
                        .requestMatchers(HttpMethod.GET, "/ratings/my-ratings").authenticated()
                        .requestMatchers(HttpMethod.GET, "/ratings/can-rate/{targetType}/{targetId}").authenticated()

                        // ========= QUESTION AUTHENTICATED ENDPOINTS =========
                        .requestMatchers(HttpMethod.POST, "/questions").authenticated()
                        .requestMatchers(HttpMethod.GET, "/questions/category/{categoryId}").authenticated()
                        .requestMatchers(HttpMethod.GET, "/questions/my-questions").authenticated()
                        .requestMatchers(HttpMethod.GET, "/questions/{questionId}").authenticated()

                        // ========= CONSULTANT ENDPOINTS =========
                        // API Consultant Profile Management
                        .requestMatchers(HttpMethod.PUT, "/consultants/profile/{userId}").hasRole("CONSULTANT")

                        // API Consultations (Consultant actions)
                        .requestMatchers(HttpMethod.GET, "/consultations/assigned").hasRole("CONSULTANT")

                        // ========= CONSULTANT QUESTION ENDPOINTS =========
                        .requestMatchers(HttpMethod.PUT, "/questions/{questionId}/answer").hasRole("CONSULTANT")

                        // ========= STAFF ENDPOINTS =========
                        // STI Services management
                        .requestMatchers(HttpMethod.POST, "/sti-services").hasRole("STAFF")
                        .requestMatchers(HttpMethod.PUT, "/sti-services/{serviceId}").hasRole("STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/sti-services/{serviceId}").hasRole("STAFF") // API STI
                                                                                                          // Tests
                                                                                                          // (Staff
                                                                                                          // actions)
                        .requestMatchers(HttpMethod.GET, "/sti-services/staff/pending-tests").hasRole("STAFF")
                        .requestMatchers(HttpMethod.PUT, "/sti-services/staff/tests/{testId}/confirm").hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, "/sti-services/staff/confirmed-tests").hasRole("STAFF")
                        .requestMatchers(HttpMethod.PUT, "/sti-services/staff/tests/{testId}/sample").hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, "/sti-services/staff/my-tests").hasRole("STAFF")
                        .requestMatchers(HttpMethod.PUT, "/sti-services/staff/tests/{testId}/result").hasRole("STAFF")
                        .requestMatchers(HttpMethod.PUT, "/sti-services/staff/tests/{testId}/complete").hasRole("STAFF")

                        // API STI Packages (Staff actions)
                        .requestMatchers(HttpMethod.POST, "/sti-services/packages").hasRole("STAFF")
                        .requestMatchers(HttpMethod.PUT, "/sti-services/packages/{packageId}").hasRole("STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/sti-services/packages/{packageId}").hasRole("STAFF")

                        // ========= BLOG STAFF ENDPOINTS =========
                        .requestMatchers(HttpMethod.PUT, "/blog/{postId}/status").hasRole("STAFF")

                        // ========= RATING STAFF ENDPOINTS =========
                        .requestMatchers(HttpMethod.GET, "/ratings/staff/all").hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, "/ratings/staff/consultation").hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, "/ratings/staff/sti-service").hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, "/ratings/staff/sti-package").hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, "/ratings/staff/summary/all").hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, "/ratings/staff/summary/consultation").hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, "/ratings/staff/summary/sti-service").hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, "/ratings/staff/summary/sti-package").hasRole("STAFF")
                        .requestMatchers(HttpMethod.POST, "/ratings/staff/reply/{ratingId}").hasRole("STAFF")
                        .requestMatchers(HttpMethod.PUT, "/ratings/staff/reply/{ratingId}").hasRole("STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/ratings/staff/reply/{ratingId}").hasRole("STAFF")

                        // ========= QUESTION STAFF ENDPOINTS =========
                        .requestMatchers(HttpMethod.PUT, "/questions/{questionId}/status")
                        .hasAnyRole("STAFF", "CONSULTANT")
                        .requestMatchers(HttpMethod.DELETE, "/questions/{questionId}").hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, "/questions/status/{status}").hasAnyRole("STAFF", "CONSULTANT")

                        // ========= ADMIN ENDPOINTS =========
                        // API User & Admin Management
                        .requestMatchers(HttpMethod.GET, "/admin/consultants").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin/consultants/{userId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/admin/consultants/{userId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/admin/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/users/{userId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin/users/roles").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin/users/count").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin/users/{userId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/users/{userId}").hasRole("ADMIN")

                        // API App Config Management (Admin only)
                        .requestMatchers(HttpMethod.GET, "/admin/config").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/config").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/admin/config").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/admin/config/{key}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/config/{key}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/config/{key}/inactive").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/config/{key}/active").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/admin/config/{key}/upload").hasRole("ADMIN") // API STI
                                                                                                         // Services
                                                                                                         // Management
                                                                                                         // (Admin only)
                        .requestMatchers(HttpMethod.GET, "/admin/sti-services").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/admin/sti-services").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/sti-services/{serviceId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin/sti-services/{serviceId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin/sti-tests/all").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin/sti-tests/stats").hasRole("ADMIN")

                        // All other admin endpoints
                        .requestMatchers("/admin/**").hasRole("ADMIN") // Default rule: all other endpoints require
                                                                       // authentication

                        // ========= BLOG ADMIN/STAFF ENDPOINTS =========
                        .requestMatchers(HttpMethod.GET, "/blog").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/blog").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/blog/{postId}").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/blog/{postId}").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/blog/{postId}/status").hasAnyRole("STAFF", "ADMIN")

                        .anyRequest().authenticated())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults())
                .cors(Customizer.withDefaults()).logout(logout -> logout
                        .logoutUrl("/users/logout")
                        .logoutSuccessHandler(new CustomLogoutSuccessHandler())
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID"));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            UserDtls user = userRepository.findByUsername(username)
                    .orElse(null);

            if (user == null) {
                throw new UsernameNotFoundException("Không tìm thấy người dùng: " + username);
            }

            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            String roleName = user.getRoleName();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName));

            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    user.getIsActive(),
                    true,
                    true,
                    true,
                    authorities);
        };
    }

    private static class CustomLogoutSuccessHandler implements LogoutSuccessHandler {
        @Override
        public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
                Authentication authentication)
                throws IOException, ServletException {
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("{\"success\":true,\"message\":\"Logout successfully\"}");
            response.setContentType("application/json");
        }
    }
}