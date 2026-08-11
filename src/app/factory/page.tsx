"use client";

import React from "react";

import EnsureChain from "@/components/EnsureChain";

import ChildrenForm from "./components/ChildrenForm";
import DeploySection from "./components/DeploySection";
import Header from "./components/Header";
import ParentForm from "./components/ParentForm";

export default function FactoryPage() {
  return (
    <div className="w-full px-4 py-12 md:px-8 lg:px-32">
      <div className="mx-auto flex max-w-294 flex-col gap-6">
        <Header />
        <EnsureChain>
          <ParentForm />
          <ChildrenForm />
          <DeploySection />
        </EnsureChain>
      </div>
    </div>
  );
}
