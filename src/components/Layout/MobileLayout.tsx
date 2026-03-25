import { CanvasArea } from '../Canvas/CanvasArea';
import { MobileToolbar } from '../Mobile/MobileToolbar';
import { SlideStrip } from '../Mobile/SlideStrip';
import { BottomSheet } from '../Mobile/BottomSheet';

export function MobileLayout() {
  return (
    <div className="flex flex-col h-full relative">
      {/* Canvas takes remaining space */}
      <div className="flex-1 relative min-h-0" style={{ paddingBottom: '80px' }}>
        <CanvasArea mode="mobile" />
        <MobileToolbar />
      </div>

      {/* Slide strip */}
      <SlideStrip />

      {/* Bottom sheet */}
      <BottomSheet />
    </div>
  );
}
