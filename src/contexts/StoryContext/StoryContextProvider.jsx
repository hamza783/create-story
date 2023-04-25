import React, {useState} from 'react'
import StoryContext from './StoryContex'

const StoryContextProvider = (props) => {
  const [storyTitle, setStoryTitle] = useState('')
  const [storySummary, setStorySummary] = useState('')
  const [storyCover, setStoryCover] = useState('')
  const [chapters, setChapters] = useState([])
  const [messages, setMessages] = useState([])
  const [currentChapterNumber, setCurrentChapterNumber] = useState(0)

  const value = {
    storyTitle,
    setStoryTitle,
    storySummary,
    setStorySummary,
    storyCover,
    setStoryCover,
    chapters,
    messages,
    setMessages,
    setChapters,
    currentChapterNumber,
    setCurrentChapterNumber
  }

  return (
    <StoryContext.Provider {...props} value={value} />
  )
}

export default StoryContextProvider