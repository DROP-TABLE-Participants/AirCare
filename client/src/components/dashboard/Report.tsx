"use client";

import { InformationCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

export default function Report() {
  return (
    <section className="bg-gray-50 py-12">
    <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
      {}
      <InformationCircleIcon className="h-12 w-12 text-blue-500 mb-4" />

      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Summary Condition Report
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl">
        Contrary to popular belief, Lorem Ipsum is not simply random text. 
        It has roots in a piece of classical Latin literature from 45 BC, 
        making it over 2000 years old. Richa
      </p>
    </div>
  </section>
  );
}