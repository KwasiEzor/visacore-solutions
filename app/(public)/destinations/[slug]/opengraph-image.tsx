import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"

export const alt = "Destination VisaCore Solutions"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const destination = await prisma.destination.findUnique({
    where: { slug },
    select: {
      name: true,
      heroTitle: true,
      heroDescription: true,
    },
  })

  const title = destination?.heroTitle || destination?.name || "Destination"
  const subtitle =
    destination?.heroDescription ||
    `Immigration vers ${destination?.name || "votre prochaine destination"}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #081E3F 0%, #0C2F62 54%, #123867 100%)",
          color: "white",
          padding: "58px 66px",
          position: "relative",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-110px",
            bottom: "-120px",
            width: "380px",
            height: "380px",
            borderRadius: "9999px",
            background: "rgba(219,173,38,0.16)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#DBAD26",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
              }}
            >
              Destination
            </div>
            <div
              style={{
                fontSize: "22px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              VisaCore Solutions
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 22px",
              borderRadius: "9999px",
              border: "1px solid rgba(219,173,38,0.28)",
              background: "rgba(219,173,38,0.12)",
              color: "#DBAD26",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            Évaluation gratuite
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "880px",
          }}
        >
          <div
            style={{
              fontSize: "74px",
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-0.05em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "28px",
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.8)",
              maxWidth: "900px",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "20px",
            color: "rgba(255,255,255,0.68)",
          }}
        >
          <div>Canada • États-Unis • Europe</div>
          <div>visacore-solutions.com</div>
        </div>
      </div>
    ),
    size
  )
}
