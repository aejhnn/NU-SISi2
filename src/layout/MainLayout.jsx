import BackgroundWaves from "../components/BackgroundWaves";
import PartnerLogos from "../components/brand/PartnerLogos";

function MainLayout({ title, children }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden px-4 pt-6 pb-4 lg:px-[5.8rem] lg:pt-[1.9rem] lg:pb-[1.35rem]">
      <BackgroundWaves />

      <h1 className="mb-5 text-center text-[1.6rem] font-black uppercase leading-none sm:text-4xl lg:mb-[2.3rem] lg:text-[3rem]">
        {title}
      </h1>

      {/* Frosted card: nearly clear over the top-left wave, solid enough elsewhere to read on. */}
      <main className="relative flex flex-1 flex-col rounded-[1.375rem] border border-white/80 bg-white/80 px-5 py-6 shadow-[0_0_0_1px_rgb(20_26_51/0.04),0_0.25rem_1rem_rgb(20_26_51/0.06),0_1.5rem_3rem_-1rem_rgb(20_26_51/0.14)] backdrop-blur-xl lg:bg-transparent lg:bg-[radial-gradient(ellipse_22rem_26rem_at_0_0,rgb(255_255_255/0.2)_60%,rgb(255_255_255/0.66)_95%)] lg:px-[3.8rem] lg:pt-13.5 lg:pb-5.5">
        {children}
        <PartnerLogos className="mt-8 justify-center lg:absolute lg:bottom-5.5 lg:left-3 lg:mt-0" />
      </main>
    </div>
  );
}

export default MainLayout;
