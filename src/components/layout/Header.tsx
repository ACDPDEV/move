import { IconBrandGithub, IconPaperclip } from "@tabler/icons-react";
import LinksNav from "@/components/layout/LinksNav";
import {
    Button,
} from '@/components/ui/button';
import Link from "next/link";

const GithubRepoResponse = await fetch("https://api.github.com/repos/ACDPDev/move/contributors");
const GithubRepoData = await GithubRepoResponse.json();
const GithubRepoContributors = GithubRepoData.map((contributor: any) => contributor.avatar_url);


function Header() {
    return (
        <header className="flex flex-row w-full h-10 top-0 left-0 right-0 p-3 mt-3 fixed justify-between items-center">
            <LinksNav />
            <ul className="flex flex-row gap-2">
                <Button className="p-0">
                    <Link href="https://github.com/acdpdev/move/" className="flex flex-row gap-2 h-full w-fit justify-center items-center p-2">
                        <IconBrandGithub className="stroke-stone-400 hover:stroke-white hover:scale-110 transition-all size-5" />
                        <div className="flex flex-row gap-1 h-full w-fit">
                            {
                                GithubRepoContributors.map((contributor: any, index: number) => <img className="h-5 w-5 rounded-full" src={contributor} alt={`Contribuidor ${index}`} />)
                            }
                        </div>
                    </Link>
                </Button>
                <Button className="p-0">
                    <Link href="/paper/" className="flex flex-row gap-2 h-full w-fit justify-center items-center p-3">
                        <IconPaperclip className="stroke-stone-400 hover:stroke-white hover:scale-110 transition-all size-5" />
                    </Link>
                </Button>
            </ul>
        </header>
    )
}

export default Header;