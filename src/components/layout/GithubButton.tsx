import { IconBrandGithub } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

async function GithubButton() {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href="https://github.com/acdpdev/move/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Button
                        variant="secondary"
                        className="flex flex-row gap-2 justify-center items-center"
                    >
                        <IconBrandGithub />
                        <div className="hidden md:flex md:flex-row gap-1 h-full w-fit">
                            <img
                                key="ACDPDEV"
                                className="h-5 w-5 rounded-full"
                                src="/ACDPDEV.avif"
                            />
                            <img
                                key="TheDormitabis"
                                className="h-5 w-5 rounded-full"
                                src="/TheDormitabis.avif"
                            />
                        </div>
                    </Button>
                </Link>
            </TooltipTrigger>
            <TooltipContent>Revisa el código</TooltipContent>
        </Tooltip>
    );
}

export default GithubButton;
