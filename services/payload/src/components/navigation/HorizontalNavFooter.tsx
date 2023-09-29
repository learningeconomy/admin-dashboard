import React from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';

import Arrow from '../svgs/Arrow';

import './navigation.scss';

type HorizontalNavFooterProps = {
    mainAction?: () => void;
    canDoMainAction?: boolean;
    goBack?: () => void;
    quit?: () => void;
    mainText?: string;
    quitText?: string;
    className?: string;
    tag?: keyof JSX.IntrinsicElements;
};

const HorizontalNavFooter: React.FC<HorizontalNavFooterProps> = ({
    mainAction = () => { },
    canDoMainAction = true,
    goBack,
    quit,
    mainText = 'Continue',
    quitText = 'Quit',
    className = '',
    tag = 'footer',
}) => {
    return (
        <Flipper
            element={tag}
            flipKey={`${Boolean(goBack)}-${canDoMainAction}`}
            className={`horizontal-nav-footer w-full flex flex-col items-center p-5 bg-[--theme-bg] border-t gap-5 ${className}`}
        >
            <section className="w-full flex gap-5">
                {goBack && (
                    <Flipped flipId="back-button">
                        <button
                            type="button"
                            className="w-11 h-11 shadow rounded-full bg-[--theme-bg] flex items-center justify-center outline-none"
                            onClick={goBack}
                        >
                            <Arrow className="text-green-500 w-6 h-6" />
                        </button>
                    </Flipped>
                )}

                <Flipped flipId="main-action-button">
                    <button
                        className="w-full bg-green-500 rounded-xl px-4 py-2 text-white font-inter text-xl font-semibold outline-none"
                        type="button"
                        onClick={mainAction}
                        disabled={!canDoMainAction}
                    >
                        {mainText}
                    </button>
                </Flipped>
            </section>

            {quit && (
                <Flipped flipId="quit-button">
                    <button
                        className="w-full bg-transparent font-inter text-xl font-semibold outline-none"
                        type="button"
                        onClick={quit}
                        disabled={!canDoMainAction}
                    >
                        {quitText}
                    </button>
                </Flipped>
            )}
        </Flipper>
    );
};

export default HorizontalNavFooter;
