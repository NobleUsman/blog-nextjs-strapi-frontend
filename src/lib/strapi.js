export const fetchBlogs = async () => {
  const res = await fetch(`${process.env.STRAPI_URL}/api/blogs`);
  return (await res.json()).data;
};

export const fetchBlogBySlug = async (slug) => {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}&populate=dynamicZoneContent`
  );
  return (await res.json()).data[0];
};

export const fetchHeaderFooter = async () => {
  const [header, footer] = await Promise.all([
    fetch(`${process.env.STRAPI_URL}/api/header`),
    fetch(`${process.env.STRAPI_URL}/api/footer`),
  ]);
  return {
    header: (await header.json()).data,
    footer: (await footer.json()).data,
  };
};