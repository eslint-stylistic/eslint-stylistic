/**
 * @deprecated We should move away from this function and use `context.report` directly.
 */
export default function report(context, message, messageId, data) {
  context.report(
    Object.assign(
      { messageId },
      data,
    ),
  )
}
