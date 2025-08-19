function VectorLetterIcon({
    letter = 'x',
    className = '',
    size = 24,
    ...props
}) {
    // El tamaño base del SVG para calcular las proporciones
    const baseSize = 24;

    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox={`0 0 ${baseSize} ${baseSize}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Flecha hacia la derecha */}
            <line
                x1={baseSize / 4}
                y1={baseSize / 4}
                x2={(baseSize * 3) / 4}
                y2={baseSize / 4}
            />
            <polyline
                points={`${(baseSize * 3) / 4 - 3},${baseSize / 4 - 3} ${
                    (baseSize * 3) / 4
                },${baseSize / 4} ${(baseSize * 3) / 4 - 3},${
                    baseSize / 4 + 3
                }`}
            />

            {/* Letra variable */}
            <text
                x="50%"
                y="75%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize={baseSize * 0.8}
                fill="currentColor"
                stroke="none"
            >
                {letter}
            </text>
        </svg>
    );
}

export default VectorLetterIcon;
