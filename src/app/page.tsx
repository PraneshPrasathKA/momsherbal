"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}
import { cn } from "@/lib/utils";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Toaster, { ToasterRef } from "@/components/ui/toast";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toasterRef = useRef<ToasterRef>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animations
      const tl = gsap.timeline();
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.7"
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.8"
        )
        .fromTo(
          formRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      toasterRef.current?.show({
        title: "Invalid Email",
        message: "Please enter a valid @gmail.com address.",
        variant: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      // Real API call to our new local route
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to subscribe");

      setLoading(false);
      setSubmitted(true);

      toasterRef.current?.show({
        title: "Welcome aboard!",
        message: "You have been successfully added to our circle.",
        variant: "success",
        duration: 5000,
      });

      // Final success sequence
      setTimeout(() => {
        const tl = gsap.timeline();
        tl.to(window, {
          duration: 0.8,
          scrollTo: { y: ".success-card", offsetY: 50 },
          ease: "power2.inOut",
        })
          .fromTo(
            ".success-card",
            { opacity: 0, scale: 0.8, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
            "-=0.4"
          )
          .fromTo(
            ".success-icon",
            { scale: 0, rotate: -45 },
            { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" },
            "-=0.4"
          )
          .fromTo(
            ".success-text",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 },
            "-=0.3"
          );
      }, 50);
    } catch (error) {
      console.error("Subscription error:", error);
      setLoading(false);
      toasterRef.current?.show({
        title: "Something went wrong",
        message: "Failed to subscribe. Please check your credentials or try again later.",
        variant: "error",
      });
    }
  };

  return (
    <BackgroundBeamsWithCollision className="min-h-screen">
      <main
        ref={containerRef}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6"
      >
        <div className="flex flex-1 flex-col items-center justify-center py-5">
          <div className="w-full max-w-2xl text-center">
            <div ref={logoRef} className="mb-6 flex justify-center animate-float">
              <Image
                src="/images/Mom_s_herbal_logo-removebg-preview.png"
                alt="MomsHerbal Logo"
                width={320}
                height={320}
                className="w-[240px] md:w-[320px] object-contain drop-shadow-2xl"
                priority
              />
            </div>

            <div className="mb-4 inline-flex items-center rounded-full border border-sage/40 bg-sage/10 px-6 py-2.5 backdrop-blur-md badge-shimmer shadow-[0_0_15px_rgba(142,125,51,0.2)]">
              <span className="text-sm font-bold tracking-[0.3em] text-forest uppercase">
                Coming Soon 2026
              </span>
            </div>

            <h1
              ref={titleRef}
              className="mb-4 font-serif text-4xl sm:text-6xl md:text-8xl font-medium tracking-tight text-forest"
            >
              Moms<span className="italic text-sage">Herbal</span>
            </h1>

            <p
              ref={textRef}
              className="mb-8 text-lg leading-relaxed text-forest/80 md:text-xl"
            >
              Experience the essence of natural wellness. Our curated collection of
              premium organic herbs is blooming and will be ready for you soon.
              Join our circle for exclusive early access.
            </p>

            <div ref={formRef} className="mx-auto max-w-md">
              {!submitted ? (
                <>
                  <form
                    onSubmit={handleSubmit}
                    className="group relative flex flex-col gap-4 sm:flex-row sm:gap-2"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border border-sage/20 bg-white/40 px-6 py-4 text-forest placeholder:text-forest/40 backdrop-blur-xl transition-all focus:border-sage focus:outline-none focus:ring-4 focus:ring-sage/10 disabled:opacity-50"
                      disabled={loading}
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative min-w-[140px] overflow-hidden whitespace-nowrap rounded-2xl bg-forest px-8 py-4 font-semibold text-cream transition-all hover:bg-forest/90 hover:shadow-[0_0_20px_rgba(142,125,51,0.3)] active:scale-95 disabled:scale-100 disabled:opacity-80"
                    >
                      <span className={cn("transition-all duration-300", loading ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0")}>
                        Notify Me
                      </span>
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
                            Sending...
                          </span>
                        </div>
                      )}
                    </button>
                  </form>
                  <p className="mt-4 text-lg text-sage">
                    Be the first to know when we launch.
                  </p>
                </>
              ) : (
                <div className="success-card rounded-3xl border border-sage/30 bg-white/40 p-8 shadow-2xl backdrop-blur-xl">
                  <div className="success-icon mb-4 flex justify-center">
                    <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-sage/20 text-forest shadow-inner">
                      <svg
                        className="h-6 w-6 md:h-8 md:w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="success-text mb-2 font-serif text-3xl font-medium text-forest">
                    You're on the list!
                  </h3>
                  <p className="success-text text-lg text-forest/70">
                    Thank you for joining our circle. We'll be in touch soon with
                    the latest updates.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="w-full py-8 text-center text-sage">
          <p className="font-sans text-xs tracking-[0.2em] uppercase">
            &copy; 2026 MomsHerbal &bull; Pure &bull; Organic &bull; Earth
          </p>
        </div>
      </main>
      <Toaster ref={toasterRef} />
    </BackgroundBeamsWithCollision>
  );
}
