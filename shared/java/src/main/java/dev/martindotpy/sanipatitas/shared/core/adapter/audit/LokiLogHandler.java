package dev.martindotpy.sanipatitas.shared.core.adapter.audit;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.logging.ErrorManager;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;

import com.fasterxml.jackson.databind.ObjectMapper;

// Buffers log entries and pushes them to Loki in batches via HTTP
public class LokiLogHandler extends Handler {

    private static final String LOKI_URL = env("LOKI_URL", "http://localhost:3100");
    private static final boolean LOKI_ENABLED = "true".equalsIgnoreCase(env("LOKI_ENABLED", "false"));
    private static final String SERVICE_NAME = env("SERVICE_NAME", "unknown");
    private static final int BATCH_SIZE = 100;

    private final HttpClient httpClient;
    private final ObjectMapper mapper;
    private final BlockingQueue<LogRecord> queue;
    private volatile boolean running;

    public LokiLogHandler() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
        this.mapper = new ObjectMapper();
        this.queue = new LinkedBlockingQueue<>(10000);
        this.running = LOKI_ENABLED;

        if (LOKI_ENABLED) {
            Thread sender = new Thread(this::sendLoop, "loki-sender");
            sender.setDaemon(true);
            sender.start();
        }
    }

    @Override
    public void publish(LogRecord record) {
        if (!LOKI_ENABLED || !isLoggable(record) || record.getLevel().intValue() < Level.INFO.intValue()) {
            return;
        }
        queue.offer(record);
    }

    // Send loop
    private void sendLoop() {
        List<LogRecord> batch = new ArrayList<>(BATCH_SIZE);
        while (running) {
            try {
                LogRecord first = queue.poll(2, TimeUnit.SECONDS);
                if (first == null) continue;
                batch.clear();
                batch.add(first);
                queue.drainTo(batch, BATCH_SIZE - 1);
                pushToLoki(batch);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }

    // HTTP push
    private void pushToLoki(List<LogRecord> batch) {
        try {
            Map<String, List<Object[]>> grouped = new LinkedHashMap<>();
            for (LogRecord record : batch) {
                String ts = String.valueOf(record.getInstant().toEpochMilli() * 1_000_000L);
                String line = formatRecord(record);
                String level = record.getLevel().getName().toLowerCase();
                grouped.computeIfAbsent(level, k -> new ArrayList<>())
                        .add(new Object[] { ts, line });
            }

            List<Map<String, Object>> streams = new ArrayList<>();
            for (var entry : grouped.entrySet()) {
                streams.add(Map.of(
                        "stream", Map.of("service", SERVICE_NAME, "level", entry.getKey()),
                        "values", entry.getValue()));
            }

            Map<String, Object> payload = Map.of("streams", streams);
            String json = mapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(LOKI_URL + "/loki/api/v1/push"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .timeout(Duration.ofSeconds(5))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.discarding());
        } catch (IOException e) {
            reportError(null, e, ErrorManager.WRITE_FAILURE);
        }
    }

    // Format
    private String formatRecord(LogRecord record) {
        String message = record.getMessage();

        if (isJson(message)) {
            return message;
        }

        try {
            Map<String, Object> plain = new LinkedHashMap<>();
            plain.put("message", message);
            plain.put("logger", record.getLoggerName());
            return mapper.writeValueAsString(plain);
        } catch (IOException e) {
            return "{\"message\":\"" + message.replace("\"", "\\\"") + "\"}";
        }
    }

    private static boolean isJson(String s) {
        if (s == null || s.isEmpty()) return false;
        char first = s.charAt(0);
        return first == '{' || first == '[';
    }

    @Override
    public void flush() {
    }

    @Override
    public void close() throws SecurityException {
        running = false;
    }

    // Env
    private static String env(String key, String fallback) {
        String value = System.getenv(key);
        return value != null ? value : fallback;
    }
}
