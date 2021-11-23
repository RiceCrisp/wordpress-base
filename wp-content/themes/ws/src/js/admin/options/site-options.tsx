import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

declare const wp: any

const apiFetch = wp.apiFetch
const { Button, TextareaControl, TextControl } = wp.components

function SiteOptions() {
  const [fields, setFields] = useState({
    google_maps_key: '',
    google_maps_styles: '',
    seo_meta_title: '',
    site_phone: '',
    site_email: '',
    site_location_street: '',
    site_location_city: '',
    site_location_state: '',
    site_location_zip: '',
    social_links: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      linkedin: ''
    }
  })

  useEffect(() => {
    apiFetch({ path: `/wp/v2/settings?_fields=${Object.keys(fields).join(',')}` })
      .then((res: any) => {
        setFields(res)
      })
      .catch((err: string) => {
        console.error('error', err)
      })
  }, [])

  return (
    <>
      <h1>Site Options</h1>
      <section>
        <h2>General</h2>
        <div className="logo">
          <label>Logo</label>
          <small>Due to svg security exploits, svg&apos;s cannot be uploaded to media manager. To change the logo, contact super admin, or replace the <b>logo.svg</b> file in the root of this theme directory.</small>
          <img src="/wp-content/themes/ws/logo.svg" alt="Logo" />
        </div>
      </section>
      <section>
        <h2>Google Maps</h2>
        <TextControl
          label="API Key"
          onChange={ (newValue: string) => setFields({ ...fields, google_maps_key: newValue }) }
          value={ fields.google_maps_key }
          name="google_maps_key"
        />
        <TextareaControl
          label="JSON Styles"
          onChange={ (newValue: string) => setFields({ ...fields, google_maps_styles: newValue }) }
          value={ fields.google_maps_styles }
          name="google_maps_styles"
          help={ <a href="https://mapstyle.withgoogle.com/" target="_blank" rel="noopener noreferrer">Google Map Styler</a> }
        />
      </section>
      <section>
        <h2>SEO</h2>
        <TextControl
          label="Text to append to meta titles"
          onChange={ (newValue: string) => setFields({ ...fields, seo_meta_title: newValue }) }
          value={ fields.seo_meta_title }
          name="seo_meta_title"
        />
      </section>
      <section>
        <h2>Contact</h2>
        <TextControl
          label="Telephone"
          onChange={ (newValue: string) => setFields({ ...fields, site_phone: newValue }) }
          value={ fields.site_phone }
          name="site_phone"
        />
        <TextControl
          label="Email"
          type="email"
          onChange={ (newValue: string) => setFields({ ...fields, site_email: newValue }) }
          value={ fields.site_email }
          name="site_email"
        />
        <TextControl
          label="Address"
          placeholder="Street Address"
          onChange={ (newValue: string) => setFields({ ...fields, site_location_street: newValue }) }
          value={ fields.site_location_street }
          name="site_location_street"
        />
        <TextControl
          placeholder="City"
          onChange={ (newValue: string) => setFields({ ...fields, site_location_city: newValue }) }
          value={ fields.site_location_city }
          name="site_location_city"
        />
        <TextControl
          placeholder="State"
          onChange={ (newValue: string) => setFields({ ...fields, site_location_state: newValue }) }
          value={ fields.site_location_state }
          name="site_location_state"
          maxlength="2"
        />
        <TextControl
          placeholder="Zip Code"
          onChange={ (newValue: string) => setFields({ ...fields, site_location_zip: newValue }) }
          value={ fields.site_location_zip }
          name="site_location_zip"
          maxlength="5"
        />
      </section>
      <section>
        <h2>Social</h2>
        <TextControl
          label="Facebook"
          onChange={ (newValue: string) => setFields({ ...fields, social_links: { ...fields.social_links, facebook: newValue } }) }
          value={ fields.social_links?.facebook }
          name="social_links[facebook]"
        />
        <TextControl
          label="Twitter"
          onChange={ (newValue: string) => setFields({ ...fields, social_links: { ...fields.social_links, twitter: newValue } }) }
          value={ fields.social_links?.twitter }
          name="social_links[twitter]"
        />
        <TextControl
          label="Instagram"
          onChange={ (newValue: string) => setFields({ ...fields, social_links: { ...fields.social_links, instagram: newValue } }) }
          value={ fields.social_links?.instagram }
          name="social_links[instagram]"
        />
        <TextControl
          label="Youtube"
          onChange={ (newValue: string) => setFields({ ...fields, social_links: { ...fields.social_links, youtube: newValue } }) }
          value={ fields.social_links?.youtube }
          name="social_links[youtube]"
        />
        <TextControl
          label="LinkedIn"
          onChange={ (newValue: string) => setFields({ ...fields, social_links: { ...fields.social_links, linkedin: newValue } }) }
          value={ fields.social_links?.linkedin }
          name="social_links[linkedin]"
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

// class SiteOptions extends Component {
//
//   constructor(props) {
//     super(props)
//     this.state = {
//       mediaObject: null,
//       logo: locals.logo,
//       googleMapsKey: locals.googleMapsKey,
//       googleMapsStyles: locals.googleMapsStyles,
//       seoMetaTitle: locals.seoMetaTitle,
//       sitePhone: locals.sitePhone,
//       siteEmail: locals.siteEmail,
//       siteLocationStreet: locals.siteLocationStreet,
//       siteLocationCity: locals.siteLocationCity,
//       siteLocationState: locals.siteLocationState,
//       siteLocationZip: locals.siteLocationZip,
//       socialLinks: locals.socialLinks
//     }
//   }
//
//   render() {
//     const {
//       logo,
//       googleMapsKey,
//       googleMapsStyles,
//       seoMetaTitle,
//       sitePhone,
//       siteEmail,
//       siteLocationStreet,
//       siteLocationCity,
//       siteLocationState,
//       siteLocationZip,
//       socialLinks
//     } = this.state
//     return (
//       <>
//         <h1>Site Options</h1>
//         <section>
//           <h2>General</h2>
//           <div className="logo">
//             <label>Logo</label>
//             <small>Due to svg security exploits, svg&apos;s cannot be uploaded to media manager. To change the logo, contact super admin, or replace the <b>logo.svg</b> file in the root of this theme directory.</small>
//             { logo ? (
//               <img src={ logo } alt="Logo" />
//             ) : (
//               <p><i>No Logo</i></p>
//             ) }
//           </div>
//         </section>
//         <section>
//           <h2>Google Maps</h2>
//           <TextControl
//             label="API Key"
//             onChange={ newValue => this.setState({ googleMapsKey: newValue }) }
//             value={ googleMapsKey }
//             name="google_maps_key"
//           />
//           <TextareaControl
//             label="JSON Styles"
//             onChange={ newValue => this.setState({ googleMapsStyles: newValue }) }
//             value={ googleMapsStyles }
//             name="google_maps_styles"
//             help={ <a href="https://mapstyle.withgoogle.com/" target="_blank" rel="noopener noreferrer">Google Map Styler</a> }
//           />
//         </section>
//         <section>
//           <h2>SEO</h2>
//           <TextControl
//             label="Text to append to meta titles"
//             onChange={ newValue => this.setState({ seoMetaTitle: newValue }) }
//             value={ seoMetaTitle }
//             name="seo_meta_title"
//           />
//         </section>
//         <section>
//           <h2>Contact</h2>
//           <TextControl
//             label="Telephone"
//             onChange={ newValue => this.setState({ sitePhone: newValue }) }
//             value={ sitePhone }
//             name="site_phone"
//           />
//           <TextControl
//             label="Email"
//             type="email"
//             onChange={ newValue => this.setState({ siteEmail: newValue }) }
//             value={ siteEmail }
//             name="site_email"
//           />
//           <TextControl
//             label="Address"
//             placeholder="Street Address"
//             onChange={ newValue => this.setState({ siteLocationStreet: newValue }) }
//             value={ siteLocationStreet }
//             name="site_location_street"
//           />
//           <TextControl
//             placeholder="City"
//             onChange={ newValue => this.setState({ siteLocationCity: newValue }) }
//             value={ siteLocationCity }
//             name="site_location_city"
//           />
//           <TextControl
//             placeholder="State"
//             onChange={ newValue => this.setState({ siteLocationState: newValue }) }
//             value={ siteLocationState }
//             name="site_location_state"
//             maxlength="2"
//           />
//           <TextControl
//             placeholder="Zip Code"
//             onChange={ newValue => this.setState({ siteLocationZip: newValue }) }
//             value={ siteLocationZip }
//             name="site_location_zip"
//             maxlength="5"
//           />
//         </section>
//         <section>
//           <h2>Social</h2>
//           <TextControl
//             label="Facebook"
//             onChange={ newValue => this.setState({ socialLinks: { ...socialLinks, facebook: newValue } }) }
//             value={ socialLinks.facebook }
//             name="social_links[facebook]"
//           />
//           <TextControl
//             label="Twitter"
//             onChange={ newValue => this.setState({ socialLinks: { ...socialLinks, twitter: newValue } }) }
//             value={ socialLinks.twitter }
//             name="social_links[twitter]"
//           />
//           <TextControl
//             label="Instagram"
//             onChange={ newValue => this.setState({ socialLinks: { ...socialLinks, instagram: newValue } }) }
//             value={ socialLinks.instagram }
//             name="social_links[instagram]"
//           />
//           <TextControl
//             label="Youtube"
//             onChange={ newValue => this.setState({ socialLinks: { ...socialLinks, youtube: newValue } }) }
//             value={ socialLinks.youtube }
//             name="social_links[youtube]"
//           />
//           <TextControl
//             label="LinkedIn"
//             onChange={ newValue => this.setState({ socialLinks: { ...socialLinks, linkedin: newValue } }) }
//             value={ socialLinks.linkedin }
//             name="social_links[linkedin]"
//           />
//         </section>
//         <Button
//           isPrimary
//           type="submit"
//         >
//           Save Changes
//         </Button>
//       </>
//     )
//   }
//
// }

function init() {
  const siteOptions = document.querySelector('.site-options')
  if (siteOptions) {
    ReactDOM.render(
      <SiteOptions />,
      siteOptions
    )
  }
}

export { init }
