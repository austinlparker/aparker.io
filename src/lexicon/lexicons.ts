/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { LexiconDoc, Lexicons } from '@atproto/lexicon'

export const schemaDict = {
  IoAparkerBlogDefs: {
    lexicon: 1,
    id: 'io.aparker.blog.defs',
    defs: {
      commentRef: {
        type: 'object',
        description: 'The parent comment of a post.',
        required: ['id'],
        properties: {
          id: {
            type: 'ref',
            ref: 'lex:com.atproto.repo.strongRef',
          },
        },
      },
    },
  },
  IoAparkerBlogImages: {
    lexicon: 1,
    id: 'io.aparker.blog.images',
    defs: {
      main: {
        type: 'object',
        required: ['images'],
        description: 'A set of images embedded in a blog post.',
        properties: {
          images: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:io.aparker.blog.images#image',
            },
          },
        },
      },
      image: {
        type: 'object',
        required: ['image', 'alt'],
        properties: {
          image: {
            type: 'blob',
            accept: ['image/*'],
            maxSize: 1000000,
          },
          alt: {
            type: 'string',
            description:
              'Alt text description of the image, for accessibility.',
          },
        },
      },
      view: {
        type: 'object',
        required: ['images'],
        properties: {
          images: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:io.aparker.blog.images#viewImage',
            },
          },
        },
      },
      viewImage: {
        type: 'object',
        required: ['thumb', 'fullsize', 'alt'],
        properties: {
          thumb: {
            type: 'string',
            format: 'uri',
            description:
              'Fully-qualified URL where a thumbnail of the image can be fetched. For example, CDN location provided by the App View.',
          },
          fullsize: {
            type: 'string',
            format: 'uri',
            description:
              'Fully-qualified URL where a large version of the image can be fetched. May or may not be the exact original blob. For example, CDN location provided by the App View.',
          },
          alt: {
            type: 'string',
            description:
              'Alt text description of the image, for accessibility.',
          },
        },
      },
    },
  },
  IoAparkerBlogPost: {
    lexicon: 1,
    id: 'io.aparker.blog.post',
    revision: 1,
    defs: {
      main: {
        type: 'record',
        description: 'A single blog post',
        key: 'tid',
        record: {
          type: 'object',
          required: ['title', 'content', 'createdAt'],
          properties: {
            title: {
              type: 'string',
              maxLength: 1000,
              description: 'The title of the blog post.',
            },
            content: {
              type: 'string',
              maxLength: 100000,
              description: 'The content of the blog post.',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
              description:
                'The date and time the blog post was created (user-defined).',
            },
            commentRoot: {
              type: 'ref',
              description: 'The root Bluesky post associated with this post.',
              ref: 'lex:io.aparker.blog.defs#commentRef',
            },
            labels: {
              type: 'union',
              description:
                'Self-label values for this blog post. Effectively content warnings.',
              refs: ['lex:com.atproto.label.defs#selfLabels'],
            },
            tags: {
              type: 'array',
              description: 'Hashtags for this blog post.',
              maxLength: 8,
              items: {
                type: 'string',
                maxLength: 640,
                maxGraphemes: 64,
              },
            },
            embeds: {
              type: 'union',
              description: 'Embedded content for this blog post (images, etc.)',
              refs: ['lex:io.aparker.blog.images#main'],
            },
          },
        },
      },
    },
  },
}
export const schemas: LexiconDoc[] = Object.values(schemaDict) as LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)
export const ids = {
  IoAparkerBlogDefs: 'io.aparker.blog.defs',
  IoAparkerBlogImages: 'io.aparker.blog.images',
  IoAparkerBlogPost: 'io.aparker.blog.post',
}
