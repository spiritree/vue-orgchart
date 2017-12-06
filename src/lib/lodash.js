import merge from 'lodash-es/merge'

export const mergeOptions = (obj, src) => {
  return merge(obj, src)
}
