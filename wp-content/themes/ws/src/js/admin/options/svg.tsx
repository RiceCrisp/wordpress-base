import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { SVG } from '@ws/types'
import { uniqid } from '@ws/utils'
import { useSettings } from '@ws/hooks'
import {
  SortableContainer,
  SortableItem,
  deleteItem,
  updateItem,
  arrayMove
} from '@ws/components'

declare const wp: any

const {
  Button,
  FormFileUpload,
  Notice,
  TextareaControl,
  TextControl
} = wp.components

function SVGOptions() {
  const [svgs, setSvgs] = useSettings({ svgs: [] })
  const [alert, setAlert] = useState({ msg: '', type: '' })

  const validViewbox = (viewbox: string) => {
    if (viewbox) {
      const match = viewbox.match(/(-?\d+(\.\d+)?) (-?\d+(\.\d+)?) (-?\d+(\.\d+)?) (-?\d+(\.\d+)?)/g)
      if ((match && match[0] === viewbox) || viewbox === '') {
        return viewbox
      }
    }
    return ''
  }

  const importSVG = (e: Event & { target: HTMLInputElement & EventTarget }) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const result = reader.result
        if (typeof result === 'string') {
          const parser = new DOMParser()
          const xml = parser.parseFromString(result.replace(/[\n\t\r]+/g, ''), 'text/xml')
          const icons: HTMLElement[] = Array.prototype.slice.call(xml.querySelectorAll<HTMLElement>('symbol').length
            ? xml.querySelectorAll<HTMLElement>('symbol')
            : xml.querySelectorAll<HTMLElement>('svg'))
          const newSvgs = icons.map(icon => {
            const id = icon.id || ''
            const title = icon.querySelector<HTMLElement>('title')?.innerHTML || id
            const viewbox = icon.getAttribute('viewBox') || `0 0 ${icon.getAttribute('width')} ${icon.getAttribute('height')}`
            // Remove elements
            const defs = icon.querySelectorAll<HTMLElement>('defs, title')
            defs.forEach(el => {
              icon.removeChild(el)
            })
            // Remove wrapped elements
            const gs = icon.querySelectorAll<HTMLElement>('g')
            gs.forEach(g => {
              while (g.firstChild) {
                icon.insertBefore(g.firstChild, g)
              }
              icon.removeChild(g)
            })
            // Remove attributes
            icon.querySelectorAll('*').forEach(el => {
              el.removeAttribute('class')
            })
            const path = icon.innerHTML.replace(/></g, '>\n<')
            return {
              uid: uniqid(),
              id: id,
              title: title,
              viewbox: viewbox,
              path: path.replace(/\sxmlns=["'].*?["']/g, '') // This is the only way to remove the xmlns attribute for some reason
            }
          })
          setSvgs([...newSvgs, ...svgs])
          setAlert({ msg: 'Successfully imported.', type: 'success' })
        }
      }
      catch (err) {
        console.error(err)
        setAlert({ msg: 'There was an error importing the file. Confirm that the file type is correct is and that the data is valid.', type: 'error' })
      }
    }
    if (e.target.files?.length) {
      reader.readAsText(e.target.files[0])
    }
  }

  const exportSVG = () => {
    let blob = '<svg>'
    svgs.forEach((svg: SVG) => {
      blob += `<symbol id="${svg.id}" viewBox="${svg.viewbox}">${svg.title ? `<title>${svg.title}</title>` : ''}${svg.path}</symbol>`
    })
    blob += '</svg>'
    const svgFile = new Blob([blob], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()
    a.download = `svgs_${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}-${today.getFullYear()}`
    a.href = URL.createObjectURL(svgFile)
    a.click()
  }

  const titleToId = (title: string) => {
    let str = title.replace(/^\s+|\s+$/g, '')
    str = str.toLowerCase()
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
    const to = 'aaaaeeeeiiiioooouuuunc------'
    for (let i = 0; i < from.length; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    }
    str = str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    return str
  }

  const isDuplicate = (title: string) => {
    let c = 0
    svgs.forEach((svg: SVG) => {
      if (titleToId(title) === titleToId(svg.title)) {
        c++
      }
    })
    return c > 1
  }

  const removeInline = (index: number) => {
    setSvgs([
      ...svgs.map((svg: SVG, i: number) => {
        if (i === index) {
          const newPath = svg.path.replace(/style="[^"]*"/g, '').replace(/class="[^"]*"/g, '')
          return {
            ...svg,
            path: newPath
          }
        }
        return svg
      })
    ])
  }

  return (
    <>
      <h1>SVG Manager</h1>
      <section>
        <p><b>ID</b> - Unique name used by the SVG shortcode to identify the icon. Hyphen delimited.</p>
        <p><b>Title</b> - Description of SVG. Used by screenreaders to identify/describe the icon.</p>
        <p><b>ViewBox</b> - Defines the dimensions of the icon, usually coorelating to Illustrator Artboard dimensions. Must be 4 numbers (float) with the first two numbers being the x,y coordinates of the top left of the artboard (typically 0, 0), and the last two numbers being the width and height of the artboard, respectively.</p>
        <p><b>Paths</b> - This is the actual path data. It is encouraged that you only use path elements, so as to prevent stroke styles or fill rules from changing expected behavior, but all valid SVG elements are allowed. The result will be displayed in real-time with a black fill property (if all styles have been removed).</p>
        <p><i><b>Tips:</b> Icon should fill most, if not all, of the ViewBox and should likely be a perfect square. All icon styles should be inline css (not classes). You can use the &quot;Remove Inline Styles&quot; button if you want to be able to set the color in the page editor.</i></p>
        <hr />
        <p>Remember to save changes after adding any new SVG&apos;s. If you accidentally delete an SVG, just refresh the page without saving changes.</p>
        { alert.msg && (
          <Notice
            status={ alert.type }
            onRemove={ () => setAlert({ msg: '', type: '' }) }
          >
            <p>{ alert.msg }</p>
          </Notice>
        ) }
        <div className="row">
          <div className="col">
            <FormFileUpload
              id="svg-import"
              accept=".svg"
              onChange={ importSVG }
              className="is-secondary"
            >
              Import
            </FormFileUpload>
          </div>
          <div className="col">
            <Button
              onClick={ exportSVG }
              className="is-secondary"
            >
              Export
            </Button>
          </div>
        </div>
        <Button
          isPrimary
          id="first-svg-submit"
          type="submit"
        >
          Save Changes
        </Button>
        <div className="svg-list">
          <div className="row">
            <div className="col">
              <Button
                isSecondary
                onClick={ (e: Event) => {
                  e.preventDefault()
                  setSvgs([
                    {
                      uid: uniqid(),
                      id: '',
                      title: '',
                      viewbox: '',
                      path: ''
                    },
                    ...svgs
                  ])
                }}
              >
                Add SVG
              </Button>
            </div>
          </div>
          <SortableContainer
            onSortEnd={ (oldIndex: number, newIndex: number) => setSvgs(arrayMove(svgs, oldIndex, newIndex)) }
          >
            { svgs.map((v: Record<string, any>, i: number) => {
              return (
                <SortableItem
                  key={ v.uid }
                  i={ i }
                  onDelete={ (index: number) => setSvgs(deleteItem(svgs, index)) }
                >
                  <div className="row svg-card">
                    <input name={ `svgs[${i}][uid]` } type="hidden" value={ v.uid } />
                    <div className="col-xs-6">
                      { validViewbox(v.viewbox) &&
                        <svg
                          className="svg-preview"
                          viewBox={ validViewbox(v.viewbox) }
                          dangerouslySetInnerHTML={ { __html: v.path } }
                          fillRule="evenodd">
                        </svg>
                      }
                    </div>
                    <div className="col-xs-6">
                      <small>ID: { titleToId(v.title) }</small>
                      <input
                        type="hidden"
                        name={ `svgs[${i}][id]` }
                        value={ titleToId(v.title) }
                      />
                      <TextControl
                        label="Title"
                        name={ `svgs[${i}][title]` }
                        className={ isDuplicate(v.title) || !v.title ? 'invalid' : '' }
                        onChange={ (newValue: string) => setSvgs(updateItem(svgs, i, 'title', newValue)) }
                        value={ v.title }
                      />
                      <TextControl
                        label="ViewBox"
                        name={ `svgs[${i}][viewbox]` }
                        className={ validViewbox(v.viewbox) ? '' : 'invalid' }
                        onChange={ (newValue: string) => setSvgs(updateItem(svgs, i, 'viewbox', newValue)) }
                        value={ v.viewbox }
                      />
                    </div>
                    <div className="col-xs-12">
                      <div className="path-container">
                        <Button
                          isSmall
                          className="remove-inline"
                          icon="admin-appearance"
                          label="Remove Inline Styles"
                          onClick={ (e: Event) => {
                            e.preventDefault()
                            removeInline(i)
                          } }
                        />
                        <TextareaControl
                          label="Paths"
                          name={ `svgs[${i}][path]` }
                          onChange={ (newValue: string) => setSvgs(updateItem(svgs, i, 'path', newValue)) }
                          value={ v.path }
                        />
                      </div>
                    </div>
                  </div>
                </SortableItem>
              )
            }) }
          </SortableContainer>
          { !!svgs.length && (
            <div className="row">
              <div className="col">
                <Button
                  isSecondary
                  onClick={ (e: Event) => {
                    e.preventDefault()
                    setSvgs([
                      ...svgs,
                      {
                        uid: uniqid(),
                        id: '',
                        title: '',
                        viewbox: '',
                        path: ''
                      }
                    ])
                  }}
                >
                  Add SVG
                </Button>
              </div>
            </div>
          ) }
        </div>
        <Button
          isPrimary
          type="submit"
        >
          Save Changes
        </Button>
      </section>
    </>
  )
}

function init() {
  const svgList = document.querySelector('.svg-options')
  if (svgList) {
    ReactDOM.render(
      <SVGOptions />,
      svgList
    )
  }
}

export { init }
