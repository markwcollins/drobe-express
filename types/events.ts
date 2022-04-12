export enum EventName {
  SignedUp = 'Signed Up',
  AppLoaded = 'App Loaded',
  ChromeExtensionLoaded = 'Chrome Extension Loaded',
  ShopPageViewDetails = 'Shop - Page View Details',
  BoardEditorShareBoard = 'BoardEditor - Share Board',
  ShopSearchSearchGoogle = 'ShopSearch - Search Google',
  AddedToWishList = 'Added To Wish List',
  CreatedBoard = 'Created Board',
  ClickedProductSourceLink = 'Clicked Product Source Link'
}

export const EventsForAPI = [
  EventName.SignedUp,
  EventName.AppLoaded,
  EventName.ChromeExtensionLoaded,
  EventName.AddedToWishList,
  EventName.CreatedBoard
]

// these are required by facebook
export enum ActionSource { 
  WEBSITE = 'website',
  APP = 'app'
}