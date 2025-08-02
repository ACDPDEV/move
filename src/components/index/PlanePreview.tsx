function PlanePreview({ className }: { className?: string }) {
    return (
        <div className={`w-fit h-fit ${className}`}>
            <div className="relative w-48 h-48 grid grid-cols-3 grid-rows-3 bg-[#222326] gap-0.5">
                <div className="bg-[#151618]" />
                <div className="bg-[#151618]" />
                <div className="bg-[#151618]" />
                <div className="bg-[#151618]" />
                <div className="bg-[#151618]" />
                <div className="bg-[#151618]" />
                <div className="bg-[#151618]" />
                <div className="bg-[#151618]" />
                <div className="bg-[#151618]" />
                <div className="absolute bg-green-500 w-8 h-8 border-2 border-white rounded-full top-1/3 right-1/3 translate-x-1/2 -translate-y-1/2 shadow-xl shadow-black" />
                <div className="absolute bottom-0 left-0 right-0 top-0 w-full h-full bg-radial from-tranparent to-[#151618]" />
                <div className="absolute top-1/2 left-1/2 -translate-1/2 bg-[#222326] border border-[#303236] p-1 rounded-md text-sm text-[#9A9CAC] font-mono">
                    x: 8 y: 12
                </div>
            </div>
        </div>
    );
}

export default PlanePreview;
