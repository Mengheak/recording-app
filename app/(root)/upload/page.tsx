"use client"

import FileInput from '@/components/FileInput'
import FormField from '@/components/FormField'
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from '@/constants'
import { getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails } from '@/lib/actions/video'
import { useFileInput } from '@/lib/hooks/useFileInput'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

const uploadFileToBunny = (file: File, uploadUrl: string, accessKey: string): Promise<void> => {
  return fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      AccessKey: accessKey
    },
    body: file
  }).then((response) => {
    if (!response.ok) throw new Error("Upload failed")
  })
}

const Page: React.FC = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public"
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const video = useFileInput(MAX_VIDEO_SIZE)
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE)
  const [videoDuration, setVideoDuration] = useState(0)


  useEffect(() => {
    const checkForRecordedVideo = async () => {
      try {
        const stored = sessionStorage.getItem("recordedVideo");
        if (!stored) return;

        const { url, name, type, duration } = JSON.parse(stored);
        const blob = await fetch(url).then((res) => res.blob());
        const file = new File([blob], name, { type, lastModified: Date.now() });

        if (video.inputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          video.inputRef.current.files = dataTransfer.files;

          const event = new Event("change", { bubbles: true });
          video.inputRef.current.dispatchEvent(event);

          video.handleFileChange({
            target: { files: dataTransfer.files },
          } as ChangeEvent<HTMLInputElement>);
        }

        if (duration) setVideoDuration(duration);

        sessionStorage.removeItem("recordedVideo");
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error loading recorded video:", err);
      }
    };

    checkForRecordedVideo();
  }, [video]);

  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }
  const handleSubmit = async (e: FormEvent) => {
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

      const {
        videoId,
        uploadUrl: videoUploadUrl,
        accessKey: videoAccessKey
      } = await getVideoUploadUrl()

      if (!videoUploadUrl || !videoAccessKey) {
        throw new Error("Failed to get video upload credentials")
      }

      await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey)


      const {
        uploadUrl: thumbnailUploadUrl,
        accessKey: thumbnailAccessKey,
        cdnUrl: thumbnailCdnUrl
      } = await getThumbnailUploadUrl(videoId)


      if (!thumbnailUploadUrl || !thumbnailAccessKey || !thumbnailCdnUrl) {
        throw new Error("Failed to get thumbnail upload credentials")
      }


      await uploadFileToBunny(thumbnail.file, thumbnailUploadUrl, thumbnailAccessKey)


      await saveVideoDetails({
        videoId,
        thumbnailUrl: thumbnailCdnUrl,
        ...formData,
        duration: videoDuration
      })

      router.push(`/  `)
    } catch (e) {
      console.log("Error submitting form", e)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className='wrapper-md upload-page'>
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