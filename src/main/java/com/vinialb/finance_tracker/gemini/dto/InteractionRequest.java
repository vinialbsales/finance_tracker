package com.vinialb.finance_tracker.gemini.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record InteractionRequest<T>(String model, T input, @JsonProperty("previous_interaction_id") String previousId, List<Tool> tools) {
    public InteractionRequest(T input, String previousId, List<Tool> tools) {
        this("gemini-3.8-flash", input, previousId, tools);
    }
}
