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
  USER_CONTENTS = 'user_contents',
  TAGS = 'tags',
  BOARD_TAGS = 'board_tags',
  PRODUCT_TAGS = 'product_tags',
  FX_RATES = 'fx_rates',
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
  INVITED_FRIENDS = 'invited_friends'
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

export interface IIdentitfyExtraData {
  country?: Country
  interests?: UserInterest[]
}

export interface IProfile extends ISupabaseResource, IIdentitfyExtraData {
  user_id: ApiID
  email: string
  first_name: string
  last_name: string
  user_type: USER_TYPE
  sign_up_channel?: CHANNELS
  completed_actions?: IUserAction
  allow_unlimited_products: boolean
  max_products_allowed?: number // undefined is unlimited
  currency?: Currency
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
  tags?: IProductTag[]
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
  tags?: IBoardTag[]
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
  site_name?: string
  description?: string
  image_url?: URL
  saved?: boolean
  price?: string
  currency?: string
  updated_at?: Date
  history?: IIWebPageBaseHistory
  page_found?: boolean
}

export interface IIWebPageBaseHistoryResult { 
  timestamp?: number, 
  price?: string, 
  currency?: string 
}

export interface IIWebPageBaseHistory {
  data?: IIWebPageBaseHistoryResult[]
}

export interface IWebPagePopulated extends IWebPageBase {}

export interface IWebPage extends IWebPagePopulated {}

// TAGS

export interface ITagBase extends Omit<ISupabaseUserResource, 'updated_by'|'updated_in_channel'> {
  name?: string
}

export interface ITagPopulated extends ITagBase {}

export interface ITag extends ITagPopulated {}

// BOARD_TAGS

export interface IBoardTagBase extends Omit<ISupabaseUserResource, 'updated_by'|'updated_in_channel'> {
  board_id: ApiID
  tag_id: ApiID
}

export interface IBoardTagPopulated extends IBoardTagBase {
  tag: ITag
}

export interface IBoardTag extends IBoardTagPopulated {}

// PRODUCT_TAGS

export interface IProductTagBase extends Omit<ISupabaseUserResource, 'updated_by'|'updated_in_channel'> {
  product_id: ApiID
  tag_id: ApiID
}

export interface IProductTagPopulated extends IProductTagBase {
  tag: ITag
}

export interface IProductTag extends IProductTagPopulated {}

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
  location_banner_image: string
  active: boolean
  country?: Country
  interests?: UserInterest[]
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

export interface IWebsiteProductData { 
  url?: string
  title?: string, 
  site_name?: string, 
  image_url?: string, 
  description?: string, 
  price?: string, 
  currency?: string 
  availability?: boolean
} 

// CURRENCIES

export const currencies = ['AUD','USD','GBP','NZD','CAD','EUR','SGD','HKD','NOK']
export type Currency = typeof currencies[number]
export const isValidCurrency = (currency: Currency): boolean => currencies.includes(currency)

// COUNTRIES

export interface ICountry {
  id: string
  name: string
}

export interface ICountryUi extends ICountry {
  isActive: boolean
}

export const COUNTRIES: ICountry[] = [
  { id: 'au', name: 'Australia'},
  { id: 'us', name: 'United States'},
  { id: 'gb', name: 'United Kingdom'},
  { id: 'ca', name: 'Canada'},
  { id: 'nz', name: 'New Zealand'},
  { id: 'other', name: 'Other'}
]

export type Country = typeof COUNTRIES[number]['name']
export type CountryID = typeof COUNTRIES[number]['id']

export const COUNTRIES_OBJ: {[key: CountryID]: ICountry}  = COUNTRIES.reduce((obj, country) => ({ ...obj, [country.id]: country }), {})

export const isValidCountry = (country: string): boolean => !!COUNTRIES_OBJ[country]

// FX RATES and CURRENCIES

export interface IFXRate  {
  from_currency: string
  updated_at: Date
  to_currencies: {
    [key: Currency]: number
  }
}

export interface ICreateFXRate extends Omit<IFXRate, 'updated_at'>  {
  from_currency: string
  to_currencies: {
    [key: Currency]: number
  }
}

export const CountryToCurrencyMapping = new Map<Country, Currency>([
  ['au', 'AUD'],
  ['us', 'USD'],
  ['ca', 'CAD'],
  ['nz', 'NZD'],
  ['gb', 'GBP'],
])

export const DefaultCurrency = 'USD'

// USER INTERESTS

export interface IUserInterest {
  id: string
  name: string
}

export interface IUserInterestUi extends IUserInterest {
  isActive: boolean
}

export interface IUserInterest {
  id: string
  name: string
}

export interface IUserInterestUi extends IUserInterest {
  isActive: boolean
}

export const USER_INTEREST_WHEN_UNKNOWN =  { id: 'unknown', name: 'Featured' }

export const USER_INTERESTS: IUserInterest[] = [
  { id: 'womens-fashion-1', name: 'Women\'s Fashion' },
  { id: 'mens-fashion-1', name: 'Men\'s fashion' },
  { id: 'kids-fashion-1', name: 'Kid\'s fashion' },
  { id: 'home-1', name: 'Home and Furniture' },
  // USER_INTEREST_WHEN_UNKNOWN
]

export type UserInterest = typeof USER_INTERESTS[number]['name']
export type UserInterestID = typeof USER_INTERESTS[number]['id']

export const USER_INTERESTS_OBJ: {[ key: UserInterestID ]: IUserInterest} = USER_INTERESTS.reduce((obj, interest) => ({ ...obj, [interest.id]: interest }), {})


// SITE TO EXCLUDES 

const sitesToExclude = [
  'google', 
  'ad.doubleclick.net',
  'facebook',
  'clickserve.dartsearch.net',
  'youtube',
  'pixel',
  'apple.com',
  'track.trafficguard.ai',
  'goo.gl',
  'amazon',
  'ebay',
  'xg4ken.com',
]

const regexExclusion = new RegExp(sitesToExclude.join('|'))
export const isRestrictedSite = (url: string): boolean => regexExclusion.test(url)

// EVENTS

export enum EVENT_NAME {
  SignedUp = 'Signed Up',
  AppLoaded = 'App Loaded',
  ChromeExtensionLoaded = 'Chrome Extension Loaded',
  ShopPageViewDetails = 'Shop - Page View Details',
  BoardEditorShareBoard = 'BoardEditor - Share Board',
  ShopSearchSearchGoogle = 'ShopSearch - Search Google',
  AddedToWishList = 'Added To Wish List',
  CreatedBoard = 'Created Board',
  ClickedProductSourceLink = 'Clicked Product Source Link',
  InvitedFriendsOpened = 'Invited Friends Opened',
  InvitedFriendsCancelled = 'Invited Friends Cancelled',
  InvitedFriendsSuccess = 'Invited Friends Success',
  PriceChanged = 'Price Changed'
}

export const EventsForAPI = [
  EVENT_NAME.SignedUp,
  EVENT_NAME.AppLoaded,
  EVENT_NAME.ChromeExtensionLoaded,
  EVENT_NAME.AddedToWishList,
  EVENT_NAME.CreatedBoard
]

export const EventsForAppsFlyer = [
  EVENT_NAME.SignedUp,
  EVENT_NAME.AppLoaded,
  EVENT_NAME.ChromeExtensionLoaded,
  EVENT_NAME.AddedToWishList,
  EVENT_NAME.CreatedBoard
]

// these are required by facebook
export enum ACTION_SOURCE { 
  WEBSITE = 'website',
  // APP = 'app',
  OTHER = 'other'
}