'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
    decodeURLParam,
    encodeURLParam,
} from '@/simulations/cinematica/utils/URLToken';

function useURL() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const setURLParams = (params: { [key: string]: string }) => {
        const URLParams = new URLSearchParams(searchParams);
        Object.entries(params).forEach(([key, value]) => {
            URLParams.set(key, encodeURLParam(value));
        });
        replace(`${pathname}?${URLParams.toString()}`);
    };

    const getURLParams = (param: string) => {
        if (!searchParams.get(param)) return null;
        return decodeURLParam(searchParams.get(param)!);
    };

    return { setURLParams, getURLParams };
}

export { useURL };
