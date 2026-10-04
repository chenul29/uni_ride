import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type StudentProfileRecord = {
  id: string
  full_name: string
  email: string
  photo_url: string | null
  created_at: string
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfileRecord | null>(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      if (!supabase) {
        setError('Supabase is not configured.')
        setLoading(false)
        return
      }

      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData.user) {
        window.location.replace('/student/login')
        return
      }

      const { data, error: profileError } = await supabase
        .from('students')
        .select('id, full_name, email, photo_url, created_at')
        .eq('auth_user_id', authData.user.id)
        .maybeSingle()

      if (!active) return
      if (profileError) {
        setError(profileError.message)
      } else if (!data) {
        setError('Student profile could not be found for this account.')
      } else {
        const student = data as StudentProfileRecord
        setProfile(student)
        setFullName(student.full_name)
        setAvatarUrl(student.photo_url || '')
      }
      setLoading(false)
    }

    void loadProfile()
    return () => { active = false }
  }, [])

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setProfileMessage('')
    const normalizedName = fullName.trim()
    if (normalizedName.length < 2 || !profile || !supabase) {
      setError('Enter a name with at least two characters.')
      return
    }

    setSavingProfile(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData.user) {
        throw authError || new Error('Please sign in again to update your profile.')
      }

      const { data, error: updateError } = await supabase
        .from('students')
        .update({ full_name: normalizedName })
        .eq('auth_user_id', authData.user.id)
        .select('id, full_name, email, photo_url, created_at')
        .maybeSingle()
      if (updateError) throw updateError
      if (!data) {
        throw new Error('No student row was updated. Run supabase/student_profile_setup.sql in the Supabase SQL Editor, then try again.')
      }

      const savedProfile = data as StudentProfileRecord
      setProfile(savedProfile)
      setFullName(savedProfile.full_name)

      const { error: metadataError } = await supabase.auth.updateUser({ data: { full_name: savedProfile.full_name } })
      setProfileMessage(metadataError
        ? 'Name saved to the student database. The account display name could not be synced: ' + metadataError.message
        : 'Name updated in your student profile and account.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save your name. Please try again.')
    } finally {
      setSavingProfile(false)
    }
  }

  const uploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    setError('')
    setProfileMessage('')
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('Choose an image smaller than 3 MB.')
      return
    }
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }

    setUploadingPhoto(true)
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData.user) {
      setUploadingPhoto(false)
      setError(authError?.message || 'Please sign in again to upload a photo.')
      return
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const photoPath = `${authData.user.id}/profile.${extension}`
    const { error: uploadError } = await supabase.storage
      .from('student-profile-photos')
      .upload(photoPath, file, { upsert: true, contentType: file.type, cacheControl: '3600' })
    if (uploadError) {
      setUploadingPhoto(false)
      const message = uploadError.message.toLowerCase()
      setError(message.includes('bucket') || message.includes('row-level security') || message.includes('permission')
        ? `Photo storage is not configured or permission was denied. Run supabase/student_profile_setup.sql in the Supabase SQL Editor. Details: ${uploadError.message}`
        : uploadError.message)
      return
    }

    const { data: publicUrlData } = supabase.storage.from('student-profile-photos').getPublicUrl(photoPath)
    const nextAvatarUrl = `${publicUrlData.publicUrl}?updated=${Date.now()}`
    const { data: updatedProfile, error: profileError } = await supabase
      .from('students')
      .update({ photo_url: nextAvatarUrl })
      .eq('auth_user_id', authData.user.id)
      .select('id, full_name, email, photo_url, created_at')
      .maybeSingle()
    setUploadingPhoto(false)
    if (profileError || !updatedProfile) {
      setError(profileError?.message || 'The photo uploaded, but its URL could not be saved to your student record. Run supabase/student_profile_setup.sql in Supabase.')
      return
    }
    setProfile(updatedProfile as StudentProfileRecord)
    setAvatarUrl(nextAvatarUrl)
    setProfileMessage('Profile photo updated.')
  }

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setPasswordMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)
    const newPassword = String(formData.get('newPassword') || '')
    const confirmPassword = String(formData.get('confirmPassword') || '')
    if (newPassword.length < 8) {
      setError('Your new password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.')
      return
    }
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }

    setSavingPassword(true)
    try {
      const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword })
      if (passwordError) {
        const message = passwordError.message.toLowerCase()
        setError(message.includes('same_password') || message.includes('different from the old password')
          ? 'Supabase rejected this password as one you have used before. Choose a password you have never used on this account.'
          : passwordError.message)
        return
      }
      form.reset()
      setPasswordMessage('Password changed successfully.')
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : 'Could not change the password. Please try again.')
    } finally {
      setSavingPassword(false)
    }
  }

  const initials = (profile?.full_name || 'Student').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  return (
    <main className="min-h-screen bg-neutral-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary-blue hover:text-primary-dark-blue">← UniRide dashboard</a>
        <header className="mt-7 border-b border-neutral-border pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-blue">Student account</p>
          <h1 className="mt-2 text-3xl font-extrabold text-primary-dark-blue">Your profile</h1>
          <p className="mt-2 text-sm text-neutral-secondary-text">Manage your personal details and account security.</p>
        </header>

        {loading ? <p className="py-10 text-sm text-neutral-secondary-text">Loading profile...</p> : !profile ? <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error || 'Profile unavailable.'}</p> : (
          <div className="grid gap-8 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                {avatarUrl ? <img src={avatarUrl} alt={`${profile.full_name} profile`} className="h-24 w-24 rounded-full border border-neutral-border object-cover" /> : <div className="grid h-24 w-24 place-items-center rounded-full bg-blue-100 text-2xl font-bold text-primary-dark-blue" aria-label="No profile photo">{initials}</div>}
                <div>
                  <h2 className="text-lg font-bold text-primary-dark-blue">{profile.full_name}</h2>
                  <p className="mt-1 text-sm text-neutral-secondary-text">Student account</p>
                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md border border-primary-blue px-3 py-2 text-xs font-bold text-primary-blue hover:bg-blue-50">
                    {uploadingPhoto ? 'Uploading...' : 'Change photo'}
                    <input type="file" accept="image/*" className="sr-only" onChange={uploadPhoto} disabled={uploadingPhoto} />
                  </label>
                </div>
              </div>

              <dl className="divide-y divide-neutral-border border-y border-neutral-border">
                <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-neutral-secondary-text">Student ID</dt><dd className="break-all text-right font-semibold text-neutral-main-text">{profile.id}</dd></div>
                <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-neutral-secondary-text">Email</dt><dd className="break-all text-right font-semibold text-neutral-main-text">{profile.email}</dd></div>
                <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-neutral-secondary-text">Member since</dt><dd className="text-right font-semibold text-neutral-main-text">{new Date(profile.created_at).toLocaleDateString()}</dd></div>
              </dl>
            </section>

            <div className="space-y-8">
              <form onSubmit={saveProfile} className="space-y-4">
                <div><h2 className="text-lg font-bold text-primary-dark-blue">Personal details</h2><p className="mt-1 text-sm text-neutral-secondary-text">Update the name shown on your account.</p></div>
                <label className="block text-sm font-semibold text-neutral-main-text">Full name<input required minLength={2} maxLength={100} value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-neutral-border bg-white px-3 font-normal outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100" /></label>
                <button type="submit" disabled={savingProfile || fullName.trim() === profile.full_name} className="rounded-md bg-primary-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-dark-blue disabled:cursor-not-allowed disabled:opacity-50">{savingProfile ? 'Saving...' : 'Save profile'}</button>
                {profileMessage && <p className="text-sm text-green-800" role="status">{profileMessage}</p>}
                {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
              </form>

              <form onSubmit={changePassword} className="space-y-4 border-t border-neutral-border pt-7">
                <div><h2 className="text-lg font-bold text-primary-dark-blue">Change password</h2><p className="mt-1 text-sm text-neutral-secondary-text">Choose a new password with at least 8 characters.</p></div>
                <label className="block text-sm font-semibold text-neutral-main-text">New password<input name="newPassword" required type="password" minLength={8} autoComplete="new-password" className="mt-2 h-11 w-full rounded-lg border border-neutral-border bg-white px-3 font-normal outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100" /></label>
                <label className="block text-sm font-semibold text-neutral-main-text">Confirm new password<input name="confirmPassword" required type="password" minLength={8} autoComplete="new-password" className="mt-2 h-11 w-full rounded-lg border border-neutral-border bg-white px-3 font-normal outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100" /></label>
                <button type="submit" disabled={savingPassword} className="rounded-md border border-primary-blue px-4 py-2.5 text-sm font-bold text-primary-blue hover:bg-blue-50 disabled:cursor-wait disabled:opacity-50">{savingPassword ? 'Updating...' : 'Update password'}</button>
              </form>
            </div>
          </div>
        )}
        {error && profile && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        {(profileMessage || passwordMessage) && <p className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800" role="status">{passwordMessage || profileMessage}</p>}
      </div>
    </main>
  )
}