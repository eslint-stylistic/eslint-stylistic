import Graphemer from 'graphemer'

let splitter: Graphemer

function isASCII(value: string): boolean {
  return /^[\u0020-\u007F]*$/u.test(value)
}

export function getStringLength(value: string): number {
  if (isASCII(value))
    return value.length

  // @ts-expect-error CJS interop
  splitter ??= new (Graphemer.default || Graphemer)()

  return splitter.countGraphemes(value)
}
