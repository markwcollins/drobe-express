
import UpdateWebPagesCron from './UpdateWebPagesCron'
import schedule from 'node-schedule'

const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6] // every 2nd day
rule.hour = 20 // utc time
rule.minute = 45

export const initCrons = () => {
  schedule.scheduleJob(rule, function() {
    console.log('starting crons')
    const updateWebPagesCron = new UpdateWebPagesCron()
    updateWebPagesCron.init()
  })
}