import React, { useContext, useState } from 'react'
import 'font-awesome/css/font-awesome.min.css'
import Button from '../Button/Button'
import useChatGpt from '../../hooks/useChatGpt'
import StoryContext from '../../contexts/StoryContext/StoryContex';

const GenerateCover = () => {
  const { storyTitle, storyCover, setStoryCover } = useContext(StoryContext)
  const { loading, getChatGptResponse, generateImage } = useChatGpt()

  const [value, setValue] = useState('')
  const [url, setUrl] = useState(storyCover)

  const generateDescription = async () => {
    setValue('')
    const description = await getChatGptResponse(
      `Generate a detailed description of a front cover of a short story with the title ${storyTitle}. Keep the description less than 200 words.`,
      300
    )
    setValue(description)
  }

  const generateImageUsingChatGpt = async (prompt) => {
    setUrl('')
    const customPrompt = prompt + 'Do not include the title in the image'
    const url = await generateImage(customPrompt)
    setUrl(url)
    setStoryCover(url)
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
          placeholderText='Description of your cover'
          value={value}
          onChange={(e) => setValue(e?.target?.value)}
          style={{ padding: '10px', width: '80%', height: '100px' }}
        />
        <div style={{ display: 'flex' }}>
          <Button
            isLoading={loading}
            icon='⚡️'
            value='Generate Description'
            backgroundColor='#208C49'
            backgroundColorHover='#176535'
            onClick={() => generateDescription()}
            style={{ margin: '8px' }}
          />
          <Button
            isLoading={loading}
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
        {loading && <>Loading.....</>}
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
