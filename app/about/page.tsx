import ContactButton from '@/components/ContactButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Powell Shirts',
  description: 'Learn about Powell Shirts and our mission to celebrate monetary policy through fashion',
};

export default function About() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 font-brand mb-4">
            About J Powell Shirts
          </h1>
          <p className="text-xl text-gray-600">
            Where Monetary Policy Becomes A Fashion Statement (?)
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              J Powell Shirts was born out of a <a className="text-sky-700" target="_blank" href="https://www.federalreserve.gov/newsevents/speech/powell20260111a.htm">statement Federal Reserve Chair Jerome Powell released on January 11, 2026</a>.
              It was a stark reminder that the non-partisan body of economists entrusted with governing monetary policy for all Americans was being pressured and intimidated.
              When a U.S. institution of global standing — built on integrity, discipline, and professional independence — finds itself threatened by the autocratic impulses of a particular administration, how should ordinary people respond?
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              One answer: celebrate the people holding the line. Jerome Hayden Powell — arguably one of the most quietly consequential figures in American civil service — deserved recognition
              for his steadfast commitment to serve all Americans and shepherd an economy free from short-term political interference. And if that recognition happens to come on a t-shirt, all the better.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Maybe monetary policy doesn&apos;t have to be boring.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you are a Federal Reserve enthusiast, economics student, or finance professional — you deserve apparel that celebrates your passion for sound monetary policy and the people who shape it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Quality & Sustainability: Made in America
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All our products are produced through Printify's network of premium U.S. based print partners. 
              This means:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
			  <li>You're buying garments made by U.S. companies</li>
			  <li>Your product is produced/printed in the U.S.</li>
              <li>High-quality, durable prints that last</li>
              <li>Comfortable, premium cotton fabrics</li>
              <li>Made-to-order production (reducing waste)</li>
              <li>Sustainable manufacturing practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Why Jerome Powell?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              As Chair of the Federal Reserve, Jerome Powell has become one of the most influential 
              figures in global economics. Whether you admire his steady hand during economic uncertainty, 
              follow his every word during press conferences, or simply appreciate the memes, 
              our collection lets you wear your Fed fandom proudly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Have questions, feedback, or design ideas? We&apos;d love to hear from you.
            </p>
            <ContactButton />
          </section>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-block bg-sky-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors"
          >
            Shop the Collection
          </a>
        </div>
      </div>
    </div>
  );
}
