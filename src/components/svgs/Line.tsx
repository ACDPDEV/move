function Line({
    className,
}: Readonly<{ className?: string }> & React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1747"
            height="1102"
            viewBox="0 0 1747 1102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M2 1101C2 1101 81.8343 845.921 218.5 787.5C355.166 729.079 427.178 916.341 594 847C760.822 777.659 580.101 505.97 769.5 331C958.899 156.03 1388 423 1545 331C1702 239 1745 1 1745 1"
                stroke="url(#paint0_linear_46_39)"
                stroke-opacity="0.5"
                strokeWidth="3"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_46_39"
                    x1="1934.5"
                    y1="-33.9999"
                    x2="-238.5"
                    y2="1077"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#151618" stopOpacity="0" />
                    <stop offset="0.480769" stopColor="#303236" />
                    <stop offset="1" stopColor="#151618" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default Line;
