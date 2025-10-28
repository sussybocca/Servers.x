import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { supabase } from '../supabaseClient.js'
import Editor from '@monaco-editor/react'

export default function Editor({ serverId }) {
  const [files, setFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    const fetchFiles = async () => {
      const { data } = await supabase.from('server_files').select('*').eq('server_id', serverId)
      setFiles(data)
      if (data[0]) {
        setCurrentFile(data[0])
        setContent(data[0].content)
      }
    }
    fetchFiles()
  }, [serverId])

  const handleSave = async () => {
    if (!currentFile) return
    const { error } = await supabase.from('server_files')
      .update({ content, updated_at: new Date() })
      .eq('id', currentFile.id)
    if (error) console.error(error)
    else alert('Saved!')
  }

  const handleAddFile = async () => {
    const path = prompt('File path (e.g., src/index.jsx)')
    if (!path) return
    const { data, error } = await supabase.from('server_files')
      .insert([{ server_id: serverId, path, content: '' }])
    if (!error) setFiles(prev => [...prev, data[0]])
  }

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', height: '90vh' }}>
        <div style={{ width: '200px', borderRight: '1px solid gray', padding: '1rem' }}>
          <h3>Files</h3>
          <button onClick={handleAddFile}>Add File</button>
          <ul>
            {files.map(f => (
              <li key={f.id} onClick={() => { setCurrentFile(f); setContent(f.content) }} style={{ cursor: 'pointer' }}>
                {f.path}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flexGrow: 1 }}>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={content}
            onChange={setContent}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </>
  )
}
