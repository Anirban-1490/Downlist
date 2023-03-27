import Head from "next/head";
import { serverlessPath } from "Serverlesspath";

export function CustomHead({
    description,
    contentTitle,
    contentType,
    url,
    imageUrl,
}) {
    return (
        <Head>
            <meta name="description" content={`${description}`} />
            <title>{contentTitle}</title>
            <meta property="og:title" content={contentTitle} />
            <meta property="og:type" content={contentType || "website"} />
            <meta
                property="og:url"
                content={`${serverlessPath.domain}${url || ""}`}
            />
            <meta
                property="og:image"
                content={imageUrl || "/DownlistLogoNew.svg"}
            />
            <meta property="og:description" content={description} />
        </Head>
    );
}
