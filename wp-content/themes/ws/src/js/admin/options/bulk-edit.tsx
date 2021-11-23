import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { PostTypeControl } from '@ws/components'

declare const wp: any

const { Button, FormFileUpload, Notice } = wp.components

function BulkEditOptions() {
  const [loading, setLoading] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [alert, setAlert] = useState({ msg: '', type: '' })

  const getBulk = (e: Event) => {
    e.preventDefault()
    setLoading(true)
    fetch(`/wp-admin/admin-ajax.php?action=_ws_get_bulk&types=${selectedTypes.join()}`)
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            setAlert({ msg: '', type: '' })
            const csvFile = new Blob([data], { type: 'text/csv' })
            const a = document.createElement('a')
            const today = new Date()
            const month = today.getMonth() + 1
            const day = today.getDate()
            a.download = `bulk_data_${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}-${today.getFullYear()}`
            a.href = URL.createObjectURL(csvFile)
            a.click()
          })
        }
        else {
          setAlert({ msg: 'Something went wrong. Please try again.', type: 'error' })
        }
      })
      .catch(err => {
        setAlert({ msg: 'Something went wrong. Please try again.', type: 'error' })
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const setBulk = (e: Event & { target: HTMLInputElement & EventTarget }) => {
    e.preventDefault()
    setLoading(true)
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      const data = new FormData()
      data.append('action', '_ws_set_bulk')
      if (typeof result === 'string') {
        data.append('csv', result)
      }
      fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: data
      })
        .then(res => {
          if (res.status === 200) {
            setAlert({ msg: 'Fields updated successfully.', type: 'success' })
          }
          else {
            setAlert({ msg: 'There was an error importing the file. Confirm that the file type is correct is and that the data is valid.', type: 'error' })
          }
        })
        .catch(err => {
          setAlert({ msg: 'There was an error importing the file. Confirm that the file type is correct is and that the data is valid.', type: 'error' })
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    if (e.target.files?.length) {
      reader.readAsText(e.target.files[0])
    }
  }

  return (
    <>
      <h1>Bulk Edit</h1>
      <section>
        <h2>Export</h2>
        <p>Download a .csv file of all public posts/pages.</p>
        <fieldset>
          <legend>Post Types</legend>
          <PostTypeControl
            onChange={ (newValue: string[]) => setSelectedTypes(newValue) }
            value={ selectedTypes }
            multiple
          />
        </fieldset>
        <Button
          isSecondary
          isBusy={ loading }
          id="bulk-download"
          onClick={ getBulk }
        >
          Download
        </Button>
      </section>
      <section>
        <h2>Import</h2>
        <p>Upload a .csv file with all fields that you want to update. First column should be the post/page id, but the rest of the columns can be any meta field or post field that you want to update. Be sure to include the field name in the first row. If using the previously exported csv file, delete the &quot;url&quot; column. It is only included to help associate a post id with the title. If you want to create a new post, set the ID to &quot;0&quot;. You can set terms for different taxonomies by using the column heading <i>tax_TAXONOMY_SLUG</i> and listing desired terms separated by commas. This will overwrite any previous terms.</p>
        <p><i>Example:</i></p>
        <table className="bulk-table">
          <thead>
            <tr>
              <td>id</td>
              <td>_seo_title</td>
              <td>_seo_description</td>
              <td>post_content</td>
              <td>tax_category</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Title 1</td>
              <td>Description 1</td>
              <td>&lt;p&gt;Post Content 1&lt;/p&gt;</td>
              <td>retail</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Title 2</td>
              <td>Description 2</td>
              <td>&lt;p&gt;Post Content 2&lt;/p&gt;</td>
              <td>industrial,commercial</td>
            </tr>
          </tbody>
        </table>
        { alert.msg && (
          <Notice
            status={ alert.type }
            onRemove={ () => setAlert({ msg: '', type: '' }) }
          >
            <p>{ alert.msg }</p>
          </Notice>
        ) }
        <FormFileUpload
          accept=".csv"
          isBusy={ loading }
          onChange={ setBulk }
          className="is-secondary"
        >
          Import Data
        </FormFileUpload>
      </section>
    </>
  )
}

function init() {
  const bulkEditOptions = document.querySelector('.bulk-edit-options')
  if (bulkEditOptions) {
    ReactDOM.render(
      <BulkEditOptions />,
      bulkEditOptions
    )
  }
}

export { init }
