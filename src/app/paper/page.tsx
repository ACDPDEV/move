import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconDownload, IconFileDigit } from '@tabler/icons-react';
import { Link } from 'next-view-transitions';

export default function Paper() {
    return (
        <div className="w-full h-[calc(100vh-4.5rem)] p-4 flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2 h-64 md:h-[60vh] lg:h-full rounded-2xl overflow-hidden shadow-lg">
                <iframe
                    className="w-full h-full"
                    src="https://docs.google.com/document/d/e/2PACX-1vThKgRPqxdeRGYEoF5Bi8suxy9XaOA4-zZAY6lpsEyU80AEHsdg0HWvysM7BLUgehNt7v8oFEUZbDHM/pub"
                    title="Informe de Feria de Ciencias"
                />
            </div>

            <ScrollArea className="w-full lg:w-1/2 h-full bg-white dark:bg-zinc-900 rounded-2xl shadow-inner p-6">
                <div className="prose prose-zinc dark:prose-invert lg:prose-lg">
                    <h1>Informe de Feria de Ciencias</h1>
                    <h2>Colegio San Juan de Trujillo</h2>

                    <div className="flex flex-wrap gap-3 my-4">
                        <Link
                            href="https://docs.google.com/document/d/1WvlXqsQMBft_nka50MnxCPKdXio10RiM09j4_NQitZ4/export?format=docx"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                                <IconDownload size={20} />
                                Descargar DOCX
                            </Button>
                        </Link>

                        <Link
                            href="https://docs.google.com/document/d/1WvlXqsQMBft_nka50MnxCPKdXio10RiM09j4_NQitZ4/edit?usp=sharing"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button className="flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 rounded-xl">
                                <IconFileDigit size={20} />
                                Ver en Google Docs
                            </Button>
                        </Link>
                    </div>

                    <section>
                        <h3>Integrantes</h3>
                        <ul className="list-disc list-inside">
                            <li>Anthony Rafael Aguirre Chavez</li>
                            <li>Arteaga Alvarado Josecarlos Jaimito</li>
                            <li>Ahilton César Díaz Pisfil</li>
                            <li>Luis Arturo Ildefonso Valdiviezo</li>
                            <li>Dayron Stephano Urbina Saldarriaga</li>
                        </ul>
                    </section>

                    <section className="mt-4">
                        <h3>Asesor</h3>
                        <ul className="list-disc list-inside">
                            <li>Edgar Rodriguez Hurtado</li>
                        </ul>
                    </section>
                </div>
            </ScrollArea>
        </div>
    );
}
