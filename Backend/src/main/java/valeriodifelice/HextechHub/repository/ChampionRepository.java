package valeriodifelice.HextechHub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import valeriodifelice.HextechHub.model.Champions;

@Repository
public interface ChampionRepository extends JpaRepository<Champions, Long> {
}