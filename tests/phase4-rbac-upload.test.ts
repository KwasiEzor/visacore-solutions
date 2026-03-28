import assert from "node:assert/strict"
import test from "node:test"

import {
  canAccessAdminPath,
  canRenderAdminNavItem,
  hasPermission,
} from "../lib/rbac"
import {
  MAX_UPLOAD_SIZE,
  validateUploadFileMetadata,
} from "../lib/upload-policy.shared"

test("rbac helper keeps users/settings restricted while leaving normal admin paths accessible", () => {
  assert.equal(canAccessAdminPath("/admin", "EDITOR"), true)
  assert.equal(canAccessAdminPath("/admin/users", "EDITOR"), false)
  assert.equal(canAccessAdminPath("/admin/settings", "ADMIN"), false)
  assert.equal(canAccessAdminPath("/admin/privacy-requests", "ADMIN"), false)
  assert.equal(
    canAccessAdminPath("/admin/privacy-requests", "SUPER_ADMIN"),
    true
  )
  assert.equal(canAccessAdminPath("/admin/users", "SUPER_ADMIN"), true)
  assert.equal(canRenderAdminNavItem("EDITOR", "manage_users"), false)
  assert.equal(canRenderAdminNavItem("SUPER_ADMIN", "manage_settings"), true)
})

test("rbac permissions remain aligned with create/edit/delete and super-admin-only resources", () => {
  assert.equal(hasPermission("EDITOR", "create"), true)
  assert.equal(hasPermission("EDITOR", "edit"), true)
  assert.equal(hasPermission("EDITOR", "delete"), false)
  assert.equal(hasPermission("ADMIN", "delete"), true)
  assert.equal(hasPermission("ADMIN", "manage_users"), false)
  assert.equal(hasPermission("SUPER_ADMIN", "manage_users"), true)
})

test("upload policy accepts valid files and rejects oversize or mismatched extensions", () => {
  const valid = validateUploadFileMetadata({
    name: "visa-guide.pdf",
    type: "application/pdf",
    size: 128_000,
  })

  assert.equal(valid.success, true)
  if (valid.success) {
    assert.equal(valid.extension, ".pdf")
    assert.equal(valid.sanitizedBase, "visa-guide")
  }

  const invalidExtension = validateUploadFileMetadata({
    name: "photo.pdf",
    type: "image/png",
    size: 256_000,
  })

  assert.equal(invalidExtension.success, false)
  if (!invalidExtension.success) {
    assert.match(invalidExtension.error, /extension/i)
  }

  const oversize = validateUploadFileMetadata({
    name: "document.pdf",
    type: "application/pdf",
    size: MAX_UPLOAD_SIZE + 1,
  })

  assert.equal(oversize.success, false)
  if (!oversize.success) {
    assert.match(oversize.error, /5 Mo/i)
  }
})
