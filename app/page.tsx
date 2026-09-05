import React from "react";

const page = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 px-4 py-12 md:py-24 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 max-w-xl">
            <span className="text-sm font-semibold tracking-wider uppercase text-indigo-600">
              New Launch
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
              Build your next idea{" "}
              <span className="text-indigo-600">incredibly fast</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              This is a production-ready main layout section structured with
              semantic HTML tags and responsive utilities. Fully optimized for
              mobile, tablet, and desktop views.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200">
                Get Started
              </button>
              <button className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-200 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>

          {/* Visual Placeholder */}
          <div className="w-full h-64 sm:h-96 bg-linear-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center">
            <span className="text-white/80 font-medium text-lg">
              Main Feature Visual
            </span>
          </div>
        </section>

        {/* Feature Grid Segment */}
        <section className="border-t border-slate-200 pt-16">
          <h2 className="text-2xl font-bold mb-8 text-slate-800">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm"
              >
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold mb-4">
                  0{item}
                </div>
                <h3 className="text-lg font-semibold mb-2">Feature Block</h3>
                <p className="text-slate-600 text-sm">
                  Add key value propositions or metrics right here.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8 text-slate-800">
            About Section
          </h2>
          {/* Left Side: Visual Representation */}
          <div className="grid grid-cols-2 gap-4 relative mb-10">
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl h-48 sm:h-64 shadow-md"></div>
            <div className="bg-slate-200 rounded-2xl h-48 sm:h-64 shadow-md overflow-hidden flex items-center justify-center text-slate-400 font-medium">
              Image Placeholder
            </div>
            <div className="bg-slate-900 rounded-2xl h-48 sm:h-64 shadow-xl col-span-2 p-6 flex flex-col justify-end text-white">
              <span className="text-3xl font-bold tracking-tight">99.9%</span>
              <span className="text-slate-400 text-sm">
                Platform Uptime SLA
              </span>
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
              Founded with a vision to simplify complex software infrastructure,
              our team combines clean design principles with high-performance
              execution. We focus on modern engineering so you can focus on your
              users.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <h4 className="font-bold text-slate-950 text-lg">
                  Global Reach
                </h4>
                <p className="text-sm text-slate-500">
                  Serving thousands of active global builders weekly.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-950 text-lg">
                  Open Source
                </h4>
                <p className="text-sm text-slate-500">
                  Deeply committed to extensible, open architectures.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default page;
