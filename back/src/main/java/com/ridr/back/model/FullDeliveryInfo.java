package com.ridr.back.model;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class FullDeliveryInfo {
    private String cityRegion;
    private String address;
    private String trackNumber;
    private String serviceName;
    private Double cost;
    private Double weight;
    private List<Map<String, String>> trackInfo;
}
