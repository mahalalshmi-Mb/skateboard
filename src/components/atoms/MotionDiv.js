import React from "react";
import { motion } from "framer-motion";

const MotionDiv = (props) => {
  const variants = {
    slideInRight_slideOutLeft: {
      hidden: {
        opacity: 0,
        x: "-100vw",
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", delay: 0.2 },
      },
      exit: {
        x: "-100vw",
        transition: { ease: "easeInOut" },
      },
    },
    slideInLeft_slideOutRight: {
      hidden: {
        opacity: 0,
        x: "100vw",
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", delay: 0.2 },
      },
      exit: {
        x: "+100%",
        transition: { ease: "easeInOut" },
      },
    },
    slideInRight_slideOutRight: {
      hidden: {
        opacity: 0,
        x: "200vw",
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: { type: "linear", delay: 0.1 },
      },
      exit: {
        x: "200vw",
        transition: { ease: "linear" },
      },
    },
    fadeIn_slideOutLeft: {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: { delay: 1, duration: 1 },
      },
      exit: {
        x: "+100%",
        transition: { ease: "easeInOut" },
      },
    },
    fadeIn_slideOutRight: {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: { delay: 1, duration: 1 },
      },
      exit: {
        x: "-100%",
        transition: { ease: "easeInOut" },
      },
    },
    slideInFromTop: {
      hidden: {
        opacity: 0,
        y: "-100vw",
      },
      visible: {
        opacity: 1,
        y: 0,
      },
      exit: {
        y: "-100vw",
      },
    },
    slideInFromBottom: {
      hidden: {
        opacity: 0,
        y: "200vw",
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: { ease: "easeIn", duration: 2 },
      },
      exit: {
        y: "200vw",
        transition: { ease: "easeOut", duration: 2 },
      },
    },
    scaleToTop: {
      hidden: {
        opacity: 0,
        y: "200vw",
        width: "0%",
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: { ease: "linear", duration: 0.3 },
        width: "100%",
      },
      exit: {
        y: "200vw",
        transition: { ease: "linear", duration: 0.3 },
        width: "0%",
      },
    },
  };

  return (
    <motion.div
      style={{ position: "relative", ...props.style }}
      variants={variants[props.type]}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout={props.layout}
    >
      {props.children}
    </motion.div>
  );
};

export default MotionDiv;
