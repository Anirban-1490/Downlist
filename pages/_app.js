import Head from "next/head";
import "Style/GlobalStyle/global.scss";
import "pages/_styles/topanimestyle.css";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { ParentNavbar } from "Components/Global/Navbar";
import { ScrollToTop } from "Components/Global/ScrollToTop/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import "react-loading-skeleton/dist/skeleton.css";
import { Footer } from "Components/Global/Footer/footer";
import { WrapperParent } from "Components/Global/Wrapper";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { serverlessPath } from "Serverlesspath";
gsap.registerPlugin(ScrollTrigger);

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [isDividerMount, setDividerMount] = useState(false);

    //* wrap the QueryClient in a useMemo as not doing this
    //* will clear the Queryclient object after the iniital page load
    //* animation
    const client = useMemo(() => new QueryClient(), []);

    nProgress.configure({ showSpinner: false });

    const globalTimeline = gsap.timeline({
        defaults: { duration: 1, ease: "power3.inOut" },
    });

    //* effects to run on a route change
    useEffect(() => {
        const handleStart = () => {
            setDividerMount(false);
            nProgress.start();
        };
        const handleStop = () => {
            nProgress.done();
            globalTimeline.play();
        };

        globalTimeline
            .fromTo(
                ".divider",
                {
                    xPercent: 0,
                },
                {
                    xPercent: -100,
                    stagger: {
                        each: 0.14,
                        from: "random",
                    },
                    delay: 2,
                }
            )
            .set([".outer", ".inner"], {
                overflow: "visible",
                height: "auto",
                delay: 2,
                onComplete: () => {
                    ScrollTrigger.refresh();
                    setDividerMount(true);
                },
            });

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleStop);
        router.events.on("beforeHistoryChange", handleStop);

        () => {
            globalTimeline.kill();
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleStop);
            router.events.off("beforeHistoryChange", handleStop);
        };
    }, [router]);

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" href="/DownlistLogoIcon.png" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0"
                />
                <meta name="theme-color" content="#000000" />

                <meta
                    name="keywords"
                    content="uplist , anime , manga , characters , anime characters , myanimelist , animelist , downlist"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                />
                <link rel="apple-touch-icon" href="./DownlistLogoIcon.png" />

                <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Archivo&display=swap"
                    rel="stylesheet"
                />
                <link
                    rel="preload preconnect"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap"
                    as="style"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=block"
                    rel="stylesheet"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=block"
                    rel="stylesheet preload preconnect"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@900&display=block"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=block"
                    rel="stylesheet"
                />

                <link
                    href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&display=swap"
                    rel="stylesheet"
                />
                <script
                    type="module"
                    src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
                    defer></script>
                <script
                    noModule
                    src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
                    defer></script>
                <script
                    src="https://kit.fontawesome.com/44a11d6622.js"
                    crossOrigin="anonymous"></script>
                <script
                    src="https://kit.fontawesome.com/44a11d6622.js"
                    crossOrigin="anonymous"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/vanta@0.5.21/dist/vanta.waves.min.js"></script>
            </Head>
            <QueryClientProvider client={client}>
                <ReactQueryDevtools />
                <Hydrate state={pageProps.dehydratedState}>
                    <>
                        <WrapperParent isDividerMount={isDividerMount}>
                            <ScrollToTop />
                            <ParentNavbar {...pageProps} />

                            {<Component {...pageProps} />}
                            {Component?.removeFooter || <Footer />}

                            <Analytics />
                        </WrapperParent>
                    </>
                </Hydrate>
            </QueryClientProvider>
        </>
    );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
