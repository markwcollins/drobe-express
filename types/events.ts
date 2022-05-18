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