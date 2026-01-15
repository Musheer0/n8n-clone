"use client"

import type React from "react"
import { ArrowRight, Zap, Workflow, Code2, Globe, Mail, MessageCircle, Cpu, Webhook, Clock, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 backdrop-blur-md bg-background/80 border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/vercel.svg" alt="n8n-clone" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-bold">n8n-clone</span>
          </div>
          <Link
            href="/login"
            className="px-6 py-2 rounded-lg border  text-primary hover:bg-accent/10 font-medium transition"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl sm:text-7xl font-bold mb-8 leading-tight">
            Automation <span className="text-accent">without the code</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect triggers, executors, and AI models. Build powerful workflows visually. No engineering required.
          </p>

          <div className="mb-12 rounded-xl overflow-hidden border border-border">
            <div className="aspect-video bg-muted/50 flex items-center justify-center">
              <Image
                src="/hero.png"
                alt="Workflow builder interface"
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#demo"
              className="px-8 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition inline-flex items-center justify-center gap-2"
            >
              Start building <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#nodes"
              className="px-8 py-3 rounded-lg border border-border hover:border-accent/50 hover:bg-muted/50 font-medium transition"
            >
              See what's possible
            </Link>
          </div>
        </div>
      </section>

      {/* Supported Nodes */}
      <section id="nodes" className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Available nodes</h2>
            <p className="text-muted-foreground">Everything you need to build workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Triggers */}
            <NodeItem
              icon={<Clock className="w-5 h-5" />}
              name="Manual Trigger"
              description="Trigger a workflow manually"
            />
            <NodeItem
              icon={<Code2 className="w-5 h-5" />}
              name="Google Forms Trigger"
              description="Trigger a workflow through google forms"
            />
            <NodeItem
              icon={<Webhook className="w-5 h-5" />}
              name="Webhook Trigger"
              description="Trigger a workflow by sending a post request to the webhook"
            />
            {/* Executors */}
            <NodeItem
              icon={<Globe className="w-5 h-5" />}
              name="Http Execution"
              description="Execute a http request and use its data across workflows"
            />
            <NodeItem icon={<Mail className="w-5 h-5" />} name="Mail Execution" description="Execute a smtp mail" />
            <NodeItem
              icon={<MessageCircle className="w-5 h-5" />}
              name="Discord"
              description="Send a discord message"
            />
            <NodeItem
              icon={<Cpu className="w-5 h-5" />}
              name="Gemini-Text"
              description="Get a text response from gemini"
            />
            <NodeItem icon={<Cpu className="w-5 h-5" />} name="Groq-Text" description="Get a text response from groq" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How it works</h2>

          <div className="space-y-8">
            <StepCard
              number={1}
              title="Choose a trigger"
              description="Select how your workflow starts. Manually, through Google Forms, or via webhook."
            />
            <StepCard
              number={2}
              title="Add executors"
              description="Connect nodes to send emails, call APIs, post to Discord, or run AI models."
            />
            <StepCard
              number={3}
              title="Build & deploy"
              description="Visualize your workflow and go live instantly. No deployment required."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why n8n-clone</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Workflow className="w-6 h-6" />}
              title="Visual workflows"
              description="See your logic flow. Edit it visually. Deploy instantly."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Lightning fast"
              description="Webhooks execute in milliseconds. Workflows scale automatically."
            />
            <FeatureCard
              icon={<Cpu className="w-6 h-6" />}
              title="AI ready"
              description="Integrate Gemini and Groq. Let AI handle the hard parts."
            />
            <FeatureCard
              icon={<Check className="w-6 h-6" />}
              title="Reliable"
              description="Enterprise-grade execution. Automatic retries. Error handling."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Connect anything"
              description="HTTP calls, webhooks, Discord, email. Mix and match."
            />
            <FeatureCard
              icon={<Code2 className="w-6 h-6" />}
              title="No code"
              description="No JavaScript, no syntax errors, no deployment headaches."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to build?</h2>
          <p className="text-lg text-muted-foreground mb-10">Start automating in minutes. No credit card required.</p>
          <Link
            href="/login"
            className="inline-flex px-8 py-4 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition items-center gap-2"
          >
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 n8n-clone. Automation platform.</p>
        </div>
      </footer>
    </div>
  )
}

function NodeItem({
  icon,
  name,
  description,
}: {
  icon: React.ReactNode
  name: string
  description: string
}) {
  return (
    <div className="p-4 rounded-lg border border-border hover:border-accent/40 hover:bg-muted/50 transition group cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold mb-1">{name}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center font-bold text-accent">
          {number}
        </div>
        {number < 3 && <div className="w-1 h-12 bg-gradient-to-b from-accent/50 to-transparent mt-2" />}
      </div>
      <div className="pt-2">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-xl border border-border hover:border-accent/40 hover:bg-muted/50 transition group">
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 transition">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}
