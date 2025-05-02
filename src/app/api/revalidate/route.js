import { revalidatePath } from 'next/cache';

// Sample Request Body
// {
//   event: 'entry.update',
//   createdAt: '2025-05-02T01:26:26.303Z',
//   model: 'blog',
//   uid: 'api::blog.blog',
//   entry: {
//     id: 8,
//     documentId: 'wxgxhws85fp6o1k60kqcqb7v',
//     title: 'Balance in Tech 1',
//     slug: 'balance-in-tech',
//     author: 'Alex Johnson',
//     createdAt: '2025-05-01T23:23:46.918Z',
//     updatedAt: '2025-05-02T01:26:26.283Z',
//     publishedAt: null,
//     dynamicZoneContent: [ [Object], [Object], [Object] ]
//   }

const modelToPageMap = {
  'blog': '/', // Map to homepage for blog list updates
};

export async function POST(request) {
  const secret = request.headers.get('x-strapi-secret');
  const body = await request.json();

  // Validate secret first
  if (secret !== process.env.WEBHOOK_SECRET) {
    return new Response('Invalid secret', { status: 401 });
  }

  try {
    const { event, model, entry } = body;
    
    // Always revalidate the specific blog post
    if (model === 'blog' && entry?.slug) {
      revalidatePath(`/blog/${entry.slug}`);
    }

    // Revalidate mapped paths for collection updates
    if (modelToPageMap[model]) {
      revalidatePath(modelToPageMap[model]);
    }

    return Response.json({ 
      revalidated: true,
      event,
      paths: [
        modelToPageMap[model],
        ...(entry?.slug ? [`/blog/${entry.slug}`] : [])
      ].filter(Boolean)
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return Response.json(
      { error: 'Error revalidating content' },
      { status: 500 }
    );
  }
}