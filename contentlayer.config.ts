import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";
import rehypePrismPlus from "rehype-prism-plus";
import siteMetadata from "@/data/siteMetadata";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    lastmod: { type: "date", required: false },
    description: { type: "string" },
    images: { type: "json" },
    canonicalUrl: { type: "string" },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.description,
        image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/posts/${doc._raw.flattenedPath}`,
      }),
    },
  },
}));

export default makeSource({
  contentDirPath: "app/[lng]/posts",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypePrismPlus as any, { defaultLanguage: "js", ignoreMissing: true }],
    ],
  },
});