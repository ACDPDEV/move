import {
    Icon3dCubeSphere,
    IconChevronDown,
    IconLink,
    IconPlayerPlay,
    IconReload,
} from '@tabler/icons-react';

function PlayerBar({ className }: { className?: string }) {
    return (
        <div className={`w-fit h-fit ${className}`}>
            <div className="relative w-fit h-16 flex flex-row p-4 gap-2 bg-[#151618] border border-[#222326] rounded-2xl">
                <div className="w-32 h-8 bg-[#222326] rounded-lg flex flex-row justify-between items-center p-2 font-mono text-sm text-[#9A9CAC]">
                    <span className="flex flex-row gap-2 items-center">
                        <span>t</span>
                        <span>256.2</span>
                    </span>
                    <span>s</span>
                </div>
                <div className="w-8 h-8 bg-[#222326] rounded-lg flex justify-center items-center">
                    <IconLink size={20} color="#9A9CAC" />
                </div>
                <div className="w-8 h-8 bg-[#222326] rounded-lg flex justify-center items-center scale-125 border border-[#9A9CAC] shadow-inset-double-md">
                    <IconPlayerPlay size={20} color="#9A9CAC" />
                </div>
                <div className="w-8 h-8 bg-[#222326] rounded-lg flex justify-center items-center">
                    <IconReload size={20} color="#9A9CAC" />
                </div>
                <div className="w-fit h-8 bg-[#222326] rounded-lg flex justify-center items-center p-2 gap-1">
                    <span className="font-mono w-[5ch] text-sm text-[#9A9CAC]">
                        x1
                    </span>
                    <IconChevronDown size={16} color="#9A9CAC" />
                </div>
                <div className="w-fit h-8 bg-[#222326] rounded-lg flex justify-center items-center p-2 gap-1">
                    <Icon3dCubeSphere size={20} color="#9A9CAC" />
                    <IconChevronDown size={16} color="#9A9CAC" />
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 w-full h-full bg-gradient-to-r from-[#151618] via-transparent to-[#151618]" />
        </div>
    );
}

export default PlayerBar;
