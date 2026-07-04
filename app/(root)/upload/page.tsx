"use client"

import FileInput from '@/components/FileInput'
import FormField from '@/components/FormField'
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from '@/constants'
import { useFileInput } from '@/lib/hooks/useFileInput'
import React, { ChangeEvent, FormEvent, useState } from 'react'

const Page: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public"
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const video = useFileInput(MAX_VIDEO_SIZE)
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      if (!video.file || !thumbnail.file) {
        setError('Please upload video and thumbnail')
        return
      }
      if (!formData.title || !formData.description || !formData.visibility) {
        setError("Please fill in all the details")
        return
      }
    } catch (e) {
      console.log("Error submitting form", e)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className='wrapper upload-page'>
      <h1></h1>
      {error && <div className='error-field'>
        {error}
      </div>}

      <form className='rounded-20 gap-6 w-full flex flex-col shadow-10 px-5 py-7.5' onSubmit={handleSubmit}>
        <FormField
          id="title"
          label="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder={"Enter a clear video title"}
        />
        <FormField
          id="description"
          label="Description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Briefly describe what this video is about"
          as="textarea"
        />

        <FileInput
          id="video"
          label="Video"
          accept="video/*"
          file={video.file}
          previewUrl={video.previewUrl}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          type="video"
        />

        <FileInput
          id="thumbnail"
          label="Thumbnail"
          accept="image/*"
          file={thumbnail.file}
          previewUrl={thumbnail.previewUrl}
          inputRef={thumbnail.inputRef}
          onChange={thumbnail.handleFileChange}
          onReset={thumbnail.resetFile}
          type="image"
        />

        <FormField
          id="visibility"
          label="Visibility"
          value={formData.visibility}
          onChange={handleInputChange}
          as="select"
          options={[
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
          ]}
        />
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  )
}

export default Page