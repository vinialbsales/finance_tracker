package com.vinialb.finance_tracker.gemini.dto;

public record Tool(String type, String name, String description, ToolParameters parameters) {
    public Tool(String name, String description, ToolParameters parameters) {
        this("function", name, description, parameters);
    }
}