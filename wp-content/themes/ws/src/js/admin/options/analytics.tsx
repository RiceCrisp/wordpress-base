import React from 'react'
import ReactDOM from 'react-dom'
import { useSettings } from '@ws/hooks'

declare const wp: any

const { Button, TextControl } = wp.components

function AnalyticsOptions() {
  const [fields, setFields] = useSettings({
    tag_manager_id: null,
    pardot_email: null,
    pardot_password: null,
    pardot_key: null,
    pardot_account: null,
    marketo_endpoint: null,
    marketo_token: null
  })

  return (
    <>
      <h1>Tracking &amp; Analytics</h1>
      <section>
        <h2>Google Tag Manager</h2>
        <TextControl
          label="Google Tag Manager ID"
          placeholder="GTM-XXXXXXX"
          onChange={ (newValue: string) => setFields({ ...fields, tag_manager_id: newValue }) }
          value={ fields.tag_manager_id }
          name="tag_manager_id"
        />
      </section>
      <section>
        <h2>Pardot API</h2>
        <TextControl
          label="Email"
          type="email"
          onChange={ (newValue: string) => setFields({ ...fields, pardot_email: newValue }) }
          value={ fields.pardot_email }
          name="pardot_email"
        />
        <TextControl
          label="Password"
          type="password"
          onChange={ (newValue: string) => setFields({ ...fields, pardot_password: newValue }) }
          value={ fields.pardot_password }
          name="pardot_password"
        />
        <TextControl
          label="User Key"
          onChange={ (newValue: string) => setFields({ ...fields, pardot_key: newValue }) }
          value={ fields.pardot_key }
          name="pardot_key"
        />
        <TextControl
          label="Account ID"
          onChange={ (newValue: string) => setFields({ ...fields, pardot_account: newValue }) }
          value={ fields.pardot_account }
          name="pardot_account"
        />
      </section>
      <section>
        <h2>Marketo API</h2>
        <TextControl
          label="Endpoint URL"
          onChange={ (newValue: string) => setFields({ ...fields, marketo_endpoint: newValue }) }
          value={ fields.marketo_endpoint }
          name="marketo_endpoint"
        />
        <TextControl
          label="Access Token"
          onChange={ (newValue: string) => setFields({ ...fields, marketo_token: newValue }) }
          value={ fields.marketo_token }
          name="marketo_token"
        />
      </section>
      <Button
        isPrimary
        type="submit"
      >
        Save Changes
      </Button>
    </>
  )
}

function init() {
  const analyticsOptions = document.querySelector('.analytics-options')
  if (analyticsOptions) {
    ReactDOM.render(
      <AnalyticsOptions />,
      analyticsOptions
    )
  }
}

export { init }
