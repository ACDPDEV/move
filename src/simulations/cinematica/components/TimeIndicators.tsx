'use client'
import { useTimeStore } from "../store/useTimeStore";
import FPSBadge from "./badges/FpsIndicator";

function TimeIndicators() {

    const isPlaying = useTimeStore((s) => s.isPlaying);

    return (
        <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-red-400'}`} />
            {isPlaying ? 'Reproduciendo' : 'Pausado'}
          </div>
        </div>
        <FPSBadge className="text-white" />
      </div>
    );
}

export default TimeIndicators;