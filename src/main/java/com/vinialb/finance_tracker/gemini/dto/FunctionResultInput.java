package com.vinialb.finance_tracker.gemini.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record FunctionResultInput(String type, String name, @JsonProperty("call_id") String callId, List<ResultContent> result) {}
