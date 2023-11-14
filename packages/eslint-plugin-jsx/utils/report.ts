/**
 * @deprecated We should move away from this function and use `context.report` directly.
 */
export default function report(context: any, message: string, messageId: string, data: any) {
  context.report(
    Object.assign(
      { messageId },
      data,
    ),
  )
}
