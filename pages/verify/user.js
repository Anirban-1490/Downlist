import { useRouter } from "next/router";
import { useEffect } from "react";

const verifyUsers = ({ hasTokenSet }) => {
  const router = useRouter();

  useEffect(() => {
    if (hasTokenSet) {
      router.replace("/");
    }
  }, []);

  return (
    <>
      <h1 style={{ color: "white" }}>Done</h1>
    </>
  );
};

export async function getServerSideProps({ params, query }) {
  const { utoken } = query;

  process.env.UTOKEN = utoken;

  return {
    props: {
      hasTokenSet: true,
    },
  };
}

export default verifyUsers;
