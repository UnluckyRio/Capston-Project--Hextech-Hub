package valeriodifelice.HextechHub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import valeriodifelice.HextechHub.dto.ChampionStatsDto;
import valeriodifelice.HextechHub.service.ChampionService;

import java.util.List;

@RestController
@RequestMapping("/api/champions")
public class ChampionController {
    private final ChampionService championService;

    public ChampionController(ChampionService championService) { this.championService = championService; }

    @GetMapping("/stats")
    public ResponseEntity<List<ChampionStatsDto>> listStats() {
        List<ChampionStatsDto> list = championService.getTierList();
        return ResponseEntity.ok(list);
    }
}