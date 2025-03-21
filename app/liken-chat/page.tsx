'use client'

import React from 'react'
import { Chat } from './chat-package/chat'

export default function LikenChat() {
  return (
    <div className="bg-gray-100 p-4 h-full">
      <div className="mx-auto max-w-7xl bg-white rounded-lg shadow-md h-full p-6">
        <Chat />
      </div>
    </div>
  )
}