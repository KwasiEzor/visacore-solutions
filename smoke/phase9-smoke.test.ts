import assert from "node:assert/strict"
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process"
import { randomUUID } from "node:crypto"
import { once } from "node:events"
import net from "node:net"
import path from "node:path"
import test from "node:test"

import { createContactRequest } from "../actions/contacts"
import { prisma } from "../lib/prisma"

async function getAvailablePort() {
  return await new Promise<number>((resolve, reject) => {
    const server = net.createServer()
    server.listen(0, "127.0.0.1", () => {
      const address = server.address()
      if (!address || typeof address === "string") {
        server.close()
        reject(new Error("Failed to allocate an available port"))
        return
      }

      const { port } = address
      server.close((error) => {
        if (error) {
          reject(error)
          return
        }

        resolve(port)
      })
    })
    server.on("error", reject)
  })
}

function trimOutput(value: string) {
  return value.length > 6000 ? value.slice(-6000) : value
}

async function waitForServerReady(
  child: ChildProcessWithoutNullStreams,
  url: string
) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < 60_000) {
    if (child.exitCode !== null) {
      throw new Error(`Next server exited early with code ${child.exitCode}`)
    }

    try {
      const response = await fetch(url, { redirect: "manual" })
      if (response.status < 500) {
        return
      }
    } catch {
      // The dev server is still booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw new Error("Timed out waiting for the Next.js dev server to become ready")
}

async function startNextServer(port: number) {
  const nextBin = path.join(
    process.cwd(),
    "node_modules",
    "next",
    "dist",
    "bin",
    "next"
  )

  let output = ""
  const child = spawn(
    process.execPath,
    [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  )

  child.stdout.on("data", (chunk: Buffer) => {
    output = trimOutput(`${output}${chunk.toString()}`)
  })

  child.stderr.on("data", (chunk: Buffer) => {
    output = trimOutput(`${output}${chunk.toString()}`)
  })

  try {
    await waitForServerReady(child, `http://127.0.0.1:${port}/login`)
    return {
      child,
      getOutput() {
        return output
      },
    }
  } catch (error) {
    child.kill("SIGTERM")
    throw new Error(
      `Failed to start the Next.js dev server.\n\n${output}\n\n${
        error instanceof Error ? error.message : "Unknown startup error"
      }`
    )
  }
}

async function stopNextServer(child: ChildProcessWithoutNullStreams) {
  if (child.exitCode !== null) {
    return
  }

  child.kill("SIGTERM")

  try {
    await Promise.race([
      once(child, "exit"),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timed out stopping dev server")), 10_000)
      ),
    ])
  } catch {
    child.kill("SIGKILL")
    await once(child, "exit")
  }
}

test("smoke: public routes and admin login gate stay reachable", async (t) => {
  const port = await getAvailablePort()
  const server = await startNextServer(port)
  const baseUrl = `http://127.0.0.1:${port}`

  t.after(async () => {
    await stopNextServer(server.child)
  })

  const homeResponse = await fetch(`${baseUrl}/`)
  const homeHtml = await homeResponse.text()

  assert.equal(homeResponse.status, 200, server.getOutput())
  assert.match(homeHtml, /href="\/evaluation"/)
  assert.match(homeHtml, /href="\/contact"/)
  assert.match(homeHtml, /href="\/services\/[^"]+"/)
  assert.match(homeHtml, /href="\/destinations\/[^"]+"/)

  const contactResponse = await fetch(`${baseUrl}/contact`)
  const contactHtml = await contactResponse.text()

  assert.equal(contactResponse.status, 200, server.getOutput())
  assert.match(contactHtml, /id="fullName"/)
  assert.match(contactHtml, /id="email"/)
  assert.match(contactHtml, /id="subject"/)
  assert.match(contactHtml, /id="message"/)
  assert.match(contactHtml, /Envoyer le message/)

  const adminResponse = await fetch(`${baseUrl}/admin`, {
    redirect: "manual",
  })

  assert.ok(
    [302, 303, 307, 308].includes(adminResponse.status),
    `Expected /admin to redirect to login, received ${adminResponse.status}`
  )
  assert.match(adminResponse.headers.get("location") ?? "", /\/login/)

  const loginResponse = await fetch(`${baseUrl}/login`)
  const loginHtml = await loginResponse.text()

  assert.equal(loginResponse.status, 200, server.getOutput())
  assert.match(loginHtml, /name="email"/)
  assert.match(loginHtml, /name="password"/)
  assert.match(loginHtml, /Se connecter/)
})

test("smoke: createContactRequest persists accepted submissions", async (t) => {
  const token = randomUUID().slice(0, 8)
  const email = `smoke+${token}@example.com`
  const subject = `Smoke ${token}`

  t.after(async () => {
    await prisma.contactRequest.deleteMany({
      where: { email },
    })
  })

  const result = await createContactRequest({
    fullName: "Smoke Test",
    email,
    phone: "+22890000000",
    subject,
    message:
      "Ceci est une soumission de smoke test pour verifier le parcours de contact.",
    website: "",
  })

  assert.equal(result.success, true)
  assert.equal(result.status, "accepted")

  const persistedRequest = await prisma.contactRequest.findFirst({
    where: { email, subject },
    orderBy: { createdAt: "desc" },
  })

  assert.ok(persistedRequest)
  assert.equal(persistedRequest?.fullName, "Smoke Test")
  assert.equal(persistedRequest?.subject, subject)
})
