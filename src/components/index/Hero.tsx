import Link from "next/link";
import { Button } from "../ui/button";
import { IconArrowRight, IconBook } from "@tabler/icons-react";

function Hero() {
    return (
        <article className="w-full h-[calc(100vh-76px)] rounded-2xl bg-slate-950">
            <div className="flex flex-col w-full h-full gap-16 justify-center items-center bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
                <h1 className="font-black text-9xl">M O V E</h1>
                <div className="flex flex-row gap-4 justify-center items-center text-lg font-normal">
                    <Link href="/simulations/">
                        <Button>
                            Explorar simulaciones
                            <IconArrowRight />
                        </Button>
                    </Link>
                    <Link href="/paper/">
                        <Button variant="secondary">
                            Leer más
                            <IconBook />
                        </Button>
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default Hero;