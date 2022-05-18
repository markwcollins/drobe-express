import Analytics from 'analytics-node'
import CONFIG from '../config';

export const analytics = CONFIG.IS_DEV ? null : new Analytics(CONFIG.SEGMENT_WRITE_KEY)

export const trackAnalyticsEvent = (userId: string, event: string, properties: {}) => {
  analytics?.track({ userId, event, properties })
}
