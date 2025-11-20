package valeriodifelice.HextechHub.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import valeriodifelice.HextechHub.dto.ChampionStatsDto;
import valeriodifelice.HextechHub.repository.ChampionRepository;

@Service
public class ChampionService {
    private final ChampionRepository championRepository;

    public ChampionService(ChampionRepository championRepository) {
        this.championRepository = championRepository;
    }

    @Cacheable(value = "tierList")
    public List<ChampionStatsDto> getTierList() {
        return championRepository.findAll().stream()
                .map(c -> new ChampionStatsDto(
                        c.getId(), c.getName(), c.getRole(),
                        c.getPickrate(), c.getWinrate(), c.getBanrate(), c.getMatches()
                ))
                .collect(Collectors.toList());
    }
}