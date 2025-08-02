import { IconSearch, IconX } from '@tabler/icons-react';

function PageURL({ className }: { className?: string }) {
    return (
        <div className={`w-fit h-fit ${className}`}>
            <div className="w-fit h-fit relative">
                <div className="w-48 h-32 bg-[#151618] gap-0.5 text-[8px] text-[#FCFCFD] border-t border-l border-[#222326] rounded-tl-lg">
                    <header className="w-full h-fit flex flex-col items-center justify-center">
                        <nav className="w-full h-fit flex flex-row items-center justify-start border-b border-[#222326]">
                            <div className="flex flex-row gap-1 p-1 items-center justify-center w-fit h-fit border-r border-[#222326] rounded-t-lg">
                                <img
                                    src="/favicon.ico"
                                    alt="Logo"
                                    className="w-2 h-2"
                                />
                                <span>Move</span>
                                <IconX className="ml-2" size={8} />
                            </div>
                        </nav>
                        <nav className="w-full h-fit flex p-3 pr-0 border-b border-[#222326]">
                            <div className="w-full h-4 flex flex-row items-center justify-start bg-[#222326] rounded-l-sm gap-2 p-1">
                                <IconSearch size={8} />
                                <span>move-fencyt.vercel.app/...</span>
                            </div>
                        </nav>
                    </header>
                </div>
                <div className="absolute bottom-0 left-0 right-0 top-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-[#151618]" />
                <div className="absolute bottom-0 left-0 right-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-transparent to-[#151618]" />
                <div className="absolute bottom-0 left-0 right-0 top-0 w-full h-full bg-gradient-to-br from-transparent to-[#151618]" />
            </div>
        </div>
    );
}

export default PageURL;
