import { useRef, useState } from "react";
import authStyle from "Style/UserAuth/userauth.module.scss";
import axios from "axios";
import { path } from "server-path";

import { useAuth } from "Feature/Authorize/Authorize";
import { useWindowResize } from "Hooks/useWindowResize";
import { useRouter } from "next/router";

const UserAuthentication = () => {
    const container_to_move = useRef();
    const [errors, setError] = useState({});
    const [isErrorMessageVisable, showErrorMessage] = useState(false);
    const [isAuthenticated, setAuth] = useState(false);
    const router = useRouter();
    //   useAuth(isAuthenticated, true);
    const innerWidth = useWindowResize();

    const isSmallScreen = innerWidth > 768 ? false : true;

    //* handler for switching between signup and sign in form
    const changeBtn = function (e) {
        e.preventDefault();
        showErrorMessage(false);
        setError({});
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

        showErrorMessage(false);

        e.target.innerHTML = "Loading...";
        const formData = new FormData(e.target.parentElement);
        const userInfo = Object.fromEntries(formData);

        try {
            let response;

            //* for signup form request
            if (formName === "signup") {
                response = await axios.post(
                    `${path.domain}api/v1/auth/signup`,
                    userInfo
                );
            } else if (formName === "signin") {
                response = await axios.post(
                    `${path.domain}api/v1/auth/signin`,
                    userInfo
                );
            }

            //* store the token in localstorage
            const token = response.data.token;
            localStorage.setItem("token", token);

            //   setAuth(true);
            router.replace(`/`);
        } catch (error) {
            showErrorMessage(true);
            e.target.innerHTML = "Sign up";
            let messages;

            //* check if error response is relates to any field (like email)
            if (error.response.data.messages?.includes(".")) {
                messages = error.response.data.messages.split(".");
                setError({ ...error.response.data, messages });
            } else {
                messages = error.response.data.messages;
                setError({ messages });
            }
        }
    };

    return (
        <>
            <div className={authStyle["container"]}>
                <div className={authStyle["child-container"]}>
                    <div
                        className={authStyle["child-inner-container"]}
                        ref={container_to_move}>
                        <form className={authStyle["signin-container"]}>
                            <h2>Welcome back :)</h2>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="Email"
                                autoComplete="off"
                            />
                            {errors?.fields?.includes("email") &&
                            isErrorMessageVisable ? (
                                <p className={authStyle["error-message"]}>
                                    {
                                        errors.messages[
                                            errors.fields.indexOf("email")
                                        ]
                                    }
                                </p>
                            ) : (
                                ""
                            )}
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
                            {errors?.fields?.includes("password") &&
                            isErrorMessageVisable ? (
                                <p className={authStyle["error-message"]}>
                                    {
                                        errors.messages[
                                            errors.fields.indexOf("password")
                                        ]
                                    }
                                </p>
                            ) : (
                                ""
                            )}
                            <button
                                type="submit"
                                className={authStyle["submit-btn"]}
                                onClick={(e) => formHandler("signin", e)}>
                                Sign in
                            </button>

                            {!errors?.fields && isErrorMessageVisable ? (
                                <p
                                    className={authStyle["error-message"]}
                                    style={{ marginBottom: "1em" }}>
                                    {errors.messages}
                                </p>
                            ) : (
                                ""
                            )}

                            <h4>
                                New user?{" "}
                                <button
                                    className={authStyle["change"]}
                                    onClick={(e) => changeBtn(e)}>
                                    Sign up
                                </button>
                            </h4>
                        </form>

                        {/* //* ----------------Sign up-----------  */}
                        <form className={authStyle["newuser-container"]}>
                            <h2>Create account</h2>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Username"
                                autoComplete="off"
                            />
                            {errors?.fields?.includes("name") &&
                            isErrorMessageVisable ? (
                                <p className={authStyle["error-message"]}>
                                    {
                                        errors.messages[
                                            errors.fields.indexOf("name")
                                        ]
                                    }
                                </p>
                            ) : (
                                ""
                            )}
                            <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="Email"
                                autoComplete="off"
                            />
                            {errors?.fields?.includes("email") &&
                            isErrorMessageVisable ? (
                                <p className={authStyle["error-message"]}>
                                    {
                                        errors.messages[
                                            errors.fields.indexOf("email")
                                        ]
                                    }
                                </p>
                            ) : (
                                ""
                            )}
                            <div className={authStyle["pwd-contianer"]}>
                                <input
                                    type="password"
                                    name="pass"
                                    id="pwd"
                                    placeholder="Password"
                                    autoComplete="off"
                                />
                                <button onClick={(e) => showPwd(e)}>
                                    <ion-icon name="eye-outline"></ion-icon>
                                </button>
                            </div>
                            {errors?.fields?.includes("password") &&
                            isErrorMessageVisable ? (
                                <p className={authStyle["error-message"]}>
                                    {
                                        errors.messages[
                                            errors.fields.indexOf("password")
                                        ]
                                    }
                                </p>
                            ) : (
                                ""
                            )}
                            <button
                                type="submit"
                                className={authStyle["submit-btn"]}
                                onClick={(e) => formHandler("signup", e)}>
                                Sign up
                            </button>
                            <h4>
                                Already a user?{" "}
                                <button
                                    className={authStyle["change"]}
                                    onClick={(e) => changeBtn(e)}>
                                    Sign in
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

export default UserAuthentication;
