"use client";
import React from "react";

const Contact = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  return (
    <section
      id="contact"
      className="max-w-7xl mx-auto border-t border-slate-200 pt-24 grid grid-cols-1 lg:grid-cols-12 gap-12"
    >
      {/* Left Side: Contact Information & FAQ (5 Columns) */}
      <div className="lg:col-span-5 flex flex-col space-y-8">
        <div>
          <span className="text-sm font-semibold tracking-wider uppercase text-blue-600">
            Get in Touch
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
            Let's connect
          </h2>
          <p className="text-slate-600 mt-3">
            Have questions about integrations or enterprise pricing? Drop us a
            line or browse our quick answers.
          </p>
        </div>

        {/* Quick FAQ Toggle Group */}
        <div className="space-y-3">
          {[
            {
              q: "What is your typical turnaround time?",
              a: "We usually respond to all standard inquiries within 12 business hours.",
            },
            {
              q: "Do you offer custom SLA support?",
              a: "Yes, our Enterprise tier includes dedicated 24/7 slack/phone channels.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 bg-white rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 font-medium text-sm flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400">
                  {openFaq === idx ? "−" : "+"}
                </span>
              </button>
              {openFaq === idx && (
                <p className="p-4 pt-0 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Interactive Form Layout (7 Columns) */}
      <div className="lg:col-span-7 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                placeholder="Jane"
                required
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
            >
              Work Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              placeholder="jane@company.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
            >
              Project Details
            </label>
            <textarea
              id="message"
              rows="4"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
              placeholder="Tell us about what you are aiming to build..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
