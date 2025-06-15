"use client"

import { useState } from "react"
import { HeartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface SimpleLoginProps {
  onLogin: () => void
}

export function SimpleLogin({ onLogin }: SimpleLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Hardcoded credentials
    if (username === "admin" && password === "admin") {
      onLogin()
      setError("")
    } else {
      setError("Forkert brugernavn eller kode")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <HeartIcon className="h-6 w-6 text-rose-400 mr-2" />
            <CardTitle className="text-2xl font-serif text-gray-800">
              Renas & Ayse
            </CardTitle>
            <HeartIcon className="h-6 w-6 text-rose-400 ml-2" />
          </div>
          <CardDescription>Log ind for at se bryllupsgalleriet</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Brugernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Kode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600"
            >
              Log ind
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
