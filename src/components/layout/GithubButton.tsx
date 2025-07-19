import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function GithubButton() {

    const GithubRepoResponse = await fetch("https://api.github.com/repos/ACDPDev/move/contributors");
    const GithubRepoData = await GithubRepoResponse.json();
    const GithubRepoContributors = GithubRepoData.map((contributor: any) => contributor.avatar_url);

    if (GithubRepoContributors.length === 0) {
        return (
            <Link href="https://github.com/acdpdev/move/">
            <Button size='icon'>
                <IconBrandGithub/>
            </Button>
        </Link>
        );
    }

    return (
        <Link href="https://github.com/acdpdev/move/" target="_blank" rel="noreferrer">
            <Button variant='secondary' className="flex flex-row gap-2 justify-center items-center">
                <IconBrandGithub/>
                <div className="hidden md:flex md:flex-row gap-1 h-full w-fit">
                    {
                        GithubRepoContributors.map((contributor: any, index: number) => 
                            <img 
                                key={contributor}
                                className="h-5 w-5 rounded-full" 
                                src={contributor} 
                                alt={`Contribuidor ${index}`} 
                            />)
                    }
                </div>
            </Button>
        </Link>
    )
}

export default GithubButton;