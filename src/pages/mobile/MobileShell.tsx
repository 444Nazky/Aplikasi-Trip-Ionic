import StatusBar from './StatusBar';
import FloatingBottomNav from './FloatingBottomNav'; // Import komponen bottom nav
import type { MobileScreen } from '../types';

interface MobileShellProps {
  children: React.ReactNode;
  activeScreen: MobileScreen;
  go: (s: MobileScreen) => void;
  lightBar?: boolean;
}

export default function MobileShell({ children, activeScreen, go, lightBar }: MobileShellProps) {
  // Sembunyikan bottom navbar di halaman tertentu jika perlu (seperti kamera / aktif trip)
  const hideBottomNav = ['camera', 'trip-active'].includes(activeScreen);

  return (
    <div className="w-[390px] h-[844px] bg-slate-100 rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-slate-800 flex flex-col relative font-sans">
      {/* Top Status Bar */}
      <StatusBar light={lightBar} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24">
        {children}
      </div>

      {/* Floating Bottom Navigation Bar */}
      {!hideBottomNav && (
        <div className="absolute bottom-4 left-0 right-0 px-4 z-40">
          <FloatingBottomNav activeScreen={activeScreen} go={go} />
        </div>
      )}
    </div>
  );
}