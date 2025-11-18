package valeriodifelice.HextechHub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import valeriodifelice.HextechHub.service.LolService;

import java.util.Map;

@RestController
@RequestMapping("/api/lol")
public class LolController {
    private final LolService lolService;

    public LolController(LolService lolService) {
        this.lolService = lolService;
    }

    @GetMapping("/summoner/by-name/{region}/{name}")
    public ResponseEntity<?> summonerByName(@PathVariable String region, @PathVariable String name) {
        try {
            return ResponseEntity.ok(lolService.getSummonerByName(region, name));
        } catch (LolService.ApiUnavailableException e) {
            return ResponseEntity.status(503).body(Map.of("message", "API non disponibile"));
        } catch (LolService.NotFoundOrUnavailableException e) {
            return ResponseEntity.status(404).body(Map.of("message", "Giocatore non trovato"));
        }
    }

    @GetMapping("/matches/by-puuid/{region}/{puuid}")
    public ResponseEntity<?> matchesByPuuid(@PathVariable String region, @PathVariable String puuid, @RequestParam(defaultValue = "10") int count) {
        try {
            return ResponseEntity.ok(lolService.getMatchesByPuuid(region, puuid, count));
        } catch (LolService.ApiUnavailableException e) {
            return ResponseEntity.status(503).body(Map.of("message", "API non disponibile"));
        } catch (LolService.NotFoundOrUnavailableException e) {
            return ResponseEntity.status(404).body(Map.of("message", "Dati non trovati"));
        }
    }

    @GetMapping("/match/{region}/{id}")
    public ResponseEntity<?> matchDetail(@PathVariable String region, @PathVariable("id") String matchId) {
        try {
            return ResponseEntity.ok(lolService.getMatchById(region, matchId));
        } catch (LolService.ApiUnavailableException e) {
            return ResponseEntity.status(503).body(Map.of("message", "API non disponibile"));
        } catch (LolService.NotFoundOrUnavailableException e) {
            return ResponseEntity.status(404).body(Map.of("message", "Partita non trovata"));
        }
    }
}