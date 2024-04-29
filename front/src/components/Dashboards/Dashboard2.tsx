import React, { useEffect, useRef, useState } from "react";
const { tableau } = window;

function Dashboard2() {
  const [viz, setViz] = useState(null);
  const ref = useRef(null);
  const dashboard1Url =
    "https://public.tableau.com/views/Book2_17143408106620/Dashboard2?:language=en-GB&publish=yes&:sid=&:display_count=n&:origin=viz_share_link";

  const initViz = () => {
    if (window.tableau && ref.current) {
      if (!viz) {
        const theNewThing = new window.tableau.Viz(ref.current, dashboard1Url, {
          width: "100%",
          height: "100vh",
        });
        setViz(theNewThing);
        console.log("tableau initiialized");
      } else {
        console.log("skipping init, already initialized");
      }
    } else {
      console.error("Tableau is not initialized.");
    }
  };

  useEffect(initViz, []);

  return <div ref={ref} />;
}

export default Dashboard2;
