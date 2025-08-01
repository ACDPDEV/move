function Aureola({
    className,
}: Readonly<{ className?: string }> & React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="2332"
            height="1489"
            viewBox="0 0 2332 1489"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g filter="url(#filter0_f_46_38)">
                <path
                    d="M338.587 710.924C241.285 813.5 263.961 801.596 244 899.297C224.04 996.997 197.416 1071.08 295.836 1193.9C394.257 1316.73 371.575 1253.45 523.487 1190.62C675.398 1127.79 932.447 1176.82 1058.95 1158.86C1185.45 1140.89 1247.93 1053.95 1385.46 1037.29C1522.99 1020.63 1575.22 892.408 1709.83 811.681C1844.45 730.954 2021.4 759.194 2074.29 626.594C2127.18 493.994 2118.01 429.696 2031.54 312.822C1945.07 195.947 1806.99 228.433 1615.25 231.23C1423.5 234.026 1224.62 273.897 1079.25 391.128C933.881 508.358 940.019 575.952 789 667C637.981 758.048 435.89 608.347 338.587 710.924Z"
                    fill="url(#paint0_linear_46_38)"
                    fillOpacity="0.16"
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_46_38"
                    x="0"
                    y="0"
                    width="2332"
                    height="1489"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="112.5"
                        result="effect1_foregroundBlur_46_38"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_46_38"
                    x1="1914.27"
                    y1="-327.426"
                    x2="2999.98"
                    y2="3469.02"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#5D4EF1" />
                    <stop offset="0.586538" stopColor="#56FF23" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default Aureola;
