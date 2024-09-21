/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons'
import { isObj, hasProp } from '../../../../util'
import { CID } from 'multiformats/cid'
import * as IoAparkerBlogDefs from './defs'
import * as ComAtprotoLabelDefs from '../../../com/atproto/label/defs'
import * as IoAparkerBlogImages from './images'

export interface Record {
  /** The title of the blog post. */
  title: string
  /** The content of the blog post. */
  content: string
  /** The date and time the blog post was created (user-defined). */
  createdAt: string
  commentRoot?: IoAparkerBlogDefs.CommentRef
  labels?:
    | ComAtprotoLabelDefs.SelfLabels
    | { $type: string; [k: string]: unknown }
  /** Hashtags for this blog post. */
  tags?: string[]
  embeds?: IoAparkerBlogImages.Main | { $type: string; [k: string]: unknown }
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'io.aparker.blog.post#main' ||
      v.$type === 'io.aparker.blog.post')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('io.aparker.blog.post#main', v)
}
