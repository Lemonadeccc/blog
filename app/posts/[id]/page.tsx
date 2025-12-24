import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import dayjs from "dayjs";
import { MDXContent } from '../../components/mdx-content'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    id: post._raw.flattenedPath,
  }))
}
export const generateMetadata = async ({ params }: Props) => {
  const { id } = await params
  const post = allPosts.find((post) => post._raw.flattenedPath === id)
  if (!post) throw new Error(`Post not found for id: ${id}`)
  return { title: post.title }
}

const Page = async ({ params }: Props) => {
  const { id } = await params
  const post = allPosts.find((post) => post._raw.flattenedPath === id)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-xl py-8 prose prose-slate">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
          {dayjs(post.date).format('DD/MM/YYYY')}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <MDXContent code={post.body.code} />
    </article>
  )
}

export default Page