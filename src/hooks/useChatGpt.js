import { useState } from 'react'
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  // organization: "org-fsGeyrWfm2AXuHG873bsxY1D",
  apiKey: import.meta.env.VITE_CHAT_GPT_API_KEY,
})

const useChatGpt = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const openai = new OpenAIApi(configuration)

  const getChatGptResponse = async (newPrompt, maxToken = 40) => {
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
      return 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-fsGeyrWfm2AXuHG873bsxY1D/user-fXBjzzAYXs4NqKvytsBgcgrG/img-EVDaoojoGm90LHqg2DGQLwKg.png?st=2023-04-20T21%3A53%3A28Z&se=2023-04-20T23%3A53%3A28Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-20T16%3A37%3A35Z&ske=2023-04-21T16%3A37%3A35Z&sks=b&skv=2021-08-06&sig=fo9dqcmtggHsFbl8t6nVH0W0YtPe0eokBZvsT42FdWU%3D'
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