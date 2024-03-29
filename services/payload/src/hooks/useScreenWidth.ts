import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * React hook for keeping track of screen width and re-rendering
 *
 * Use like so:
 *
 * const width = useScreenWidth(); // This will rerender the component when resizing the window
 *
 * if (width < 991) console.log('Mobile width!');
 * else console.log('Not mobile width');
 *
 * To skip re-rendering on resize, pass true like so:
 * useScreenWidth(doesNotNeedToReRenderOnResize);
 */
export const useScreenWidth = (skip = false) => {
    const activeListener = useRef<boolean>(false);
    const [width, setWidth] = useState(window.innerWidth);

    const handler = useCallback(() => setWidth(window.innerWidth), []);

    useEffect(() => {
        if (!skip && !activeListener.current) {
            window.addEventListener('resize', handler);
            activeListener.current = true;
        } else if (activeListener.current) {
            window.removeEventListener('resize', handler);
        }

        return () => window.removeEventListener('resize', handler);
    }, [skip]);

    return width;
};

export default useScreenWidth;
