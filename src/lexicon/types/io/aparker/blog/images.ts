/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons'
import { isObj, hasProp } from '../../../../util'
import { CID } from 'multiformats/cid'

/** A set of images embedded in a blog post. */
export interface Main {
  images: Image[]
  [k: string]: unknown
}

export function isMain(v: unknown): v is Main {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'io.aparker.blog.images#main' ||
      v.$type === 'io.aparker.blog.images')
  )
}

export function validateMain(v: unknown): ValidationResult {
  return lexicons.validate('io.aparker.blog.images#main', v)
}

export interface Image {
  image: BlobRef
  /** Alt text description of the image, for accessibility. */
  alt: string
  [k: string]: unknown
}

export function isImage(v: unknown): v is Image {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'io.aparker.blog.images#image'
  )
}

export function validateImage(v: unknown): ValidationResult {
  return lexicons.validate('io.aparker.blog.images#image', v)
}

export interface View {
  images: ViewImage[]
  [k: string]: unknown
}

export function isView(v: unknown): v is View {
  return (
    isObj(v) && hasProp(v, '$type') && v.$type === 'io.aparker.blog.images#view'
  )
}

export function validateView(v: unknown): ValidationResult {
  return lexicons.validate('io.aparker.blog.images#view', v)
}

export interface ViewImage {
  /** Fully-qualified URL where a thumbnail of the image can be fetched. For example, CDN location provided by the App View. */
  thumb: string
  /** Fully-qualified URL where a large version of the image can be fetched. May or may not be the exact original blob. For example, CDN location provided by the App View. */
  fullsize: string
  /** Alt text description of the image, for accessibility. */
  alt: string
  [k: string]: unknown
}

export function isViewImage(v: unknown): v is ViewImage {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'io.aparker.blog.images#viewImage'
  )
}

export function validateViewImage(v: unknown): ValidationResult {
  return lexicons.validate('io.aparker.blog.images#viewImage', v)
}
