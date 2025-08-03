import { IconUser } from '@tabler/icons-react';

function Colaborators({ className }: { className?: string }) {
    return (
        <div className={`w-fit h-fit ${className}`}>
            <div className="relative flex flex-row w-42 h-14 -space-x-5">
                <img
                    src="/ACDPDEV.avif"
                    alt="ACDPDEV"
                    className="w-12 h-12 rounded-full shadow-md shadow-black z-5"
                />
                <img
                    src="/TheDormitabis.avif"
                    alt="TheDormitabis"
                    className="w-12 h-12 rounded-full shadow-md shadow-black z-4"
                />
                <div className="w-12 h-12 flex justify-center items-center rounded-full shadow-md shadow-black bg-[#222326] z-3">
                    <IconUser size={32} color="#9A9CAC" />
                </div>
                <div className="w-12 h-12 flex justify-center items-center rounded-full shadow-md shadow-black bg-[#222326] z-2">
                    <IconUser size={32} color="#9A9CAC" />
                </div>
                <div className="w-12 h-12 flex justify-center items-center rounded-full shadow-md shadow-black bg-[#222326] z-1">
                    <IconUser size={32} color="#9A9CAC" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 top-0 w-full h-full bg-gradient-to-r from-transparent to-[#151618] z-6" />
            </div>
        </div>
    );
}

export default Colaborators;
