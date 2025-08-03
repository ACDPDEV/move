import Link from 'next/link';

function About() {
    return (
        <section className="w-full h-screen flex flex-col items-center justify-start border-x border-[#222326] px-8 sm:px-36 pt-24 gap-10 [&_h1]:font-semibold [&_h1]:text-2xl [&_h1]:text-[#FCFCFD] [&_p]:text-md [&_p]:font-medium [&_p]:text-[#D9D9D9]">
            <h1>¿Quiénes están detrás de MOVE?</h1>
            <p>
                Somos un equipo de estudiantes del{' '}
                <Link
                    href="https://www.facebook.com/ColegioSanJuanTrujillo/?locale=es_LA"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#7a74a5] hover:underline"
                >
                    Colegio San Juan
                </Link>{' '}
                participando en{' '}
                <Link
                    href="https://www.gob.pe/institucion/minedu/campa%C3%B1as/64666-feria-escolar-nacional-de-ciencia-y-tecnologia-eureka"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#7a74a5] hover:underline"
                >
                    Feria Escolar Nacional de Ciencia y Tecnología Eureka 2025
                </Link>{' '}
                . Nuestro objetivo es revolucionar la forma en que se aprenden
                las ciencias en el Perú.
            </p>
            <p>
                Creemos que la educación debe ser{' '}
                <strong className="text-[#A2DCA2]">interactiva</strong>,{' '}
                <strong className="text-[#F79C6E]">divertida</strong> y{' '}
                <strong className="text-[#A3A3DC]">accesible</strong> para todos
                los estudiantes, independientemente de su idioma o ubicación.
            </p>
        </section>
    );
}

export default About;
