import LayoutContainer from '@/components/layout/LayoutContainer';
import Aureola from '@/components/svgs/Aureola';
import Line from '@/components/svgs/Line';
import { Meteors } from '@/components/ui/meteors';

function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LayoutContainer
            bgColor="hsl(240deg, 30%, 5%)"
            personalisedBackground={
                <>
                    <Aureola className="absolute top-1/2 left-1/2 -translate-1/2 min-w-[90rem] w-full h-auto z-100 pointer-events-none" />
                    <Line className="absolute top-0 bottom-0 left-0 right-0 w-full h-full -z-1 pointer-events-none" />
                    <img
                        src="/Stars.avif"
                        alt="stars"
                        className="absolute top-1/2 left-1/2 -translate-1/2 min-w-6xl w-full max-w-none h-auto -z-2 opacity-60 animate-pulse animate-iteration-count-infinite pointer-events-none"
                    />
                    <Meteors number={4} />
                </>
            }
        >
            {children}
        </LayoutContainer>
    );
}

export default Layout;
