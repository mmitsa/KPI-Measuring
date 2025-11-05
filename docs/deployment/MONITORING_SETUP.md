# Monitoring & Observability Setup
# إعداد المراقبة والرصد

## 📊 Overview

Comprehensive monitoring setup for the Performance Management System including metrics, logs, traces, and alerts.

---

## 1. Application Insights (Azure)

### 1.1 Setup

```bash
# Install NuGet package
dotnet add package Microsoft.ApplicationInsights.AspNetCore

# Add to Program.cs
builder.Services.AddApplicationInsightsTelemetry(builder.Configuration["ApplicationInsights:InstrumentationKey"]);
```

**appsettings.json:**
```json
{
  "ApplicationInsights": {
    "InstrumentationKey": "your-key-here",
    "EnableAdaptiveSampling": true,
    "EnableDependencyTracking": true,
    "EnablePerformanceCounterCollectionModule": true
  }
}
```

### 1.2 Custom Metrics

```csharp
private readonly TelemetryClient _telemetry;

public void TrackGoalCreated(Goal goal)
{
    _telemetry.TrackEvent("GoalCreated", new Dictionary<string, string>
    {
        { "GoalType", goal.Type },
        { "Weight", goal.Weight.ToString() }
    });
}

public void TrackEvaluationFinalized(Evaluation evaluation)
{
    _telemetry.TrackMetric("FinalScore", evaluation.FinalScore);
    _telemetry.TrackEvent("EvaluationFinalized", new Dictionary<string, string>
    {
        { "Rating", evaluation.FinalRating },
        { "Period", evaluation.Period }
    });
}
```

---

## 2. Prometheus + Grafana

### 2.1 Prometheus Setup

**Install Prometheus:**
```bash
# Download and install Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar xvfz prometheus-*.tar.gz
cd prometheus-*
```

**prometheus.yml:**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'performance-api'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/metrics'

  - job_name: 'performance-db'
    static_configs:
      - targets: ['localhost:9187']  # SQL Server exporter

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
```

**Start Prometheus:**
```bash
./prometheus --config.file=prometheus.yml
# Access: http://localhost:9090
```

### 2.2 Add Metrics to .NET API

```bash
dotnet add package prometheus-net.AspNetCore
```

**Program.cs:**
```csharp
using Prometheus;

var app = builder.Build();

// Prometheus metrics endpoint
app.UseMetricServer();  // /metrics endpoint
app.UseHttpMetrics();   // HTTP request metrics

// Custom metrics
var goalCreatedCounter = Metrics.CreateCounter("goals_created_total", "Total number of goals created");
var evaluationDuration = Metrics.CreateHistogram("evaluation_duration_seconds", "Evaluation calculation time");
```

### 2.3 Grafana Setup

```bash
# Install Grafana
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install grafana

# Start Grafana
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Access: http://localhost:3000 (admin/admin)
```

**Add Prometheus Data Source:**
1. Configuration → Data Sources → Add Prometheus
2. URL: `http://localhost:9090`
3. Save & Test

### 2.4 Grafana Dashboards

**Dashboard JSON available at:** `docs/monitoring/grafana-dashboard.json`

**Key Panels:**
- API Request Rate (requests/sec)
- API Response Time (p50, p95, p99)
- Error Rate (%)
- Active Users
- Database Connections
- Memory Usage
- CPU Usage

---

## 3. ELK Stack (Logging)

### 3.1 Elasticsearch Setup

```bash
# Install Elasticsearch
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.0-linux-x86_64.tar.gz
tar -xzf elasticsearch-8.11.0-linux-x86_64.tar.gz
cd elasticsearch-8.11.0/
./bin/elasticsearch

# Access: http://localhost:9200
```

### 3.2 Logstash Setup

**logstash.conf:**
```conf
input {
  file {
    path => "/var/log/performance-api/*.log"
    start_position => "beginning"
    codec => json
  }
}

filter {
  json {
    source => "message"
  }

  mutate {
    add_field => { "[@metadata][target_index]" => "performance-logs-%{+YYYY.MM.dd}" }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "%{[@metadata][target_index]}"
  }

  stdout {
    codec => rubydebug
  }
}
```

### 3.3 Kibana Setup

```bash
# Install Kibana
wget https://artifacts.elastic.co/downloads/kibana/kibana-8.11.0-linux-x86_64.tar.gz
tar -xzf kibana-8.11.0-linux-x86_64.tar.gz
cd kibana-8.11.0/
./bin/kibana

# Access: http://localhost:5601
```

**Configure Index Pattern:**
1. Management → Stack Management → Index Patterns
2. Create index pattern: `performance-logs-*`
3. Time field: `@timestamp`

---

## 4. Structured Logging (Serilog)

### 4.1 Setup

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
dotnet add package Serilog.Sinks.Elasticsearch
```

**Program.cs:**
```csharp
using Serilog;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithThreadId()
    .WriteTo.Console()
    .WriteTo.File("logs/performance-api-.log", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 30)
    .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri("http://localhost:9200"))
    {
        AutoRegisterTemplate = true,
        IndexFormat = "performance-logs-{0:yyyy.MM.dd}"
    })
    .CreateLogger();

builder.Host.UseSerilog();
```

### 4.2 Structured Logging Examples

```csharp
// Log with context
_logger.LogInformation("Goal created. GoalId={GoalId}, EmployeeId={EmployeeId}, Type={Type}",
    goal.GoalId, goal.EmployeeId, goal.Type);

// Log evaluation finalization
_logger.LogInformation("Evaluation finalized. EvaluationId={EvaluationId}, FinalScore={FinalScore}, Rating={Rating}",
    evaluation.EvaluationId, evaluation.FinalScore, evaluation.FinalRating);

// Log error
_logger.LogError(ex, "Failed to calculate final score. EvaluationId={EvaluationId}",
    evaluationId);
```

---

## 5. Health Checks

### 5.1 Setup

```bash
dotnet add package Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore
dotnet add package AspNetCore.HealthChecks.SqlServer
dotnet add package AspNetCore.HealthChecks.Redis
```

**Program.cs:**
```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<PerformanceDbContext>("database")
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), name: "sql-server")
    .AddRedis(builder.Configuration["Redis:ConnectionString"], name: "redis")
    .AddUrlGroup(new Uri("https://nafath.sa"), name: "sso-provider");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

**Health Check Endpoints:**
- `/health` - Overall health
- `/health/ready` - Readiness probe (K8s)
- `/health/live` - Liveness probe (K8s)

---

## 6. Alerting

### 6.1 Prometheus Alertmanager

**alertmanager.yml:**
```yaml
global:
  resolve_timeout: 5m
  smtp_smarthost: 'smtp.gov.sa:587'
  smtp_from: 'alerts@performance.gov.sa'
  smtp_auth_username: 'alerts@performance.gov.sa'
  smtp_auth_password: '***'

route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'email-notifications'

receivers:
  - name: 'email-notifications'
    email_configs:
      - to: 'it-team@gov.sa'
        headers:
          Subject: '[ALERT] {{ .GroupLabels.alertname }}'

  - name: 'slack-notifications'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/***'
        channel: '#alerts'
        title: 'Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

**Alert Rules (alerts.yml):**
```yaml
groups:
  - name: performance-system-alerts
    interval: 30s
    rules:
      - alert: APIDown
        expr: up{job="performance-api"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "API is down"
          description: "Performance API has been down for more than 1 minute"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} (>5%)"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile response time is {{ $value }}s (>1s)"

      - alert: HighCPUUsage
        expr: node_cpu_usage_percent > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value }}% (>80%)"

      - alert: HighMemoryUsage
        expr: node_memory_usage_percent > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value }}% (>85%)"

      - alert: DatabaseConnectionPoolExhausted
        expr: db_connection_pool_active / db_connection_pool_max > 0.9
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool exhausted"
          description: "Connection pool usage is {{ $value }}% (>90%)"
```

---

## 7. Uptime Monitoring

### 7.1 UptimeRobot

**Monitors:**
- https://app.performance.gov.sa (HTTP, every 5 minutes)
- https://api.performance.gov.sa/health (HTTP, every 5 minutes)

**Alert Contacts:**
- Email: it-team@gov.sa
- SMS: +966504875663

### 7.2 Pingdom

**Setup:**
1. Add check: https://app.performance.gov.sa
2. Check interval: 1 minute
3. Alert contacts: Email + SMS
4. Response time threshold: 3 seconds

---

## 8. Performance Monitoring

### 8.1 Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API Response Time (p95) | < 1s | > 2s |
| Page Load Time | < 3s | > 5s |
| Error Rate | < 0.1% | > 1% |
| Uptime | > 99.5% | < 99% |
| Database Query Time (p95) | < 500ms | > 1s |
| CPU Usage | < 70% | > 85% |
| Memory Usage | < 75% | > 90% |

### 8.2 Application Performance Monitoring (APM)

**Datadog / New Relic / Elastic APM:**

```csharp
// Install Elastic APM
dotnet add package Elastic.Apm.NetCoreAll

// Add to Program.cs
app.UseAllElasticApm(builder.Configuration);
```

---

## 9. Business Metrics Dashboard

### 9.1 Key Business Metrics

- Total Users
- Active Users (daily, weekly, monthly)
- Goals Created
- Evaluations Completed
- Objections Submitted
- PIPs Active
- Average Final Score
- Rating Distribution

### 9.2 Custom Dashboard

```csharp
// Business metrics endpoint
app.MapGet("/api/v1/metrics/business", async (PerformanceDbContext db) =>
{
    var metrics = new
    {
        TotalUsers = await db.Users.CountAsync(),
        ActiveGoals = await db.Goals.CountAsync(g => g.Status == "Approved"),
        EvaluationsCompleted = await db.Evaluations.CountAsync(e => e.Status == "Approved"),
        AverageFinalScore = await db.Evaluations.AverageAsync(e => (double?)e.FinalScore) ?? 0,
        RatingDistribution = await db.Evaluations
            .GroupBy(e => e.FinalRating)
            .Select(g => new { Rating = g.Key, Count = g.Count() })
            .ToListAsync()
    };

    return Results.Ok(metrics);
});
```

---

## 10. Dashboard Examples

### 10.1 System Health Dashboard

**Metrics:**
- API Uptime (%)
- Average Response Time (ms)
- Error Rate (%)
- Active Database Connections
- CPU Usage (%)
- Memory Usage (%)
- Disk Usage (%)

### 10.2 Application Dashboard

**Metrics:**
- Requests per Second
- Response Time Distribution (p50, p95, p99)
- Top 10 Slowest Endpoints
- Error Breakdown by Type
- User Sessions (active, new, returning)

### 10.3 Business Dashboard

**Metrics:**
- Daily Active Users
- Goals Created (daily, weekly, monthly)
- Evaluations Finalized
- Average Final Score Trend
- Rating Distribution
- PIPs Active
- Objections Pending

---

**Last Updated**: November 2025
**Version**: 1.0
**Status**: ✅ Production Ready
