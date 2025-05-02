import Link from 'next/link';
import { fetchBlogBySlug, fetchBlogs } from '@/lib/strapi';

export async function generateStaticParams() {
  const blogs = await fetchBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white p-6 shadow-md">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Blogs
          </Link>
        </div>
      </header>

      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        <p className="text-gray-600 mb-8">By {blog.author}</p>

        <div className="space-y-8">
          {blog.dynamicZoneContent.map((section, index) => {
            const key = `${blog.id}-${index}`;

            switch (section.__component) {
              case 'blog-content.text':
                return (
                  <p key={key} className="text-lg leading-relaxed text-gray-700 mb-6">
                    {section.text}
                  </p>
                );

              case 'blog-content.heading':
                return (
                  <h2 key={key} className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b pb-2 border-gray-200">
                    {section.title}
                  </h2>
                );

              case 'blog-content.quote':
                return (
                  <blockquote key={key} className="border-l-4 border-blue-600 pl-4 my-8 bg-blue-50 p-4 rounded-lg">
                    <p className="text-lg italic text-gray-800">&quot;{section.text}&quot;</p>
                    {section.author && (
                      <footer className="mt-4 text-gray-600 not-italic">— {section.author}</footer>
                    )}
                  </blockquote>
                );

              default:
                console.error('Unhandled component type:', section.__component);
                return (
                  <div key={key} className="bg-red-100 p-4 rounded-lg">
                    <p className="text-red-700">Unsupported content block</p>
                  </div>
                );
            }
          })}
        </div>
      </main>
    </div>
  );
}