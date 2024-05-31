#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Omniom.WebAPI/Omniom.WebAPI.csproj", "Omniom.WebAPI/"]
COPY ["Omniom.Infrastructure/Omniom.Infrastructure.csproj", "Omniom.Infrastructure/"]
COPY ["Omniom.Domain/Omniom.Domain.csproj", "Omniom.Domain/"]
COPY ["Omniom.DatabaseMigrator/Omniom.DatabaseMigrator.csproj", "Omniom.DatabaseMigrator/"]

RUN dotnet restore "Omniom.WebAPI/Omniom.WebAPI.csproj"
COPY . .
WORKDIR "/src/Omniom.WebAPI"
RUN dotnet build "Omniom.WebAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Omniom.WebAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Omniom.WebAPI.dll"]