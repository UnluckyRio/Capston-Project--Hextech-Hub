package valeriodifelice.HextechHub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;

@Service
public class LolService {
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${riot.api.key:}")
    private String apiKey;

    private String regionHost(String region) {
        return switch (region) {
            case "EUW" -> "euw1";
            case "EUNE" -> "eun1";
            case "NA" -> "na1";
            case "KR" -> "kr";
            case "BR" -> "br1";
            case "JP" -> "jp1";
            case "TR" -> "tr1";
            case "RU" -> "ru";
            case "LA1" -> "la1";
            case "LA2" -> "la2";
            case "OC1" -> "oc1";
            default -> "euw1";
        };
    }

    @Cacheable(value = "summonerByName", key = "#region + ':' + #name")
    public Map<?,?> getSummonerByName(String region, String name) {
        if (apiKey == null || apiKey.isBlank()) throw new ApiUnavailableException();
        String host = regionHost(region);
        String url = "https://" + host + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + apiKey;
        try {
            return restTemplate.getForObject(url, Map.class);
        } catch (RestClientException ex) {
            throw new NotFoundOrUnavailableException();
        }
    }

    @Cacheable(value = "matchesByPuuid", key = "#region + ':' + #puuid + ':' + #count")
    public String[] getMatchesByPuuid(String region, String puuid, int count) {
        if (apiKey == null || apiKey.isBlank()) throw new ApiUnavailableException();
        String platform = switch (region) {
            case "EUW", "EUNE", "TR", "RU" -> "europe";
            case "NA", "BR", "LA1", "LA2", "OC1" -> "americas";
            case "KR", "JP" -> "asia";
            default -> "europe";
        };
        String url = "https://" + platform + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?count=" + count + "&api_key=" + apiKey;
        try {
            return restTemplate.getForObject(url, String[].class);
        } catch (RestClientException ex) {
            throw new NotFoundOrUnavailableException();
        }
    }

    @Cacheable(value = "matchDetail", key = "#region + ':' + #matchId")
    public Map<?,?> getMatchById(String region, String matchId) {
        if (apiKey == null || apiKey.isBlank()) throw new ApiUnavailableException();
        String platform = switch (region) {
            case "EUW", "EUNE", "TR", "RU" -> "europe";
            case "NA", "BR", "LA1", "LA2", "OC1" -> "americas";
            case "KR", "JP" -> "asia";
            default -> "europe";
        };
        String url = "https://" + platform + ".api.riotgames.com/lol/match/v5/matches/" + matchId + "?api_key=" + apiKey;
        try {
            return restTemplate.getForObject(url, Map.class);
        } catch (RestClientException ex) {
            throw new NotFoundOrUnavailableException();
        }
    }

    public static class NotFoundOrUnavailableException extends RuntimeException {}
    public static class ApiUnavailableException extends RuntimeException {}
}