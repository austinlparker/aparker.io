/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons'
import { isObj, hasProp } from '../../../../util'
import { CID } from 'multiformats/cid'
import * as ComAtprotoRepoStrongRef from '../../../com/atproto/repo/strongRef'

/** The parent comment of a post. */
export interface CommentRef {
  id: ComAtprotoRepoStrongRef.Main
  [k: string]: unknown
}

export function isCommentRef(v: unknown): v is CommentRef {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'io.aparker.blog.defs#commentRef'
  )
}

export function validateCommentRef(v: unknown): ValidationResult {
  return lexicons.validate('io.aparker.blog.defs#commentRef', v)
}
