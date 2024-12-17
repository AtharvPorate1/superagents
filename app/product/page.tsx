'use client'

import '@/styles/neo-brutalism.css';
import { useState, FormEvent, useRef, useEffect, ChangeEvent } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Mic, ImageIcon } from 'lucide-react'
import { Message, AgentResponse, AgentType } from '@/types/agents'
import { useChatStore } from '@/store/chatStore'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const agentImages: Record<AgentType, string> = {
  superagent: 'https://placehold.co/100x100/4a90e2/ffffff?text=SA',
  trading: 'https://placehold.co/100x100/f39c12/ffffff?text=TA',
  travel: 'https://placehold.co/100x100/2ecc71/ffffff?text=TR',
  healthcare: 'https://placehold.co/100x100/e74c3c/ffffff?text=HC',
  nft: 'https://placehold.co/100x100/9b59b6/ffffff?text=NFT',
  personal: 'https://placehold.co/100x100/3498db/ffffff?text=PA',
  vision: 'https://placehold.co/100x100/8e44ad/ffffff?text=VI'
};

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<AgentType>('superagent')
  const [showChat, setShowChat] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'uploaded'>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { messages, addMessage } = useChatStore()

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const uploadToBlob = async (file: File): Promise<string> => {
    const filename = encodeURIComponent(file.name);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/api/blob-storage?filename=${filename}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to blob storage');
    }

    const blob = await response.json();
    return blob.url;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    setShowChat(true)
    const userMessage: Message = { 
      role: 'user', 
      content: selectedImage ? `[Image uploaded] ${input}` : input
    }
    addMessage(userMessage)
    setInput('')
    setIsLoading(true)
    setCurrentAgent(selectedImage ? 'vision' : 'superagent')

    try {
      const apiRoute = selectedImage ? '/api/vision' : '/api/superagent';
      const body = selectedImage
        ? { imageUrl }
        : { messages: [...messages, userMessage] };

      console.log('Sending request to:', apiRoute);
      console.log('Request body:', JSON.stringify(body));

      const res = await fetch(apiRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API request failed: ${res.status} ${res.statusText}\n${errorText}`);
      }

      const data: AgentResponse = await res.json()
      console.log('API response:', data);

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content), 
        agent: data.agent 
      }
      addMessage(assistantMessage)
      setCurrentAgent(data.agent as AgentType)
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      addMessage({ 
        role: 'assistant', 
        content: `Sorry, I encountered an error. Please try again. Error details: ${error instanceof Error ? error.message : String(error)}` 
      })
      setCurrentAgent('superagent')
    } finally {
      setIsLoading(false)
      setSelectedImage(null)
      setImageUrl(null)
    }
  }

  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setUploadStatus('uploading');
      try {
        const blobUrl = await uploadToBlob(file);
        setImageUrl(blobUrl);
        setUploadStatus('uploaded');
      } catch (error) {
        console.error('Error uploading image to blob storage:', error);
        setUploadStatus('idle');
        // You might want to show an error message to the user here
      }
    }
  };

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

  const renderVisionAnalysis = (content: string) => {
    try {
      console.log("Content : ", content)
      const analysis = JSON.parse(content);
      return (
        <div className="space-y-4">
          <Card className="p-4 bg-blue-100 border-blue-300">
            <h3 className="font-bold text-lg mb-2">Market Overview</h3>
            <p>Trend: {analysis.marketOverview.trend}</p>
            <p>Support: {analysis.marketOverview.support.join(', ')}</p>
            <p>Resistance: {analysis.marketOverview.resistance.join(', ')}</p>
          </Card>
          <Card className="p-4 bg-green-100 border-green-300">
            <h3 className="font-bold text-lg mb-2">Pattern Analysis</h3>
            <ul className="list-disc list-inside">
              {analysis.patternAnalysis.map((pattern: string, index: number) => (
                <li key={index}>{pattern}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-4 bg-yellow-100 border-yellow-300">
            <h3 className="font-bold text-lg mb-2">Trade Setups</h3>
            <ul className="list-disc list-inside">
              {analysis.tradeSetups.map((setup: string, index: number) => (
                <li key={index}>{setup}</li>
              ))}
            </ul>
          </Card>
        </div>
      );
    } catch (error) {
      console.error('Error parsing vision analysis:', error);
      return <p>{content}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-yellow-200 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <motion.div 
          className="mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image src={agentImages[currentAgent]} alt="Agent" width={100} height={100} className="rounded-full" />
        </motion.div>
        <motion.div 
          className="mb-4 text-lg font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentAgent === 'superagent' 
            ? 'SuperAgent'
            : `SuperAgent > ${currentAgent.charAt(0).toUpperCase() + currentAgent.slice(1)}`
          }
        </motion.div>
        
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full mb-8"
            >
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full">
                <CardContent className="p-4 max-h-[60vh] overflow-y-auto" ref={chatContainerRef}>
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div 
                        key={index} 
                        className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border-2 border-black'}`}>
                          {message.agent === 'vision' 
                            ? renderVisionAnalysis(message.content)
                            : <p className="text-sm">{message.content}</p>
                          }
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div 
                      className="flex justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full">
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
              <Button
                type="button"
                onClick={() => document.getElementById('imageUpload')?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded-none"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded-none"
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                variant={isRecording ? "destructive" : "secondary"}
              >
                <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
              </Button>
            </form>
            {imageUrl && (
              <div className="mt-2">
                {uploadStatus === 'uploading' && <p>Uploading, please wait...</p>}
                {uploadStatus === 'uploaded' && <>
                  <p>Uploaded</p>

                  <img src={imageUrl} alt="Selected" className="max-w-full h-auto" />
                </> 
                }
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

