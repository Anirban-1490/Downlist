import { useRef, useEffect } from "react";

import ranmdomTextStyle from "Components/Home/Style/RandomizedText.module.scss";

export function HomeHeader() {
  const textContainerRef = useRef();
  const childNodesOfTextContainer = textContainerRef.current?.childNodes;
  let colors = [
    "lightgreen",
    "#FFD700",
    "#FF6103",
    "#ADD8E6",
    "#D4C2B0",
    "#D15D84",
  ];

  useEffect(() => {
    let activeChildrensIndex = [];

    let allChildrens = [];
    childNodesOfTextContainer?.forEach((node, index) => {
      if (node.nodeName === "H1") {
        allChildrens = [...allChildrens, ...node.children];
      }
    });
    // *maybe a external package will be more appearant in this case , but this will do the job

    function getRandomChildrens(limit) {
      let i = 0;

      while (i < limit) {
        const randomChildIndex = pickARndomChildrenIndex(
          activeChildrensIndex,
          allChildrens.length
        );

        const randomChild = allChildrens[randomChildIndex];
        const randomColorIndex = Math.floor(Math.random() * 10) % colors.length;

        randomChild.style.color = `${colors[randomColorIndex]}`;
        activeChildrensIndex.push(randomChildIndex);
        i++;
      }
    }

    function pickARndomChildrenIndex(activeChildrensIndex, totalChildrens) {
      const randomIndex = Math.floor(Math.random() * 100) % totalChildrens;

      return activeChildrensIndex.includes(randomIndex)
        ? pickARndomChildrenIndex(activeChildrensIndex, totalChildrens)
        : randomIndex;
    }

    const interId = setInterval(() => {
      //* remove the styles for activated childrens
      allChildrens.forEach((childNode, index) => {
        if (activeChildrensIndex.includes(index)) {
          childNode.style.color = "#ffffffe1";
        }
      });

      //* clear all the array
      activeChildrensIndex.length = 0;

      const getARandomLimit =
        (Math.floor(Math.random() * 10) % (allChildrens.length - 5)) + 1;

      getRandomChildrens(getARandomLimit);
    }, 1450);

    return () => clearInterval(interId);
  });

  return (
    <>
      <section className={ranmdomTextStyle["home-section-1"]}>
        <div
          className={ranmdomTextStyle["main-text-container"]}
          ref={textContainerRef}
        >
          <h1>
            <span>y</span>
            <span>o</span>
            <span>u</span>
            <span>r</span>
          </h1>
          <h1>
            <span>o</span>
            <span>w</span>
            <span>n</span>
          </h1>
          <h1>
            <span>w</span>
            <span>o</span>
            <span>r</span>
            <span>l</span>
            <span>d</span>
          </h1>
          <p>
            Explore a vast list of Anime and Characters. Comes with full details
            on them.
          </p>
        </div>
      </section>
    </>
  );
}
