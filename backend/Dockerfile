# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copy solution and project files
COPY PerformanceSystem.sln ./
COPY src/PerformanceSystem.API/*.csproj ./src/PerformanceSystem.API/
COPY src/PerformanceSystem.Core/*.csproj ./src/PerformanceSystem.Core/
COPY src/PerformanceSystem.Application/*.csproj ./src/PerformanceSystem.Application/
COPY src/PerformanceSystem.Infrastructure/*.csproj ./src/PerformanceSystem.Infrastructure/
COPY src/PerformanceSystem.Tests/*.csproj ./src/PerformanceSystem.Tests/

# Restore dependencies
RUN dotnet restore

# Copy source code
COPY . .

# Build application
WORKDIR /src/src/PerformanceSystem.API
RUN dotnet build -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

# Copy published files
COPY --from=publish /app/publish .

# Expose port
EXPOSE 5001

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5001
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5001/health || exit 1

# Start application
ENTRYPOINT ["dotnet", "PerformanceSystem.API.dll"]
