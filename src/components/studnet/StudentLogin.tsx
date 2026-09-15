import { FormEvent, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface StudentLoginProps {
	mode?: 'login' | 'register'
}

export default function StudentLogin({ mode = 'login' }: StudentLoginProps) {
	const isRegistering = mode === 'register'
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setMessage('')
		setError('')

		if (!supabase) {
			setError('Supabase is not configured.')
			return
		}

		if (isRegistering && password !== confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		setLoading(true)
		try {
			if (isRegistering) {
				const { data, error: signUpError } = await supabase.auth.signUp({
					email: email.trim().toLowerCase(),
					password,
					options: { data: { full_name: fullName.trim() } },
				})
				if (signUpError || !data.user) throw signUpError || new Error('Could not create account.')

				setMessage(data.session
					? 'Account created successfully. You can now sign in.'
					: 'Account created. Check your email to confirm your account, then sign in.')
			} else {
				const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
				if (signInError) throw signInError
				setMessage('Signed in successfully.')
			}
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : 'Something went wrong.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="min-h-screen bg-neutral-background px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
				<div className="grid w-full overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[0.9fr_1.1fr]">
					<section className="hidden bg-primary-dark-blue p-10 text-white lg:flex lg:flex-col lg:justify-between">
						<a href="/" className="flex items-center gap-3" aria-label="Return to UniRide home">
							<span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-orange text-lg font-extrabold text-primary-dark-blue">U</span>
							<span className="text-xl font-bold">UniRide</span>
						</a>
						<div>
							<p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">Student travel made simple</p>
							<h1 className="max-w-sm text-4xl font-extrabold leading-tight">Your campus ride starts here.</h1>
							<p className="mt-5 max-w-sm text-sm leading-6 text-blue-100">Book rides, manage your balance, and keep your journey moving from one simple place.</p>
						</div>
						<p className="text-xs text-blue-200">Safe, reliable travel for SLIIT students.</p>
					</section>

					<section className="p-6 sm:p-10">
						<div className="mb-8 flex items-center justify-between lg:hidden">
							<a href="/" className="flex items-center gap-2 text-lg font-bold text-primary-blue" aria-label="Return to UniRide home">
								<span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-blue text-sm text-white">U</span>
								UniRide
							</a>
							<span className="text-xs text-neutral-secondary-text">Student portal</span>
						</div>

						<div className="mb-7">
							<p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-blue">Student portal</p>
							<h2 className="text-3xl font-extrabold tracking-tight text-primary-dark-blue">
								{isRegistering ? 'Create your account' : 'Welcome back'}
							</h2>
							<p className="mt-2 text-sm leading-6 text-neutral-secondary-text">
								{isRegistering ? 'Join UniRide and make your daily campus trips easier.' : 'Sign in to manage your rides and student wallet.'}
							</p>
						</div>

						{(message || error) && (
							<div className={`mb-5 rounded-lg border px-4 py-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`} role="status">
								{error || message}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							{isRegistering && (
								<label className="block text-sm font-semibold text-neutral-main-text">
									Full name
									<input required type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" className="mt-2 h-11 w-full rounded-lg border border-neutral-border px-3 font-normal outline-none transition focus:border-primary-blue focus:ring-2 focus:ring-blue-100" />
								</label>
							)}
							<label className="block text-sm font-semibold text-neutral-main-text">
								University email
								<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@university.edu" className="mt-2 h-11 w-full rounded-lg border border-neutral-border px-3 font-normal outline-none transition focus:border-primary-blue focus:ring-2 focus:ring-blue-100" />
							</label>
							<label className="block text-sm font-semibold text-neutral-main-text">
								Password
								<input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="mt-2 h-11 w-full rounded-lg border border-neutral-border px-3 font-normal outline-none transition focus:border-primary-blue focus:ring-2 focus:ring-blue-100" />
							</label>
							{isRegistering && (
								<label className="block text-sm font-semibold text-neutral-main-text">
									Confirm password
									<input required type="password" minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" className="mt-2 h-11 w-full rounded-lg border border-neutral-border px-3 font-normal outline-none transition focus:border-primary-blue focus:ring-2 focus:ring-blue-100" />
								</label>
							)}

							<button type="submit" disabled={loading} className="h-11 w-full rounded-lg bg-primary-blue font-bold text-white transition hover:bg-primary-dark-blue focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
								{loading ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'}
							</button>
						</form>

						<p className="mt-7 text-center text-sm text-neutral-secondary-text">
							{isRegistering ? 'Already have an account?' : 'New to UniRide?'}{' '}
							<a href={isRegistering ? '/student/login' : '/student/register'} className="font-bold text-primary-blue hover:text-primary-dark-blue">
								{isRegistering ? 'Sign in' : 'Create an account'}
							</a>
						</p>
						<a href="/" className="mt-5 block text-center text-xs font-semibold text-neutral-secondary-text hover:text-primary-blue">Back to home</a>
					</section>
				</div>
			</div>
		</main>
	)
}
