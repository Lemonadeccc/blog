import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import dayjs from "dayjs";
import siteMetadata from '@/data/siteMetadata'
import { Metadata } from 'next';
import { MDXContent } from "@/components/mdx-content";

type Props = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    id: post._raw.flattenedPath,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = allPosts.find((post) => post._raw.flattenedPath === id)
  if (!post) throw new Error(`Post not found for id: ${id}`)

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()

  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      siteName: siteMetadata.title,
      locale: 'zh_CN',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: [siteMetadata.author]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: imageList,
    },
  }
}

const Page = async ({ params }: Props) => {
  const { id } = await params
  const post = allPosts.find((post) => post._raw.flattenedPath === id)
  if (!post) notFound()
  const jsonLd = post.structuredData
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-xl py-8 prose prose-slate dark:prose-invert">
        <div className="mb-8 text-center">
          <time dateTime={post.date} className="mb-1 text-xs text-gray-600 dark:text-white">
            {dayjs(post.date).format('DD/MM/YYYY')}
          </time>
          <h1 className="text-3xl font-bold dark:text-white">{post.title}</h1>
        </div>
        <MDXContent code={post.body.code} />
      </article>
    </>
  )
}

export default Page