import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"

export const alt = "Service VisaCore Solutions"
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
  const service = await prisma.service.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      whoIsItFor: true,
    },
  })

  const title = service?.name || "Service"
  const subtitle =
    service?.description ||
    service?.whoIsItFor ||
    "Accompagnement sur mesure pour vos démarches d'immigration."

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(circle at top right, rgba(219,173,38,0.22), transparent 34%), linear-gradient(135deg, #081E3F 0%, #0A2852 55%, #102B4B 100%)",
          color: "white",
          padding: "58px 66px",
          position: "relative",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
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
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background: "rgba(219,173,38,0.14)",
                border: "1px solid rgba(219,173,38,0.28)",
                color: "#DBAD26",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "22px",
              }}
            >
              VS
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
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
                Service
              </div>
              <div style={{ fontSize: "22px", color: "rgba(255,255,255,0.7)" }}>
                VisaCore Solutions
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "14px 22px",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.78)",
              fontSize: "18px",
            }}
          >
            Stratégie • Dossier • Suivi
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
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
              color: "rgba(255,255,255,0.78)",
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
          <div>Évaluation gratuite • Rendez-vous • Espace client</div>
          <div>visacore-solutions.com</div>
        </div>
      </div>
    ),
    size
  )
}
