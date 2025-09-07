import React from "react";
import { FaArrowUpLong } from "react-icons/fa6";

function About() {
  return (
    <div
      data-scroll
      data-scroll-section
      data-scroll-speed="0.01"
      className="w-full bg-[#1d1f1e] rounded-t-3xl py-10 sm:py-20"
    >
      <div className="container w-full">
        <h1 className="sm:text-3xl text-xl sm:leading-normal font-medium mb-10 border-b-[1px] border-zinc-700 pb-10">
          The Quantitative Club at IIT Kharagpur is a premier student organization dedicated to fostering excellence in quantitative finance, data science, and financial modeling through hands-on projects, competitions, and industry collaborations.
        </h1>
        <div className="md:flex justify-center gap-10">
          <div className="about-text h-fit">
            <h1 className="text-4xl mb-4">Our Mission:</h1>
            <p className="text-base sm:text-xl text-zinc-200 tracking-wide">
              We bridge the gap between theoretical knowledge and practical application in quantitative finance. Through workshops, hackathons, case studies, and industry partnerships, we prepare students for careers in investment banking, hedge funds, fintech, and quantitative research.
            </p>
            <div className="rounded-full flex gap-2 justify-center mt-4 w-fit bg-[#004D43] text-zinc-100 px-10 py-3 text-sm tracking-wider uppercase">
              Learn More
              <FaArrowUpLong className="rotate-45 origin-center translate-y-[2px]" />
            </div>
          </div>
          <img
            className="w-full rounded-3xl mt-10 md:w-[40vw] md:mt-0"
            src="https://ochi.design/wp-content/uploads/2022/05/Homepage-Photo-663x469.jpg"
            alt="about us"
          />
        </div>
      </div>
    </div>
  );
}

export default About;
