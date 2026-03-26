import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A2540] px-4 text-center">
      <h1 className="text-8xl font-bold text-[#C9A227]">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-white">
        Page introuvable
      </h2>
      <p className="mt-2 max-w-md text-white/60">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button className="bg-[#C9A227] text-white hover:bg-[#A88620]">
            Retour à l&apos;accueil
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Nous contacter
          </Button>
        </Link>
      </div>
    </div>
  )
}
