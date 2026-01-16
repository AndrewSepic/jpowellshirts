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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Powell Shirts
          </h1>
          <p className="text-xl text-gray-600">
            Where Monetary Policy Becomes A Fashion Statement
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Powell Shirts was born from a simple idea: monetary policy doesn't have to be boring. 
              We believe that Federal Reserve enthusiasts, economics students, and finance professionals 
              deserve apparel that celebrates their passion for sound monetary policy and the people who shape it.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our exclusive collection of Jerome Powell themed t-shirts combines quality craftsmanship 
              with designs that resonate with anyone who's ever anxiously awaited a FOMC meeting or 
              debated the merits of quantitative easing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Quality & Sustainability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All our products are produced through Printify's network of premium print partners. 
              This means:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>High-quality, durable prints that last</li>
              <li>Comfortable, premium cotton fabrics</li>
              <li>Made-to-order production (reducing waste)</li>
              <li>Sustainable manufacturing practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Have questions, feedback, or design ideas? We'd love to hear from you. 
              Reach out through our contact page or connect with us on social media.
            </p>
          </section>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-block bg-sky-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors"
          >
            Shop the Collection
          </a>
        </div>
      </div>
    </div>
  );
}
