import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen h-full flex items-center justify-center sm:p-0 p-4 relative overflow-hidden">
      <Image
        src="/assets/bg/omnixBg.webp"
        alt="Omnix Global Background"
        width={1980}
        height={1080}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        priority
        placeholder="blur"
        blurDataURL="/assets/bg/omnixBg-small.webp"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10" />
      <div className="relative z-20 w-full sm:max-w-md p-4">{children}</div>
    </section>
  );
}
