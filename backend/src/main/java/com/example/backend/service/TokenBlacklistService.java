package com.example.backend.service;

import com.example.backend.exception.OperationType;
import com.example.backend.exception.TokenException;
import com.example.backend.model.TokenBlacklist;
import com.example.backend.repository.TokenBlacklistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TokenBlacklistService {
    private final TokenBlacklistRepository tokenBlacklistRepository;

    @Autowired
    public TokenBlacklistService(TokenBlacklistRepository tokenBlacklistRepository) {
        this.tokenBlacklistRepository = tokenBlacklistRepository;
    }

    public void blacklistToken(String token, LocalDateTime expiryTime) {
        try {
            TokenBlacklist tokenBlacklist = new TokenBlacklist(null, token, expiryTime);
            tokenBlacklistRepository.save(tokenBlacklist);
        } catch (Exception ex) {
            throw new TokenException("Failed to blacklist token: " + ex.getMessage(), OperationType.CREATION);
        }
    }

    public boolean isTokenBlacklisted(String token) {
        try {
            return tokenBlacklistRepository.existsByToken(token);
        } catch (Exception ex) {
            throw new TokenException("Failed to check if token is blacklisted: " + ex.getMessage(), OperationType.RETRIEVAL);
        }
    }

    @Scheduled(fixedRate = 86400000)
    public void removeExpiredTokens() {
        try {
            LocalDateTime now = LocalDateTime.now();
            tokenBlacklistRepository.deleteByExpiryTimeBefore(now);
        } catch (Exception ex) {
            throw new TokenException("Failed to remove expired tokens from blacklist: " + ex.getMessage(), OperationType.DELETION);
        }
    }
}
