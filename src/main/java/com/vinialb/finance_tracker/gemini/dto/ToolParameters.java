package com.vinialb.finance_tracker.gemini.dto;

import java.util.List;
import java.util.Map;

public record ToolParameters(String type, Map<String,Object> properties, List<String> required) {}