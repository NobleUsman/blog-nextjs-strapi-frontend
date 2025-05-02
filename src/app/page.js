import { fetchBlogs, fetchHeaderFooter } from '@/lib/strapi';

export default async function Home() {
  const { header, footer } = await fetchHeaderFooter();
  const blogs = await fetchBlogs();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white p-6 shadow-md">
        <h1 className="text-2xl font-bold max-w-3xl mx-auto">{header?.LogoText}</h1>
      </header>

      <main className="p-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Latest Blogs</h2>
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <a
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h3>
              <p className="text-gray-600">By {blog.author}</p>
            </a>
          ))}
        </div>
      </main>

      <footer className="bg-blue-800 text-white mt-12 py-6">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gray-200">{footer?.copyrightText}</p>
        </div>
      </footer>
    </div>
  );
}