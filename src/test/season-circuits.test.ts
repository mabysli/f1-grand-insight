import { describe, expect, it } from "vitest";
import { getSeasonCircuits } from "@/data/season-circuits";

describe("season circuits", () => {
  it.each([[2022, 22], [2023, 22], [2024, 24]])(
    "covers each completed race in %i with a unique mapped circuit",
    (year, expectedRaces) => {
      const circuits = getSeasonCircuits(year);
      expect(circuits).toHaveLength(expectedRaces);
      expect(new Set(circuits.map((circuit) => circuit.id)).size).toBe(expectedRaces);
      for (const circuit of circuits) {
        expect(circuit.trackPath).toMatch(/^M.+Z$/);
        expect(circuit.lengthKm).toBeGreaterThan(3);
        expect(circuit.lengthKm).toBeLessThan(8);
        expect(circuit.fastestLap).toMatch(/^\d+:\d{2}\.\d{3}$/);
      }
    },
  );

  it("uses the layout for the selected year and counts laps actually completed", () => {
    const spain2022 = getSeasonCircuits(2022).find((circuit) => circuit.id === "catalunya");
    const spain2024 = getSeasonCircuits(2024).find((circuit) => circuit.id === "catalunya");
    expect(spain2022?.length).toBe("4,675 km");
    expect(spain2024?.length).toBe("4,657 km");
    expect(spain2022?.trackPath).not.toBe(spain2024?.trackPath);
    expect(getSeasonCircuits(2022).find((circuit) => circuit.id === "suzuka")?.laps).toBe(28);
  });
});
