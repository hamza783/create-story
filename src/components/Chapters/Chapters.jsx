import React, { useContext, useState } from 'react'
import 'font-awesome/css/font-awesome.min.css'
import PromptInput from '../PromptInput/PromptInput'
import Button from '../Button/Button'
import useChatGpt from '../../hooks/useChatGpt'
import StoryContext from '../../contexts/StoryContext/StoryContex'
import { useEffect } from 'react'

const Chapters = () => {
  const {
    storyTitle,
    storySumamry,
    chapters,
    setChapters,
    currentChapterNumber,
    setCurrentChapterNumber,
    messages
  } = useContext(StoryContext)
  
  const { loading, getChatGptResponse, getChatGptResponseChat, generateImage } = useChatGpt()

  const summary = storySumamry ? `This is what the story is about: ${storySumamry}` : ''
  const defaultMessage = {
    role: 'system',
    content: `You are an author of children's short stories that writes entertaining and easy to understand stories.
     Your stories usually have a happy ending with a lesson.
     The name of the story you are currently working on is ${storyTitle}. ${summary}.
     Your job is to write 3 chapters of this story.`
  }

  const currentChapter = chapters[currentChapterNumber]
    ? chapters[currentChapterNumber]
    : { title: '', content: '', image: null}

  // chapter title
  const [newChapterTitleValue, setNewChapterTitleValue] = useState(currentChapter?.title)
  const [newChapterTitle, setNewChapterTitle] = useState(currentChapter?.title)

  // chapter content
  const [newChapterContentValue, setNewChapterContentValue] = useState(currentChapter?.content)
  const [newChapterContent, setNewChapterContent] = useState(currentChapter?.content)

  // chapter image description
  const [newChapterImageDescValue, setNewChapterImageDescValue] = useState('')
  const [newChapterImageUrlValue, setNewChapterImageUrlValue] = useState(currentChapter?.image)
  const [newChapterImageUrl, setNewChapterImageUrl] = useState(currentChapter?.image)

  const [chapterMessages, setChapterMessages] = useState([ ...messages, defaultMessage])
  const [currentMessage, setCurrentMessage] = useState([])  

  const generateChapterTitle = async () => {
    const newMessage = {
      role: 'user',
      content: `generate the title of chapter ${currentChapterNumber + 1} out of 3 chapters for your short story called ${storyTitle}`
    }
    const returnedMessages = await getChatGptResponseChat([ ...chapterMessages, newMessage])
    const title = returnedMessages[returnedMessages.length - 1]?.content || ''
    setNewChapterTitleValue(title)
    setCurrentMessage(returnedMessages)
  }

  const onSubmitChapterTitle = () => {
    setNewChapterTitle(newChapterTitleValue)
    setChapterMessages(currentMessage)
  }

  const generateChapterContent = async () => {
    const newMessage = {
      role: 'user',
      content: `write chapter ${currentChapterNumber + 1} for your short story called ${storyTitle}.
        the title of the chapter is ${newChapterTitle}. The chapter should be less than 150 words.`
    }
    const returnedMessages = await getChatGptResponseChat([ ...chapterMessages, newMessage])
    const content = returnedMessages[returnedMessages.length - 1]?.content || ''
    setNewChapterContentValue(content)
    setCurrentMessage(returnedMessages)
  }

  const onSubmitChapterContent = () => {
    setNewChapterContent(newChapterContentValue)
    setChapterMessages(currentMessage)
  }

  const generateChapterPictureDesctiption = async () => {
    const description = await getChatGptResponse(
      `Generate a detailed description of this scene of a short story with the title ${storyTitle}: ${newChapterContent}`,
      300
    )
    setNewChapterImageDescValue(description)
  }

  const generateChapterPicture = async () => {
    setNewChapterImageUrlValue('')
    const url = await generateImage(newChapterImageDescValue)
    setNewChapterImageUrlValue(url)
  }

  const saveChapter = () => {
    const newChapter = {
      title: newChapterTitle,
      content: newChapterContent,
      image: newChapterImageUrl
    }
    setChapters([ ...chapters, newChapter ])
    setCurrentChapterNumber(currentChapterNumber + 1)
  }

  useEffect(() => {
    const currentChapterTemp = chapters[currentChapterNumber]
      ? chapters[currentChapterNumber]
      : { title: '', content: '', image: null}
    
    // reset chapter title
    setNewChapterTitleValue(currentChapterTemp?.title)
    setNewChapterTitle(currentChapterTemp?.title)

    // reset chapter content
    setNewChapterContentValue(currentChapterTemp?.content)
    setNewChapterContent(currentChapterTemp?.content)

    // reset chapter image description
    setNewChapterImageDescValue('')
    setNewChapterImageUrlValue(currentChapterTemp?.image)
    setNewChapterImageUrl(currentChapterTemp?.image)
  }, [currentChapterNumber])

  if (currentChapterNumber && currentChapterNumber >= 3) {
    return (
      <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <h1>Congratulations!!! Your book is finished.</h1>
        <Button
          value='Print book'
          backgroundColor='#208C49'
          backgroundColorHover='#176535'
          linkTo='/print-book'
          style={{ margin: '8px', width: 'fit-content' }}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '75%', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex',  flexDirection: 'column',  width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Chapter {currentChapterNumber + 1}</h1>
        <h4>Let's work on the chapter {currentChapterNumber + 1} of "{storyTitle}"</h4>

        {/* chapter title */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <PromptInput
            placeholderText='Title of your chapter'
            value={newChapterTitleValue}
            setValue={setNewChapterTitleValue}
            onSubmit={onSubmitChapterTitle}
            onCancel={() => setNewChapterTitleValue('')}
            style={{ width: '70%' }}
          />
          <Button
            isLoading={loading}
            icon='⚡️'
            value='Generate Chapter Title'
            backgroundColor='#208C49'
            backgroundColorHover='#176535'
            onClick={() => generateChapterTitle()}
            style={{ margin: '8px' }}
          />
        </div>

        {/* chapter content */}
        {newChapterTitle && (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <PromptInput
              placeholderText={`Write chapter ${currentChapterNumber + 1}`}
              value={newChapterContentValue}
              isTextArea
              setValue={setNewChapterContentValue}
              onSubmit={onSubmitChapterContent}
              onCancel={() => setNewChapterContentValue('')}
              style={{ width: '70%', height: '175px', marginBottom: '4px' }}
            />
            <Button
              isLoading={loading}
              icon='⚡️'
              value='Generate Chapter'
              backgroundColor='#208C49'
              backgroundColorHover='#176535'
              onClick={() => generateChapterContent()}
              style={{ margin: '8px' }}
            />
          </div>
        )}

        {/* chapter image description */}
        {newChapterContent && (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <PromptInput
              placeholderText='Image for this chapter'
              value={newChapterImageDescValue}
              setValue={setNewChapterImageDescValue}
              onSubmit={() => {generateChapterPicture()}}
              onCancel={() => {setNewChapterImageDescValue('')}}
              style={{ width: '70%' }}
            />
            <Button
              isLoading={loading}
              icon='⚡️'
              value='Generate Picture Desctiption'
              backgroundColor='#208C49'
              backgroundColorHover='#176535'
              onClick={() => generateChapterPictureDesctiption()}
              style={{ margin: '8px' }}
            />
          </div>
        )}

        {newChapterImageUrlValue && (
          <>
            <h2>{`Here is the generated picture. If you don't like it you can generate another one or skip picture for this chapter.`}</h2>
            <img className="result-image" src={newChapterImageUrlValue} alt="generated-image" />
            <Button style={{ margin: '16px' }} value='Add to chapter' onClick={() => setNewChapterImageUrl(newChapterImageUrlValue)} />
          </>
        )}

        {newChapterTitle && newChapterContent && currentChapterNumber < 3 && (
          <Button
            isLoading={loading}
            icon='⚡️'
            value='Save chapter content'
            backgroundColor='#208C49'
            backgroundColorHover='#176535'
            onClick={() => saveChapter()}
            style={{ margin: '8px' }}
          />
        )}
      </div>
    </div>
  )
}

Chapters.propTypes = {}

Chapters.defaultProps = {}

export default Chapters
