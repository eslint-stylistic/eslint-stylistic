'use strict'

import getMessageData from './message'

export default function report(context, message, messageId, data) {
  context.report(
    Object.assign(
      getMessageData(messageId, message),
      data,
    ),
  )
}
