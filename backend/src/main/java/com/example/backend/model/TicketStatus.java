package com.example.backend.model;

public enum TicketStatus {
    NEW("Nowy"),
    ASSIGNED("Przyjęty"),
    FORWARDED("Przekazany"),
    RESOLVED("Rozwiązany");

    private final String displayName;

    TicketStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
