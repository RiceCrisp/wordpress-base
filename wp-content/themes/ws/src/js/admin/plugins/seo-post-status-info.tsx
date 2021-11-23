import React, { useState } from 'react'
import { Select } from '@ws/types'

declare const wp: any

const { Button, Notice } = wp.components
const { useSelect } = wp.data
const { PluginPostStatusInfo } = wp.editPost || {}
const { __ } = wp.i18n

export const seoPostStatusInfo = wp.editPost ? {
  name: 'ws-seo-post-status-info',
  args: {
    render: () => {
      const [expanded, setExpanded] = useState(true)
      const {
        postType,
        meta,
        title,
        excerpt,
        content
      } = useSelect((select: Select) => ({
        postType: select('core/editor').getCurrentPostType(),
        meta: select('core/editor').getEditedPostAttribute('meta'),
        title: select('core/editor').getEditedPostAttribute('title'),
        excerpt: select('core/editor').getEditedPostAttribute('excerpt'),
        content: select('core/editor').getEditedPostContent()
      }))

      // Prevent reusable block editor from crashing
      if (!meta) {
        return null
      }

      const errors: string[] = []
      const warnings: string[] = []

      checkH1s({
        postType,
        title,
        content,
        warnings,
        errors
      })
      checkMetaDescription({
        meta,
        excerpt,
        warnings
      })
      checkAnchorText({
        content,
        warnings
      })
      checkAltText({
        content,
        warnings
      })

      return (
        <PluginPostStatusInfo
          className="seo-post-status-info"
        >
          <div className="seo-audit">
            <p>{ __('SEO Audit', 'ws') }</p>
            <Button
              isLink
              onClick={ () => {
                setExpanded(!expanded)
              } }
            >
              { expanded ? 'Hide' : 'Show' }
            </Button>
          </div>
          { expanded && (
            <ul>
              { errors.map((error, i) => (
                <li key={ i }>
                  <Notice
                    status="error"
                    isDismissible={ false }
                  >
                    { error }
                  </Notice>
                </li>
              )) }
              { warnings.map((warning, i) => (
                <li key={ i }>
                  <Notice
                    status="warning"
                    isDismissible={ false }
                  >
                    { warning }
                  </Notice>
                </li>
              )) }
            </ul>
          ) }
        </PluginPostStatusInfo>
      )
    }
  }
} : null

function checkH1s(
  args: { postType: string, title: string, content: string, warnings: string[], errors: string[] }
) {
  const h1s = []
  let matches = null

  const {
    postType,
    title,
    content,
    warnings,
    errors
  } = args

  // Most post types will use their own template, so they will already have an h1 built-in.
  if (postType !== 'page') {
    h1s.push(title)
  }

  // Check heading blocks
  const headingRegex = /<h1.*?>(.*?)<\/h1>/g
  matches = headingRegex.exec(content)
  while (matches != null) {
    if (matches && matches[1]) {
      h1s.push(matches[1])
    }
    matches = headingRegex.exec(content)
  }

  // Push warnings and errors
  if (h1s.length === 0) {
    errors.push(__('Page is missing an h1.', 'ws'))
  }
  if (h1s.length > 1) {
    errors.push(__('Page has multiple h1\'s.', 'ws'))
  }
  if (h1s.length === 1 && h1s[0].length < 20) {
    warnings.push(__('The h1 is short. The ideal h1 length is 20-70 characters.', 'ws'))
  }
  if (h1s.length === 1 && h1s[0].length > 70) {
    warnings.push(__('The h1 is long. The ideal h1 length is 20-70 characters.', 'ws'))
  }
}

function checkMetaDescription(
  args: { meta: Record<string, any>, excerpt: string, warnings: string[] }
) {
  const {
    meta,
    excerpt,
    warnings
  } = args

  if (!meta._seo_description && !excerpt) {
    warnings.push(__('Page is missing meta description.', 'ws'))
  }
}

function checkAnchorText(
  args: { content: string, warnings: string[] }
) {
  let anchors = []
  let matches = null

  const {
    content,
    warnings
  } = args

  // Check anchors
  const anchorRegex = /<a\s.*?>(.*?)<\/a>/g
  matches = anchorRegex.exec(content)
  while (matches != null) {
    if (matches && matches[1]) {
      anchors.push(matches[1])
    }
    matches = anchorRegex.exec(content)
  }

  // Check buttons
  const buttonTextRegex = /"buttonText":"(.*?)"/g
  matches = buttonTextRegex.exec(content)
  while (matches != null) {
    if (matches && matches[1]) {
      anchors.push(matches[1])
    }
    matches = buttonTextRegex.exec(content)
  }
  anchors = anchors.filter(anchor => ['click here', 'click this', 'go', 'here', 'this', 'start', 'right here', 'more', 'learn more'].includes(anchor.toLowerCase()))

  // Push warnings
  anchors.forEach(anchor => {
    warnings.push(`${__('Link does not have descriptive text.', 'ws')} (${anchor})`)
  })
}

function checkAltText(
  args: { content: string, warnings: string[] }
) {
  const alts = []
  let matches = null

  const {
    content,
    warnings
  } = args

  const altTextRegex = /<img\s((?![^>]*?alt)|(?![^>]*?alt="[^"]+?")).*?src="(.*?)".*?>/g
  matches = altTextRegex.exec(content)
  while (matches != null) {
    if (matches && matches[2]) {
      alts.push(matches[2])
    }
    matches = altTextRegex.exec(content)
  }

  // Push warnings
  alts.forEach(alt => {
    warnings.push(`${__('Image does not have alt text.', 'ws')} (${alt})`)
  })
}
