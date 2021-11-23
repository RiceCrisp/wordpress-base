export type Color = {
  name: string,
  slug: string,
  color: string
}

export type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

export type Gradient = {
  name: string,
  slug: string,
  gradient: string
}

export type Location = {
  name: string,
  street: string,
  city: string,
  state: string,
  zip: string,
  coordinates?: string
}

export type Post = {
  id: number,
  parent: number,
  children?: Post[]
}

export type Props = {
  attributes: Record<string, any>,
  clientId: string,
  name: string,
  setAttributes: (args: { [index: string]: any }) => void
}

export type Select = (store: string) => any

export type SVG = {
  uid?: string,
  id: string,
  viewbox: string,
  title: string,
  path: string
}

export type Taxonomy = {
  name: string,
  slug: string,
  types: string[],
  terms?: Term[]
}

export type Term = {
  id: number,
  name: string,
  parent: number,
  children?: Term[]
}
