import Head from "next/head";
import "./_styles/header-style.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <head>
        <meta charset="utf-8" />
        <link rel="icon" href="./DownlistLogoIcon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="check you favourite anime and characters and more"
        />
        <meta
          name="keywords"
          content="uplist , anime , manga , characters , anime characters , myanimelist , animelist , downlist"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="apple-touch-icon" href="./DownlistLogoIcon.png" />

        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />

        <link
          rel="preload preconnect"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap"
          as="style"
          crossorigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=block"
          rel="stylesheet"
          crossorigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=block"
          rel="stylesheet preload preconnect"
        />

        <script
          src="https://kit.fontawesome.com/44a11d6622.js"
          crossorigin="anonymous"
        ></script>
        <script
          src="https://kit.fontawesome.com/44a11d6622.js"
          crossorigin="anonymous"
        ></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/vanta@0.5.21/dist/vanta.waves.min.js"></script>
        <title>Downlist - Home for anime</title>
      </head>
      <Component {...pageProps} />
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
