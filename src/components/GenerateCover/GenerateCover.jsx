import React, { useContext, useState } from 'react'
import 'font-awesome/css/font-awesome.min.css'
import Button from '../Button/Button'
import useChatGpt from '../../hooks/useChatGpt'
import StoryContext from '../../contexts/StoryContext/StoryContex';

const GenerateCover = () => {
  const { storyTitle, storySummary, storyCover, setStoryCover } = useContext(StoryContext)
  const { getChatGptResponse, generateImage } = useChatGpt()
  const [ loadingDescription, setLoadingDescription ] = useState(false)
  const [ loadingImage, setLoadingImage ] = useState(false)

  const [value, setValue] = useState('')
  const [url, setUrl] = useState(storyCover)

  const generateDescription = async () => {
    setLoadingDescription(true)
    setValue('')
    const description = await getChatGptResponse(
      `Generate a detailed description of a picture from a scene from a short story with the title ${storyTitle}.
      Here is the summary of that story: ${storySummary}.
      Keep the description less than 100 words.`,
      300
    )
    setLoadingDescription(false)
    setValue(description.trim())
  }

  const generateImageUsingChatGpt = async (prompt) => {
    setLoadingImage(true)
    setUrl('')
    const customPrompt = prompt + 'Do not include the title in the image'
    const url = await generateImage(customPrompt)
    setUrl(url)
    setStoryCover(url)
    setLoadingImage(false)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex',  flexDirection: 'column',  width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Generate Cover: Create the main cover for:</h1>
        <h1 style={{ color: 'red' }}>{storyTitle}</h1>
        <div>
          <p>Write the description of the cover to create the cover of your story.</p>
          <p>You can also click "Generate Desctiption" to have the description of the cover auto generated.</p>
        </div>

        {/* user input prompts for image description */}
        <textarea
          value={value}
          onChange={(e) => setValue(e?.target?.value)}
          style={{ padding: '10px', width: '80%', height: '100px' }}
        />
        <div style={{ display: 'flex' }}>
          <Button
            isLoading={loadingDescription}
            icon='⚡️'
            value='Generate Description'
            backgroundColor='#208C49'
            backgroundColorHover='#176535'
            onClick={() => generateDescription()}
            style={{ margin: '8px' }}
          />
          <Button
            isLoading={loadingImage}
            disabled={!value}
            icon='⚡️'
            value='Generate Image'
            backgroundColor='#208C49'
            backgroundColorHover='#176535'
            onClick={() => generateImageUsingChatGpt(value)}
            style={{ margin: '8px' }}
          />
        </div>

        {/* show generated image */}
        {url && (
          <>
            <h2>{`Here is the generated picture. If you don't like it you can generate another one.`}</h2>
            <img className="result-image" src={url} alt="generated-image" />
            <Button style={{ margin: '16px' }} value='Continue' linkTo='/chapters' />
          </>
        )}
      </div>
    </div>
  )
}

GenerateCover.propTypes = {}

GenerateCover.defaultProps = {}

export default GenerateCover
