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
    chapters,
    setChapters,
    currentChapterNumber,
    setCurrentChapterNumber,
    messages,
    setMessages
  } = useContext(StoryContext)
  
  const { loading, error, getChatGptResponseChat, generateImage } = useChatGpt()

  const currentChapter = chapters[currentChapterNumber]
    ? chapters[currentChapterNumber]
    : { title: '', content: '', image: null}

  // current step
  // 0: generate title
  // 1: generate content
  // 2: generate image description
  // 3: generate image
  const [step, setStep] = useState(0)

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

  // to keep track of current chapter messages
  const [currentMessage, setCurrentMessage] = useState()  

  // loading states
  const [ chapterTitleLoading, setChapterTitleLoading ] = useState(false)
  const [ chapterDescriptionLoading, setChapterDescriptionLoading ] = useState(false)
  const [ chapterImageDescriptionLoading, setImageDescriptionLoading ] = useState(false)
  const [ chapterImageLoading, setChapterImageLoading ] = useState(false)

  const generateChapterTitle = async () => {
    setChapterTitleLoading(true)
    const newMessage = {
      role: 'user',
      content: `generate the title of chapter ${currentChapterNumber + 1} out of 3 chapters for your short story called ${storyTitle}`
    }
    const returnedMessages = await getChatGptResponseChat([ ...messages, newMessage])
    const title = returnedMessages[returnedMessages.length - 1]?.content || ''
    setNewChapterTitleValue(title)
    setCurrentMessage(returnedMessages)
    setChapterTitleLoading(false)
  }

  const onSubmitChapterTitle = () => {
    // manully add this message to chapter messages in case user wrote down the summary without using chat gpt.
    const finalTitleMessage = [
      {
        role: 'user',
        content: `generate the title of chapter ${currentChapterNumber + 1} out of 3 chapters for your short story called ${storyTitle}`
      },
      {
        role: 'assistant',
        content: newChapterTitleValue
      }
    ]
    setNewChapterTitle(newChapterTitleValue)
    setMessages([ ...messages, ...finalTitleMessage ])
    setStep(1)
  }

  const generateChapterContent = async () => {
    setChapterDescriptionLoading(true)
    const newMessage = {
      role: 'user',
      content: `write chapter ${currentChapterNumber + 1} for your short story called ${storyTitle}.
        the title of the chapter is ${newChapterTitle}. The chapter should be less than 150 words.`
    }
    const returnedMessages = await getChatGptResponseChat([ ...messages, newMessage])
    const content = returnedMessages[returnedMessages.length - 1]?.content || ''
    setNewChapterContentValue(content)
    setCurrentMessage(returnedMessages)
    setChapterDescriptionLoading(false)
  }

  const onSubmitChapterContent = () => {
    // manully add this message to chapter messages in case user wrote down the summary without using chat gpt.
    const finalContentMessage = [
      {
        role: 'user',
        content: `write chapter ${currentChapterNumber + 1} for your short story called ${storyTitle}.
          the title of the chapter is ${newChapterTitle}. The chapter should be less than 150 words.`
      },
      {
        role: 'assistant',
        content: newChapterContentValue
      }
    ]
    setNewChapterContent(newChapterContentValue)
    setMessages([ ...messages, ...finalContentMessage ])
    setStep(2)
  }

  const generateChapterPictureDesctiption = async () => {
    setImageDescriptionLoading(true)
    const newMessage = {
      role: 'user',
      content: `Generate a detailed description of a picture from any 1 scene from this chapter. Limit the description to less than 100 words`
    }
    const returnedMessages = await getChatGptResponseChat([ ...messages, newMessage])
    const description = returnedMessages[returnedMessages.length - 1]?.content || ''
    setCurrentMessage(returnedMessages)
    setNewChapterImageDescValue(description)
    setImageDescriptionLoading(false)
  }

  const generateChapterPicture = async () => {
    setChapterImageLoading(true)
    setNewChapterImageUrlValue('')
    const url = await generateImage(newChapterImageDescValue)
    setNewChapterImageUrlValue(url)
    setChapterImageLoading(false)
    setStep(3)
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
    setChapterTitleLoading(false)
    setChapterDescriptionLoading(false)
    setImageDescriptionLoading(false)
    setChapterImageLoading(false)
  }, [error])

  useEffect(() => {
    const currentChapterTemp = chapters[currentChapterNumber]
      ? chapters[currentChapterNumber]
      : { title: '', content: '', image: null}
    
    // reset step
    setStep(0)
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
    <div style={{ display: 'flex', border: '1px solid', justifyContent: 'center', alignItems: 'center' }}>
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
            isLoading={chapterTitleLoading}
            icon='⚡️'
            value='Generate Chapter Title'
            backgroundColor='#208C49'
            backgroundColorHover='#176535'
            onClick={() => generateChapterTitle()}
            style={{ margin: '8px' }}
          />
        </div>

        {/* chapter content */}
        {step > 0 && (
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
              isLoading={chapterDescriptionLoading}
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
        {step > 1 && (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <PromptInput
              placeholderText='Image for this chapter'
              value={newChapterImageDescValue}
              isTextArea
              setValue={setNewChapterImageDescValue}
              onSubmit={() => {generateChapterPicture()}}
              onCancel={() => {setNewChapterImageDescValue('')}}
              style={{ width: '70%', height: '175px', marginBottom: '4px' }}
            />
            <Button
              isLoading={chapterImageDescriptionLoading}
              icon='⚡️'
              value='Generate Picture Desctiption'
              backgroundColor='#208C49'
              backgroundColorHover='#176535'
              onClick={() => generateChapterPictureDesctiption()}
              style={{ margin: '8px' }}
            />
          </div>
        )}
        {chapterImageLoading && <>Loading.....</>}
        {step > 2 && newChapterImageUrlValue && (
          <>
            <h2>{`Here is the generated picture. If you don't like it you can generate another one or skip picture for this chapter.`}</h2>
            <img className="result-image" src={newChapterImageUrlValue} alt="generated-image" />
            <Button style={{ margin: '16px' }} value='Add to chapter' onClick={() => setNewChapterImageUrl(newChapterImageUrlValue)} />
            {newChapterImageUrl && <p style={{ color: 'green' }}>Image Added!</p>}
          </>
        )}

        {newChapterTitle && newChapterContent && currentChapterNumber < 3 && (
          <Button
            isLoading={loading}
            icon='⚡️'
            value={`Save chapter content ${newChapterImageUrlValue ? 'with' : 'without'} image`}
            backgroundColor='#208C49'
            backgroundColorHover='#176535'
            onClick={() => saveChapter()}
            style={{ margin: '8px' }}
          />
        )}

        {error && (
          <p style={{ color: 'red' }}>Ops... something went wrong. Please try again after few seconds.</p>
        )}
      </div>
    </div>
  )
}

Chapters.propTypes = {}

Chapters.defaultProps = {}

export default Chapters
