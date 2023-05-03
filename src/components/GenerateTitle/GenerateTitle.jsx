import React, { useContext, useState } from 'react'
import 'font-awesome/css/font-awesome.min.css'
import PromptInput from '../PromptInput/PromptInput'
import Button from '../Button/Button'
import useChatGpt from '../../hooks/useChatGpt'
import StoryContext from '../../contexts/StoryContext/StoryContex'

const GenerateTitle = () => {
  const { storyTitle, setStoryTitle, storySummary, setMessages, setStorySummary } = useContext(StoryContext)
  const { loading, getChatGptResponse } = useChatGpt()

  const [storySummaryValue, setStorySummaryValue] = useState('')
  const [storyTitleValue, setStoryTitleValue] = useState('')
  const [showTitleInput, setShowTitleInput] = useState(false)

  const generateTitle = async () => {
    const summary = storySummary? `Here is what the book is about: ${storySummary}.` : ''
    const title = await getChatGptResponse(`Generate a title of a children's book. ${summary}`)
    const defaultMessage = {
      role: 'system',
      content: `You are an author of children's short stories that writes entertaining and easy to understand stories.
       Your stories usually have a happy ending with a lesson.
       The name of the story you are currently working on is ${title.trim()}. ${summary}.
       Your job is to write 3 chapters of this story.`
    }
    setMessages([defaultMessage])
    setStoryTitleValue(title.trim())
  }

  return (
    <div style={{ display: 'flex', height: '75%', border:'1px solid', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex',  flexDirection: 'column',  width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Generate Title: Create the title of your book</h1>

        <div style={{ display: 'flex', flexDirection: 'column',  width: '100%', justifyContent: 'center', alignItems: 'center', margin: '32px 0' }}>
          <h4>Write a brief summary of your story including the name of the main characters. If you don't want to do this you can skip this step</h4>
          <PromptInput
            placeholderText='Summary of the story'
            value={storySummaryValue}
            setValue={setStorySummaryValue}
            showSubmit={false}
            onCancel={() => {setStorySummaryValue('')}}
            style={{ width: '70%' }}
          />
          <div style={{ display: 'flex',  width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              value='Save summary'
              backgroundColor='#208C49'
              backgroundColorHover='#176535'
              onClick={() => {
                setStorySummary(storySummaryValue)
                setShowTitleInput(true)
              }}
              style={{ margin: '8px', width: '150px' }}
            />
            <Button
              value='Skip'
              backgroundColor='#208C49'
              backgroundColorHover='#176535'
              onClick={() => setShowTitleInput(true)}
              style={{ margin: '8px', width: '150px' }}
            />
          </div>
        </div>

        {/* user input prompts */}
        {showTitleInput && (
          <div style={{ display: 'flex', flexDirection: 'column',  width: '100%', justifyContent: 'center', alignItems: 'center', margin: '32px 0' }}>
            <h4>Write the title of your book or click generate to let chat GPT generate it for you.</h4>
            <PromptInput
              placeholderText='Title of you story'
              value={storyTitleValue}
              setValue={setStoryTitleValue}
              onSubmit={() => setStoryTitle(storyTitleValue)}
              onCancel={() => {setStoryTitleValue('')}}
              style={{ width: '70%' }}
            />
            <Button
              isLoading={loading}
              icon='⚡️'
              value='Generate Title'
              backgroundColor='#208C49'
              backgroundColorHover='#176535'
              onClick={() => generateTitle()}
              style={{ margin: '8px' }}
            />
          </div>
        )}

        {/* print story title */}
        {storyTitle && (
          <>
            <h2>{`The title of your story is "${storyTitle}"`}</h2>
            <Button value='Continue' linkTo='/generate-cover' />
          </>
        )}
      </div>
    </div>
  )
}

GenerateTitle.propTypes = {}

GenerateTitle.defaultProps = {}

export default GenerateTitle
