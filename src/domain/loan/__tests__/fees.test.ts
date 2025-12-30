import { describe, it, expect } from "vitest";
import { getFeesForYear } from "../fees";

describe("getFeesForYear", () => {
  it("returns correct fees for known years", () => {
    const fees2025 = getFeesForYear(2025);
    expect(fees2025).toEqual({
      tuition: 9535,
      maintenanceLoan: 10544,
      maintenanceGrant: 0,
      postGraduateLoan: 12858,
    });

    const fees2016 = getFeesForYear(2016);
    expect(fees2016).toEqual({
      tuition: 9000,
      maintenanceLoan: 8200,
      maintenanceGrant: 0,
      postGraduateLoan: 10000,
    });
  });

  it("returns latest data for future years", () => {
    const future = getFeesForYear(2030);
    const latest = getFeesForYear(2025);
    expect(future).toEqual(latest);
  });

  it("returns correct historical data", () => {
    const fees1998 = getFeesForYear(1998);
    expect(fees1998.tuition).toBe(1000);
    expect(fees1998.maintenanceLoan).toBe(0);
    expect(fees1998.postGraduateLoan).toBe(0);
  });

  it("shows maintenance grant removal in 2016", () => {
    const fees2015 = getFeesForYear(2015);
    expect(fees2015.maintenanceGrant).toBe(3387);

    const fees2016 = getFeesForYear(2016);
    expect(fees2016.maintenanceGrant).toBe(0);
  });

  it("shows postgraduate loan introduction in 2016", () => {
    const fees2015 = getFeesForYear(2015);
    expect(fees2015.postGraduateLoan).toBe(0);

    const fees2016 = getFeesForYear(2016);
    expect(fees2016.postGraduateLoan).toBe(10000);
  });

  it("uses most recent applicable year for gaps", () => {
    // 2018-2022 should use 2017 data
    const fees2018 = getFeesForYear(2018);
    const fees2017 = getFeesForYear(2017);
    expect(fees2018).toEqual(fees2017);
  });
});
