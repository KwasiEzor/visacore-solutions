import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A2540] items-center justify-center p-12">
        <div className="text-center space-y-6">
          <Image
            src="/images/visacore_solutions_globe_logo.png"
            alt="VisaCore Solutions"
            width={240}
            height={240}
            className="mx-auto"
          />
          <h1 className="text-3xl font-bold text-white">
            VisaCore Solutions
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Votre partenaire de confiance pour l&apos;immigration internationale
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        {children}
      </div>
    </div>
  )
}
