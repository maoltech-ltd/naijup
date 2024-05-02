import React from 'react'
import Editor from '../components/Post/Editor'
import Editors from '../components/Post/Editors'

const createPost
 = () => {
  return (
    <div>
        <Editor post={null}/>
        <Editors />
    </div>
  )
}

export default createPost
