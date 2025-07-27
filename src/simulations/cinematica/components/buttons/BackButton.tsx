import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

function BackButton() {
    return (
        <Link
            href="/simulations/"
            className="group flex items-center gap-2 text-stone-700 dark:text-stone-300 p-2 rounded underline underline-offset-4 transition-all"
        >
            <IconArrowLeft size={16} />

            <span className="opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm">
                Volver
            </span>
        </Link>
    );
}

export default BackButton;
