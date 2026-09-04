import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Download } from "lucide-react"

export const metadata: Metadata = {
  title: "브랜드 로고 — kt is WI ZEROTHON",
  robots: { index: false, follow: false },
}

const ASSETS = [
  {
    name: "kt is WI ZEROTHON — Black (PNG)",
    desc: "kt is CI Black+Red + WI ZEROTHON 검정 · 밝은 배경용 · 투명 배경",
    href: "/brand/wi-zerothon-logo-black.png",
    download: "kt-is-WI-ZEROTHON-logo-black.png",
    preview: "/brand/wi-zerothon-logo-black.png",
    width: 642,
    height: 96,
    previewClass: "bg-white/95",
  },
  {
    name: "kt is WI ZEROTHON — Black (PNG · 2x)",
    desc: "검정 버전 고해상도",
    href: "/brand/wi-zerothon-logo-black@2x.png",
    download: "kt-is-WI-ZEROTHON-logo-black@2x.png",
    preview: "/brand/wi-zerothon-logo-black@2x.png",
    width: 1284,
    height: 192,
    previewClass: "bg-white/95",
  },
  {
    name: "kt is WI ZEROTHON — Black (SVG)",
    desc: "검정 버전 벡터 파일",
    href: "/brand/wi-zerothon-logo-black.svg",
    download: "kt-is-WI-ZEROTHON-logo-black.svg",
    preview: "/brand/wi-zerothon-logo-black.png",
    width: 642,
    height: 96,
    previewClass: "bg-white/95",
  },
  {
    name: "kt is WI ZEROTHON — White (PNG)",
    desc: "어두운 배경용 · WI ZEROTHON 흰색 · 투명 배경",
    href: "/brand/wi-zerothon-logo-dark.png",
    download: "kt-is-WI-ZEROTHON-logo-dark.png",
    preview: "/brand/wi-zerothon-logo-dark.png",
    width: 642,
    height: 96,
    previewClass: "bg-[#0a1238]/60",
  },
  {
    name: "kt is WI ZEROTHON — White (PNG · 2x)",
    desc: "어두운 배경용 고해상도",
    href: "/brand/wi-zerothon-logo-dark@2x.png",
    download: "kt-is-WI-ZEROTHON-logo-dark@2x.png",
    preview: "/brand/wi-zerothon-logo-dark@2x.png",
    width: 1284,
    height: 192,
    previewClass: "bg-[#0a1238]/60",
  },
  {
    name: "kt is WI ZEROTHON — White (SVG)",
    desc: "어두운 배경용 벡터 파일",
    href: "/brand/wi-zerothon-logo-dark.svg",
    download: "kt-is-WI-ZEROTHON-logo-dark.svg",
    preview: "/brand/wi-zerothon-logo-dark.png",
    width: 642,
    height: 96,
    previewClass: "bg-[#0a1238]/60",
  },
  {
    name: "kt is CI — Black+Red (PNG)",
    desc: "공식 kt is CI · Black+Red",
    href: "/brand/kt-is-ci-black-red.png",
    download: "kt-is-ci-black-red.png",
    preview: "/brand/kt-is-ci-black-red.png",
    width: 492,
    height: 229,
    previewClass: "bg-white/95",
  },
  {
    name: "kt is CI — White+Red (PNG)",
    desc: "어두운 배경용 kt is CI",
    href: "/brand/kt-is-ci-dark.png",
    download: "kt-is-ci-dark.png",
    preview: "/brand/kt-is-ci-dark.png",
    width: 492,
    height: 229,
    previewClass: "bg-[#0a1238]/60",
  },
] as const

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-[#050818] text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="text-sm text-[#7eb6ff] transition-colors hover:text-[#c4b5fd]"
        >
          ← 메인으로
        </Link>

        <h1 className="mt-8 text-3xl font-bold tracking-tight md:text-4xl">
          브랜드 로고 다운로드
        </h1>
        <p className="mt-4 text-base leading-relaxed text-foreground/75 md:text-lg">
          <strong className="text-foreground">kt is</strong> CI는{" "}
          <strong className="text-foreground">Black+Red</strong>,{" "}
          <strong className="text-foreground">WI ZEROTHON</strong> 문구는 검정(밝은 배경) /
          흰색(어두운 배경) 버전으로 제공됩니다.
        </p>

        <div className="mt-10 space-y-5">
          {ASSETS.map((asset) => (
            <article
              key={asset.href}
              className="rounded-2xl border border-[#3b6cff]/40 bg-[#080d24]/80 p-5 md:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-foreground">{asset.name}</h2>
                  <p className="mt-1 text-sm text-foreground/65">{asset.desc}</p>
                  <div
                    className={`mt-4 flex min-h-[5rem] items-center rounded-xl border border-[#3b6cff]/25 px-4 py-3 ${asset.previewClass}`}
                  >
                    <Image
                      src={asset.preview}
                      alt=""
                      width={asset.width}
                      height={asset.height}
                      unoptimized
                      className="h-10 w-auto max-w-full object-contain object-left md:h-12"
                    />
                  </div>
                </div>
                <a
                  href={asset.href}
                  download={asset.download}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#7eb6ff]/60 bg-[#1a2f6e]/80 px-5 py-3 text-sm font-semibold text-[#dff0ff] transition-colors hover:border-[#c4b5fd] hover:bg-[#2a1548] hover:text-white"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  다운로드
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
