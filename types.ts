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
}


export enum Folder {
  BOARDS = 'boards',
  PRODUCTS = 'products'
}

export enum UserAction {
  ONBOARDED = 'onboarded',
  SHOP_SCREENSHOT = 'shop_screenshot'
}

export interface IDefault {
  id: ApiID
  loading?: boolean
}

export interface IUser {
  id: UUID
  email: string
}

export interface ISupabaseResource extends IDefault {
  inserted_at?: Date
  updated_at?: Date
}

export interface IProfile extends ISupabaseResource {
  user_id: ApiID
  email: string
  first_name: string
  last_name: string
  user_type: AUTH_TYPE
  completed_actions?: {[key in UserAction]: Date}
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
  location: string
  deleted?: boolean
  background_removed?: boolean
  web_page_id?: ApiID
  google_vision_labels?: string[]
  owned?: boolean
}

export interface IProductPopulated extends IProductBase {
  webPage?: IWebPage
}

export interface IProduct extends IProductPopulated {
  price: number
  previousPrice?: number
  priceChanged: boolean
}

// BOARD_ITEMS

export interface IBoardItemBase extends ISupabaseUserResource {
  product_id?: ApiID 
  board_id: ApiID
  pos_x: number
  pos_y: number
  rotate_z: number
  scale: number
  zIndex?: number
}

export interface IBoardItem extends IBoardItemBase {
  product?: IProduct
}

// BOARDS

export interface IBoardBase extends ISupabaseUserResource  {
  bucket: Bucket
  location: string
  deleted?: boolean
  products?: IProduct[]
}

export interface IBoardPopulated extends IBoardBase  {
  boardItems?: IBoardItem[] 
}

export interface IBoard extends IBoardPopulated  {
  price: number
}

// WEBPAGES

export interface IWebPageBase extends ISupabaseUserResource {
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

export enum AUTH_TYPE {
  USER = 'user',
  GUEST = 'guest',
  CONVERTED_GUEST = 'converted-guest'
}

export enum AUTH_ACTION {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  CONVERT_GUEST_TO_USER = 'CONVERT_GUEST_TO_USER'
}
