import { Flame } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] px-6 py-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">

        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[16px] tracking-tight text-white">CricArena</span>
            </div>
            <p className="text-[13px] text-stone-500">
              Built with ❤️ by{" "}
              <a 
                href="https://github.com/avichal-08" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-stone-300 hover:text-orange-400 font-semibold transition-colors"
              >
                Avichal
              </a>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/avichal-08" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-stone-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.1] transition-all"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/Avichal_08" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="X (Twitter)"
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-stone-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.1] transition-all"
            >
              <XIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.05]">
          <p className="text-[12px] text-stone-600">
            © 2026 CricArena. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-stone-600">All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}