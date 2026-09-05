import React from "react";

const page = () => {
  console.log("hello from server component");

  return (
    <section
      id="about"
      className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-10"
    >
      {/* Left Side: Visual Representation */}
      <div className="grid grid-cols-2 gap-4 relative">
        <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl h-48 sm:h-64 shadow-md"></div>
        <div className="bg-slate-200 rounded-2xl h-48 sm:h-64 shadow-md overflow-hidden flex items-center justify-center text-slate-400 font-medium">
          Image Placeholder
        </div>
        <div className="bg-slate-900 rounded-2xl h-48 sm:h-64 shadow-xl col-span-2 p-6 flex flex-col justify-end text-white">
          <span className="text-3xl font-bold tracking-tight">99.9%</span>
          <span className="text-slate-400 text-sm">Platform Uptime SLA</span>
        </div>
      </div>

      {/* Right Side: Text Narrative */}
      <div className="flex flex-col space-y-6">
        <span className="text-sm font-semibold tracking-wider uppercase text-blue-600">
          Our Story
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          We build digital foundations that scale with your growth
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Founded with a vision to simplify complex software infrastructure, our
          team combines clean design principles with high-performance execution.
          We focus on modern engineering so you can focus on your users.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <h4 className="font-bold text-slate-950 text-lg">Global Reach</h4>
            <p className="text-sm text-slate-500">
              Serving thousands of active global builders weekly.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-950 text-lg">Open Source</h4>
            <p className="text-sm text-slate-500">
              Deeply committed to extensible, open architectures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
