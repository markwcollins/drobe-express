
import UpdateWebPagesByUserCron from './UpdateWebPagesByUserCron'
import UpdateFXRatesCron from './UpdateFXRatesCron'
import schedule from 'node-schedule'

export const initCrons = () => {

  const updateWebPagesCronRule = new schedule.RecurrenceRule()
  updateWebPagesCronRule.dayOfWeek = [1, 3, 4]
  updateWebPagesCronRule.hour = 20 // utc time
  updateWebPagesCronRule.minute = 20
  
  schedule.scheduleJob(updateWebPagesCronRule, function() {
    const updateWebPagesByUserCron = new UpdateWebPagesByUserCron()
    console.log('starting UpdateWebPagesByUserCron')
    updateWebPagesByUserCron.run()
  })
}