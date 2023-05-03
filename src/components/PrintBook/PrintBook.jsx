import React, { useContext } from 'react'
import 'font-awesome/css/font-awesome.min.css'
import StoryContext from '../../contexts/StoryContext/StoryContex'
import styled from 'styled-components'


const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  width: 600px;
  height: 800px;
  font-size: 22px;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  margin: 32px;
  padding: 32px;

  /* override styles when printing */
  @media print {
    @page {
      size: 600px 825px;
      margin: 0;
      padding: 0;
    }

    // displayHeaderFooter: false,
    //         printBackground: true,
    //         preferCSSPageSize: true
    margin: 0;
    page-break-after: always;
  }
`

const PrintBook = () => {
  const { storyTitle, storyCover, chapters } = useContext(StoryContext)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '75%', justifyContent: 'center', alignItems: 'center' }}>
      <Page style={{ justifyContent: 'center', backgroundImage: `url(${storyCover})`, backgroundSize: 'cover' }}>
        <h1 style={{ color: 'white', backgroundColor: 'black' }}>{storyTitle}</h1>
      </Page>
      {chapters.map((chapter) => {
        return (
          <>
            <Page>
              <h3>{chapter?.title}</h3>
              <p>{chapter?.content}</p>
            </Page>
            {chapter?.image && (
              <Page>
                <div style={{ display: 'flex', width: '500px', height: '800px', alignItems: 'center' }}>
                  <img style={{ width: '100%', height: '80%', display: 'block' }} className="result-image" src={chapter?.image} alt="generated-image" />
                </div>
              </Page>
            )}
          </>
        )
      })}
    </div>
  )
}

PrintBook.propTypes = {}

PrintBook.defaultProps = {}

export default PrintBook
