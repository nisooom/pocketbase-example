"use client";
import React from 'react'

const Page = () => {

    function onButtonClick() {
        window.location.href = '/realtime';
    }

  return (
    <div>
        <h1>Pocketbase Real-time Example</h1>
        <button onClick={onButtonClick}>Go to Real-time Example</button>
    </div>
  )
}

export default Page