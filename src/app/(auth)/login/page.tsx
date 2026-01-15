"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GithubIcon } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGithubLogin = async () => {
    setIsLoading(true)
   authClient.signIn.social({provider:"github",})
  }

  return (
    <div className="min-h-screen w-full bg-background overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-background relative overflow-hidden p-12">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center space-y-8">
            {/* Logo/Branding */}
            <div className="inline-flex items-center justify-center gap-2 mb-8">
              <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M12 2L22 7L22 17L12 22L2 17L2 7Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12V22M12 12L2 7M12 12L22 7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">N8N</h1>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground text-balance">
                Automate{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                  Everything
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Connect your tools, automate workflows, and focus on what matters most. Enterprise automation made
                simple.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-3 pt-8">
              {[
                { icon: "⚡", text: "Lightning-fast automation" },
                { icon: "🔗", text: "2000+ app integrations" },
                { icon: "🛡️", text: "Enterprise security" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-12">
              {[
                { number: "50K+", label: "Teams" },
                { number: "1M+", label: "Workflows" },
                { number: "99.9%", label: "Uptime" },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-xl font-black text-primary">{stat.number}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-10">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-foreground">Welcome back</h2>
              <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
            </div>

          

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-background text-muted-foreground font-medium">continue with</span>
              </div>
            </div>

            {/* GitHub Login */}
            <Button
              onClick={handleGithubLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full h-11 border border-border bg-card hover:bg-muted text-foreground font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <GithubIcon className="w-4 h-4" />
              GitHub
            </Button>

          </div>
        </div>
      </div>
    </div>
  )
}
