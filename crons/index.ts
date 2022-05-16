
import UpdateWebPagesCron from './UpdateWebPagesCron'
import UpdateFXRatesCron from './UpdateFXRatesCron'
import schedule from 'node-schedule'

export const initCrons = () => {

  const updateWebPagesCronRule = new schedule.RecurrenceRule()
  updateWebPagesCronRule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6] // every day
  updateWebPagesCronRule.hour = 20 // utc time
  updateWebPagesCronRule.minute = 45
  
  schedule.scheduleJob(updateWebPagesCronRule, function() {
    const updateWebPagesCron = new UpdateWebPagesCron()
    console.log('starting UpdateWebPagesCron')
    updateWebPagesCron.run()
  })

  const updateFXRatesCronRule = new schedule.RecurrenceRule()
  updateFXRatesCronRule.dayOfWeek = [1, 2, 3, 4, 5] // every weekday
  updateFXRatesCronRule.hour = 12 // utc time
  updateFXRatesCronRule.minute = 0

  schedule.scheduleJob(updateFXRatesCronRule, function() {
    console.log('starting UpdateWebPagesCron')
    const updateFXRatesCron = new UpdateFXRatesCron()
    updateFXRatesCron.run()
  })
}