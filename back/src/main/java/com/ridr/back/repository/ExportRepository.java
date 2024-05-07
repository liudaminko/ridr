package com.ridr.back.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ridr.back.model.ShortInfoBook;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.StringWriter;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ExportRepository {
    private final JdbcTemplate jdbcTemplate3;
    private Map<String, String> columnToTableMap = new HashMap<>();


    private void initializeBookColumnToTableMap() {
        columnToTableMap.clear();

        columnToTableMap.put("order_id", "bsf");
        columnToTableMap.put("title", "bd");
        columnToTableMap.put("genre", "g");
        columnToTableMap.put("publishing_year", "bd");
        columnToTableMap.put("publisher", "p");
        columnToTableMap.put("language", "bd");
        columnToTableMap.put("authors", "a");
        columnToTableMap.put("unit_price", "bsf");
        columnToTableMap.put("full_name", "cd");
        columnToTableMap.put("sex", "cd");
        columnToTableMap.put("age", "ad");
        columnToTableMap.put("age_group", "ad");
    }

    private void initializeDeliveryColumnToTableMap() {
        columnToTableMap.clear();

        columnToTableMap.put("order_id", "df");
        columnToTableMap.put("delivery_type", "dtd");
        columnToTableMap.put("delivery_service_provider", "dspd");
        columnToTableMap.put("region", "dad");
        columnToTableMap.put("city", "dad");
        columnToTableMap.put("address", "dad");
        columnToTableMap.put("cost", "df");
        columnToTableMap.put("weight", "df");
        columnToTableMap.put("warehouse_processing_time", "df");
        columnToTableMap.put("delivery_warehouse_service_provider_time", "df");
        columnToTableMap.put("service_delivery_time", "df");
        columnToTableMap.put("total_delivery_time", "df");
    }

    private void initializeOrderColumnToTableMap() {
        columnToTableMap.clear();

        columnToTableMap.put("order_id", "oof");
        columnToTableMap.put("full_name", "cd");
        columnToTableMap.put("sex", "cd");
        columnToTableMap.put("age", "ad");
        columnToTableMap.put("age_group", "ad");

        columnToTableMap.put("year", "dd");
        columnToTableMap.put("quarter", "dd");
        columnToTableMap.put("month", "dd");
        columnToTableMap.put("day", "dd");
        columnToTableMap.put("day_of_week", "dd");
        columnToTableMap.put("day_of_month", "dd");

        columnToTableMap.put("hour", "td");
        columnToTableMap.put("minute", "td");

        columnToTableMap.put("region", "dad");
        columnToTableMap.put("city", "dad");
        columnToTableMap.put("address", "dad");
        columnToTableMap.put("total_quantity", "oof");
        columnToTableMap.put("total_amount", "oof");
    }
    public String getBookSaleFactCSV(List<String> selectedColumns, int limit) {
        initializeBookColumnToTableMap();
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT TOP ").append(limit).append(" ");

        for (String column : selectedColumns) {
            String table = columnToTableMap.get(column);
            if(column.equals("genre")) {
                queryBuilder.append(table).append(".").append("name").append(", ");
            } else if (column.equals("publisher")) {
                queryBuilder.append(table).append(".").append("name").append(", ");
            } else {
                queryBuilder.append(table).append(".").append(column).append(", ");
            }
        }

        queryBuilder.delete(queryBuilder.length() - 2, queryBuilder.length());

        queryBuilder.append(" FROM Book_Sale_Fact bsf ");

        if (selectedColumns.contains("title") || selectedColumns.contains("genre")
                || selectedColumns.contains("authors") || selectedColumns.contains("publishing_year")
                || selectedColumns.contains("publisher") || selectedColumns.contains("language")) {
            queryBuilder.append("JOIN Book_Dim bd ON bd.book_id = bsf.book_id ");
        }

        if (selectedColumns.contains("authors")) {
            queryBuilder.append("JOIN Book_Authors ba ON ba.book_id = bd.book_id ");
            queryBuilder.append("JOIN Author a ON a.author_id = ba.author_id ");
        }

        if (selectedColumns.contains("genre")) {
            queryBuilder.append("JOIN Genre g ON g.genre_id = bd.genre_id ");
        }
        if (selectedColumns.contains("publisher")) {
            queryBuilder.append("JOIN Publisher p ON p.publisher_id = bd.publisher_id ");
        }

        if (selectedColumns.contains("age") || selectedColumns.contains("age_group")) {
            queryBuilder.append("JOIN Age_Dim ad ON ad.age_id = bsf.age_id ");
        }
        if (selectedColumns.contains("full_name") || selectedColumns.contains("sex")) {
            queryBuilder.append("JOIN Customer_Dim cd ON cd.customer_id = bsf.customer_id ");
        }

        queryBuilder.append(" ORDER BY bd.book_id ");

        String query = queryBuilder.toString();

        StringWriter writer = new StringWriter();
        jdbcTemplate3.query(query, new ResultSetExtractor<Void>() {
            @Override
            public Void extractData(ResultSet rs) throws SQLException, DataAccessException {
                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();

                for (int i = 1; i <= columnCount; i++) {
                    writer.append(metaData.getColumnLabel(i));
                    if (i < columnCount) {
                        writer.append(',');
                    }
                }
                writer.append('\n');

                while (rs.next()) {
                    for (int i = 1; i <= columnCount; i++) {
                        writer.append(rs.getString(i));
                        if (i < columnCount) {
                            writer.append(',');
                        }
                    }
                    writer.append('\n');
                }

                return null;
            }
        });

        return writer.toString();
    }

    public String getDeliveryFactCSV(List<String> selectedColumns, int limit) {
        initializeDeliveryColumnToTableMap();
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT TOP ").append(limit).append(" ");

        for (String column : selectedColumns) {
            String table = columnToTableMap.get(column);
            if(column.equals("delivery_type")) {
                queryBuilder.append(table).append(".").append("name").append(", ");
            } else if (column.equals("delivery_service_provider")) {
                queryBuilder.append(table).append(".").append("name").append(", ");
            } else {
                queryBuilder.append(table).append(".").append(column).append(", ");
            }
        }
        queryBuilder.delete(queryBuilder.length() - 2, queryBuilder.length());

        queryBuilder.append(" FROM Delivery_Fact df ");


        if (selectedColumns.contains("delivery_type")) {
            queryBuilder.append("JOIN Delivery_Type_Dim dtd ON dtd.delivery_type_id = df.delivery_type_id ");
        }

        if (selectedColumns.contains("delivery_service_provider")) {
            queryBuilder.append("JOIN Delivery_Service_Provider_Dim dspd ON dspd.delivery_service_provider_id = df.delivery_service_provider_id ");
        }

        if (selectedColumns.contains("region") || selectedColumns.contains("city") || selectedColumns.contains("address")) {
            queryBuilder.append("JOIN Delivery_Address_Dim dad ON dad.delivery_address_id = df.delivery_address_id ");
        }

        queryBuilder.append(" ORDER BY df.order_id ");

        String query = queryBuilder.toString();

        StringWriter writer = new StringWriter();
        jdbcTemplate3.query(query, new ResultSetExtractor<Void>() {
            @Override
            public Void extractData(ResultSet rs) throws SQLException, DataAccessException {
                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();

                for (int i = 1; i <= columnCount; i++) {
                    writer.append(metaData.getColumnLabel(i));
                    if (i < columnCount) {
                        writer.append(',');
                    }
                }
                writer.append('\n');

                while (rs.next()) {
                    for (int i = 1; i <= columnCount; i++) {
                        Object columnValue = rs.getObject(i);
                        if (columnValue == null) {
                            writer.append("NULL");
                        } else {
                            writer.append(columnValue.toString());
                        }
                        if (i < columnCount) {
                            writer.append(',');
                        }
                    }
                    writer.append('\n');
                }

                return null;
            }

        });

        return writer.toString();
    }

    public String getOrderFactCSV(List<String> selectedColumns, int limit) {
        initializeOrderColumnToTableMap();
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT TOP ").append(limit).append(" ");

        for (String column : selectedColumns) {
            String table = columnToTableMap.get(column);
            queryBuilder.append(table).append(".").append(column).append(", ");
        }
        queryBuilder.delete(queryBuilder.length() - 2, queryBuilder.length());

        queryBuilder.append(" FROM Order_Fact oof ");

        if (selectedColumns.contains("age") || selectedColumns.contains("age_group")) {
            queryBuilder.append("JOIN Age_Dim ad ON ad.age_id = oof.age_id ");
        }
        if (selectedColumns.contains("full_name") || selectedColumns.contains("sex")) {
            queryBuilder.append("JOIN Customer_Dim cd ON cd.customer_id = oof.customer_id ");
        }

        if (selectedColumns.contains("region") || selectedColumns.contains("city") || selectedColumns.contains("address")) {
            queryBuilder.append("JOIN Delivery_Address_Dim dad ON dad.delivery_address_id = oof.delivery_address_id ");
        }

        if (selectedColumns.contains("year") || selectedColumns.contains("quarter") || selectedColumns.contains("month")
        || selectedColumns.contains("day") || selectedColumns.contains("day_of_month") || selectedColumns.contains("day_of_week")
        ) {
            queryBuilder.append("JOIN Date_Dim dd ON dd.date_id = oof.date_id ");
        }

        if (selectedColumns.contains("hour") || selectedColumns.contains("minute") || selectedColumns.contains("address")) {
            queryBuilder.append("JOIN Time_Dim td ON td.time_id = oof.time_id ");
        }

        queryBuilder.append(" ORDER BY oof.order_id ");

        String query = queryBuilder.toString();

        StringWriter writer = new StringWriter();
        jdbcTemplate3.query(query, new ResultSetExtractor<Void>() {
            @Override
            public Void extractData(ResultSet rs) throws SQLException, DataAccessException {
                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();

                for (int i = 1; i <= columnCount; i++) {
                    writer.append(metaData.getColumnLabel(i));
                    if (i < columnCount) {
                        writer.append(',');
                    }
                }
                writer.append('\n');

                while (rs.next()) {
                    for (int i = 1; i <= columnCount; i++) {
                        writer.append(rs.getString(i));
                        if (i < columnCount) {
                            writer.append(',');
                        }
                    }
                    writer.append('\n');
                }

                return null;
            }
        });

        return writer.toString();
    }

//////////////////////////////////////JSON///////////////////////////////////
    public String getBookSaleFactJSON(List<String> selectedColumns, int limit) {
        initializeBookColumnToTableMap();
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT TOP ").append(limit).append(" ");

        for (String column : selectedColumns) {
            String table = columnToTableMap.get(column);
            if(column.equals("genre")) {
                queryBuilder.append(table).append(".").append("name").append(", ");
            } else if (column.equals("publisher")) {
                queryBuilder.append(table).append(".").append("name").append(", ");
            } else {
                queryBuilder.append(table).append(".").append(column).append(", ");
            }
        }

        queryBuilder.delete(queryBuilder.length() - 2, queryBuilder.length());

        queryBuilder.append(" FROM Book_Sale_Fact bsf ");

        if (selectedColumns.contains("title") || selectedColumns.contains("genre")
                || selectedColumns.contains("authors") || selectedColumns.contains("publishing_year")
                || selectedColumns.contains("publisher") || selectedColumns.contains("language")) {
            queryBuilder.append("JOIN Book_Dim bd ON bd.book_id = bsf.book_id ");
        }

        if (selectedColumns.contains("authors")) {
            queryBuilder.append("JOIN Book_Authors ba ON ba.book_id = bd.book_id ");
            queryBuilder.append("JOIN Author a ON a.author_id = ba.author_id ");
        }

        if (selectedColumns.contains("genre")) {
            queryBuilder.append("JOIN Genre g ON g.genre_id = bd.genre_id ");
        }
        if (selectedColumns.contains("publisher")) {
            queryBuilder.append("JOIN Publisher p ON p.publisher_id = bd.publisher_id ");
        }

        if (selectedColumns.contains("age") || selectedColumns.contains("age_group")) {
            queryBuilder.append("JOIN Age_Dim ad ON ad.age_id = bsf.age_id ");
        }
        if (selectedColumns.contains("full_name") || selectedColumns.contains("sex")) {
            queryBuilder.append("JOIN Customer_Dim cd ON cd.customer_id = bsf.customer_id ");
        }

        queryBuilder.append(" ORDER BY bd.book_id ");

        String query = queryBuilder.toString();


        List<Map<String, Object>> resultList = jdbcTemplate3.query(query, new ResultSetExtractor<List<Map<String, Object>>>() {
            @Override
            public List<Map<String, Object>> extractData(ResultSet rs) throws SQLException, DataAccessException {
                List<Map<String, Object>> rows = new ArrayList<>();
                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();

                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = metaData.getColumnLabel(i);
                        Object columnValue = rs.getObject(i);
                        row.put(columnName, columnValue);
                    }
                    rows.add(row);
                }

                return rows;
            }
        });


        ObjectMapper mapper = new ObjectMapper();
        StringWriter writer = new StringWriter();
        try {
            mapper.writeValue(writer, resultList);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return writer.toString();
    }


    public String getDeliveryFactJSON(List<String> selectedColumns, int limit) {
        initializeDeliveryColumnToTableMap();
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT TOP ").append(limit).append(" ");

        for (String column : selectedColumns) {
            String table = columnToTableMap.get(column);
            if(column.equals("delivery_type")) {
                queryBuilder.append(table).append(".").append("name").append(", ");
            } else if (column.equals("delivery_service_provider")) {
                queryBuilder.append(table).append(".").append("name").append(", ");
            } else {
                queryBuilder.append(table).append(".").append(column).append(", ");
            }
        }
        queryBuilder.delete(queryBuilder.length() - 2, queryBuilder.length());

        queryBuilder.append(" FROM Delivery_Fact df ");


        if (selectedColumns.contains("delivery_type")) {
            queryBuilder.append("JOIN Delivery_Type_Dim dtd ON dtd.delivery_type_id = df.delivery_type_id ");
        }

        if (selectedColumns.contains("delivery_service_provider")) {
            queryBuilder.append("JOIN Delivery_Service_Provider_Dim dspd ON dspd.delivery_service_provider_id = df.delivery_service_provider_id ");
        }

        if (selectedColumns.contains("region") || selectedColumns.contains("city") || selectedColumns.contains("address")) {
            queryBuilder.append("JOIN Delivery_Address_Dim dad ON dad.delivery_address_id = df.delivery_address_id ");
        }

        queryBuilder.append(" ORDER BY df.order_id ");

        String query = queryBuilder.toString();

        List<Map<String, Object>> resultList = jdbcTemplate3.query(query, new ResultSetExtractor<List<Map<String, Object>>>() {
            @Override
            public List<Map<String, Object>> extractData(ResultSet rs) throws SQLException, DataAccessException {
                List<Map<String, Object>> rows = new ArrayList<>();
                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();

                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = metaData.getColumnLabel(i);
                        Object columnValue = rs.getObject(i);
                        row.put(columnName, columnValue);
                    }
                    rows.add(row);
                }

                return rows;
            }
        });


        ObjectMapper mapper = new ObjectMapper();
        StringWriter writer = new StringWriter();
        try {
            mapper.writeValue(writer, resultList);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return writer.toString();
    }

    public String getOrderFactJSON(List<String> selectedColumns, int limit) {
        initializeOrderColumnToTableMap();
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT TOP ").append(limit).append(" ");

        for (String column : selectedColumns) {
            String table = columnToTableMap.get(column);
            queryBuilder.append(table).append(".").append(column).append(", ");
        }
        queryBuilder.delete(queryBuilder.length() - 2, queryBuilder.length());

        queryBuilder.append(" FROM Order_Fact oof ");

        if (selectedColumns.contains("age") || selectedColumns.contains("age_group")) {
            queryBuilder.append("JOIN Age_Dim ad ON ad.age_id = oof.age_id ");
        }
        if (selectedColumns.contains("full_name") || selectedColumns.contains("sex")) {
            queryBuilder.append("JOIN Customer_Dim cd ON cd.customer_id = oof.customer_id ");
        }

        if (selectedColumns.contains("region") || selectedColumns.contains("city") || selectedColumns.contains("address")) {
            queryBuilder.append("JOIN Delivery_Address_Dim dad ON dad.delivery_address_id = oof.delivery_address_id ");
        }

        if (selectedColumns.contains("year") || selectedColumns.contains("quarter") || selectedColumns.contains("month")
                || selectedColumns.contains("day") || selectedColumns.contains("day_of_month") || selectedColumns.contains("day_of_week")
        ) {
            queryBuilder.append("JOIN Date_Dim dd ON dd.date_id = oof.date_id ");
        }

        if (selectedColumns.contains("hour") || selectedColumns.contains("minute") || selectedColumns.contains("address")) {
            queryBuilder.append("JOIN Time_Dim td ON td.time_id = oof.time_id ");
        }

        queryBuilder.append(" ORDER BY oof.order_id ");

        String query = queryBuilder.toString();

        List<Map<String, Object>> resultList = jdbcTemplate3.query(query, new ResultSetExtractor<List<Map<String, Object>>>() {
            @Override
            public List<Map<String, Object>> extractData(ResultSet rs) throws SQLException, DataAccessException {
                List<Map<String, Object>> rows = new ArrayList<>();
                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();

                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = metaData.getColumnLabel(i);
                        Object columnValue = rs.getObject(i);
                        row.put(columnName, columnValue);
                    }
                    rows.add(row);
                }

                return rows;
            }
        });


        ObjectMapper mapper = new ObjectMapper();
        StringWriter writer = new StringWriter();
        try {
            mapper.writeValue(writer, resultList);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return writer.toString();
    }

}
