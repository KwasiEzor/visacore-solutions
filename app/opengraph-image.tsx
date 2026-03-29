import { ImageResponse } from "next/og"

export const alt = "VisaCore Solutions"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(circle at top left, rgba(219,173,38,0.26), transparent 36%), linear-gradient(135deg, #081E3F 0%, #0B2C5A 56%, #102D52 100%)",
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
            right: "-80px",
            top: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "9999px",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              background: "rgba(219,173,38,0.18)",
              border: "1px solid rgba(219,173,38,0.32)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 700,
              color: "#DBAD26",
            }}
          >
            VC
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#DBAD26",
              }}
            >
              VisaCore Solutions
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "rgba(255,255,255,0.74)",
                marginTop: "8px",
              }}
            >
              Immigration internationale depuis Lomé, Togo
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "860px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                padding: "10px 18px",
                borderRadius: "9999px",
                background: "rgba(219,173,38,0.14)",
                color: "#DBAD26",
                border: "1px solid rgba(219,173,38,0.26)",
                fontSize: "18px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Visa, études, travail, immigration
            </div>
          </div>

          <div
            style={{
              fontSize: "64px",
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Votre projet international</span>
            <span style={{ color: "#DBAD26" }}>mérite un cadrage expert.</span>
          </div>

          <div
            style={{
              fontSize: "28px",
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.76)",
              marginTop: "24px",
              maxWidth: "900px",
            }}
          >
            Accompagnement stratégique, préparation documentaire et suivi humain
            pour le Canada, les États-Unis et l&apos;Europe.
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
          <div style={{ display: "flex", gap: "24px" }}>
            <span>Évaluation gratuite</span>
            <span>Rendez-vous conseil</span>
            <span>Espace client</span>
          </div>
          <div>visacore-solutions.com</div>
        </div>
      </div>
    ),
    size
  )
}
