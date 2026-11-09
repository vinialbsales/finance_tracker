package com.vinialb.finance_tracker.gemini.dto;

public record ResultContent(String type, String text) {
    public ResultContent(String text) {
        this("text", text);
    }
}
