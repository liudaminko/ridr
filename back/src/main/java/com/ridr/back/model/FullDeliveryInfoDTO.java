package com.ridr.back.model;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class FullDeliveryInfoDTO {
    private String cityRegion;
    private String address;
    private String trackNumber;
    private String serviceName;
    private Double cost;
    private Double weight;
    private String trackInfo;
}
