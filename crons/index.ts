
import UpdateWebPagesByUserCron from './UpdateWebPagesByUserCron'
import UpdateFXRatesCron from './UpdateFXRatesCron'
import schedule from 'node-schedule'

export const initCrons = () => {

  const updateFXRatesCronRule = new schedule.RecurrenceRule()
  updateFXRatesCronRule.dayOfWeek = [1, 2, 3, 4, 5] // every weekday
  updateFXRatesCronRule.hour = 20 // utc time
  updateFXRatesCronRule.minute = 10

  schedule.scheduleJob(updateFXRatesCronRule, function() {
    console.log('starting updateFXRatesCronRule')
    const updateFXRatesCron = new UpdateFXRatesCron()
    updateFXRatesCron.run()
  })

  const updateWebPagesCronRule = new schedule.RecurrenceRule()
  updateWebPagesCronRule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6] // every day
  updateWebPagesCronRule.hour = 20 // utc time
  updateWebPagesCronRule.minute = 20
  
  schedule.scheduleJob(updateWebPagesCronRule, function() {
    const updateWebPagesByUserCron = new UpdateWebPagesByUserCron()
    console.log('starting UpdateWebPagesByUserCron')
    updateWebPagesByUserCron.run()
  })
}