import { IconUser } from '@tabler/icons-react';

function ColaboratorsList() {
    return (
        <div className="relative flex flex-col gap-0.5 p-0.5 bg-[#222326] rounded-md [&>div]:flex [&>div]:flex-row [&>div]:bg-[#151618] [&>div]:p-2 [&>div]:z-2 [&>div]:gap-4 [&_h1]:font-semibold [&_h1]:text-sm [&_h1]:text-[#FCFCFD] [&_p]:text-sm [&_p]:font-medium [&_p]:text-[#9A9CAC]">
            <div className="rounded-t-[7px]">
                <div className="w-12 h-12 flex justify-center items-center rounded-full shadow-md bg-[#222326]">
                    <IconUser size={32} color="#9A9CAC" />
                </div>
                <div className="flex flex-col h-full justify-between">
                    <h1>Anthony Aguirre</h1>
                    <p>Informe</p>
                </div>
            </div>
            <div>
                <div className="w-12 h-12 flex justify-center items-center rounded-full shadow-md bg-[#222326]">
                    <IconUser size={32} color="#9A9CAC" />
                </div>
                <div className="flex flex-col h-full justify-between">
                    <h1>Jaimito Arteaga</h1>
                    <p>Cuaderno de Campo</p>
                </div>
            </div>
            <div>
                <img
                    src="/ACDPDEV.avif"
                    alt="ACDPDEV"
                    className="w-12 h-12 flex justify-center items-center rounded-full shadow-md bg-[#222326]"
                />
                <div className="flex flex-col h-full justify-between">
                    <h1>Ahilton Díaz</h1>
                    <p>Desarrollador y Diseñador</p>
                </div>
            </div>
            <div>
                <div className="w-12 h-12 flex justify-center items-center rounded-full shadow-md bg-[#222326]">
                    <IconUser size={32} color="#9A9CAC" />
                </div>
                <div className="flex flex-col h-full justify-between">
                    <h1>Luis Ildefonso</h1>
                    <p>Tester y Feedback</p>
                </div>
            </div>
            <div className="rounded-b-[7px]">
                <img
                    src="/TheDormitabis.avif"
                    alt="TheDormitabis"
                    className="w-12 h-12 flex justify-center items-center rounded-full shadow-md bg-[#222326]"
                />
                <div className="flex flex-col h-full justify-between">
                    <h1>Dayron Urbina</h1>
                    <p>Desarrollador y Tester</p>
                </div>
            </div>
            <span className="absolute top-1/2 left-1/2 -translate-1/2 w-full h-80 bg-radial from-[#4329AC] to-transparent opacity-50 z-1" />
        </div>
    );
}

export default ColaboratorsList;
