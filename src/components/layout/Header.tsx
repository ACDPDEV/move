import { IconPaperclip } from '@tabler/icons-react';
import LinksNav from '@/components/layout/LinksNav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import GithubButton from './GithubButton';
import { ModeToggle } from './ToogleTheme';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

function Header() {
    return (
        <header className="flex flex-row w-full h-10 top-0 left-0 right-0 p-4 mt-3 fixed justify-between items-center z-9999999">
            <LinksNav />
            <ul className="flex flex-row gap-2">
                <GithubButton />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/paper/">
                            <Button variant="secondary" size="icon">
                                <IconPaperclip />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>Revisa el informe</TooltipContent>
                </Tooltip>
            </ul>
        </header>
    );
}

export default Header;
