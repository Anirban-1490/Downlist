/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { useRef, useState } from "react";
import authStyle from "Style/UserAuth/userauth.module.scss";
import axios from "axios";
import { path } from "server-path";

import { useAuth } from "Feature/Authorize/Authorize";
import { useWindowResize } from "Hooks/useWindowResize";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

const UserAuthentication = () => {
    const container_to_move = useRef();
    const router = useRouter();
    const innerWidth = useWindowResize();
    const { mutate, data, isLoading, error, isError, isSuccess, reset } =
        useMutation(
            async (inputData) => {
                if (inputData.formName === "signup") {
                    return (
                        await axios.post(
                            `${path.domain}api/v1/auth/signup`,
                            inputData.data
                        )
                    ).data;
                } else if (inputData.formName === "signin") {
                    return (
                        await axios.post(
                            `${path.domain}api/v1/auth/signin`,
                            inputData.data
                        )
                    ).data;
                }
            },
            {
                onSettled: (data, error, variables, context) => {
                    if (error) return;
                    localStorage.setItem("token", data.token);
                    router.replace("/");
                },
            }
        );

    //   useAuth(isAuthenticated, true);

    const isSmallScreen = innerWidth > 768 ? false : true;
    const errorName = error && error?.response.data.name;
    const errorMessage = error && error?.response.data.message;

    //* handler for switching between signup and sign in form
    const changeBtn = function (e) {
        e.preventDefault();
        reset();
        const left_pos = getComputedStyle(container_to_move.current).left;
        console.log(left_pos);
        if (left_pos === "0px") {
            container_to_move.current.style.left = `-${
                container_to_move.current.parentElement.getBoundingClientRect()
                    .width + 26
            }px`;
        } else {
            container_to_move.current.style.left = "0";
        }
    };

    //* handler for that eye button for showing password

    const showPwd = function (e) {
        e.preventDefault();

        const type = e.target.parentElement.previousSibling.type;
        if (type === "password") {
            e.target.parentElement.previousSibling.type = "text";
            e.target.parentElement.innerHTML = `<ion-icon name="eye-off-outline"></ion-icon>`;
        } else {
            e.target.parentElement.previousSibling.type = "password";
            e.target.parentElement.innerHTML = `<ion-icon name="eye-outline"></ion-icon>`;
        }
    };

    const formHandler = async (formName, e) => {
        e.preventDefault();

        const formData = new FormData(e.target.parentElement);
        const userInfo = Object.fromEntries(formData);

        try {
            mutate({ data: userInfo, formName });
        } catch (error) {}
    };

    return (
        <>
            <div className={authStyle["container"]}>
                <div className={authStyle["child-container"]}>
                    {isError &&
                        (errorName === "DuplicateEmail" ||
                            errorName === "NoAccount") && (
                            <p
                                css={{
                                    textAlign: "center",
                                    fontSize: "1.15rem !important",
                                    margin: "2rem 0",
                                }}
                                className={authStyle["error-message"]}>
                                {errorMessage}
                            </p>
                        )}
                    <div
                        className={authStyle["child-inner-container"]}
                        ref={container_to_move}>
                        <form className={authStyle["signin-container"]}>
                            <h2>Welcome back :)</h2>
                            <div className={authStyle["input-container"]}>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                />
                                {errorName === "EmptyEmail" && isError && (
                                    <p className={authStyle["error-message"]}>
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                            <div className={authStyle["input-container"]}>
                                <div className={authStyle["pwd-contianer"]}>
                                    <input
                                        type="password"
                                        name="pass"
                                        id="pwd"
                                        placeholder="Password"
                                        autoComplete="chrome-off"
                                    />

                                    <button onClick={(e) => showPwd(e)}>
                                        <ion-icon name="eye-outline"></ion-icon>
                                    </button>
                                </div>
                                {errorName === "EmptyPassword" && isError && (
                                    <p className={authStyle["error-message"]}>
                                        {errorMessage}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className={authStyle["submit-btn"]}
                                onClick={(e) => formHandler("signin", e)}
                                disabled={isSuccess}>
                                {isLoading && !isError
                                    ? "Loading..."
                                    : "Sign in"}
                            </button>

                            <h4>
                                New user?{" "}
                                <button
                                    className={authStyle["change"]}
                                    onClick={(e) => changeBtn(e)}>
                                    Create new account
                                </button>
                            </h4>
                        </form>

                        {/* //* ----------------Sign up-----------  */}
                        <form className={authStyle["newuser-container"]}>
                            <h2>Create account</h2>

                            <div className={authStyle["input-container"]}>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Username"
                                    autoComplete="off"
                                />
                                {(errorName === "ValidationErrorname" ||
                                    errorName === "EmptyUsername") &&
                                    isError && (
                                        <p
                                            className={
                                                authStyle["error-message"]
                                            }>
                                            {errorMessage}
                                        </p>
                                    )}
                            </div>
                            <div className={authStyle["input-container"]}>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                />
                                {(errorName === "ValidationErroremail" ||
                                    errorName === "EmptyEmail") &&
                                    isError && (
                                        <p
                                            className={
                                                authStyle["error-message"]
                                            }>
                                            {errorMessage}
                                        </p>
                                    )}
                            </div>

                            <div className={authStyle["input-container"]}>
                                <div className={authStyle["pwd-contianer"]}>
                                    <input
                                        type="password"
                                        name="pass"
                                        id="pwd"
                                        placeholder="Password"
                                        autoComplete="chrome-off"
                                    />

                                    <button onClick={(e) => showPwd(e)}>
                                        <ion-icon name="eye-outline"></ion-icon>
                                    </button>
                                </div>
                                {(errorName === "ValidationErrorpassword" ||
                                    errorName === "EmptyPassword") &&
                                    isError && (
                                        <p
                                            className={
                                                authStyle["error-message"]
                                            }>
                                            {errorMessage}
                                        </p>
                                    )}
                            </div>
                            <button
                                type="submit"
                                className={authStyle["submit-btn"]}
                                onClick={(e) => formHandler("signup", e)}
                                disabled={isSuccess}>
                                {isLoading && !isError
                                    ? "Loading..."
                                    : "Sign up"}
                            </button>
                            <h4>
                                Already a user?{" "}
                                <button
                                    className={authStyle["change"]}
                                    onClick={(e) => changeBtn(e)}>
                                    Log in here
                                </button>
                            </h4>
                        </form>
                    </div>
                </div>

                <article className={authStyle["signup-background-container"]}>
                    {!isSmallScreen && (
                        <>
                            <h1>Explore Downlist</h1>
                            <p>
                                Discover a vast library of anime and character,
                                add them to Your list, share your thoughts and
                                more.
                            </p>
                        </>
                    )}
                </article>
            </div>
        </>
    );
};

UserAuthentication.removeFooter = true;

export default UserAuthentication;
