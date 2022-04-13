import { PostgrestError } from '@supabase/supabase-js'

export type ApiID = string
export type UUID = string
export type URL = string
export type DataUri = string
export type ErrorResponse = PostgrestError|undefined|null
export type Base64 = string

export enum Bucket {
  IMAGES = 'images',
  PUBLIC = 'public'
}

export enum SupabaseTables {
  PRODUCTS = 'products', 
  BOARDS = 'boards',
  BOARD_ITEMS = 'board_items',
  WEB_PAGES = 'web_pages',
  SHOPS = 'shops',
  PROFILES = 'profiles',
  CONTENTS = 'contents',
  USER_CONTENTS = 'contents',
}

export enum Folder {
  BOARDS = 'boards',
  PRODUCTS = 'products'
}

export enum UserAction {
  ONBOARDED_CHROME = 'onboarded_chrome',
  ONBOARDED_APP = 'onboarded',
  SHOP_SCREENSHOT = 'shop_screenshot',
  LOADED_DEMO_DATA = 'loaded_demo_data',
  REMOVED_DEMO_DATA  = 'removed_demo_data', 
}

export type IUserAction = {
  [key in UserAction]?: Date
}

export interface IDefault {
  id: ApiID
  loading?: boolean
}

export interface IUser {
  id: UUID
  email: string
}

export enum CHANNELS {
  WEBSITE = 'website',
  APP = 'app',
  CHROME = 'chrome'
}

export interface ISupabaseUpdateResource {
  updated_by?: ApiID
  updated_in_channel?: CHANNELS,
}

export interface ISupabaseResource extends IDefault, ISupabaseUpdateResource {
  inserted_at?: Date
  updated_at?: Date
}

export interface IProfile extends ISupabaseResource {
  user_id: ApiID
  email: string
  first_name: string
  last_name: string
  user_type: USER_TYPE
  sign_up_channel?: CHANNELS
  completed_actions?: IUserAction
}

export interface ISupabaseUserResource extends ISupabaseResource {
  user_id: ApiID
  profile_id: ApiID
  inserted_at?: Date
  updated_at?: Date
}

// PRODUCT

export interface IProductBase extends ISupabaseUserResource {
  bucket: Bucket
  location?: string
  deleted?: boolean
  background_removed?: boolean
  web_page_id?: ApiID
  google_vision_labels?: string[]
  owned?: boolean
  title?: string
  price?: string
  currency?: string
  source_demo?: boolean
  source_image_url?: string
}

export interface IProductPopulated extends IProductBase {
  webPage?: IWebPage
}

export interface IProduct extends Omit<IProductPopulated, 'price'> {
  price: number
  previousPrice?: number
  priceChanged: boolean
  currency?: string
}

// BOARDS

export interface IBoardBase extends ISupabaseUserResource  {
  bucket: Bucket
  location?: string
  deleted?: boolean
  products?: IProduct[]
  source_demo?: boolean
}

export interface IBoardPopulated extends IBoardBase  {
  boardItems?: IBoardItem[] 
}

export interface IBoard extends IBoardPopulated  {
  price?: number
}

// BOARD_ITEMS

export interface IBoardItemPosition {
  rotate_z: number
  scale: number
  pos_x: number
  pos_y: number
}

export interface IBoardItemBase extends ISupabaseUserResource, IBoardItemPosition {
  product_id?: ApiID 
  board_id: ApiID
  zIndex?: number
  use_perc: boolean
  perc_x: number
  perc_y: number
  source_demo?: boolean
}

export interface IBoardItem extends IBoardItemBase {
  product?: IProduct
}

// WEBPAGES

export interface IWebPageBase extends Omit<ISupabaseUserResource, 'updated_by'|'updated_in_channel'>  {
  url: URL
  homepage: URL
  display_url: URL
  title: string
  shop_id?: ApiID
  description?: string
  image_url?: URL
  saved?: boolean
  price?: string
  currency?: string
  updated_at?: Date
  history?: IIWebPageBaseHistory
  page_found?: boolean
}

export interface IIWebPageBaseHistory {
  data?: Array<{ timestamp?: number, price?: string }>
}

export interface IWebPagePopulated extends IWebPageBase {}

export interface IWebPage extends IWebPagePopulated {}

// CONTENT

export interface IContentBase extends ISupabaseResource {
  title: string
  description: string
  source: string
  author: string
  topic: string
  url: string
  image_url: string
  published_date: Date
}

export interface IContentPopulated extends IContentBase {}

export interface IContent extends IContentPopulated {}

// USER CONTENT

export interface IUserContentBase extends ISupabaseUserResource {
  content_id: ApiID
  viewed?: Date
}

export interface IUserContentPopulated extends IUserContentBase {
  content: IContentBase
}

export interface IUserContent extends IUserContentPopulated {}

// OTHER

export interface IShop extends ISupabaseResource {
  name: string
  url: URL
  display_url: URL
  featured: boolean
  bucket: Bucket
  location: string
}

export interface IImage {
  file: FormData|File
  bucket: Bucket
  location: string
  fileName: string 
  fileExtension: string
}

export interface IProductCategory extends IDefault {
  id: string,
  title: string,
  keywords: string[],
  active: boolean,
  regexString: RegExp
}

export enum USER_TYPE {
  USER = 'user',
  GUEST = 'guest',
  // CONVERTED_GUEST = 'converted-guest'
}

export enum AUTH_ACTION {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  CONVERT_GUEST_TO_USER = 'CONVERT_GUEST_TO_USER'
}

// OPEN GRAPH

export interface IOpenGraphFormattedData { 
  title?: string, 
  site_name?: string, 
  image_url?: string, 
  description?: string, 
  price?: string, 
  currency?: string 
} 