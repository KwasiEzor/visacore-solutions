import assert from "node:assert/strict"
import test from "node:test"

import {
  evaluateSubmissionGuard,
  maxSubmissionsPerRateWindow,
  normalizeOptionalSubmissionText,
  normalizeSubmissionEmail,
  normalizeSubmissionPhone,
} from "../lib/submission-guards.shared"

test("submission guard filters honeypots and deduplicates recent submissions", () => {
  const filtered = evaluateSubmissionGuard({
    honeypotValue: "spam",
    duplicateCount: 0,
    rateLimitCount: 0,
    duplicateMessage: "duplicate",
    rateLimitedMessage: "rate",
    filteredMessage: "filtered",
  })

  assert.equal(filtered.status, "filtered")
  assert.equal(filtered.success, true)
  assert.equal(filtered.shouldPersist, false)

  const duplicate = evaluateSubmissionGuard({
    honeypotValue: "",
    duplicateCount: 1,
    rateLimitCount: 1,
    duplicateMessage: "duplicate",
    rateLimitedMessage: "rate",
    filteredMessage: "filtered",
  })

  assert.equal(duplicate.status, "duplicate")
  assert.equal(duplicate.success, true)
  assert.equal(duplicate.shouldPersist, false)
})

test("submission guard rate-limits repeated attempts and accepts clean requests", () => {
  const rateLimited = evaluateSubmissionGuard({
    honeypotValue: "",
    duplicateCount: 0,
    rateLimitCount: maxSubmissionsPerRateWindow,
    duplicateMessage: "duplicate",
    rateLimitedMessage: "rate",
    filteredMessage: "filtered",
  })

  assert.equal(rateLimited.status, "rate_limited")
  assert.equal(rateLimited.success, false)
  assert.equal(rateLimited.shouldPersist, false)

  const accepted = evaluateSubmissionGuard({
    honeypotValue: "",
    duplicateCount: 0,
    rateLimitCount: 0,
    duplicateMessage: "duplicate",
    rateLimitedMessage: "rate",
    filteredMessage: "filtered",
  })

  assert.equal(accepted.status, "accepted")
  assert.equal(accepted.success, true)
  assert.equal(accepted.shouldPersist, true)
})

test("submission normalization keeps comparable identifiers stable", () => {
  assert.equal(
    normalizeSubmissionEmail("  USER@Example.COM "),
    "user@example.com"
  )
  assert.equal(
    normalizeSubmissionPhone("  +228   90 00 00 00 "),
    "+228 90 00 00 00"
  )
  assert.equal(
    normalizeOptionalSubmissionText("   Projet Canada   "),
    "Projet Canada"
  )
  assert.equal(normalizeOptionalSubmissionText("   "), undefined)
})
