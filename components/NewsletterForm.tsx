'use client'

import { useRef, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

const NewsletterForm = ({ title = 'Subscribe to the newsletter', apiUrl = '/api/newsletter' }) => {
  const inputEl = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!siteMetadata.newsletter?.enabled) {
      setError(true)
      setMessage('Subscriptions are not yet turned on.')
      return
    }
    const res = await fetch(apiUrl, {
      body: JSON.stringify({ email: inputEl.current?.value }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    const { error: apiError } = await res.json()
    if (apiError) {
      setError(true)
      setMessage('Your e-mail address is invalid or you are already subscribed!')
      return
    }
    if (inputEl.current) inputEl.current.value = ''
    setError(false)
    setSubscribed(true)
  }

  return (
    <div>
      <div className="pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</div>
      <form className="flex flex-col sm:flex-row" onSubmit={subscribe}>
        <div>
          <label htmlFor="email-input">
            <span className="sr-only">Email address</span>
            <input
              autoComplete="email"
              className="focus:ring-primary-600 w-72 rounded-md px-4 focus:border-transparent focus:ring-2 focus:outline-none dark:bg-black"
              id="email-input"
              name="email"
              placeholder={subscribed ? "You're subscribed !  🎉" : 'Enter your email'}
              ref={inputEl}
              required
              type="email"
              disabled={subscribed}
            />
          </label>
        </div>
        <div className="mt-2 flex w-full rounded-md shadow-sm sm:mt-0 sm:ml-3">
          <button
            className={`bg-primary-500 w-full rounded-md px-4 py-2 font-medium text-white sm:py-0 ${subscribed ? 'cursor-default' : 'hover:bg-primary-700 dark:hover:bg-primary-400'} focus:ring-primary-600 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:ring-offset-black`}
            type="submit"
            disabled={subscribed}
          >
            {subscribed ? 'Thank you!' : 'Sign up'}
          </button>
        </div>
      </form>
      {error && (
        <div className="w-72 pt-2 text-sm text-red-500 sm:w-96 dark:text-red-400">{message}</div>
      )}
    </div>
  )
}

export default NewsletterForm
