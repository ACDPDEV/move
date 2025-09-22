import { ReactNode } from 'react';

interface Simulation {
    slug: string;
    name: string;
    description: string;
    area: string[];
    image: string;
    content: ReactNode;
    previewLink: string;
    playLink: string;
    isAvaible: boolean;
    difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
    rating: number;
    userCount: string;
    features: string[];
}

const simulations: Simulation[] = [
    {
        slug: 'cinematica/mru',
        name: 'MRU - Movimiento Rectilíneo Uniforme',
        description: 'Objeto en línea recta con velocidad constante.',
        area: ['Mecánica', 'Cinemática'],
        image: '/mru.avif',
        previewLink: '/simulations/cinematica/mru',
        playLink:
            '/simulations/cinematica/play?t=0&d=yy0X5x0X5x0X5x0x0x0x0X05x~s~x~wbdc201~Yxy0X5x0x1x0x0x0x0X05x~t~x~w1bb715~Yxy0X5x-0X5x0X25x0x0x0x0X05x~c~x~wf5ffa7~YY&o=0000000000000110112',
        isAvaible: true,
        difficulty: 'Básico',
        rating: 4.6,
        userCount: '2.1k',
        features: [
            'Simulación interactiva en tiempo real',
            'Visualización de posición vs tiempo',
            'Controles de velocidad ajustables',
            'Gráficos dinámicos',
            'Medición de distancias',
        ],
        content: (
            <>
                <p>
                    El <strong>MRU</strong> es un movimiento en línea recta con{' '}
                    <strong>velocidad constante</strong>. La aceleración es nula
                    y la posición varía proporcionalmente al tiempo.
                </p>
                <pre>
                    <code>x = x₀ + v · t</code>
                </pre>
                <p>
                    Esta simulación te permite experimentar con diferentes
                    valores de velocidad y observar cómo afectan la posición del
                    objeto a lo largo del tiempo.
                </p>
                <ul>
                    <li>
                        <strong>Posición inicial (x₀):</strong> Punto de partida
                        del objeto
                    </li>
                    <li>
                        <strong>Velocidad constante (v):</strong> Rapidez y
                        dirección del movimiento
                    </li>
                    <li>
                        <strong>Tiempo (t):</strong> Variable independiente del
                        movimiento
                    </li>
                </ul>
            </>
        ),
    },
    {
        slug: 'cinematica/mruv',
        name: 'MRUV - Movimiento Rectilíneo Uniformemente Variado',
        description: 'Movimiento con aceleración constante.',
        area: ['Mecánica', 'Cinemática'],
        image: '/mruv.avif',
        previewLink: '/simulations/cinematica/mruv',
        playLink:
            '/simulations/cinematica/play?t=0X00&d=yy0X5x0X5x0X5x0x0X1x0x0X05x~s~x~wbdc201~Yxy0X5x0x1x0x-0X5x0x0X05x~t~x~w1bb715~Yxy0X5x-0X5x0X25x0x0X5x0x0X05x~c~x~wf5ffa7~YY&o=0000000000000111112',
        isAvaible: true,
        difficulty: 'Intermedio',
        rating: 4.7,
        userCount: '1.8k',
        features: [
            'Simulación interactiva en tiempo real',
            'Visualización de vectores de velocidad',
            'Gráficos de posición, velocidad y aceleración',
            'Controles intuitivos de parámetros',
            'Análisis de datos en tiempo real',
        ],
        content: (
            <>
                <p>
                    El <strong>MRUV</strong> ocurre cuando un objeto se mueve en
                    línea recta con <strong>aceleración constante</strong>. La
                    velocidad varía linealmente con el tiempo.
                </p>
                <pre>
                    <code>v = v₀ + a · t</code>
                    <br />
                    <code>x = x₀ + v₀ · t + ½ · a · t²</code>
                </pre>
                <p>
                    Esta simulación permite visualizar cómo la aceleración
                    constante afecta tanto la velocidad como la posición del
                    objeto.
                </p>
                <ul>
                    <li>
                        <strong>Posición inicial (x₀):</strong> Punto de partida
                    </li>
                    <li>
                        <strong>Velocidad inicial (v₀):</strong> Velocidad al
                        inicio del movimiento
                    </li>
                    <li>
                        <strong>Aceleración (a):</strong> Cambio constante de
                        velocidad
                    </li>
                    <li>
                        <strong>Tiempo (t):</strong> Variable independiente
                    </li>
                </ul>
            </>
        ),
    },
    {
        slug: 'cinematica/mvcl',
        name: 'MVCL - Caída Libre',
        description: 'Simulación de un cuerpo cayendo solo bajo gravedad.',
        area: ['Mecánica', 'Cinemática', 'Gravitación'],
        image: '/mvcl.avif',
        previewLink: '/simulations/cinematica/mvcl',
        playLink:
            '/simulations/cinematica/play?t=0X00&d=yy0x0x0x4x0x0x0X05x~c~x~wc92a32~Yxy1x0x0x0x0x0x0X05x~t~x~we1a0c5~Yxy2x0x0x-4x0x0x0X05x~s~x~w8c358b~YY&o=0000000000000111112&v=yy~Gravedad+de+la+Tierra~x~a~x0x-9X81x1YY',
        isAvaible: true,
        difficulty: 'Intermedio',
        rating: 4.5,
        userCount: '1.5k',
        features: [
            'Simulación realista de gravedad',
            'Múltiples alturas de lanzamiento',
            'Medición de tiempo de caída',
            'Análisis de velocidad final',
            'Comparación con diferentes planetas',
        ],
        content: (
            <>
                <p>
                    La <strong>caída libre</strong> es un caso especial de MRUV
                    donde la aceleración es constante hacia abajo debido a la
                    gravedad, usualmente
                    <code>g ≈ 9.8 m/s²</code> en la Tierra.
                </p>
                <pre>
                    <code>v = g · t</code>
                    <br />
                    <code>y = y₀ + ½ · g · t²</code>
                </pre>
                <p>
                    Esta simulación te permite experimentar con diferentes
                    alturas y observar cómo afecta la gravedad al movimiento de
                    los objetos.
                </p>
                <ul>
                    <li>
                        <strong>Altura inicial (y₀):</strong> Posición desde
                        donde se suelta el objeto
                    </li>
                    <li>
                        <strong>Gravedad (g):</strong> Aceleración constante
                        hacia abajo
                    </li>
                    <li>
                        <strong>Tiempo (t):</strong> Duración del movimiento
                    </li>
                </ul>
            </>
        ),
    },
    {
        slug: 'cinematica/mp',
        name: 'MP - Movimiento Parabólico',
        description: 'Simulación de proyectiles con trayectoria parabólica.',
        area: ['Mecánica', 'Cinemática'],
        image: '/mp.avif',
        previewLink: '/simulations/cinematica/mp',
        playLink:
            '/simulations/cinematica/play?t=0X00&d=yy0X5x0x3X19x2X41x0x0x0X05x%7Ec%7Ex%7Ew3d82db%7EYxy2x0x-2X41x3X19x0x0x0X05x%7Ec%7Ex%7Eweab308%7EYY&o=0000000000000111112&v=yy%7EGravedad+de+la+Tierra%7Ex%7Ea%7Ex0x-9X81x1YY',
        isAvaible: true,
        difficulty: 'Avanzado',
        rating: 4.9,
        userCount: '3.2k',
        features: [
            'Simulación de trayectorias parabólicas',
            'Análisis de componentes X e Y',
            'Múltiples ángulos de lanzamiento',
            'Cálculo de alcance máximo',
            'Visualización de vectores de velocidad',
        ],
        content: (
            <>
                <p>
                    El <strong>tiro parabólico</strong> combina un MRU en el eje
                    horizontal (X) y un MRUV en el eje vertical (Y). El objeto
                    describe una trayectoria en forma de parábola bajo la
                    influencia de la gravedad.
                </p>
                <pre>
                    <code>x = v₀ · cos(θ) · t</code>
                    <br />
                    <code>y = v₀ · sin(θ) · t - ½ · g · t²</code>
                </pre>
                <p>
                    Esta simulación permite experimentar con diferentes ángulos
                    y velocidades iniciales para encontrar el alcance máximo y
                    analizar la trayectoria.
                </p>
                <ul>
                    <li>
                        <strong>Velocidad inicial (v₀):</strong> Magnitud de la
                        velocidad inicial
                    </li>
                    <li>
                        <strong>Ángulo de lanzamiento (θ):</strong> Dirección
                        inicial del proyectil
                    </li>
                    <li>
                        <strong>Gravedad (g):</strong> Aceleración vertical
                        constante
                    </li>
                    <li>
                        <strong>Tiempo (t):</strong> Variable independiente del
                        movimiento
                    </li>
                </ul>
            </>
        ),
    },
    {
        slug: 'cinematica/mcu',
        name: 'MCU -Movimiento Circular Uniforme',
        description: 'Simulación de un objeto girando con velocidad constante.',
        area: ['Mecánica', 'Cinemática'],
        image: '/mcu.avif',
        previewLink: '/simulations/cinematica/mcu',
        playLink: '/simulations/cinematica/play',
        isAvaible: false,
        difficulty: 'Intermedio',
        rating: 0,
        userCount: '0',
        features: [
            'Simulación interactiva en tiempo real',
            'Visualización de velocidad angular',
            'Análisis de aceleración centrípeta',
            'Múltiples radios de órbita',
            'Medición de período y frecuencia',
        ],
        content: (
            <>
                <p>
                    En el <strong>MCU</strong>, un objeto se mueve en una
                    trayectoria circular con <strong>rapidez constante</strong>.
                    Aunque la rapidez es constante, la velocidad cambia
                    constantemente de dirección, lo que produce una aceleración
                    centrípeta dirigida hacia el centro del círculo.
                </p>
                <pre>
                    <code>v = ω · r</code>
                    <br />
                    <code>a = v² / r = ω² · r</code>
                </pre>
                <p>
                    Esta simulación permite visualizar conceptos como velocidad
                    angular, aceleración centrípeta y la relación entre el radio
                    y la velocidad.
                </p>
                <ul>
                    <li>
                        <strong>Radio (r):</strong> Distancia del centro al
                        objeto
                    </li>
                    <li>
                        <strong>Velocidad angular (ω):</strong> Rapidez de
                        rotación
                    </li>
                    <li>
                        <strong>Período (T):</strong> Tiempo para completar una
                        vuelta
                    </li>
                    <li>
                        <strong>Frecuencia (f):</strong> Número de vueltas por
                        unidad de tiempo
                    </li>
                </ul>
            </>
        ),
    },
    {
        slug: 'cinematica/mcuv',
        name: 'MCUV - Movimiento Circular Uniformemente Variado',
        description: 'Movimiento circular con aceleración angular constante.',
        area: ['Mecánica', 'Cinemática'],
        image: '/mcuv.avif',
        previewLink: '/simulations/cinematica/mcuv',
        playLink: '/simulations/cinematica/play',
        isAvaible: false,
        difficulty: 'Avanzado',
        rating: 0,
        userCount: '0',
        features: [
            'Simulación de aceleración angular',
            'Visualización de velocidad angular variable',
            'Análisis de aceleración tangencial',
            'Gráficos de posición angular vs tiempo',
            'Controles avanzados de parámetros',
        ],
        content: (
            <>
                <p>
                    El <strong>MCUV</strong> es un movimiento circular donde la
                    velocidad angular cambia con el tiempo debido a una{' '}
                    <strong>aceleración angular constante</strong>. Este tipo de
                    movimiento combina la aceleración centrípeta con la
                    aceleración tangencial.
                </p>
                <pre>
                    <code>ω = ω₀ + α · t</code>
                    <br />
                    <code>θ = θ₀ + ω₀ · t + ½ · α · t²</code>
                </pre>
                <p>
                    Esta simulación permite estudiar cómo la aceleración angular
                    afecta el movimiento circular y la relación entre las
                    variables angulares.
                </p>
                <ul>
                    <li>
                        <strong>Ángulo inicial (θ₀):</strong> Posición angular
                        inicial
                    </li>
                    <li>
                        <strong>Velocidad angular inicial (ω₀):</strong> Rapidez
                        de rotación inicial
                    </li>
                    <li>
                        <strong>Aceleración angular (α):</strong> Cambio de
                        velocidad angular
                    </li>
                    <li>
                        <strong>Tiempo (t):</strong> Variable independiente del
                        movimiento
                    </li>
                </ul>
            </>
        ),
    },
    // añadir una plantilla vacía
    {
        slug: 'cinematica/blank',
        name: 'Plantilla en blanco - Cinemática',
        description: 'Plantilla en blanco para crear tu propia simulación desde cero.',
        area: ['Mecánica', 'Cinemática'],
        image: '/blank.avif',
        previewLink: '/simulations/cinematica/blank',
        playLink: '/simulations/cinematica/play',
        isAvaible: true,
        difficulty: 'Avanzado',
        rating: 0,
        userCount: '0',
        features: [
        ],
        content: (<></>),
    },
];

export { simulations, type Simulation };
