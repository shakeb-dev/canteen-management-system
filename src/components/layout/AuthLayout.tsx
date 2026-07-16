import { Outlet } from 'react-router-dom';
import { BrandLogo } from '../ui/BrandLogo';
import cmsImage from '../../assets/cms.png';

export default function AuthLayout() {
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden relative" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 30%, #7c9ec9 60%, #f5f0e8 100%)'}}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full blur-[150px] animate-drift" style={{background: 'rgba(29,78,216,0.35)'}} />
        <div className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full blur-[150px] animate-drift delay-1000" style={{background: 'rgba(245,240,232,0.25)'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full blur-[100px]" style={{background: 'rgba(124,158,201,0.2)'}} />
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-5xl mx-4 min-h-[520px] max-h-[90vh] rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)] animate-fade-in-up">

        {/* ── LEFT PANEL: Decorative Image ── */}
        <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center p-6 overflow-hidden" style={{background: 'linear-gradient(160deg, #1e3a8a 0%, #2563eb 45%, #7c9ec9 80%, #f0e9d8 100%)'}}>
          {/* Subtle cream/blue texture overlay */}
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(circle at 15% 85%, rgba(245,240,232,0.4) 0%, transparent 55%), radial-gradient(circle at 85% 15%, rgba(37,99,235,0.5) 0%, transparent 55%)' }}
          />

          {/* Polaroid-style stacked image cards */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Back card (rotated) */}
            <div className="absolute rotate-[-12deg] translate-x-[-70px] translate-y-[30px] w-64 h-72 bg-white rounded-xl shadow-2xl p-2.5 pb-8">
              <img src={cmsImage} alt="CMS" className="w-full h-full object-cover rounded-sm" />
            </div>

            {/* Middle card */}
            <div className="absolute rotate-[7deg] translate-x-[40px] translate-y-[-15px] w-68 h-76 bg-white rounded-xl shadow-2xl p-2.5 pb-8" style={{width:'272px',height:'304px'}}>
              <img src={cmsImage} alt="CMS" className="w-full h-full object-cover rounded-sm" />
            </div>

            {/* Front card (center, top) */}
            <div className="relative z-10 rotate-[-3deg] bg-white rounded-xl shadow-2xl p-2.5 pb-8" style={{width:'288px',height:'320px'}}>
              <img src={cmsImage} alt="CMS" className="w-full h-full object-cover rounded-sm" />
            </div>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-6 left-0 right-0 flex items-end justify-center gap-3 px-8">
            <p className="text-3xl font-semibold text-white/90 tracking-tight drop-shadow-sm">
              Banswara Syntex
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL: Login Form ── */}
        <div className="flex-1 bg-white dark:bg-zinc-50 flex flex-col relative overflow-hidden">
          {/* Decorative silhouette at the bottom, similar to the city skyline in reference */}
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none opacity-[0.06]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 120\'%3E%3Crect x=\'0\' y=\'80\' width=\'800\' height=\'40\' fill=\'%231e40af\'/%3E%3Crect x=\'20\' y=\'40\' width=\'40\' height=\'80\' fill=\'%231e40af\'/%3E%3Crect x=\'80\' y=\'20\' width=\'30\' height=\'100\' fill=\'%231e40af\'/%3E%3Crect x=\'120\' y=\'50\' width=\'50\' height=\'70\' fill=\'%231e40af\'/%3E%3Crect x=\'190\' y=\'30\' width=\'35\' height=\'90\' fill=\'%231e40af\'/%3E%3Crect x=\'240\' y=\'60\' width=\'45\' height=\'60\' fill=\'%231e40af\'/%3E%3Crect x=\'310\' y=\'10\' width=\'20\' height=\'110\' fill=\'%231e40af\'/%3E%3Crect x=\'340\' y=\'40\' width=\'60\' height=\'80\' fill=\'%231e40af\'/%3E%3Crect x=\'420\' y=\'55\' width=\'35\' height=\'65\' fill=\'%231e40af\'/%3E%3Crect x=\'470\' y=\'25\' width=\'25\' height=\'95\' fill=\'%231e40af\'/%3E%3Crect x=\'510\' y=\'45\' width=\'50\' height=\'75\' fill=\'%231e40af\'/%3E%3Crect x=\'580\' y=\'35\' width=\'30\' height=\'85\' fill=\'%231e40af\'/%3E%3Crect x=\'630\' y=\'60\' width=\'55\' height=\'60\' fill=\'%231e40af\'/%3E%3Crect x=\'700\' y=\'20\' width=\'20\' height=\'100\' fill=\'%231e40af\'/%3E%3Crect x=\'740\' y=\'50\' width=\'45\' height=\'70\' fill=\'%231e40af\'/%3E%3C/svg%3E")', backgroundSize: 'cover', backgroundPosition: 'bottom' }}
          />

          {/* Form content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-12 py-6 relative z-10">
            {/* Logo — large, centered, no background */}
            <div className="w-full max-w-sm mb-6 flex justify-center">
              <BrandLogo className="scale-[1.6] origin-center" />
            </div>

            <div className="w-full max-w-sm">
              <Outlet />
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-4 text-center relative z-10">
            <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">
              Canteen Management System by <span className="text-primary">Banswara Syntex Ltd.</span> © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




