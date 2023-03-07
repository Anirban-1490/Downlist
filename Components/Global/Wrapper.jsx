/** @jsxImportSource @emotion/react  */

import { useEffect, useState } from "react";

import { useRouter } from "next/router";

export const WrapperParent = ({ children, isDividerMount }) => {
    return (
        <>
            <div className="global-wrapper">
                {!isDividerMount && (
                    <div className="divider-container">
                        <div
                            className="divider divider-1"
                            key={"divider-1"}></div>
                        <div
                            className="divider divider-2"
                            key={"divider-2"}></div>
                        <div
                            className="divider divider-3"
                            key={"divider-3"}></div>
                    </div>
                )}

                {children}
            </div>
        </>
    );
};
