import { useState } from 'react'
import { Configuration, OpenAIApi } from "openai"
import SampleImage from '../assets/sample-cover-image.png'

const configuration = new Configuration({
  // organization: "org-fsGeyrWfm2AXuHG873bsxY1D",
  apiKey: import.meta.env.VITE_CHAT_GPT_API_KEY,
})

const useChatGpt = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const openai = new OpenAIApi(configuration)

  const getChatGptResponse = async (newPrompt, maxToken = 100) => {
    if(!newPrompt) return

    try {
      setLoading(true)
      setError(false)
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: newPrompt,
        max_tokens: maxToken,
        temperature: 0.8,
      })
      const choice = response?.data?.choices?.length > 0 && response?.data?.choices[0].text
      return choice
    } catch (error) {
      console.error(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }
 
  const getChatGptResponseChat = async (messages) => {
    try {
      setLoading(true)
      setError(false)
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      })
      const newResponseMessage = response?.data?.choices?.length > 0 ? response?.data?.choices[0].message : []
      return [ ...messages, newResponseMessage ]
    } catch (error) {
      console.error('error', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const generateImage = async (prompt, mock = false) => {
    if (mock) {
      return SampleImage
    }
    try {
      setLoading(true)
      setError(false)
      const response = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "512x512",
      })
      const url = response?.data.data.length > 0 ? response?.data.data[0].url : ''
      return url
    } catch (error) {
      console.error(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getChatGptResponse,
    getChatGptResponseChat,
    generateImage
  }
}

export default useChatGpt