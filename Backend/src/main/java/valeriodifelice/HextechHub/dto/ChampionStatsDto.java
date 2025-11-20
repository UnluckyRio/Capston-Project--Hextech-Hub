package valeriodifelice.HextechHub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChampionStatsDto {
    private Long id;
    private String name;
    private String role;
    private Double pickrate;
    private Double winrate;
    private Double banrate;
    private Integer matches;
}