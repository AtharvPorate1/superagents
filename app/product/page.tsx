'use client'

import '@/styles/neo-brutalism.css';
import { useState, FormEvent, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Mic } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskDisplay from '@/components/main/taskdisplay'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState<{ tasks: string[], description_to_solve: string[] } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  
  const system_prompt = `You are a superai agent gpt, you use plan and solve approach to solve a problem, you have access
  to several other apps, you can act like getting any info from them like user's gmail, discord or calendar or location
  when asked to do a task you make that as final goal, and then define tasks to reach the goal
  please respond in this json format, 
  {
    tasks: [string],
    description_to_solve:[string]
  }
  In description_to_solve you will map each task to its description on how to perform that, respond like you are doing the action,
  also make up facts, about what you concluded after doing that. use action words like doing,performing,etc .
  `

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setMessage(input)
    setInput('')
    setIsLoading(true)
    setSubmitted(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{role:'system', content : system_prompt },{ role: 'user', content: input }] }),
      })

      if (!res.ok) {
        throw new Error('Failed to fetch response')
      }

      const data = await res.json()
      const parsedResponse = JSON.parse(data.choices[0].message.content)
      setResponse(parsedResponse)
    } catch (error) {
      console.error('Error:', error)
      setResponse(null)
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        await transcribeAudio(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.wav')

    try {
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to transcribe audio')
      }

      const data = await response.json()
      setInput(data.text)
    } catch (error) {
      console.error('Error transcribing audio:', error)
      setInput('Failed to transcribe audio. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-yellow-200 p-8 flex flex-col">
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8" >
              <CardContent className="p-4">
                <p className="font-semibold">Your prompt:</p>
                <p>{message}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-grow flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="p-4">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter your prompt here..."
                      className="flex-grow border-2 border-black rounded-none bg-white"
                    />
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded-none" type="submit" disabled={isLoading || isRecording}>
                      Send
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded-none"
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isLoading}
                      variant={isRecording ? "destructive" : "secondary"}
                    >
                      <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="response"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    </div>
                  ) : response ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h2 className="text-xl font-semibold mb-4">Response:</h2>
                      <TaskDisplay
                        tasks={response.tasks.map((task, index) => ({
                          task,
                          description: response.description_to_solve[index],
                        }))}
                        
                      />
                    </motion.div>
                  ) : (
                    <p>Sorry, I encountered an error. Please try again.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded-none" onClick={() => {
              setSubmitted(false)
              setMessage('')
              setResponse(null)
            }}>
              Ask Another Question
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

