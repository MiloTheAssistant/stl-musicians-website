import { describe, expect, it } from "vitest";
import {
  getFulfillmentTasksForPaidProducts,
  getFulfillmentTaskForCampaign,
  normalizeFulfillmentTaskStatus,
  promotionFulfillmentTaskStatuses,
} from "./promotion-fulfillment";

describe("promotion fulfillment", () => {
  it("normalizes allowed manual task statuses", () => {
    expect(promotionFulfillmentTaskStatuses).toEqual([
      "todo",
      "in-progress",
      "blocked",
      "done",
    ]);
    expect(normalizeFulfillmentTaskStatus("in-progress")).toBe("in-progress");
    expect(() => normalizeFulfillmentTaskStatus("archived")).toThrow(
      "A valid fulfillment status is required",
    );
  });

  it("finds a known campaign task before persisting admin updates", () => {
    const task = getFulfillmentTaskForCampaign(
      "11111111-1111-4111-8111-111111111111",
      "smartlink-page-setup",
    );

    expect(task?.title).toBe("SmartLink page setup");
    expect(task?.guardrail).toContain("No password collection");
  });

  it("maps paid package ids to the fulfillment tasks that should start", () => {
    const tasks = getFulfillmentTasksForPaidProducts(
      "11111111-1111-4111-8111-111111111111",
      ["smartlink-setup", "local-stl-push"],
    );

    expect(tasks.map((task) => task.title)).toEqual([
      "SmartLink page setup",
      "Local STL release push",
    ]);
  });
});
