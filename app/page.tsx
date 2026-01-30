'use client'
import { useState } from 'react'

export default function Home() {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const shortenUrl = async () => {
    setError('')
    setShortUrl('')
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/urls`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ longUrl })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setShortUrl(data.shortUrl)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
        <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          URL Shortener
        </h1>

        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={e => setLongUrl(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={shortenUrl}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>

        {shortUrl && (
          <div className="mt-4 p-3 bg-green-100 rounded-md text-center">
            <a
              href={shortUrl}
              target="_blank"
              className="text-green-700 underline break-all"
            >
              {shortUrl}
            </a>
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-600 text-sm text-center">
            {error}
          </p>
        )}
      </div>
    </main>
  )
}