import { describe, expect, it } from "vitest";

import { gradeRobustness } from "./robustness";

const base = {
  challengerHoldoutRate: 0.6,
  averageChallengerUplift: 0.02,
  discoveryNoDecisionRate: 0.1,
  incumbentStability: 0.3,
};

describe("gradeRobustness", () => {
  it("is robust when holdout is strong and uplift positive", () => {
    expect(
      gradeRobustness({ ...base, challengerHoldoutRate: 0.85, averageChallengerUplift: 0.04 }).verdict,
    ).toBe("robust");
  });

  it("is promising for a slim positive majority", () => {
    expect(
      gradeRobustness({ ...base, challengerHoldoutRate: 0.55, averageChallengerUplift: 0.01 }).verdict,
    ).toBe("promising");
  });

  it("is inconclusive when discovery rarely decides", () => {
    expect(
      gradeRobustness({ ...base, discoveryNoDecisionRate: 0.6, challengerHoldoutRate: 0.9 }).verdict,
    ).toBe("inconclusive");
  });

  it("is fragile when the challenger fails out-of-sample", () => {
    expect(
      gradeRobustness({ ...base, challengerHoldoutRate: 0.2, averageChallengerUplift: -0.02 }).verdict,
    ).toBe("fragile");
  });

  it("reports confidence equal to the clamped holdout rate", () => {
    expect(gradeRobustness({ ...base, challengerHoldoutRate: 1.4 }).confidence).toBe(1);
  });
});
