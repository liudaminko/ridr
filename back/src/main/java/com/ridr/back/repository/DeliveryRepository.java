package com.ridr.back.repository;

import com.google.gson.Gson;
import com.ridr.back.model.Delivery;
import com.ridr.back.model.FullDeliveryInfo;
import com.ridr.back.model.FullDeliveryInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import com.google.gson.reflect.TypeToken;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DeliveryRepository {
    private final JdbcTemplate jdbcTemplate1;

    public Integer createDelivery(Delivery request) {
        Integer maxId = jdbcTemplate1.queryForObject("SELECT MAX(id) from Delivery", Integer.class);

        int newId = (maxId != null) ? maxId + 1 : 1;

        jdbcTemplate1.update(
                "INSERT INTO Delivery (id, delivery_type_id, delivery_service_provider_id, delivery_address_id, recipient_name, recipient_phone_number) VALUES (?, ?, ?, ?, ?, ?)",
                newId, request.getDeliveryTypeId(), request.getDeliveryServiceProviderId(), request.getDeliveryAddressId(), request.getRecipientName(), request.getRecipientPhone());

        return newId;
    }

    public FullDeliveryInfo getAllDeliveryInfo(int orderId) {
        String query = "SELECT CONCAT(da.city, CASE WHEN da.region IS NOT NULL THEN CONCAT(', ', da.region) ELSE '' END) AS city_region, CONCAT(dtt.name, ' №', da.address) as address, tn.track_number, dsp.name as service_name, d.cost, d.weight, " +
                "    (" +
                "        SELECT track_description AS description, start_date_time " +
                "        FROM Delivery_Tracking dt " +
                "        WHERE dt.delivery_id = d.id " +
                "        FOR JSON PATH " +
                "    ) AS track_info " +
                "FROM Delivery d " +
                "JOIN Delivery_Address da ON d.delivery_address_id = da.id " +
                "JOIN Track_Number tn ON d.id = tn.delivery_id " +
                "JOIN Delivery_Service_Provider dsp ON d.delivery_service_provider_id = dsp.id " +
                "JOIN Delivery_Type dtt ON d.delivery_type_id = dtt.id " +
                "JOIN Order_ o ON o.delivery_id = d.id " +
                "WHERE o.id = ?";

        FullDeliveryInfoDTO deliveryInfo = jdbcTemplate1.queryForObject(query, new Object[]{orderId}, new BeanPropertyRowMapper<>(FullDeliveryInfoDTO.class));

        List<Map<String, String>> trackingInfo = new Gson().fromJson(
                deliveryInfo.getTrackInfo(),
                new TypeToken<List<Map<String, String>>>(){}.getType()
        );
        FullDeliveryInfo fullDeliveryInfo = new FullDeliveryInfo();
        fullDeliveryInfo.setTrackInfo(trackingInfo);
        fullDeliveryInfo.setAddress(deliveryInfo.getAddress());
        fullDeliveryInfo.setCityRegion(deliveryInfo.getCityRegion());
        fullDeliveryInfo.setCost(deliveryInfo.getCost());
        fullDeliveryInfo.setWeight(deliveryInfo.getWeight());
        fullDeliveryInfo.setTrackNumber(deliveryInfo.getTrackNumber());
        fullDeliveryInfo.setServiceName(deliveryInfo.getServiceName());
        return fullDeliveryInfo;
    }
}
